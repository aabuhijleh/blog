import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";

type HastPlugin = NonNullable<SatteriProcessorOptions["hastPlugins"]>[number];

const isDev = process.env.NODE_ENV !== "production";

let occurrence = 0;

export const images: HastPlugin = {
  name: "images",
  element: {
    filter: ["img"],
    visit(node, ctx) {
      const properties = node.properties ?? {};
      const src = properties.src;

      if (isDev) {
        ctx.setProperty(node, "data-image-component", "true");
      }

      const path = typeof src === "string" ? decodeURI(src) : undefined;
      const isLocal = path !== undefined && !URL.canParse(path) && !path.startsWith("/");

      if (!isLocal) {
        ctx.setProperty(node, "loading", "lazy");
        ctx.setProperty(node, "decoding", "async");
        return;
      }

      // Only markdown syntax feeds this set, so raw HTML images register themselves.
      ctx.data.astro?.localImagePaths.add(path);

      if (!Array.isArray(properties.className)) {
        ctx.setProperty(node, "loading", "lazy");
        ctx.setProperty(node, "decoding", "async");
        return;
      }

      // Marking it here keeps `class` on the tag; getImage() echoes it back as `className`.
      const { src: _, className: __, ...rest } = properties;
      ctx.setProperty(
        node,
        "__ASTRO_IMAGE_",
        JSON.stringify({
          ...rest,
          loading: "lazy",
          decoding: "async",
          src: path,
          index: occurrence++,
        }),
      );
      for (const key of Object.keys(rest)) {
        ctx.setProperty(node, key, null);
      }
      ctx.setProperty(node, "src", null);
    },
  },
};
