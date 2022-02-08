export interface FLContractProps {
  data: FinancialLeaseContract
}
export interface FinancialLeaseContract {
  creationDate: number
  customerType: string
  customerName: string
  guarantors: Guarantor[]
  vendorName: string
  principal: number
  categoryName: string
  itemDescription: string
  businessSector: string
  downPayment: number
  installmentResponse: number
  periodLength: number
  firstInstallmentDate: number
  lastInstallmentDate: number
  feesSum: number
  customerHomeAddress: string
  nationalId: string
  commercialRegisterNumber: string
  businessAddress: string
  taxCardNumber: string
  entitledToSign: EntitledToSign
  installmentSum: number
  loanUsage: string
  applicationFeesRequired: number
  legalConstitution: string
}
interface EntitledToSign {
  position: string
  name: string
}

export type TermStyle = 'index' | 'dotted' | 'dashed' | 'alphaIndex'

interface TermData {
  id: number
  style?: TermStyle
  title?: string
}

export interface TermSubData {
  id?: string
  style?: TermStyle
  title?: string
  data: string[]
}

export interface TermMapper extends TermData {
  data: (string | TermSubData)[]
}

interface Guarantor {
  name: string
  address: string
  nationalId: string
}
