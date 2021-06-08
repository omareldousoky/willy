import Swal from 'sweetalert2'

import local from '../../../Shared/Assets/ar.json'
import { FormField } from './Form/types'
import {
  ManagerReviewEnum,
  SettledCustomer,
  Settlement,
  SettlementStatusEnum,
} from './types'

export const handleUpdateSuccess = async (callback: () => void, label = '') => {
  await Swal.fire({
    title: `${local.done} ${label}`,
    icon: 'success',
    confirmButtonText: local.end,
  })

  callback()
}

export const isSettlementReviewed = (customerSettlement: Settlement): boolean =>
  customerSettlement?.settlementStatus === SettlementStatusEnum.Reviewed

export const mapFieldsToReadOnly = (formFields: FormField[]): FormField[] =>
  formFields.map((field) =>
    field.type === 'group'
      ? { ...field, fields: mapFieldsToReadOnly(field.fields) }
      : { ...field, readOnly: true }
  )

export const hasCourtSession = (customer: SettledCustomer) =>
  customer.status !== ManagerReviewEnum.FinancialManager &&
  customer[customer.status]

export const renderCourtField = (customer: SettledCustomer, name: string) => {
  if (!hasCourtSession(customer)) {
    return ''
  }

  return customer[customer.status][name]
}
