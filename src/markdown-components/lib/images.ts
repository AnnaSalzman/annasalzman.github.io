import { attr, type Element } from './hast.ts';

/**
 * Pictures from the post's folder (![…](./images/x.jpg)) are resized by Astro.
 * These props reach Astro's getImage(): `width` is the 1× display size and
 * "constrained" makes Astro add a srcset up to 2× (see image.breakpoints in
 * astro.config.mjs), so a 4000px phone photo is never sent as is. Images are
 * never enlarged. Only scalar values survive Sätteri, hence no `widths` array.
 */
export function sizeImage(img: Element, { width, sizes }: { width: number; sizes: string }): Element {
  const src = attr(img, 'src') ?? '';
  if (/^([a-z]+:|\/)/i.test(src)) return img; // remote or /public file: left alone
  const properties = { ...img.properties };
  properties.layout ??= 'constrained';
  properties.width ??= width;
  properties.sizes ??= sizes;
  return { ...img, properties };
}
