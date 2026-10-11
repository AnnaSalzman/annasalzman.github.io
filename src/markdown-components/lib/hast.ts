/**
 * Small helpers for reading and building HAST (the HTML syntax tree Sätteri
 * hands to plugins). Kept dependency-free on purpose: the trees are plain
 * objects, so a few functions cover everything the components need.
 */
import type { Element, ElementContent, Properties, Text } from 'hast';

export type { Element, ElementContent };

export function h(
  tagName: string,
  properties: Properties = {},
  children: ElementContent[] = [],
): Element {
  return { type: 'element', tagName, properties, children };
}

export function text(value: string): Text {
  return { type: 'text', value };
}

export function isElement(node: unknown, tagName?: string): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as Element).type === 'element' &&
    (tagName === undefined || (node as Element).tagName === tagName)
  );
}

export function isWhitespace(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

/** Children without the blank text nodes that newlines in the source leave behind. */
export function meaningful(children: ElementContent[]): ElementContent[] {
  return children.filter((child) => !isWhitespace(child) && child.type !== 'comment');
}

/** Read an attribute as a trimmed string ('' when present but empty, undefined when absent). */
export function attr(el: Element, name: string): string | undefined {
  const value = el.properties?.[name];
  if (value === undefined || value === null || value === false) return undefined;
  if (Array.isArray(value)) return value.join(' ').trim();
  if (value === true) return '';
  return String(value).trim();
}

/** Depth-first search for every descendant element matching `test`. */
export function findAll(node: Element, test: (el: Element) => boolean): Element[] {
  const found: Element[] = [];
  for (const child of node.children) {
    if (!isElement(child)) continue;
    if (test(child)) found.push(child);
    found.push(...findAll(child, test));
  }
  return found;
}

export function textContent(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textContent).join('');
  return '';
}

/** If the only thing inside `children` is a single <p>, return that paragraph's children instead. */
export function unwrapParagraph(children: ElementContent[]): ElementContent[] {
  const kids = meaningful(children);
  if (kids.length === 1 && isElement(kids[0], 'p')) return kids[0].children;
  return children;
}
