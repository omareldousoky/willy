import { ReactNode } from 'react'

export interface TableMapperItem<T = void> {
  title: string | (() => JSX.Element)
  key: string
  sortable?: boolean
  render: (data: T | any) => ReactNode
}
