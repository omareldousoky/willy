export interface ActionLogProps {
  id: string
}

export interface ActionLogState {
  loading: boolean
  data: any
  from: number
  size: number
  totalCount: number
}
