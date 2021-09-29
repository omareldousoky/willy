import React, { FunctionComponent } from 'react'
import './earlyPayment.scss'
import dayjs from 'dayjs'
import {
  timeToArabicDate,
  numbersToArabic,
  getStatus,
} from '../../../../Services/utils'
import { EarlyPaymentInstallmentProps } from './types'
import { DAY_IN_MS, getInstallmentKeySum } from '../../../../Utils/payment'

export const EarlyPaymentInstallment: FunctionComponent<EarlyPaymentInstallmentProps> = ({
  applicationKey,
  installmentsObject,
  installmentsDue,
  totalDaysLate,
  totalDaysEarly,
}) => (
  <table className="tablestyle">
    <tbody>
      <tr>
        <th className="border">القسط</th>
        <th className="border">تاريخ الاستحقاق</th>
        <th className="border">أصل القسط</th>
        <th className="border">تكلفة التمويل</th>
        <th className="border">إجمالي القيمة</th>
        <th className="border">قيمة مسددة</th>
        <th className="border">تكلفة التمويل مسددة</th>
        <th className="border">الحالة</th>
        <th className="border">تاريخ الحالة</th>
        <th className="border">أيام التأخير</th>
        <th className="border">الملاحظات</th>
      </tr>
      {installmentsObject?.installments.map((installment, index) => {
        const installmentDateOfPayment = dayjs(installment.dateOfPayment).endOf(
          'day'
        )
        const installmentPaidAt = dayjs(installment.paidAt).endOf('day')

        return (
          <tr key={index}>
            <td>
              {numbersToArabic(applicationKey) +
                '/' +
                numbersToArabic(installment.id)}
            </td>
            <td
              className={installmentsDue.includes(installment.id) ? 'due' : ''}
            >
              {timeToArabicDate(installment.dateOfPayment, false)}
            </td>
            <td>{numbersToArabic(installment.principalInstallment)}</td>
            <td>{numbersToArabic(installment.feesInstallment)}</td>
            <td>{numbersToArabic(installment.installmentResponse)}</td>
            <td>{numbersToArabic(installment.principalPaid)}</td>
            <td>{numbersToArabic(installment.feesPaid)}</td>
            <td>{getStatus(installment)}</td>
            <td>
              {installment.paidAt
                ? timeToArabicDate(installment.paidAt, false)
                : ''}
            </td>
            <td>
              {installment.paidAt
                ? numbersToArabic(
                    Math.round(
                      installmentPaidAt.valueOf() -
                        installmentDateOfPayment.valueOf()
                    ) / DAY_IN_MS
                  )
                : dayjs().endOf('day').valueOf() >
                    installmentDateOfPayment.valueOf() &&
                  installment.status !== 'rescheduled'
                ? numbersToArabic(
                    Math.round(
                      (dayjs().endOf('day').valueOf() -
                        installmentDateOfPayment.valueOf()) /
                        DAY_IN_MS
                    )
                  )
                : ''}
            </td>
            <td />
          </tr>
        )
      })}
      <tr>
        <td />
        <th>الإجمالي</th>
        <td className="border">
          {numbersToArabic(installmentsObject?.totalInstallments.principal)}
        </td>
        <td className="border">
          {numbersToArabic(installmentsObject?.totalInstallments.feesSum)}
        </td>
        <td className="border">
          {numbersToArabic(
            installmentsObject?.totalInstallments.installmentSum
          )}
        </td>
        <td className="border">
          {numbersToArabic(
            getInstallmentKeySum(
              'principalPaid',
              installmentsObject?.installments
            )
          )}
        </td>
        <td className="border">
          {numbersToArabic(
            getInstallmentKeySum('feesPaid', installmentsObject?.installments)
          )}
        </td>
        <th className="border">أيام التأخير</th>
        <td className="border">
          {totalDaysLate > 0
            ? numbersToArabic(totalDaysLate)
            : numbersToArabic(0)}
        </td>
        <th className="border">أيام التبكير</th>
        <td className="border">
          {numbersToArabic(
            totalDaysEarly < 0 ? totalDaysEarly * -1 : totalDaysEarly
          )}
        </td>
      </tr>
    </tbody>
  </table>
)
