import { Customer, Document } from '../../../../Shared/Services/interfaces'

export interface LoanLimitForm {
  limit: number
  nanoLimitDocument?: Document[]
}

export interface LoanLimitModalProps {
  show: boolean
  hideModal: () => void
  customer: Customer
  loanLimit: number
}
