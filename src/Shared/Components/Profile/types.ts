import {
  CFEntitledToSignDetailsProps,
  CFGuarantorDetailsProps,
} from '../../Models/Customer'
import { CustomerScore } from '../../Services/APIs/customer/customerCategorization'

export interface FieldProps {
  fieldTitle: string
  fieldData:
    | string
    | number
    | CustomerScore[]
    | React.ReactElement
    | CFGuarantorDetailsProps
    | CFEntitledToSignDetailsProps
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
  setActiveTab(activeTab: keyof TabDataProps): void
  loading: boolean
  setLoading?(loading: boolean): void
  backButtonText?: string
  editText?: string
  editPermission?: boolean
  editOnClick?(): void
  tabsData: TabDataProps
  activeTab: keyof TabDataProps
}
