import type { APIRoute } from "astro";
import { type CollectionEntry, getCollection } from "astro:content";

import { renderOgImage } from "~/lib/og/render";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

export const GET: APIRoute<CollectionEntry<"blog">> = async ({ props, site }) => {
  if (!site) {
    throw new Error("`site` must be set in astro.config.ts to build Open Graph images.");
  }

  const png = await renderOgImage({ ...props.data, site });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
