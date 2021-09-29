import { Application } from '../../../../Services/interfaces'

export interface PaymentReceiptProps {
  receiptData: any
  data?: Application
  companyReceipt: boolean
  type: 'sme' | 'cf'
  fromLoanIssuance?: boolean
}
