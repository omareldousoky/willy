import { Score } from '../../Models/Customer'
import { CustomerScore } from '../../Services/APIs/customer/customerCategorization'
import { Customer } from '../../Services/interfaces'

export interface FieldProps {
  fieldTitle: string
  fieldData:
    | string
    | number
    | CustomerScore[]
    | React.ReactElement
    | CFGuarantorTableViewProp
  showFieldCondition: boolean
  fieldDataStyle?: React.CSSProperties
  fieldTitleStyle?: React.CSSProperties
}
export interface TabDataProps {
  [key: string]: FieldProps[]
}
export interface TabProps {
  icon?: string
  header?: string
  desc?: string
  stringKey: string
  permission?: string | string[]
  permissionKey?: string
}
export interface ProfileProps {
  source: string
  tabs: TabProps[]
  activeTab: string
  setActiveTab(activeTab: string): void
  loading: boolean
  setLoading?(loading: boolean): void
  backButtonText?: string
  editText?: string
  editPermission?: boolean
  editOnClick?(): void
  tabsData: TabDataProps
}

export interface CFGuarantorTableViewProp {
  customerId: string
  customerGuarantors: Array<Customer>
  getIscore?: (data) => Promise<void>
  iscores?: Score[]
}
