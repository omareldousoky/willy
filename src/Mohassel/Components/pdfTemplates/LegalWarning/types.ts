import {
  LegalWarningResponse,
  LegalWarningType,
} from '../../../../Shared/Models/LegalAffairs'

export interface LegalWarningTemplate {
  showDateAndTime: boolean
  courtAgent: boolean
  details: (court?: string, caseNumber?: string) => JSX.Element | string
  action: string
}

export type LegalWarningTemplates = Record<
  LegalWarningType,
  LegalWarningTemplate
>

export interface LegalWarningProps {
  type: LegalWarningType
  warnings: LegalWarningResponse[]
}
