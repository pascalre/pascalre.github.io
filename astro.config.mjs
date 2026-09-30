// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // User site (pascalre.github.io) is served from the root, so no `base` is needed.
  site: 'https://pascalre.github.io',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
