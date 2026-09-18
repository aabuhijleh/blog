import { codeToHtml } from "shiki";
import { CODE_THEME } from "~/consts";

export interface FileTreeSource {
  name: string;
  content?: string;
  children?: FileTreeSource[];
}

export interface FileTreeNode {
  name: string;
  html?: string;
  children?: FileTreeNode[];
}

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

export const highlightFileTree = async (
  nodes: FileTreeSource[],
): Promise<FileTreeNode[]> =>
  Promise.all(
    nodes.map(async ({ name, content, children }) => {
      const node: FileTreeNode = { name };
      if (children) node.children = await highlightFileTree(children);
      if (content) {
        node.html = await codeToHtml(content.trim(), {
          lang: languageOf(name),
          theme: CODE_THEME,
        });
      }
      return node;
    }),
  );
