export interface PDF {
  key?: string
  local?: string
  inputs?: Array<string>
  permission: string
  hidePdf?: boolean
}

export interface PDFListProps {
  list: PDF[]
  onClickDownload(item: PDF): void
}
