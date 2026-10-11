/**
 * The crayon box. Anna picks colors by these plain names (in frontmatter and in
 * component attributes); CSS maps each name to `--color-<name>` tokens in
 * src/styles/tokens.css.
 */
export const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'] as const;

export type Color = (typeof COLORS)[number];

const ALIASES: Record<string, Color> = {
  pink: 'red',
  tomato: 'red',
  gold: 'yellow',
  mint: 'green',
  teal: 'green',
  sky: 'blue',
  violet: 'purple',
  grape: 'purple',
};

export function isColor(value: string): value is Color {
  return (COLORS as readonly string[]).includes(value);
}

/** Turn whatever Anna typed into a known color, or undefined if we can't. */
export function parseColor(value: unknown): Color | undefined {
  if (typeof value !== 'string') return undefined;
  const name = value.trim().toLowerCase();
  if (isColor(name)) return name;
  return ALIASES[name];
}

/** Pick a color that stays stable for a given string (e.g. a tag or a title). */
export function colorFor(key: string): Color {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return COLORS[hash % COLORS.length];
}
