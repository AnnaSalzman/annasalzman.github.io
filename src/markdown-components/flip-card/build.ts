import { colorFor, parseColor } from '../../lib/colors.ts';
import { attr, h, meaningful, text, unwrapParagraph } from '../lib/hast.ts';
import type { MarkdownComponent } from '../lib/types.ts';

/**
 * <flip-card front="Photosynthesis" back="How plants turn sunlight into food"></flip-card>
 * A flashcard that flips when tapped. Put several on consecutive lines to get
 * a deck. (Writing the back inside the tag instead of back="…" also works.)
 *
 * Browser behaviour: ./client.ts
 */
export const flipCard: MarkdownComponent = {
  name: 'flip-card',
  block: true,
  group: 'flip-card-deck',
  build(el, ctx) {
    const front = attr(el, 'front');
    const backAttr = attr(el, 'back');
    const back = backAttr ? [text(backAttr)] : unwrapParagraph(meaningful(el.children));
    if (!front || back.length === 0) {
      ctx.warn('<flip-card> needs both front="…" and back="…".');
    }
    const color = parseColor(attr(el, 'color')) ?? colorFor(front ?? '');
    return h('flip-card', { className: [`tint-${color}`] }, [
      h('button', { type: 'button', className: ['flip-card'], ariaPressed: 'false' }, [
        h('span', { className: ['flip-card__face', 'flip-card__front'] }, [text(front ?? '')]),
        h('span', { className: ['flip-card__face', 'flip-card__back'] }, back),
      ]),
    ]);
  },
};
