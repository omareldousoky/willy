import { ManagerHierarchyUser } from '../../Services/interfaces'

export interface ManagersCreationProps {
  branchId: string
}

export interface Managers {
  branchId?: string
  operationsManager?: ManagerHierarchyUser
  areaManager?: ManagerHierarchyUser
  areaSupervisor?: ManagerHierarchyUser
  centerManager?: ManagerHierarchyUser
  branchManager?: ManagerHierarchyUser
}
