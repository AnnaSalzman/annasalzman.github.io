import { colorFor, parseColor } from '../../lib/colors.ts';
import { attr, h, text, textContent, unwrapParagraph } from '../lib/hast.ts';
import type { MarkdownComponent } from '../lib/types.ts';

/**
 * <game-link href="https://…" emoji="🍕">Fraction Pizza: practice equivalent fractions</game-link>
 * A big, friendly button to a game or website for students. Neighbouring
 * game links line up in a grid.
 */
export const gameLink: MarkdownComponent = {
  name: 'game-link',
  block: true,
  group: 'game-link-grid',
  build(el, ctx) {
    const href = attr(el, 'href');
    if (!href) ctx.warn('<game-link> is missing href="…" (the web address it should open).');
    const label = unwrapParagraph(el.children);
    const color = parseColor(attr(el, 'color')) ?? colorFor(textContent(el));
    const emoji = attr(el, 'emoji') || '🎮';
    return h(href ? 'a' : 'div', { className: ['game-link', `tint-${color}`], ...(href ? { href } : {}) }, [
      h('span', { className: ['game-link__emoji'], ariaHidden: 'true' }, [text(emoji)]),
      h('span', { className: ['game-link__label'] }, label),
      h('span', { className: ['game-link__arrow'], ariaHidden: 'true' }, [text('→')]),
    ]);
  },
};
