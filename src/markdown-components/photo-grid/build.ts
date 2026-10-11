import { attr, findAll, h, text, type Element } from '../lib/hast.ts';
import { sizeImage } from '../lib/images.ts';
import type { MarkdownComponent } from '../lib/types.ts';

/**
 * <photo-grid> ![…](./images/a.jpg) ![…](./images/b.jpg) </photo-grid>
 * Lays out the pictures inside side by side. Each picture can have a caption
 * via the Markdown title: ![alt text](./images/a.jpg "Caption").
 */
export const photoGrid: MarkdownComponent = {
  name: 'photo-grid',
  block: true,
  build(el, ctx) {
    const images = findAll(el, (node) => node.tagName === 'img');
    if (images.length === 0) {
      ctx.warn('<photo-grid> has no pictures inside. Put ![description](./images/name.jpg) lines between the tags.');
      return h('div', { className: ['photo-grid'] }, el.children);
    }
    return h(
      'div',
      { className: ['photo-grid'], dataCount: String(images.length) },
      images.map((img) => figure(img)),
    );
  },
};

function figure(img: Element): Element {
  const caption = attr(img, 'title');
  // Pictures here are already sized for the full column; tiles are smaller.
  const tile = sizeImage(
    { ...img, properties: { ...img.properties, width: undefined, sizes: undefined } },
    { width: 480, sizes: '(min-width: 48rem) 14rem, calc(50vw - 1.5rem)' },
  );
  return h('figure', { className: ['photo-grid__item'] }, [
    tile,
    ...(caption ? [h('figcaption', {}, [text(caption)])] : []),
  ]);
}
