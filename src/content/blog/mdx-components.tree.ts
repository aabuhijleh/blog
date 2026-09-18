import type { FileExplorerSource } from "~/components/file-explorer";

const fileExplorerAstro = `
---
import { FileExplorerView } from "./file-explorer-view";
import { highlightTree } from "./highlight";
import type { FileExplorerSource } from "./types";

interface Props {
  tree: FileExplorerSource[];
  label?: string;
  defaultExpanded?: string[];
  defaultExpandedDepth?: number;
}

const { tree, ...rest } = Astro.props;

const nodes = await highlightTree(tree);
---

<FileExplorerView client:visible tree={nodes} {...rest} />
`;

const fileExplorerView = `
export function FileExplorerView({ tree, label = "File explorer" }: FileExplorerViewProps) {
  const previews = useMemo(() => new Map(collectPreviews(tree)), [tree]);
  const [selected, setSelected] = useState(firstFile);
  const preview = selected ? previews.get(selected) : undefined;

  return (
    <div data-file-explorer-card className={cardClass}>
      <div role="tree" aria-label={label} onKeyDown={onKeyDown}>
        {renderNodes(tree, "")}
      </div>
      <section data-file-explorer-preview className={previewClass}>
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
export const highlightTree = async (
  nodes: FileExplorerSource[],
): Promise<FileExplorerNode[]> =>
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
`;

const barrel = `
export { default as FileExplorer } from "./file-explorer.astro";
export type { FileExplorerSource } from "./types";
`;

const globalCss = `
[data-file-explorer-group] {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}

[data-file-explorer-group][data-expanded="true"] {
  grid-template-rows: 1fr;
}

[data-file-explorer-item]:focus-visible > [data-file-explorer-row] {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

[data-file-explorer-preview] pre {
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

export const blogSource: FileExplorerSource[] = [
  {
    name: "src",
    children: [
      {
        name: "components",
        children: [
          {
            name: "file-explorer",
            children: [
              { name: "index.ts", content: barrel },
              { name: "file-explorer.astro", content: fileExplorerAstro },
              { name: "file-explorer-view.tsx", content: fileExplorerView },
              { name: "highlight.ts", content: highlighter },
              { name: "types.ts" },
            ],
          },
          { name: "PackageCommand.tsx" },
        ],
      },
      {
        name: "lib",
        children: [{ name: "package-commands.ts" }],
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
