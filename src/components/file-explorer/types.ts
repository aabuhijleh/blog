export interface FileExplorerSource {
  name: string;
  content?: string;
  children?: Array<FileExplorerSource>;
}

export interface FileExplorerNode {
  name: string;
  html?: string;
  children?: Array<FileExplorerNode>;
}
