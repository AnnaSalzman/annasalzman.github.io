// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownComponents } from './src/markdown-components/index.ts';

export default defineConfig({
  site: 'https://annasalzman.github.io',
  image: {
    // Sizes generated for pictures in Markdown (see sizeImage in src/markdown-components/index.ts).
    breakpoints: [400, 800, 1200, 1600],
  },
  markdown: {
    processor: satteri({
      // Parse the HTML-style tags Anna writes in posts (<flip-card>, <quiz-question>, …)
      // into real elements so the plugin below can turn them into finished HTML.
      features: { rawHtml: true },
      hastPlugins: [markdownComponents],
    }),
  },
});
