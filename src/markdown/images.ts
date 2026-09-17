import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type HastPlugin = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];

const isDev = process.env.NODE_ENV !== 'production';

export const images: HastPlugin = {
  name: 'images',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      ctx.setProperty(node, 'loading', 'lazy');
      ctx.setProperty(node, 'decoding', 'async');
      if (isDev) {
        ctx.setProperty(node, 'data-image-component', 'true');
      }
    },
  },
};
