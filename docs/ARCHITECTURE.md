# Architecture

How the pieces fit, where to extend, and how the deploy works. For conventions and step-by-step recipes see [CLAUDE.md](../CLAUDE.md); for Anna's side see [EDITING.md](EDITING.md); for the reasoning behind choices see [DECISIONS.md](DECISIONS.md).

## The short version

```
 Anna (github.com editor)          You (local, npm run dev)
          │                                  │
          ▼                                  ▼
  src/content/**/*.md + images/      src/ (pages, components, styles)
          │                                  │
          └──────────────┬───────────────────┘
                         ▼
        scripts/check-content.mjs   plain-words checks, fails only on build-breakers
                         ▼
        astro build
          ├─ content collections (src/content.config.ts) validate frontmatter
          ├─ Sätteri renders Markdown; our hast plugin turns <flip-card> etc. into HTML
          ├─ astro:assets resizes images to WebP (metadata stripped)
          └─ pages in src/pages render to static HTML  ──►  dist/
                         ▼
        GitHub Actions (.github/workflows/publish.yml)
          build job → upload-pages-artifact → deploy job → https://annasalzman.github.io
```

The output is a fully static site. The only JavaScript in the browser is one small bundle (theme toggle plus the interactive components), inlined by Astro because it is tiny.

## Stack

| Piece | What | Why it's here |
| --- | --- | --- |
| [Astro 7](https://docs.astro.build) | Static site generator, `output: 'static'` (default) | Content collections with schemas, built-in image pipeline, zero JS by default |
| Sätteri via `@astrojs/markdown-satteri` | Astro 7's default Markdown processor (Rust parser, JS plugins) | We configure it: `rawHtml: true` plus one hast plugin. Pinned to the version Astro itself depends on |
| `@astrojs/rss` | `/rss.xml` for the blog | Correct RSS/XML escaping without hand-rolling it |
| `@fontsource-variable/*` | Shantell Sans (display), Lexend (body), self-hosted | Same look on Chromebooks/Windows/iPads, no third-party font requests |
| `@astrojs/check`, `typescript`, `@types/node` (dev) | `npm run check` | Type-checks `.astro` and `.ts`, including the build-time plugin |

No UI framework, no CSS framework, no client-side router.

## Folder map

```
.github/workflows/publish.yml   build on push/PR, deploy on main
.claude/launch.json             dev/preview servers for Claude Code's browser pane
astro.config.mjs                site URL, image breakpoints, Markdown processor + plugin
scripts/check-content.mjs       content checks (no dependencies)
public/                         copied as-is: favicon.svg, files/ (downloads, stable URLs)
src/
  content.config.ts             the content schema (collections: blog, drawings, photos, resources, pages)
  content/<collection>/         Anna's Markdown; pictures in <collection>/images/
  site.ts                       site name, description, menu (NAV) and section colors
  lib/
    content.ts                  getPosts/getDrawings/…, drafts, sorting, tags, UTC date formatting
    colors.ts                   the crayon names (red…purple), aliases, stable color-from-string
  layouts/BaseLayout.astro      <head>, header, footer, global CSS, the one client script
  components/                   Astro components for pages (cards, galleries, header, …)
  pages/                        routes (see below)
  markdown-components/          the components Anna writes in Markdown (see below)
  scripts/                      browser code: main.ts (entry), theme.ts, confetti.ts
  styles/                       tokens.css, base.css, prose.css
```

### Routes

| URL | File | Source |
| --- | --- | --- |
| `/` | `pages/index.astro` | newest 3 posts, 4 drawings, 4 photos, 4 resources; intro from `pages/about.md` `summary` |
| `/blog/`, `/blog/<id>/` | `pages/blog/index.astro`, `[...id].astro` | `blog` |
| `/blog/tags/<tag>/` | `pages/blog/tags/[tag].astro` | tags across `blog` |
| `/drawings/…`, `/photos/…` | `pages/{drawings,photos}/` + `components/GalleryDetail.astro` | `drawings`, `photos` |
| `/resources/…` | `pages/resources/` | `resources` |
| `/<id>/` | `pages/[page].astro` | `pages` (About, the component playground) |
| `/rss.xml` | `pages/rss.xml.ts` | `blog`, drafts excluded |
| 404 | `pages/404.astro` | GitHub Pages serves `404.html` automatically |

Entry ids come from file names (the glob loader slugifies them: `My Post.md` → `my-post`), so the file name is the URL. A `slug:` key in frontmatter overrides that (Astro reads it before the schema); it's not documented for Anna. Routes use `[...id]` so nested folders would also work, but Anna is told to keep folders flat.

## Content

`src/content.config.ts` defines five collections, each a `glob('**/*.md')` over its folder. Schemas are deliberately forgiving because Anna types frontmatter by hand: `draft: yes` is a boolean, `tags: a, b` becomes a list, numbers are accepted as titles, an unknown `color` is ignored. Only missing essentials fail (title, date, picture).

`src/lib/content.ts` is the only place pages read collections. It hides drafts in production (`import.meta.env.DEV` shows them, with a badge) and sorts. Dates have no time zone in YAML, so they are midnight UTC; `formatDate` formats in UTC so `2026-10-11` never shows as October 10 in America.

## Markdown components

Anna writes HTML-ish tags in plain `.md` files:

```markdown
<quiz-question>

Which planet is the largest?

- [ ] Mars
- [x] Jupiter

</quiz-question>
```

How that becomes a working quiz:

1. **Parse.** Sätteri runs with `features: { rawHtml: true }`, so raw HTML (including tags that open in one block and close in another) is reparsed into real hast elements, with the Markdown between them already converted.
2. **Transform at build time.** `src/markdown-components/index.ts` is a Sätteri hast plugin. In its `before` hook it copies the whole tree once (`transformChildren`) and replaces the root. For each element whose tag is in the registry it calls that component's `build()` (in `<name>/build.ts`), which returns finished HTML. Along the way it:
   - drops the `<p>` Markdown puts around a component on its own line (`block: true`),
   - wraps runs of neighbouring components that declare a `group` (e.g. `flip-card-deck`), blank lines between them allowed,
   - makes pasted `<iframe>`s responsive (keeps their `width/height` as `aspect-ratio`, adds `loading="lazy"`),
   - sizes local Markdown images (see Images),
   - warns about unknown hyphenated tags and near-misses (`<flipcard>` → did you mean `<flip-card>`?), as GitHub annotations in CI. Warnings never fail the build.
3. **Behave in the browser.** Components that need interaction have a `<name>/client.ts` that defines a custom element with the same tag name (`flip-card`, `quiz-question`). `src/scripts/main.ts` picks them all up with `import.meta.glob('../markdown-components/*/client.ts', { eager: true })`. The server-rendered markup is usable before (and without) the script: flip cards show both sides, the quiz shows its buttons.
4. **Style.** Each component's `style.css` is global (Markdown output isn't scoped) and is loaded by `BaseLayout` through `import.meta.glob('../markdown-components/*/style.css', { eager: true })`.

