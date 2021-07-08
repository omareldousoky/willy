import { ExtendedDynamicTableProps } from '../../../Shared/Components/DynamicTable/types'
import {
  LegalWarningResponse,
  LegalWarningsSearchRequest,
} from '../../Models/LegalAffairs'

export type LegalWarningsProps = ExtendedDynamicTableProps<
  LegalWarningResponse,
  LegalWarningsSearchRequest
>

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
