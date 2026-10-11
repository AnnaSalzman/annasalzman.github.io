/**
 * The content schema: what each kind of Markdown file may say at the top
 * (its "frontmatter"). Astro checks every file against this at build time.
 *
 * Anna edits these files by hand on github.com, so fields are forgiving where
 * that is cheap: `draft: yes` works, `tags: a, b` works, an unknown color falls
 * back to the default. Only missing essentials (title, date, picture) fail.
 * If you add a field, add it to docs/EDITING.md too.
 */
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { COLORS, parseColor } from './lib/colors.ts';

const toText = (value: unknown) => (value === null || value === undefined ? undefined : String(value).trim());

/** Required text. Numbers are fine ("title: 2026" is a title). */
const text = z.preprocess(toText, z.string().min(1));

const optionalText = z.preprocess((value) => toText(value) || undefined, z.string().optional());

/** true / false, also accepting yes / no / on / off. */
const flag = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  return ['true', 'yes', 'on', 'y'].includes(value.trim().toLowerCase());
}, z.boolean().default(false));

/** A list, or a comma-separated line: `tags: [science, field trip]` or `tags: science, field trip`. */
const tags = z.preprocess(
  (value) => {
    if (value === null || value === undefined) return [];
    const list = Array.isArray(value) ? value : String(value).split(',');
    return list.map((tag) => String(tag).trim()).filter(Boolean);
  },
  z.array(z.string()),
);

/** One of the crayon colors from src/lib/colors.ts; anything else is ignored. */
const color = z.preprocess((value) => parseColor(value), z.enum(COLORS).optional());

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: text,
      date: z.coerce.date(),
      description: optionalText,
      cover: image().optional(),
      coverAlt: optionalText,
      tags,
      draft: flag,
    }),
});

/** Drawings and photos: one picture plus a few words. */
const gallerySchema = ({ image }: SchemaContext) =>
  z.object({
    title: text,
    date: z.coerce.date(),
    image: image(),
    /** Describes the picture for people who can't see it. Falls back to the title. */
    alt: optionalText,
    draft: flag,
  });

const drawings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/drawings' }),
  schema: gallerySchema,
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: gallerySchema,
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: text,
    description: optionalText,
    emoji: optionalText,
    color,
    /** Lower numbers come first on the Resources page. */
    order: z.coerce.number().default(100),
    draft: flag,
  }),
});

/** French film picks (the cinema in the illustrated town). The text below the top part is the review. */
const films = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/films' }),
  schema: ({ image }) =>
    z.object({
      title: text,
      englishTitle: optionalText,
      year: z.coerce.number().int().optional(),
      director: optionalText,
      country: optionalText,
      /** 1 to 5 stars. */
      rating: z.coerce.number().min(0).max(5).optional(),
      poster: image().optional(),
      posterAlt: optionalText,
      /** When the review was written; newest reviews come first. */
      date: z.coerce.date().optional(),
      draft: flag,
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: text,
    description: optionalText,
    /** Short intro shown on the home page (used by about.md). */
    summary: optionalText,
    /** Keep the page out of search engines (it is still reachable by its address). */
    hidden: flag,
    draft: flag,
  }),
});

export const collections = { blog, drawings, photos, resources, films, pages };
