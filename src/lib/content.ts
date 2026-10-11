/**
 * The one place pages get content from. Handles drafts (visible in `npm run
 * dev`, hidden on the real site), sorting, tags and dates.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

type Draftable = { data: { draft: boolean } };
type Dated = { data: { date: Date } };

export const showDrafts = import.meta.env.DEV;

const visible = (entry: Draftable) => showDrafts || !entry.data.draft;
const newestFirst = (a: Dated, b: Dated) => b.data.date.valueOf() - a.data.date.valueOf();

export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog', visible)).sort(newestFirst);
}

export async function getDrawings(): Promise<CollectionEntry<'drawings'>[]> {
  return (await getCollection('drawings', visible)).sort(newestFirst);
}

export async function getPhotos(): Promise<CollectionEntry<'photos'>[]> {
  return (await getCollection('photos', visible)).sort(newestFirst);
}

export async function getResources(): Promise<CollectionEntry<'resources'>[]> {
  return (await getCollection('resources', visible)).sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getPages(): Promise<CollectionEntry<'pages'>[]> {
  return getCollection('pages', visible);
}

/** "Field Trip" → "field-trip". Used in tag page addresses. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

/** Every tag used on a visible post, most used first. Tags differing only in case are merged. */
export async function getTags(): Promise<Tag[]> {
  const tags = new Map<string, Tag>();
  for (const post of await getPosts()) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      if (!slug) continue;
      const tag = tags.get(slug) ?? { name, slug, count: 0 };
      tag.count++;
      tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Previous (newer) and next (older) neighbours in a newest-first list. */
export function neighbours<T extends { id: string }>(list: T[], id: string): { newer?: T; older?: T } {
  const index = list.findIndex((entry) => entry.id === id);
  return { newer: list[index - 1], older: list[index + 1] };
}

/**
 * Dates in frontmatter have no time zone, so YAML reads them as midnight UTC.
 * Format in UTC too, or "2026-10-11" would show as October 10 in America.
 */
export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
