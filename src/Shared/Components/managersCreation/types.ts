import { ManagerHierarchyUser } from '../../Services/interfaces'

export interface ManagersCreationProps {
  branchId: string
}

export interface Managers {
  branchId?: string
  operationsManager?: ManagerHierarchyUser
  districtManager?: ManagerHierarchyUser
  districtSupervisor?: ManagerHierarchyUser
  centerManager?: ManagerHierarchyUser
  branchManager?: ManagerHierarchyUser
}
