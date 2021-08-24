import { LegalWarningType } from '../../../Mohassel/Models/LegalAffairs'

export interface SearchInitialFormikState {
  name?: string
  keyword?: string
  fromDate?: string
  toDate?: string
  governorate?: string
  status?: string
  action?: string
  branchId?: string
  isDoubtful?: boolean
  isWrittenOff?: boolean
  printed?: boolean
  lastDates?: 'day' | 'week' | 'month' | ''
  type?: string
  warningType?: LegalWarningType | ''
  phoneNumber?: string
  beneficiaryType?: 'individual' | 'group'
}

export interface SearchProps {
  size: number
  from: number
  url: string
  roleId?: string
  searchPlaceholder?: string
  datePlaceholder?: string
  hqBranchIdRequest?: string
  status?: string
  fundSource?: string
  searchKeys: Array<string>
  dropDownKeys?: Array<string>
  issuedLoansSearchFilters: any
  chosenStatus?: string
  type?: 'sme' | 'micro' | 'nano' // type of product
  beneficiaryType?: 'individual' | 'group'
  resetSelectedItems?: () => void
  setFrom?: (from: number) => void
  search: (data) => void
  searchFilters: (data) => void
  setIssuedLoansSearchFilters: (data) => void
  setLoading: (data) => void
  submitClassName?: string
  sme?: boolean
  cf?: boolean
}

export interface SearchState {
  governorates: Array<any>
  dropDownValue: string
  actionsList: Array<string>
}
