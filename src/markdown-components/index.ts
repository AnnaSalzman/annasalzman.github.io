/**
 * The Sätteri (Markdown) plugin that powers Anna's components.
 *
 * Anna writes HTML-style tags in her Markdown (`<flip-card front="…" back="…">`).
 * With `rawHtml` on, Sätteri parses those into real elements; this plugin walks
 * the tree once per document and replaces each registered tag with the HTML its
 * `build()` returns. It also:
 *   - removes the <p> Markdown wraps around a component written on its own line,
 *   - groups neighbouring components that declare a `group` (e.g. a deck of flip cards),
 *   - makes pasted <iframe> embeds (YouTube, Google Slides, …) responsive,
 *   - keeps French punctuation attached ("Bonjour !" never breaks before the "!"),
 *   - warns (never fails) about tags that look like a misspelled component.
 *
 * To add a component: see CLAUDE.md, "Adding a component for Anna".
 */
import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import type { HastPluginDefinition } from 'satteri';
import type { Element, ElementContent, Root } from 'hast';
import { attr, h, isElement, meaningful } from './lib/hast.ts';
import { sizeImage } from './lib/images.ts';
import { frenchSpacing } from '../lib/typography.ts';
import type { BuildContext, MarkdownComponent } from './lib/types.ts';

import { flipCard } from './flip-card/build.ts';
import { gameLink } from './game-link/build.ts';
import { photoGrid } from './photo-grid/build.ts';
import { quizQuestion } from './quiz-question/build.ts';
import { stickyNote } from './sticky-note/build.ts';

export const components: MarkdownComponent[] = [stickyNote, photoGrid, flipCard, quizQuestion, gameLink];

const registry = new Map(components.map((component) => [component.name, component]));

export const markdownComponents: HastPluginDefinition = {
  name: 'anna-markdown-components',
  before(root, hookCtx) {
    const file = hookCtx.fileURL
      ? relative(process.cwd(), fileURLToPath(hookCtx.fileURL))
      : 'a Markdown file';
    const ctx: BuildContext = {
      warn(message) {
        // On GitHub Actions this becomes an annotation on the run page.
        if (process.env.GITHUB_ACTIONS) console.log(`::warning file=${file},title=Component::${message}`);
        else console.warn(`\x1b[33m[components]\x1b[0m ${file}: ${message}`);
      },
    };
    const newRoot: Root = { type: 'root', children: transformChildren(root.children as ElementContent[], ctx) };
    hookCtx.replaceNode(root, newRoot);
  },
};

/** Remembers which output nodes belong to a group, so neighbours can be wrapped together. */
const groupOf = new WeakMap<object, string>();

function isBlockComponent(node: ElementContent): boolean {
  return isElement(node) && registry.get(node.tagName)?.block === true;
}

/** Elements whose text is shown exactly as typed (no typography changes). */
const VERBATIM = new Set(['code', 'pre', 'kbd', 'samp', 'script', 'style', 'textarea']);

export function transformChildren(children: ElementContent[], ctx: BuildContext, verbatim = false): ElementContent[] {
  return groupNeighbours(transformFlat(children, ctx, verbatim));
}

function transformFlat(children: ElementContent[], ctx: BuildContext, verbatim: boolean): ElementContent[] {
  const out: ElementContent[] = [];
  for (const child of children) {
    if (isElement(child, 'p')) {
      const kids = meaningful(child.children);
      // A component on its own line arrives wrapped in <p>. Drop that wrapper.
      if (kids.length > 0 && kids.every(isBlockComponent)) {
        out.push(...transformFlat(kids, ctx, verbatim));
        continue;
      }
      const stray = kids.find(isBlockComponent);
      if (stray) {
        ctx.warn(`<${(stray as Element).tagName}> is in the middle of a sentence. Put it on its own line, with a blank line before and after.`);
      }
    }
    out.push(...transformNode(child, ctx, verbatim));
  }
  return out;
}

function transformNode(node: ElementContent, ctx: BuildContext, verbatim: boolean): ElementContent[] {
  if (node.type === 'text') return [{ type: 'text', value: verbatim ? node.value : frenchSpacing(node.value) }];
  if (node.type === 'comment') return [{ type: 'comment', value: node.value }];
  if (node.type !== 'element') return [{ ...node }];

  const el: Element = {
    type: 'element',
    tagName: node.tagName,
    properties: { ...node.properties },
    children: transformChildren(node.children, ctx, verbatim || VERBATIM.has(node.tagName)),
  };

  const component = registry.get(el.tagName);
  if (component) {
    const result = component.build(el, ctx);
    const nodes = Array.isArray(result) ? result : [result];
    if (component.group) for (const n of nodes) groupOf.set(n, component.group);
    return nodes;
  }

  if (el.tagName === 'iframe') return [responsiveEmbed(el)];
  if (el.tagName === 'img') return [sizeImage(el, { width: 800, sizes: '(min-width: 48rem) 42rem, calc(100vw - 2rem)' })];

  const suggestion = suggestComponent(el.tagName);
  if (suggestion) {
    ctx.warn(`<${el.tagName}> is not a component I know. Did you mean <${suggestion}>?`);
  } else if (el.tagName.includes('-')) {
    ctx.warn(`<${el.tagName}> is not a component I know. Known components: ${[...registry.keys()].join(', ')}.`);
  }
  return [el];
}

/** Wrap runs of neighbouring same-group components (blank text between them is fine). */
function groupNeighbours(nodes: ElementContent[]): ElementContent[] {
  const out: ElementContent[] = [];
  let i = 0;
  while (i < nodes.length) {
    const group = groupOf.get(nodes[i]);
    if (!group) {
      out.push(nodes[i++]);
      continue;
    }
    const members: ElementContent[] = [];
    while (i < nodes.length) {
      const node = nodes[i];
      if (groupOf.get(node) === group) members.push(node);
      else if (!(node.type === 'text' && node.value.trim() === '')) break;
      i++;
    }
    out.push(h('div', { className: [group] }, members));
  }
  return out;
}

/** Keep a pasted embed's own shape (16:9 video, tall form, …) while letting it shrink on phones. */
function responsiveEmbed(el: Element): Element {
  const width = Number(attr(el, 'width'));
  const height = Number(attr(el, 'height'));
  const properties = { ...el.properties };
  properties.loading ??= 'lazy';
  properties.title ??= 'Embedded content';
  if (width > 0 && height > 0) {
    properties.style = `aspect-ratio: ${width} / ${height};${properties.style ? ` ${properties.style}` : ''}`;
  }
  return h('div', { className: ['embed'] }, [{ ...el, properties }]);
}

function suggestComponent(tagName: string): string | undefined {
  if (registry.has(tagName)) return undefined;
  const squash = (s: string) => s.replace(/[-_\s]/g, '');
  let best: { name: string; distance: number } | undefined;
  for (const name of registry.keys()) {
    const distance = squash(name) === squash(tagName) ? 0 : levenshtein(name, tagName);
    if (distance <= 3 && (!best || distance < best.distance)) best = { name, distance };
  }
  return best?.name;
}

function levenshtein(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}
