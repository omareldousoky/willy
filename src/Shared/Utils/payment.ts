import dayjs from 'dayjs'
import {
  ApplicationResponse,
  SingleInstallmentRow,
} from '../Models/Application'

import local from '../Assets/ar.json'
import { EarlyPaymentPdfData } from '../Components/pdfTemplates/Financial/earlyPayment/types'
import { RemainingLoanResponse } from '../Models/Payment'
import { getStatus } from '../Services/utils'

export const getFirstDueInstallment = (application: ApplicationResponse) =>
  application?.installmentsObject?.installments?.find(
    (inst) => inst.status !== 'paid' && inst.status !== 'rescheduled'
  )

export const DAY_IN_MS = 1000 * 60 * 60 * 24

export const getInstallmentKeySum = (
  key: string,
  installments?: SingleInstallmentRow[]
) =>
  installments
    ?.map((installment) => installment[key])
    .reduce((acc, current) => acc + current, 0)

export const getEarlyPaymentPdfData = (
  application: ApplicationResponse,
  remainingLoan?: RemainingLoanResponse
): EarlyPaymentPdfData => {
  let totalDaysLate = 0
  let totalDaysEarly = 0
  let latePrincipal = 0
  const installmentsDue: number[] = []

  application?.installmentsObject?.installments.forEach((installment) => {
    const dateOfPayment = dayjs(installment.dateOfPayment)
    const paidAt = dayjs(installment.paidAt)
    if (
      (dateOfPayment.month() === dayjs().month() &&
        dateOfPayment.year() === dayjs().year() &&
        getStatus(installment) === local.unpaid) ||
      getStatus(installment) === local.late ||
      getStatus(installment) === local.partiallyPaid
    ) {
      latePrincipal +=
        Number(installment?.principalInstallment) -
        Number(installment?.principalPaid)

      installmentsDue.push(installment.id)
    }
    if (installment.status !== 'rescheduled') {
      if (installment.paidAt) {
        const number = Math.round(
          (paidAt.endOf('day').valueOf() -
            dateOfPayment.endOf('day').valueOf()) /
            DAY_IN_MS
        )
        if (number > 0) {
          totalDaysLate += number
        } else {
          totalDaysEarly += number
        }
      } else {
        const number = Math.round(
          (dayjs().endOf('day').valueOf() -
            dateOfPayment.endOf('day').valueOf()) /
            DAY_IN_MS
        )
        if (number > 0) totalDaysLate += number
      }
    }
  })

  const getApplicationFee = (): number => {
    if (application?.product?.applicationFeePercent !== 0) {
      return Number(application?.product?.applicationFeePercent)
    }
    if (application?.product.applicationFeePercentPerPerson !== 0) {
      return Number(application?.product.applicationFeePercentPerPerson)
    }
    if (application?.product.individualApplicationFee !== 0) {
      return Number(application?.product.individualApplicationFee)
    }
    if (application?.product.applicationFee !== 0) {
      return Number(application?.product.applicationFee)
    }
    return 0
  }

  // aksat yageb sdadha
  const remainingInstallments: number = Math.ceil(
    application?.installmentsObject?.installments
      .map((installment) =>
        installmentsDue.includes(installment.id)
          ? Number(installment?.installmentResponse)
          : 0
      )
      .reduce((acc, current) => acc + current, 0) || 0
  )

  // raseed l asl
  const earlyPaymentPrincipal: number = Math.ceil(
    Number(remainingLoan?.remainingPrincipal) - latePrincipal
  )

  // takleft tmweel l tar7eel
  const earlyPaymentInterest: number = Math.ceil(
    (Number(application?.product?.earlyPaymentFees) / 100) *
      earlyPaymentPrincipal
  )

  // egmali l sdad l mo3agal
  const earlyPaymentTotal: number = Math.ceil(
    earlyPaymentPrincipal + earlyPaymentInterest + remainingInstallments
  )

  return {
    totalDaysLate,
    totalDaysEarly,
    installmentsDue,
    applicationFees: getApplicationFee(),
    remainingInstallments,
    remainingTotal: remainingLoan?.remainingTotal || 0,
    remainingPrincipal: remainingLoan?.remainingPrincipal,
    remainingInterest: remainingLoan?.remainingInterest,
    earlyPaymentInterest,
    earlyPaymentPrincipal,
    earlyPaymentTotal,
  }
}
