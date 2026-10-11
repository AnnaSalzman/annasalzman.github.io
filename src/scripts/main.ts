/**
 * The one script every page loads (bundled by Astro from BaseLayout).
 * It picks up the browser half of every Markdown component automatically:
 * any src/markdown-components/<name>/client.ts is included.
 */
import './theme.ts';

import.meta.glob('../markdown-components/*/client.ts', { eager: true });
