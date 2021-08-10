import { LegalWarningType } from '../../Models/LegalAffairs'

export type OptionType = { value: string; label: string }

export interface WarningTypeDropDownProps {
  onChange: (option?: OptionType) => void
  defaultValue?: LegalWarningType | ''
  omitAllOption?: boolean
  colSize?: number
}
