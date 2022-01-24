import { LoanOfficer, ManagerHierarchyUser } from '../../Services/interfaces'

export interface UsersSearchProps {
  objectKey: string | number
  item?: ManagerHierarchyUser
  updateItem: (newItem?: ManagerHierarchyUser) => void
  isLoanOfficer?: boolean
  branchId?: string
  usersInitial: Array<LoanOfficer>
  isClearable?: boolean
}
