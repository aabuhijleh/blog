import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type HastPlugin = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];

export const externalLinks: HastPlugin = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) {
        return;
      }
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', 'noopener noreferrer');
    },
  },
};
