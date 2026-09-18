import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import og from "astro-og";
import { CODE_THEME } from "./src/consts";
import { externalLinks } from "./src/markdown/external-links";
import { images } from "./src/markdown/images";

export default defineConfig({
  site: "https://blog.aabuhijleh.com",

  compressHTML: false,
  integrations: [mdx(), sitemap(), og(), react()],

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Merriweather",
      cssVariable: "--font-merriweather",
      fallbacks: ["serif"],
      weights: [400, 700],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "Fira Sans",
      cssVariable: "--font-fira-sans",
      fallbacks: ["sans-serif"],
      weights: [400, 700],
    },
  ],

  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
    },
    processor: satteri({
      features: { rawHtml: true },
      hastPlugins: [externalLinks, images],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
