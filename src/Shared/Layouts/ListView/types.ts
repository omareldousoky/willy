import { TableMapperItem } from 'Shared/Components/DynamicTable/types'
import { Tab } from 'Shared/Components/HeaderWithCards/headerWithCards'

type TabsProps =
  | { headerTabs?: undefined; activeTab?: never }
  | { headerTabs?: Array<Tab>; activeTab: string }

// TODO Here are the stuff for Search will be refactored later on
type SearchProps =
  | {
      searchKeys?: undefined
      dropDownKeys?: never
      searchPlaceholder?: never
      searchUrl?: never
      hqBranchIdRequest?: never
      datePlaceholder?: never
      searchSetFrom?: never
    }
  | {
      searchKeys?: string[]
      dropDownKeys: string[]
      searchPlaceholder: string
      searchUrl: string
      hqBranchIdRequest: string
      datePlaceholder: string
      searchSetFrom(from: number): void
    }

export type ListViewProps<TableDataType> = TabsProps &
  SearchProps & {
    headerTitle?: string
    isLoading?: boolean
    viewTitle?: string
    sideTitleText?: string
    tableFrom: number
    tableSize: number
    tableTotalCount: number
    tableUrl: string
    tableMappers: TableMapperItem[]
    tableData: TableDataType[]
    onChangeTableNumber(key: string, number: number): void
    isCf?: boolean
  }
