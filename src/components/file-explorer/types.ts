export interface FileExplorerSource {
  name: string;
  content?: string;
  children?: FileExplorerSource[];
}

export interface FileExplorerNode {
  name: string;
  html?: string;
  children?: FileExplorerNode[];
}
