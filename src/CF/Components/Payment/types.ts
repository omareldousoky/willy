import { ApplicationResponse } from '../../../Shared/Models/Application'
import { Installment } from '../../../Shared/Services/interfaces'

export interface EarlyPaymentProps {
  loading: boolean
  remainingPrincipal: number
  earlyPaymentFees: number
  requiredAmount: number
  installments: Array<Installment>
  application: ApplicationResponse
  setPayerType: (data) => void
  formikProps: any
}
