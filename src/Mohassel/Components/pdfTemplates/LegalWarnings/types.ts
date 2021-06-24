import { LegalWarningType } from '../../../Models/LegalAffairs'

export interface LegalWarningTemplate {
  showDateAndTime: boolean
  courtAgent: boolean
  details: string | JSX.Element
  action: string
}

export type LegalWarningTemplates = Record<
  LegalWarningType,
  LegalWarningTemplate
>

export interface LegalWarningProps {
  type: LegalWarningType
}
