import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { cn } from "~/lib/cn";

import type { FileExplorerNode } from "./types";

interface FileExplorerViewProps {
  tree: Array<FileExplorerNode>;
  label?: string;
  defaultExpanded?: Array<string>;
  defaultExpandedDepth?: number;
}

interface VisibleNode {
  path: string;
  parentPath: string;
  isFolder: boolean;
}

const joinPath = (parentPath: string, name: string) =>
  parentPath ? `${parentPath}/${name}` : name;

const ancestorPaths = (path: string) => {
  const folders = path.split("/").slice(0, -1);
  return folders.map((_, index) => folders.slice(0, index + 1).join("/"));
};

const foldersWithinDepth = (
  nodes: Array<FileExplorerNode>,
  maxDepth: number,
  depth = 0,
  parentPath = "",
): Array<string> =>
  nodes.flatMap((node) => {
    if (!node.children || depth >= maxDepth) return [];
    const path = joinPath(parentPath, node.name);
    return [path, ...foldersWithinDepth(node.children, maxDepth, depth + 1, path)];
  });

const flattenVisible = (
  nodes: Array<FileExplorerNode>,
  expanded: ReadonlySet<string>,
  parentPath = "",
): Array<VisibleNode> =>
  nodes.flatMap((node) => {
    const path = joinPath(parentPath, node.name);
    const isFolder = Boolean(node.children);
    const self: VisibleNode = { path, parentPath, isFolder };
    if (!isFolder || !expanded.has(path)) return [self];
    return [self, ...flattenVisible(node.children ?? [], expanded, path)];
  });

const collectPreviews = (
  nodes: Array<FileExplorerNode>,
  parentPath = "",
): Array<[string, string]> =>
  nodes.flatMap((node) => {
    const path = joinPath(parentPath, node.name);
    if (node.children) return collectPreviews(node.children, path);
    return node.html ? [[path, node.html] satisfies [string, string]] : [];
  });

const cardClass = cn(
  "not-prose my-8 flex flex-col gap-2 rounded-lg border border-muted/30 bg-canvas p-2 font-sans text-sm sm:text-base lg:-mx-8 lg:flex-row",
);

const treeClass = cn("min-w-0 lg:max-h-120 lg:w-72 lg:shrink-0 lg:overflow-auto lg:pr-1");

const previewClass = cn(
  "flex min-w-0 flex-1 rounded-md bg-terminal lg:max-h-120 lg:overflow-hidden",
);

const emptyClass = cn("m-auto px-4 py-8 text-center text-sm text-terminal-muted");

const rowClass = cn(
  "flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/12",
);

const groupClass = cn("ml-3 border-l border-muted/25 pl-2");

