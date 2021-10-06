export interface List {
  _id: string
  created?: { at: number; by?: string; userName?: string }
  status: 'created' | 'queued' | 'failed' | 'processing'
  generatedAt: number
  fileGeneratedAt?: number
  fileName?: string
  failReason?: string
  key?: string
  url?: string
  type: 'sme' | 'micro'
}
export interface ReportsListProps {
  list: List[]
  onClickDownload?: (itemId: string) => void
  iscoreType?: boolean
}