So a component is a folder: `build.ts` (required), `client.ts` and `style.css` (optional), plus one line in the registry in `index.ts`. Recipe in CLAUDE.md.

Things to know about the Sätteri plugin API (it is young; recheck on Astro upgrades):

- User hast plugins run **before** Astro's image-marker and heading-id plugins, so images we create or move are still optimized and headings still get ids.
- `ctx.replaceNode(root, newRoot)` works for whole-tree rewrites; we build clean nodes rather than mutating the materialized ones.
- Property values must be strings, numbers, booleans or **string** arrays. Number arrays are stringified or lost, which is why image sizing passes scalar `width`/`sizes`/`layout` rather than a `widths` array.
- Plain `.md` only. We don't use MDX: in MDX, `<`, `{` and HTML comments in ordinary prose break the build, which is the wrong failure mode for hand-edited posts. A misspelled tag in `.md` just renders as an unknown element.

`details`/`summary` (show the answer) is native HTML, only styled in `prose.css`.

## Images

All of Anna's pictures live under `src/content/<collection>/images/` and are referenced relatively, so Astro's asset pipeline processes them:

- Frontmatter images (`image:`, `cover:`) use the schema's `image()` helper, so a missing file fails the build with the file named (and `check-content` explains it first).
- Components render them with `<Image>` and explicit `width` + `widths` + `sizes`. `width` caps the fallback `src`, so a 4000px original never produces a 4000px file. Sharp never enlarges.
- Markdown body images (`![](./images/x.jpg)`) get `layout: 'constrained'`, `width: 800`, and a `sizes` from `sizeImage()` in `src/markdown-components/lib/images.ts`; Astro then builds a srcset from `image.breakpoints` in `astro.config.mjs` (400–1600). Photo-grid tiles use `width: 480`.
- Output is WebP (social-preview images are JPEG). **EXIF, including GPS, is stripped from every generated file, and originals are not copied to `dist/`.** Verified with a 12 MP test JPEG carrying GPS tags. The originals in the (public) repo still carry it, hence the warning in `check-content` and the privacy section in EDITING.md.

Downloads (`public/files/`) are deliberately outside the pipeline so they keep stable, shareable URLs.

## Styling

