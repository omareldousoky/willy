import { Application } from '../../../../Shared/Services/interfaces'
import { Customer } from '../../../../Shared/Models/Customer'
import { BranchDetails } from '../../../../Shared/Services/APIs/Branch/getBranch'

export interface AcknowledgmentAndPledgeProps {
  entitledToSign: {
    customer: Customer
    position: string
  }[]
  application: Application
}
export interface AcknowledgmentOfCommitmentProps {
  application: Application
  branchDetails?: BranchDetails
}
export interface AcknowledgmentWasSignedInFrontProps {
  application: Application
  branchDetails?: BranchDetails
}
export interface KnowYourCustomerProps {
  application: Application
  loanUsage: string
}
export interface SolidarityGuaranteeProps {
  application: Application
  person: Customer
  personPosition?: string
}
export interface AuthorizationToFillCheckProps {
  application: Application
}
export interface AuthorizationToFillInfoProps {
  application: Application
}
export interface PromissoryNoteProps {
  noteKind: 'sme' | 'individual'
  application: Application
  branchDetails?: BranchDetails
  person?: Customer
  personPosition?: string
}
