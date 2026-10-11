/**
 * French typography. French puts a space before ! ? : ; and inside « », and
 * that space must never break, or "Bonjour !" can end with the "!" alone on
 * the next line. This turns those spaces into no-break spaces. English text
 * (no space before punctuation) passes through unchanged.
 *
 * Used on all Markdown text (src/markdown-components/index.ts) and on titles
 * rendered by components.
 */
const NBSP = ' ';

export function frenchSpacing(text: string): string {
  return text.replace(/(^|\S)[ \t]+(?=[!?;:»])/g, `$1${NBSP}`).replace(/«[ \t]+/g, `«${NBSP}`);
}
