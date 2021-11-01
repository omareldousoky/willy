import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { endOfDayValue } from '../../../Shared/Services/utils'

export interface ClearanceDataValues {
  customerId: string
  loanId: string
  transactionKey?: string
  clearanceReason: string
  bankName: string
  notes: string
  registrationDate: number | string
  receiptDate?: number | string
  manualReceipt?: string
  status?: string
}
export interface ClearanceRequest {
  customerId: string
  loanId: string
  transactionKey?: string
  clearanceReason: string
  bankName: string
  notes: string
  registrationDate: number | string
  receiptDate?: number | string
  manualReceipt?: string
  receiptPhoto?: File
  documentPhoto?: File
}
export interface ClearanceDocumentsValues {
  receiptPhotoURL?: string
  documentPhotoURL?: string
  receiptPhoto?: File
  documentPhoto?: File
}

export const clearanceData: ClearanceDataValues = {
  customerId: '',
  loanId: '',
  transactionKey: '',
  clearanceReason: '',
  bankName: '',
  notes: '',
  registrationDate: '',
  receiptDate: '',
  manualReceipt: '',
}
export const clearanceDocuments: ClearanceDocumentsValues = {
  receiptPhotoURL: '',
  documentPhotoURL: '',
}

export const clearanceStep1CreationValidation = Yup.object().shape({
  loanId: Yup.string().trim().required(local.required),
  transactionKey: Yup.string().trim(),
  clearanceReason: Yup.string().trim().required(local.required),
  bankName: Yup.string().trim().required(local.required),
  notes: Yup.string().trim(),
  registrationDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    })
    .required(local.required),
  receiptDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    })
    .required(local.required),
  manualReceipt: Yup.string(),
  status: Yup.string(),
})
export const clearanceStep2CreationValidation = Yup.object().shape({
  receiptPhoto: Yup.mixed(),
  documentPhoto: Yup.mixed().required(local.required),
})
export const clearanceStep2EditValidation = Yup.object().shape({
  receiptPhoto: Yup.mixed(),
  documentPhoto: Yup.mixed(),
})
