import { Document } from '../../../../Shared/Services/interfaces'
import { Customer } from '../../../../Shared/Models/Customer'

export interface LoanLimitForm {
  limit: number
  nanoLimitDocument?: Document[]
}

export interface LoanLimitModalProps {
  show: boolean
  hideModal: () => void
  customer: Customer
  loanLimit: number
  onSuccess: () => void
}
