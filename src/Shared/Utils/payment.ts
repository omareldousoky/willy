import { ApplicationResponse } from '../Models/Application'

export const getFirstDueInstallment = (application: ApplicationResponse) =>
  application?.installmentsObject?.installments?.find(
    (inst) => inst.status !== 'paid' && inst.status !== 'rescheduled'
  )
