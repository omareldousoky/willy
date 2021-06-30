export interface Mapper<T = void> {
  title: string
  key: string
  sortable?: boolean
  render: (data: T | any) => void
}
