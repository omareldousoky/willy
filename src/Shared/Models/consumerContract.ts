import { Customer } from './Customer'

export interface BondContractProps {
  customerCreationDate: number
  customerName: string
  nationalId: string
  customerHomeAddress: string
  initialConsumerFinanceLimit: number
  isCF?: boolean
}
export interface ConsumerFinanceContractData extends BondContractProps {
  mobilePhoneNumber: string
  customerGuarantors?: Customer[]
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
