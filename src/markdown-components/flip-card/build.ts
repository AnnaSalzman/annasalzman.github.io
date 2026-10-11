import { colorFor, parseColor } from '../../lib/colors.ts';
import { attr, h, meaningful, text, unwrapParagraph } from '../lib/hast.ts';
import type { MarkdownComponent } from '../lib/types.ts';
import { frenchSpacing } from '../../lib/typography.ts';

/**
 * <flip-card fr="la pomme" en="the apple"></flip-card>
 * <flip-card front="Photosynthesis" back="How plants make food"></flip-card>
 *
 * A flashcard that flips when tapped. `fr`/`en` puts the French on the front
 * and marks it as French (lang="fr"), so screen readers pronounce it properly.
 * `front`/`back` is for anything else. Several on consecutive lines make a deck.
 * (Writing the back inside the tag instead of back="…" also works.)
 *
 * Browser behaviour: ./client.ts
 */
export const flipCard: MarkdownComponent = {
  name: 'flip-card',
  block: true,
  group: 'flip-card-deck',
  build(el, ctx) {
    const fr = attr(el, 'fr');
    const front = fr ?? attr(el, 'front');
    const backAttr = fr ? attr(el, 'en') : attr(el, 'back');
    const back = backAttr ? [text(frenchSpacing(backAttr))] : unwrapParagraph(meaningful(el.children));
    if (!front || back.length === 0) {
      ctx.warn(
        fr
          ? `<flip-card fr="${fr}"> needs the English too: en="…".`
          : '<flip-card> needs both sides: fr="…" en="…" (or front="…" back="…").',
      );
    }
    const color = parseColor(attr(el, 'color')) ?? colorFor(front ?? '');
    return h('flip-card', { className: [`tint-${color}`] }, [
      h('button', { type: 'button', className: ['flip-card'], ariaPressed: 'false' }, [
        h('span', { className: ['flip-card__face', 'flip-card__front'], ...(fr ? { lang: 'fr' } : {}) }, [
          text(frenchSpacing(front ?? '')),
        ]),
        h('span', { className: ['flip-card__face', 'flip-card__back'] }, back),
      ]),
    ]);
  },
};
