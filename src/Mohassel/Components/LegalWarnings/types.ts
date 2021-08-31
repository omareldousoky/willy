export enum WarningCreationStepEnum {
  SelectCustomer,
  SelectLoan,
  SelectWarning,
}

export interface WarningCreationModalProps {
  showModal: boolean
  setShowModal: (newState: boolean) => void
  getLegalWarnings: (resetFrom?: boolean) => void
}
export type ProductType = 'micro' | 'nano' | 'sme' | 'smeIndividual'
