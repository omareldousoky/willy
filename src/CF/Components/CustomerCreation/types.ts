import { Customer, Score } from '../../../Shared/Models/Customer'

export interface CFGuarantorDetailsProps {
  customerId: string
  guarantors: Array<Customer>
  hasLoan: boolean
  getIscore?: (data) => Promise<void>
  iscores?: Score[]
}