export function FileExplorerView({
  tree,
  label = "File tree",
  defaultExpanded,
  defaultExpandedDepth = 1,
}: FileExplorerViewProps) {
  const previews = useMemo(() => new Map(collectPreviews(tree)), [tree]);
  const firstFile = previews.keys().next().value ?? null;
  const [expanded, setExpanded] = useState(
    () =>
      new Set([
        ...(defaultExpanded ?? foldersWithinDepth(tree, defaultExpandedDepth)),
        ...(firstFile ? ancestorPaths(firstFile) : []),
      ]),
  );
  const [selected, setSelected] = useState(firstFile);
  const visible = useMemo(() => flattenVisible(tree, expanded), [tree, expanded]);
  const [focused, setFocused] = useState(() => visible[0]?.path ?? "");
  const items = useRef(new Map<string, HTMLDivElement>());
  const preview = selected ? previews.get(selected) : undefined;

  const toggle = (path: string, open?: boolean) => {
    setExpanded((current) => {
      const next = new Set(current);
      const shouldOpen = open ?? !next.has(path);
      if (shouldOpen) next.add(path);
      else next.delete(path);
      return next;
    });
  };

  const focus = (path: string | undefined) => {
    if (!path) return;
    setFocused(path);
    items.current.get(path)?.focus();
  };

  const activate = (path: string, isFolder: boolean) => {
    if (isFolder) toggle(path);
    else setSelected(path);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = visible.findIndex((node) => node.path === focused);
    const node = visible[index];
    if (!node) return;
    const isOpen = expanded.has(node.path);

    switch (event.key) {
      case "ArrowDown":
        focus(visible[index + 1]?.path);
        break;
      case "ArrowUp":
        focus(visible[index - 1]?.path);
        break;
      case "ArrowRight":
        if (!node.isFolder) return;
        if (isOpen) focus(visible[index + 1]?.path);
        else toggle(node.path, true);
        break;
      case "ArrowLeft":
        if (node.isFolder && isOpen) toggle(node.path, false);
        else focus(node.parentPath || undefined);
        break;
      case "Home":
        focus(visible[0]?.path);
        break;
      case "End":
        focus(visible.at(-1)?.path);
        break;
      case "Enter":
      case " ":
        activate(node.path, node.isFolder);
        break;
      default:
        return;
    }

    event.preventDefault();
  };

  const renderNodes = (nodes: Array<FileExplorerNode>, parentPath: string) =>
    nodes.map((node) => {
      const path = joinPath(parentPath, node.name);
      const isFolder = Boolean(node.children);
      const isOpen = isFolder && expanded.has(path);
      const isSelected = !isFolder && selected === path;

      return (
        // oxlint-disable-next-line jsx-a11y/click-events-have-key-events -- the tree root owns keyboard handling
        <div
          key={path}
          role="treeitem"
          aria-label={node.name}
          aria-expanded={isFolder ? isOpen : undefined}
          aria-selected={isSelected}
          tabIndex={focused === path ? 0 : -1}
          ref={(element) => {
            if (element) items.current.set(path, element);
            else items.current.delete(path);
          }}
          data-file-explorer-item
          className="outline-none"
          onFocus={(event) => {
            if (event.target === event.currentTarget) setFocused(path);
          }}
          onClick={(event) => {
            event.stopPropagation();
            activate(path, isFolder);
          }}
        >
          <div
            data-file-explorer-row
            className={cn(rowClass, isSelected && "bg-accent/15 text-accent")}
          >
            <ChevronRight
              className={cn(
                "size-4 shrink-0 text-muted transition-transform",
                isFolder ? (isOpen ? "rotate-90" : "rotate-0") : "invisible",
              )}
              aria-hidden="true"
            />
            {isFolder ? (
              isOpen ? (
                <FolderOpen className="size-4.5 shrink-0 text-accent" aria-hidden="true" />
              ) : (
                <Folder className="size-4.5 shrink-0 text-accent" aria-hidden="true" />
              )
            ) : (
              <File className="size-4.5 shrink-0 text-muted" aria-hidden="true" />
            )}
            <span className="min-w-0 wrap-break-word lg:truncate">{node.name}</span>
          </div>
          {isFolder && (
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a tree needs role="group", not a fieldset
            <div role="group" data-file-explorer-group data-expanded={isOpen} inert={!isOpen}>
              <div className="overflow-hidden">
                <div className={groupClass}>{renderNodes(node.children ?? [], path)}</div>
              </div>
            </div>
          )}
        </div>
      );
    });

  return (
    <div data-file-explorer-card className={cardClass}>
      {/* oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- the tree items carry the roving tabindex */}
      <div role="tree" aria-label={label} className={treeClass} onKeyDown={onKeyDown}>
        {renderNodes(tree, "")}
      </div>
      <section
        data-file-explorer-preview
        className={previewClass}
        aria-label={selected ?? "File preview"}
      >
        {preview ? (
          // oxlint-disable-next-line react/no-danger -- Shiki output, built on the server
          <div dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <p className={emptyClass}>
            {selected ? "No preview for this file" : "Pick a file to read it"}
          </p>
        )}
      </section>
    </div>
  );
}
