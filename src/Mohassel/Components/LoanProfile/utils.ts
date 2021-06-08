import { getStatus } from '../../../Shared/Services/utils'
import {
  ApplicationResponse,
  SingleInstallmentRow,
} from '../../Models/Application'
import local from '../../../Shared/Assets/ar.json'

export const DAY_IN_MS = 1000 * 60 * 60 * 24

export const getInstallmentKeySum = (
  key: string,
  installments?: SingleInstallmentRow[]
) => {
  let max = 0
  installments?.forEach((installment) => {
    max += installment[key]
  })
  return max
}

export const getEarlyPaymentPdfData = (
  application: ApplicationResponse,
  remainingPrincipal?: number
): EarlyPaymentPdfData => {
  let totalDaysLate = 0
  let totalDaysEarly = 0
  let latePrincipal = 0
  const installmentsDue: number[] = []

  application?.installmentsObject?.installments.forEach((installment) => {
    if (
      (new Date(installment.dateOfPayment).getMonth() ===
        new Date().getMonth() &&
        new Date(installment.dateOfPayment).getFullYear() ===
          new Date().getFullYear() &&
        getStatus(installment) === local.unpaid) ||
      getStatus(installment) === local.late ||
      (new Date(installment.dateOfPayment).getMonth() <=
        new Date().getMonth() &&
        new Date(installment.dateOfPayment).getFullYear() <=
          new Date().getFullYear() &&
        getStatus(installment) === local.partiallyPaid)
    ) {
      latePrincipal +=
        Number(installment?.principalInstallment) -
        Number(installment?.principalPaid)

      installmentsDue.push(installment.id)
    }
    if (installment.status !== 'rescheduled') {
      if (installment.paidAt) {
        const number = Math.round(
          (new Date(installment.paidAt).setHours(23, 59, 59, 59) -
            new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) /
            DAY_IN_MS
        )
        if (number > 0) {
          totalDaysLate += number
        } else totalDaysEarly += number
      } else {
        const number = Math.round(
          (new Date().setHours(23, 59, 59, 59).valueOf() -
            new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) /
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

  const calculateRemainingInstallments = (): number => {
    let total = 0
    application?.installmentsObject?.installments.forEach((installment) => {
      if (installmentsDue.includes(installment.id)) {
        total += Number(installment?.installmentResponse)
      }
    })
    return total
  }

  // egamli l raseed
  const totalLoanAmount: number =
    Number(application?.installmentsObject?.totalInstallments?.feesSum) -
    getInstallmentKeySum(
      'feesPaid',
      application?.installmentsObject?.installments
    ) +
    Number(remainingPrincipal)

  // egmali l sdad l mo3agal
  const totalEarlyPaymentAmount: number =
    Number(remainingPrincipal) +
    calculateRemainingInstallments() +
    (Number(application?.product?.earlyPaymentFees) *
      Number(remainingPrincipal)) /
      100

  // raseed l asl
  const earlyPaymentBaseAmount: number =
    Number(remainingPrincipal) - latePrincipal

  return {
    totalDaysLate,
    totalDaysEarly,
    installmentsDue,
    totalEarlyPaymentAmount,
    totalLoanAmount,
    remainingPrincipal,
    applicationFees: getApplicationFee(),
    remainingInstallments: calculateRemainingInstallments(),
    earlyPaymentBaseAmount,
  }
}
