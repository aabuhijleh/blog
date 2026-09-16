import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '~/consts';

export async function GET(context: APIContext) {
  const { site } = context;
  if (!site) {
    throw new Error(
      '`site` must be set in astro.config.ts to build the RSS feed.',
    );
  }

  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
