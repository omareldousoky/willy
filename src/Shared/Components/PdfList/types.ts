export interface PDF {
  key?: string;
  local?: string;
  inputs?: Array<string>;
  permission: string;
}

export interface PDFListProps {
  list: PDF[];
  onClickDownload(item: PDF): void;
}
