import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '~/consts';
import { renderOgImage } from '~/lib/og/render';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error(
      '`site` must be set in astro.config.ts to build Open Graph images.',
    );
  }

  const png = await renderOgImage({
    title: SITE_TITLE,
    subtitle: SITE_DESCRIPTION,
    illustration: 'monitor',
    site,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
