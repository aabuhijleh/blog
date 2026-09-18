import type { FileTreeSource } from "~/lib/file-tree";

const fileTreeAstro = `
---
import { type FileTreeSource, highlightFileTree } from "~/lib/file-tree";
import { FileTreeView } from "./FileTreeView";

interface Props {
  tree: FileTreeSource[];
  label?: string;
  defaultExpanded?: string[];
  defaultExpandedDepth?: number;
}

const { tree, ...rest } = Astro.props;

const nodes = await highlightFileTree(tree);
---

<FileTreeView client:visible tree={nodes} {...rest} />
`;

const fileTreeView = `
export function FileTreeView({ tree, label = "File tree" }: FileTreeViewProps) {
  const previews = useMemo(() => new Map(collectPreviews(tree)), [tree]);
  const [selected, setSelected] = useState(firstFile);
  const preview = selected ? previews.get(selected) : undefined;

  return (
    <div data-file-tree-card className={cardClass}>
      <div role="tree" aria-label={label} onKeyDown={onKeyDown}>
        {renderNodes(tree, "")}
      </div>
      <section data-file-tree-preview className={previewClass}>
        {preview ? (
          <div dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <p className={emptyClass}>Pick a file to read it</p>
        )}
      </section>
    </div>
  );
}
`;

const highlighter = `
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
`;

const globalCss = `
[data-file-tree-group] {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}

[data-file-tree-group][data-expanded="true"] {
  grid-template-rows: 1fr;
}

[data-file-tree-item]:focus-visible > [data-file-tree-row] {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

[data-file-tree-preview] pre {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 0.9rem 1rem;
}
`;

const astroConfig = `
import { CODE_THEME } from "./src/consts";

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
    },
  },
});
`;

export const blogSource: FileTreeSource[] = [
  {
    name: "src",
    children: [
      {
        name: "components",
        children: [
          { name: "FileTree.astro", content: fileTreeAstro },
          { name: "FileTreeView.tsx", content: fileTreeView },
          { name: "PackageCommand.tsx" },
        ],
      },
      {
        name: "lib",
        children: [
          { name: "file-tree.ts", content: highlighter },
          { name: "package-commands.ts" },
        ],
      },
      {
        name: "styles",
        children: [{ name: "global.css", content: globalCss }],
      },
      { name: "consts.ts", content: `export const CODE_THEME = "nord";` },
    ],
  },
  { name: "astro.config.ts", content: astroConfig },
];
