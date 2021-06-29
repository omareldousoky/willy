export interface PdfPortalProps {
  component: JSX.Element
}

export interface OrientationProps {
  size: 'landscape' | 'portrait'
  keepCardStyle?: boolean
}

export interface PaginationProps {
  totalCount: number
  updatePagination: (key: string, number: number) => void
  from: number
  size?: number
  paginationArr?: number[]
}
