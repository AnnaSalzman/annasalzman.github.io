/**
 * Site-wide settings: the name, the default description, and the menu.
 * Anna's own words (intro, About text) live in src/content/pages/about.md.
 */
import type { Color } from './lib/colors.ts';

export const SITE = {
  name: 'Anna Salzman',
  description:
    'A middle school teacher’s corner of the internet: blog posts, drawings, photos, and resources for my students.',
  lang: 'en',
};

export type Section = 'blog' | 'drawings' | 'photos' | 'resources' | 'about';

export interface NavItem {
  section: Section;
  href: string;
  label: string;
  emoji: string;
  /** Each section has its own crayon; pages in it pick up that tint. */
  color: Color;
}

export const NAV: NavItem[] = [
  { section: 'blog', href: '/blog/', label: 'Blog', emoji: '✏️', color: 'red' },
  { section: 'drawings', href: '/drawings/', label: 'Drawings', emoji: '🎨', color: 'purple' },
  { section: 'photos', href: '/photos/', label: 'Photos', emoji: '📷', color: 'blue' },
  { section: 'resources', href: '/resources/', label: 'Resources', emoji: '🎒', color: 'green' },
  { section: 'about', href: '/about/', label: 'About', emoji: '👋', color: 'yellow' },
];

export function sectionColor(section: Section | undefined): Color {
  return NAV.find((item) => item.section === section)?.color ?? 'yellow';
}
