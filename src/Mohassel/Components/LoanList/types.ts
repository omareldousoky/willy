export interface LoanListProps {
  branchId: string
  fromBranch?: boolean
}

export interface LoanListLocationState {
  sme?: boolean
}

export interface LoanListHistoryState {
  id: string
  sme?: boolean
}
