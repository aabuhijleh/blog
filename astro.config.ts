import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { externalLinks } from './src/markdown/external-links';

export default defineConfig({
  site: 'https://blog.aabuhijleh.com',

  compressHTML: false,
  integrations: [mdx(), sitemap()],

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Merriweather',
      cssVariable: '--font-merriweather',
      fallbacks: ['serif'],
      weights: [400, 700],
      styles: ['normal', 'italic'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fira Sans',
      cssVariable: '--font-fira-sans',
      fallbacks: ['sans-serif'],
      weights: [400, 700],
    },
  ],

  markdown: {
    shikiConfig: {
      theme: 'nord',
    },
    processor: satteri({ hastPlugins: [externalLinks] }),
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
