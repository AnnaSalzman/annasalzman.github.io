import type { Element, ElementContent } from './hast.ts';

export interface BuildContext {
  /** Print a build warning that names the Markdown file. Never fails the build. */
  warn(message: string): void;
}

/**
 * One tag Anna can write in Markdown, such as `<flip-card>`.
 *
 * `build` runs at build time, once per occurrence, and returns the finished HTML.
 * Behaviour in the browser (if any) lives next to it in `client.ts`, and styles
 * in `style.css`. See CLAUDE.md, "Adding a component for Anna".
 */
export interface MarkdownComponent {
  /** The tag name as Anna types it. Must contain a hyphen. */
  name: string;
  /**
   * Block components sit on their own line. If Markdown wrapped them in a
   * <p>, the plugin removes that <p>.
   */
  block: boolean;
  /**
   * When several of these sit together (one per line, no blank lines between),
   * wrap them in `<div class="{group}">` so CSS can lay them out as a set.
   */
  group?: string;
  build(el: Element, ctx: BuildContext): ElementContent | ElementContent[];
}
