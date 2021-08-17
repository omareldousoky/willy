import { CustomerGuarantor } from '../../Shared/Services/interfaces'

export interface BondContractProps {
  customerCreationDate: number
  customerName: string
  nationalId: string
  customerHomeAddress: string
  initialConsumerFinanceLimit: number
}
export interface ConsumerFinanceContractData extends BondContractProps {
  mobilePhoneNumber: string
  customerGuarantors?: CustomerGuarantor[]
}

export interface AcknowledgmentWasSignedInFrontProps {
  customerName: string
  nationalId: string
  customerCreationDate: number
  customerGuarantors?: CustomerGuarantor[]
}
export interface PromissoryNoteProps extends BondContractProps {
  customerGuarantors?: CustomerGuarantor[]
}

export interface AuthorizationToFillInfoProps {
  customerCreationDate: number
  customerName: string
  customerHomeAddress: string
  customerGuarantors?: CustomerGuarantor[]
}