- `src/styles/tokens.css`: every color, font, radius and shadow is a custom property. Two palettes: **paper** (default) and **chalkboard**. Chalkboard applies under `prefers-color-scheme: dark` unless the visitor chose paper, or when they chose chalkboard with the toggle (`html[data-theme]`, stored in `localStorage`, applied before first paint by an inline script in `BaseLayout`). The chalkboard block appears twice (media query + attribute) and both copies must stay identical.
- **Tints:** `tint-<color>` on any element sets `--tint`, `--tint-soft`, `--tint-strong` for its subtree. Sections set a tint on `<body>` (from `NAV` in `site.ts`); cards and components set their own. Color names are the six crayons in `src/lib/colors.ts`.
- `base.css` holds reset, typography, utilities (`.container`, `.marker`, `.sticker`, `.button`, card grids). `prose.css` styles rendered Markdown inside `.prose`.
- Astro components use scoped `<style>`. **Scoped styles don't reach elements rendered by a child component**, even when you pass `class`; use `:global()` from a scoped parent selector (see `PostCard.astro`) or wrap the child in an element you own.
- Motion respects `prefers-reduced-motion` (global rule at the end of `base.css`, plus per-component guards).

## Content checks

`scripts/check-content.mjs` runs first in `npm run build` (so locally and in CI) and alone as `npm run check:content`. Its contract: **it only exits non-zero for problems that would fail the Astro build anyway** (missing or case-mismatched picture, HEIC, frontmatter without closing `---`, an unquoted colon in a value). Its value is the explanation, in Anna's words, printed as `::error file=…::` annotations that GitHub shows at the top of the failed run. Everything else is a warning: file names, big files, GPS data in JPEGs, pictures nothing uses, links to missing `/files/…`, a `#` that silently truncates a value.

The existence check is case-sensitive on purpose: macOS finds `Photo.JPG` when asked for `photo.jpg`, the Linux runner does not.

## Deploy

`.github/workflows/publish.yml`:

- **Triggers:** push to `main` (every github.com edit is one), pull requests (build only), manual `workflow_dispatch`.
- **build** job: checkout → Node from `.nvmrc` (22, Astro 7 needs ≥ 22.12) with npm cache → `npm ci` → `npm run build` → `actions/upload-pages-artifact` with `dist/` (not on PRs).
- **deploy** job: `actions/deploy-pages` into the `github-pages` environment, with `pages: write` + `id-token: write` only on this job. `concurrency: pages` with `cancel-in-progress: false`, so quick successive saves queue instead of interrupting a deploy.
- **One-time setup:** repo Settings → Pages → Build and deployment → Source: **GitHub Actions**. Without it the deploy job fails.
- **Failure path:** if the build fails, nothing is deployed and the previous site stays live. GitHub emails whoever pushed the commit ("Run failed: Publish site - main"), which for content edits is Anna. You won't get that email for her commits; watch the Actions tab, or ask her to forward it (EDITING.md tells her to).
- Anna is told to expect about two minutes from save to live. The local build of the sample site takes a few seconds; build time grows with the number of pictures (each produces several WebP sizes). See Limits below.

## Where to extend

| You want to… | Do this |
| --- | --- |
| Add a Markdown component | CLAUDE.md → "Adding a component for Anna" |
| Add a field to a collection | `src/content.config.ts` (keep it optional and forgiving), use it in the page, document it in EDITING.md |
| Add a new kind of content | New collection in `content.config.ts`, a getter in `lib/content.ts`, routes in `src/pages/<name>/`, a `NAV` entry in `site.ts`, folder + `images/.gitkeep`, a section in EDITING.md |
| Add a standalone page | Anna can: a `.md` in `src/content/pages/` becomes `/<name>/` (avoid names that clash with sections, like `blog`) |
| Change the menu | `NAV` in `src/site.ts` (label, emoji, color) |
| Change colors or fonts | `src/styles/tokens.css` (both palettes); fonts are imported in `BaseLayout.astro` |
| Add a one-off interactive thing to a single post | Still a component (a folder with `build.ts` + `client.ts`); it's the only way to run code from `.md` |
| Use a custom domain | Add it in Settings → Pages, then change `site` in `astro.config.mjs` |

## Limits and known gaps

- No pagination on `/blog/` or the galleries. Fine for a few dozen items each; add `paginate()` when lists get long.
- No search, no image lightbox (detail pages instead), no sitemap.
- Build time scales with pictures. Astro caches optimized images in `node_modules/.astro`, but CI starts clean each run. If builds get slow (hundreds of photos), cache that directory in the workflow with `actions/cache`.
- Pages without their own picture have no social preview image.
