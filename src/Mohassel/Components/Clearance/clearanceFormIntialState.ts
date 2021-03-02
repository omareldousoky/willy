import { FormikErrors, FormikTouched } from 'formik'
import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'

const endOfDay: Date = new Date()
endOfDay.setHours(23, 59, 59, 59)
export interface ClearanceValues {
  customerId: string
  loanId: string
  transactionKey?: string
  clearanceReason: string
  bankName: string
  notes: string
  registrationDate: number | string
  receiptDate?: number | string
  receiptPhoto?: File
  receiptPhotoURL?: string
  documentPhoto?: File
  documentPhotoURL?: string
  manualReceipt?: string
  status?: string
}
export interface ClearanceErrors {
  transactionKey?: string
  loanId?: string
  clearanceReason?: string
  bankName?: string
  notes?: string
  registrationDate?: string
  receiptDate?: string
  receiptPhoto?: any
  documentPhoto?: any
  manualReceipt?: string
}
export interface ClearanceTouched {
  transactionKey?: boolean
  loanId?: boolean
  clearanceReason?: boolean
  bankName?: boolean
  notes?: boolean
  registrationDate?: boolean
  receiptDate?: boolean
  receiptPhoto?: any
  documentPhoto?: any
  manualReceipt?: boolean
}

export const clearanceData: ClearanceValues = {
  customerId: '',
  loanId: '',
  transactionKey: '',
  clearanceReason: '',
  bankName: '',
  notes: '',
  registrationDate: 0,
  receiptDate: 0,
  manualReceipt: '',
}

export const clearanceCreationValidation = Yup.object().shape({
  loanId: Yup.string().trim().required(local.required),
  transactionKey: Yup.string().trim(),
  clearanceReason: Yup.string().trim().required(local.required),
  bankName: Yup.string().trim().required(local.required),
  notes: Yup.string().trim(),
  registrationDate: Yup.string()
    .trim()
    .required(local.required)
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    }),
  receiptDate: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    }
  ),
  receiptPhoto: Yup.mixed(),
  documentPhoto: Yup.mixed().required(local.required),
  manualReceipt: Yup.string(),
  status: Yup.string(),
})
export const clearanceEditValidation = Yup.object().shape({
  loanId: Yup.string().trim().required(local.required),
  transactionKey: Yup.string().trim(),
  clearanceReason: Yup.string().trim().required(local.required),
  bankName: Yup.string().trim().required(local.required),
  notes: Yup.string().trim(),
  registrationDate: Yup.string()
    .trim()
    .required(local.required)
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    }),
  receiptDate: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    }
  ),
  receiptPhoto: Yup.mixed(),
  documentPhoto: Yup.mixed(),
  manualReceipt: Yup.string(),
  status: Yup.string(),
})
