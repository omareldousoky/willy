import { Application, Customer } from "../../../../Shared/Services/interfaces";

export interface AcknowledgmentAndPledgeProps {
  entitledToSign: Customer[];
}
export interface AcknowledgmentOfCommitmentProps {
  application: Application;
}
export interface AcknowledgmentWasSignedInFrontProps {
  application: Application;
}
export interface KnowYourCustomerProps {
  application: Application;
  loanUsage: string;
}
export interface PromissoryNoteProps {
  noteKind: "شركات" | "شخصى";
}
