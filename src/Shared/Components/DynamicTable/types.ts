import { ReactNode } from 'react'

export interface TableMapperItem<T = any> {
  title: string | (() => JSX.Element | void)
  key: string
  sortable?: boolean
  render: (data: T, i?: number) => void | ReactNode
}

export interface CommonDynamicTableProps<T = any, S = any> {
  data: T[]
  totalCount: number
  searchFilters: S
  search: (request: S) => Promise<void>
  setSearchFilters: (filters: S) => void
}

// used by components that uses dynamic table
export interface ExtendedDynamicTableProps<T = any, S = any>
  extends CommonDynamicTableProps<T, S> {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export type ChangeNumberType = 'from' | 'size'

export interface PaginationProps {
  pagesList?: number[]
  size?: number
}

/* 
used `any` so we don't break existing usages and also to research exporting connected
component with generics
 */
export interface DynamicTableProps extends CommonDynamicTableProps<any, any> {
  mappers: TableMapperItem<any>[]
  pagination: boolean
  customPagination?: PaginationProps
  changeNumber?: (key: ChangeNumberType, number: number) => void | undefined
  size?: number
  from?: number
  url?: string
}
