import { codeToHtml } from "shiki";

import { CODE_THEME } from "~/consts";

import type { FileExplorerNode, FileExplorerSource } from "./types";

const LANGUAGES: Record<string, string> = {
  astro: "astro",
  css: "css",
  html: "html",
  js: "js",
  json: "json",
  jsx: "jsx",
  md: "md",
  mdx: "mdx",
  mjs: "js",
  sh: "bash",
  svg: "xml",
  ts: "ts",
  tsx: "tsx",
  yaml: "yaml",
  yml: "yaml",
};

const languageOf = (name: string) =>
  LANGUAGES[name.split(".").pop()?.toLowerCase() ?? ""] ?? "text";

export const highlightTree = async (nodes: FileExplorerSource[]): Promise<FileExplorerNode[]> =>
  Promise.all(
    nodes.map(async ({ name, content, children }) => {
      const node: FileExplorerNode = { name };
      if (children) node.children = await highlightTree(children);
      if (content) {
        node.html = await codeToHtml(content.trim(), {
          lang: languageOf(name),
          theme: CODE_THEME,
        });
      }
      return node;
    }),
  );
