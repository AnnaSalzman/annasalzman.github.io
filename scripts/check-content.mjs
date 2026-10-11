#!/usr/bin/env node
/**
 * Friendly checks on Anna's content. Runs before every build (`npm run build`)
 * and on its own with `npm run check:content`. No dependencies.
 *
 * Rule: this script only FAILS for problems that would break the Astro build
 * anyway (missing picture, unreadable iPhone photo, file without frontmatter).
 * Its job is to explain them in plain words, early. Everything else is a
 * warning and the build goes on. On GitHub Actions, messages are printed as
 * annotations, so they appear at the top of the run page that the
 * "Run failed" email links to.
 */
import { closeSync, existsSync, openSync, readdirSync, readFileSync, readSync, statSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src/content');
const FILES = join(ROOT, 'public/files');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.tif', '.tiff']);
const IPHONE_EXTENSIONS = new Set(['.heic', '.heif']);
const BIG_FILE_MB = 10;
const GOOD_NAME = /^[a-z0-9][a-z0-9._-]*$/;

const inActions = Boolean(process.env.GITHUB_ACTIONS);
const counts = { error: 0, warning: 0 };

function report(level, file, message) {
  counts[level]++;
  const path = relative(ROOT, file);
  if (inActions) {
    console.log(`::${level} file=${path},title=${level === 'error' ? 'Content problem' : 'Content note'}::${message}`);
  } else {
    const color = level === 'error' ? '\x1b[31m' : '\x1b[33m';
    console.log(`${color}${level === 'error' ? '✗ error' : '! warning'}\x1b[0m ${path}\n  ${message}\n`);
  }
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const sizeMB = (file) => statSync(file).size / 1024 / 1024;

/**
 * existsSync, but case-sensitive everywhere. macOS finds "Photo.JPG" when asked
 * for "photo.jpg"; the Linux machine that builds the site does not.
 */
function existsExactly(path) {
  if (!existsSync(path)) return false;
  for (let p = path; p !== ROOT && p !== dirname(p); p = dirname(p)) {
    if (!readdirSync(dirname(p)).includes(basename(p))) return false;
  }
  return true;
}

/** The closest existing file name in the same folder, to suggest when a reference is wrong. */
function suggest(missingPath) {
  const dir = dirname(missingPath);
  if (!existsSync(dir)) return undefined;
  const wanted = basename(missingPath).toLowerCase();
  const names = readdirSync(dir);
  const sameButCase = names.find((name) => name.toLowerCase() === wanted);
  if (sameButCase) return sameButCase;
  const stem = (name) => name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[\s_]+/g, '-');
  return names.find((name) => stem(name) === stem(wanted));
}

/** True if a JPEG carries GPS coordinates in its EXIF data. */
function hasGpsLocation(file) {
  const buffer = Buffer.alloc(256 * 1024);
  const fd = openSync(file, 'r');
  const length = readSync(fd, buffer, 0, buffer.length, 0);
  closeSync(fd);
  try {
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return false;
    let i = 2;
    while (i + 4 < length && buffer[i] === 0xff) {
      const marker = buffer[i + 1];
      const segmentLength = buffer.readUInt16BE(i + 2);
      if (marker === 0xe1 && buffer.toString('latin1', i + 4, i + 10) === 'Exif\0\0') {
        const tiff = i + 10;
        const little = buffer.toString('latin1', tiff, tiff + 2) === 'II';
        const u16 = (o) => (little ? buffer.readUInt16LE(o) : buffer.readUInt16BE(o));
        const u32 = (o) => (little ? buffer.readUInt32LE(o) : buffer.readUInt32BE(o));
        const ifd0 = tiff + u32(tiff + 4);
        for (let e = 0; e < u16(ifd0); e++) {
          const entry = ifd0 + 2 + e * 12;
          if (u16(entry) !== 0x8825) continue; // GPS info pointer
          const gps = tiff + u32(entry + 8);
          for (let g = 0; g < u16(gps); g++) {
            if (u16(gps + 2 + g * 12) === 0x0002) return true; // GPSLatitude
          }
        }
        return false;
      }
      if (marker === 0xda) return false; // image data starts; no EXIF before it
      i += 2 + segmentLength;
    }
  } catch {
    // Truncated or unusual file: not our problem here.
  }
  return false;
}

// ---------------------------------------------------------------------------

const referencedImages = new Set();

for (const file of walk(CONTENT)) {
  const ext = extname(file).toLowerCase();
  const name = basename(file);
  if (name === '.gitkeep' || name === '.DS_Store') continue;

  if (ext !== '.md') {
    if (!IMAGE_EXTENSIONS.has(ext) && !IPHONE_EXTENSIONS.has(ext)) {
      report('warning', file, `This file won't show up on the site. Pages and posts must end in .md, and pictures go in an images folder.`);
    }
    continue;
  }

  const source = readFileSync(file, 'utf8').replace(/^﻿/, '');
  if (!/^---\r?\n/.test(source)) {
    report('error', file, `This file has to start with a line of three dashes (---), then the title, date and so on, then another line of three dashes. Copy the top part from an example in docs/EDITING.md.`);
    continue;
  }

  const closing = source.slice(3).search(/\r?\n---\s*(\r?\n|$)/);
  if (closing === -1) {
    report('error', file, `The top part (title, date, …) starts with --- but never ends. Add a line with three dashes (---) after the last setting.`);
    continue;
  }
  const frontmatter = source.slice(0, closing + 3);

  // The two YAML slips that happen most when typing by hand.
  for (const line of frontmatter.split(/\r?\n/).slice(1)) {
    const setting = line.match(/^([A-Za-z]+):\s+(.*)$/);
    if (!setting) continue;
    const [, key, value] = setting;
    if (/^["'[]/.test(value)) continue; // quoted or a [list]: fine
    if (/:\s/.test(value)) {
      report('error', file, `The ${key} has a colon in it ("${value}"). Put the whole thing in quotes: ${key}: "${value.replace(/"/g, "'")}"`);
    } else if (/\s#/.test(value)) {
      report('warning', file, `Everything after the # in "${value}" is ignored. Put the whole ${key} in quotes: ${key}: "${value}"`);
    }
  }

  // Picture references: frontmatter `image:` / `cover:` and Markdown ![…](./…).
  const refs = [];
  for (const match of frontmatter.matchAll(/^(image|cover):\s*["']?([^"'\n#]+?)["']?\s*$/gm)) refs.push(match[2]);
  for (const match of source.matchAll(/!\[[^\]]*\]\(\s*<?(\.{1,2}\/[^)>]+?)>?(?:\s+"[^"]*")?\s*\)/g)) refs.push(match[1]);

  for (const ref of refs) {
    let decoded = ref.trim();
    try {
      decoded = decodeURI(decoded);
    } catch {
      // keep as written
    }
    const target = resolve(dirname(file), decoded);
    referencedImages.add(target);
    const targetExt = extname(target).toLowerCase();

    if (/\s/.test(ref.trim()) && !ref.includes('%20')) {
      // Markdown doesn't treat ![…](./my photo.jpg) as a picture at all; it shows the text.
      report('warning', file, `The picture name "${ref.trim()}" has a space in it, so it will show up as text instead of a picture. Rename the file with dashes (like "${basename(ref.trim()).replace(/\s+/g, '-')}") and use that name here.`);
    } else if (IPHONE_EXTENSIONS.has(targetExt)) {
      report('error', file, `"${ref}" is an iPhone HEIC photo, which websites can't show. Save it as a JPG (on a Mac: open it in Preview, File → Export, Format: JPEG), upload that, and change the name here to end in .jpg.`);
    } else if (!existsExactly(target)) {
      const hint = suggest(target);
      report(
        'error',
        file,
        hint
          ? `Can't find the picture "${ref}". There is a file called "${hint}" in that folder. Names must match exactly, including capital letters and spaces.`
          : `Can't find the picture "${ref}". Check that it was uploaded to the images folder and that the name matches exactly (capital letters count).`,
      );
    }
  }

  // Download links to /files/…
  for (const match of source.matchAll(/\]\(\s*<?(\/files\/[^)\s>]+)/g)) {
    let path = match[1];
    try {
      path = decodeURI(path);
    } catch {
      // keep as written
    }
    if (!existsExactly(join(ROOT, 'public', path))) {
      report('warning', file, `The link "${match[1]}" points to a file that isn't in public/files/, so it will be a broken link.`);
    }
  }
}

// Pictures themselves
for (const file of walk(CONTENT)) {
  const ext = extname(file).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext) && !IPHONE_EXTENSIONS.has(ext)) continue;
  const name = basename(file);

  if (IPHONE_EXTENSIONS.has(ext) && !referencedImages.has(file)) {
    report('warning', file, `This is an iPhone HEIC photo, which websites can't show. Upload a JPG version instead (see docs/EDITING.md).`);
  }
  if (!GOOD_NAME.test(name)) {
    report('warning', file, `Picture names work best in lowercase with dashes, like "${name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+/, '')}".`);
  }
  if (sizeMB(file) > BIG_FILE_MB) {
    report('warning', file, `This picture is ${sizeMB(file).toFixed(0)} MB. That's fine for the site (it gets shrunk), but it makes the project heavy. Under ${BIG_FILE_MB} MB is best.`);
  }
  if ((ext === '.jpg' || ext === '.jpeg') && hasGpsLocation(file)) {
    report('warning', file, `This photo has GPS location data in it. The website copy has it removed, but the original file in the repository is public. See "Photos and privacy" in docs/EDITING.md.`);
  }
  if (!referencedImages.has(file)) {
    report('warning', file, `No page uses this picture. It's still public in the repository; delete it if you don't need it.`);
  }
}

// Downloads
for (const file of walk(FILES)) {
  const name = basename(file);
  if (name === '.gitkeep' || name === '.DS_Store') continue;
  if (/\s/.test(name)) {
    report('warning', file, `File names with spaces make awkward links. Rename it with dashes, like "${name.replace(/\s+/g, '-')}".`);
  }
  if (sizeMB(file) > BIG_FILE_MB * 2) {
    report('warning', file, `This file is ${sizeMB(file).toFixed(0)} MB. Big downloads are slow for students; GitHub refuses files over 100 MB.`);
  }
}

const summary = `Content check: ${counts.error} error(s), ${counts.warning} warning(s).`;
if (counts.error > 0) {
  console.log(`\n\x1b[31m${summary}\x1b[0m The site can't be built until the error(s) above are fixed.\n`);
  process.exit(1);
}
console.log(counts.warning > 0 ? `${summary}\n` : 'Content check: all good.\n');
