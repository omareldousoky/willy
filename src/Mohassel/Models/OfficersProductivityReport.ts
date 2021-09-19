export interface OfficersProductivityRequest {
  startDate: number
  endDate: number
  branches: string[]
  gracePeriod?: number
}

export interface CommonOfficersProductivity {
  totalBranches?: number
  totalIssuedCount?: number
  totalIssuedAmount?: number
  expectedPaymentsThisDuration?: number
  paidByEndOfDuration?: number
  paymentPercentage?: number
  currentWalletAmount?: number
  reciepts?: number
  totalCount?: number
}

interface OfficersProductivityCenterManagers
  extends CommonOfficersProductivity {
  centerManager?: string
}

interface OfficersProductivityAreaSupervisors
  extends CommonOfficersProductivity {
  centerManagers?: OfficersProductivityCenterManagers[]
  areaSupervisor?: string
}

interface OfficersProductivityAreaManagers extends CommonOfficersProductivity {
  areaSupervisors?: OfficersProductivityAreaSupervisors[]
  areaManager?: string
}

interface OfficersProductivityOperationManager
  extends CommonOfficersProductivity {
  areaManagers?: OfficersProductivityAreaManagers[]
  operationsManager?: string
}

export interface OfficersProductivityResponse
  extends CommonOfficersProductivity {
  response: OfficersProductivityOperationManager[]
  _id?: string
  startDate: number
  endDate: number
}
