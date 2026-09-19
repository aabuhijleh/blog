import { satteriCreateHighlightFn, type SatteriProcessorOptions } from "@astrojs/markdown-satteri";

import { CODE_THEME } from "~/consts";

type HastPlugin = NonNullable<SatteriProcessorOptions["hastPlugins"]>[number];

const LANGUAGE_PREFIX = "language-";

const highlighter = satteriCreateHighlightFn("shiki", { theme: CODE_THEME });

const languageOf = (className: unknown) => {
  const names = Array.isArray(className) ? className : [className];
  const tagged = names.find(
    (name): name is string => typeof name === "string" && name.startsWith(LANGUAGE_PREFIX),
  );
  return tagged?.slice(LANGUAGE_PREFIX.length) ?? "plaintext";
};

// The rawHtml feature drops the fence language, so read it back off the class.
export const highlight: HastPlugin = {
  name: "highlight",
  element: {
    filter: ["pre"],
    visit(node, ctx) {
      const code = node.children?.find(
        (child) => child.type === "element" && child.tagName === "code",
      );
      if (code?.type !== "element") return;

      const source = ctx.textContent(code).replace(/\n$/, "");
      return highlighter.then((run) => run?.(source, languageOf(code.properties?.className)));
    },
  },
};
