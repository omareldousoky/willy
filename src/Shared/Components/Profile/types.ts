import { CFGuarantorDetailsProps } from '../../../CF/Components/CustomerCreation/types';
import { CustomerScore } from '../../Services/APIs/customer/customerCategorization'

export interface FieldProps {
  fieldTitle: string
  fieldData:
    | string
    | number
    | CustomerScore[]
    | React.ReactElement
    | CFGuarantorDetailsProps
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
