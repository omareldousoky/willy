import { TableMapperItem } from 'Shared/Components/DynamicTable/types'
import { Tab } from 'Shared/Components/HeaderWithCards/headerWithCards'

type TabsProps =
  | { headerTabs?: undefined; activeTab?: never }
  | { headerTabs?: Array<Tab>; activeTab: string }

export type ListViewProps<TableDataType> = TabsProps & {
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
  // TODO Here are the stuff for Search will be refactored later on
  isCf: boolean
  searchKeys: string[]
  dropDownKeys: string[]
  searchPlaceholder: string
  searchUrl: string
  hqBranchIdRequest: string
  datePlaceholder: string
  searchSetFrom(from: number): void
}
