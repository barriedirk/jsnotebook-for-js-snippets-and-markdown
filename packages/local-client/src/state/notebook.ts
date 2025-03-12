export interface Notebook {
  title: string;
  fileId: string;
}

export interface FilesNotebook {
  activeFileId?: string | undefined;
  files: Notebook[];
}
