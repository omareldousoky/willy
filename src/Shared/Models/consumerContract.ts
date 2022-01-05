import { Customer, EntitledToSign, OtpCustomer } from './Customer'

export interface BondContractProps {
  customerCreationDate: number
  customerName: string
  nationalId: string
  customerHomeAddress: string
  initialConsumerFinanceLimit: number
  commercialRegisterNumber?: string
  businessAddress?: string
  branchName?: string
  branchAddress?: string
  isCF?: boolean
}
export interface ConsumerFinanceContractData extends BondContractProps {
  mobilePhoneNumber: string
  customerGuarantors?: Customer[]
  entitledToSignCustomers?: EntitledToSign[]
  otpCustomers?: OtpCustomer[]
}

export interface AcknowledgmentWasSignedInFrontProps {
  customerName: string
  nationalId: string
  customerCreationDate: number
  customerGuarantors?: Customer[]
  isCF?: boolean
}
export interface PromissoryNoteProps extends BondContractProps {
  customerGuarantors?: Customer[]
}

export interface AuthorizationToFillInfoProps {
  customerCreationDate: number
  customerName: string
  customerHomeAddress: string
  customerGuarantors?: Customer[]
  isCF?: boolean
}
