import {
  GroupsByBranch,
  LoanOfficer,
  ManagerHierarchyUser,
  OfficersGroup,
} from '../../../Shared/Services/interfaces'
import { Tab } from '../../../Shared/Components/HeaderWithCards/cardNavbar'

export interface UsersSearchProps {
  objectKey: string | number
  item?: ManagerHierarchyUser
  updateItem: (newItem?: ManagerHierarchyUser) => void
  isLoanOfficer?: boolean
  branchId?: string
  usersInitial: Array<LoanOfficer>
  isClearable?: boolean
}

export interface ManagersCreationProps {
  branchId: string
}

export interface BranchBasicsCardProps {
  name: string
  branchCode: number
  createdAt: string
  status: 'active' | 'inactive' | ''
}

export interface Managers {
  branchId?: string
  operationsManager?: ManagerHierarchyUser
  areaManager?: ManagerHierarchyUser
  areaSupervisor?: ManagerHierarchyUser
  centerManager?: ManagerHierarchyUser
  branchManager?: ManagerHierarchyUser
}

export interface UserOfBranch {
  name: string
  _id: string
}

export interface ManagerProfileProps {
  branchId: string
  name: string
  branchCode: number
  createdAt: string
  status: 'active' | 'inactive' | ''
}

export interface ManagerProfileState {
  loading: boolean
  data: Managers
  tabsArray: Array<Tab>
  activeTab: string
}

export interface SupervisionGroupProps {
  seqNo: number
  deleteGroup: any
  group: OfficersGroup
  branchId: string
  mode: string
  users: Array<LoanOfficer>
  loanOfficers: Array<LoanOfficer>
  updateGroupOfficers: (newGroup: ManagerHierarchyUser[]) => void
  updateGroupLeader: (newLeader?: ManagerHierarchyUser) => void
}

export interface SupervisionLevelsActionsProps {
  branchId: string
  mode: 'delete' | 'approve' | 'unapprove'
}

export interface SupervisionLevelsActionsState {
  data: {
    id: string
    branchId: string
    startDate: number
    groups: OfficersGroup[]
  }
  loading: boolean
  selectedGroups: OfficersGroup[]
  chosenStatus: string
}

export interface SupervisionLevelsCreationProps {
  branchId: string
  mode: 'create' | 'edit'
}

export interface Group {
  id?: string
  leader: string | ManagerHierarchyUser
  officers: string[] | ManagerHierarchyUser[]
}

export interface SupervisionGroupsListState {
  size: number
  from: number
  branchId: string
  searchKey: string[]
  options: {
    label: string
    value: string
  }[]
  selectedGroups: GroupsByBranch[]
  checkAll: boolean
  chosenStatus: string
  officersModal: boolean
  currentGroup?: GroupsByBranch
}

export interface SupervisionGroupsListProps {
  data: GroupsByBranch[]
  totalCount: number
  loading: boolean
  searchFilters: object
  error: string
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
  setLoading: (data) => void
}

export interface SupervisionsProfileProps {
  branchId: string
  name: string
  branchCode: number
  createdAt: string
  status: 'active' | 'inactive' | ''
}

export interface SupervisionsProfileState {
  data: {
    id: string
    branchId: string
    startDate: number
    groups: OfficersGroup[]
  }
  loading: boolean
  tabsArray: Array<Tab>
  activeTab: string
}
