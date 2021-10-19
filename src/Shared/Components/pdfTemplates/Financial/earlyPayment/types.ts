import {
  ApplicationResponse,
  InstallmentsResponse,
} from '../../../../Models/Application'

export interface EarlyPaymentPdfData {
  totalDaysLate: number
  totalDaysEarly: number
  installmentsDue: number[]
  remainingInstallments: number
  applicationFees: number
  remainingTotal: number // egamli l raseed
  remainingInterest?: number
  remainingPrincipal?: number
  earlyPaymentPrincipal: number
  earlyPaymentInterest: number
  earlyPaymentTotal: number // egmali l sdad l mo3agal
}

export interface EarlyPaymentPDFProps {
  application: ApplicationResponse
  earlyPaymentPdfData: EarlyPaymentPdfData
  branchDetails: any
  type?: 'cf' | 'sme' | 'lts'
}

export interface EarlyPaymentInstallmentProps {
  applicationKey: number
  installmentsObject?: InstallmentsResponse
  installmentsDue: number[]
  totalDaysLate: number
  totalDaysEarly: number
}
