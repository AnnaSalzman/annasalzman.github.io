import { COLORS, parseColor } from '../../lib/colors.ts';
import { attr, h } from '../lib/hast.ts';
import type { MarkdownComponent } from '../lib/types.ts';

/**
 * <sticky-note color="yellow"> … </sticky-note>
 * A colored note for reminders and asides. Markdown works inside when the
 * tags sit on their own lines with blank lines around the content.
 */
export const stickyNote: MarkdownComponent = {
  name: 'sticky-note',
  block: true,
  build(el, ctx) {
    const raw = attr(el, 'color');
    let color = parseColor(raw);
    if (raw && !color) {
      ctx.warn(`<sticky-note color="${raw}">: I don't know that color, so it's yellow. Try one of: ${COLORS.join(', ')}.`);
    }
    color ??= 'yellow';
    return h('aside', { className: ['sticky-note', `tint-${color}`] }, el.children);
  },
};
