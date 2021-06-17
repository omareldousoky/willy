import {
  ApplicationResponse,
  InstallmentsResponse,
} from '../../../Models/Application'
import { EarlyPaymentPdfData } from '../../LoanProfile/types'

export interface EarlyPaymentPDFProps {
  application: ApplicationResponse
  earlyPaymentPdfData: EarlyPaymentPdfData
  branchDetails: any
}

export interface EarlyPaymentInstallmentProps {
  applicationKey: number
  installmentsObject?: InstallmentsResponse
  installmentsDue: number[]
  totalDaysLate: number
  totalDaysEarly: number
}
