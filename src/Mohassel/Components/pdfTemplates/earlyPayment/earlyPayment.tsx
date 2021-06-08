import React, { FunctionComponent } from 'react'
import './earlyPayment.scss'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  timeToArabicDate,
  numbersToArabic,
  getStatus,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import { ApplicationResponse } from '../../../Models/Application'
import { DAY_IN_MS, getInstallmentKeySum } from '../../LoanProfile/utils'

interface EarlyPaymentPDFProps {
  data: ApplicationResponse
  earlyPaymentPdfData: EarlyPaymentPdfData
  branchDetails: any
}

const EarlyPaymentPDF: FunctionComponent<EarlyPaymentPDFProps> = ({
  data,
  earlyPaymentPdfData,
  branchDetails,
}) => {
  const {
    totalDaysEarly,
    totalDaysLate,
    totalEarlyPaymentAmount,
    totalLoanAmount,
    applicationFees,
    installmentsDue,
    remainingInstallments,
    earlyPaymentBaseAmount,
    remainingPrincipal,
  } = earlyPaymentPdfData

  return (
    <div className="early-payment-print" lang="ar">
      <table className="text-center my-3 mx-0 w-100">
        <tbody>
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th colSpan={6} style={{ backgroundColor: 'white' }}>
              <div className="logo-print-tb" />
            </th>
            <th style={{ backgroundColor: 'white' }} colSpan={6}>
              ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th style={{ width: '35%' }} className="title bold border">
              شركة تساهيل للتمويل متناهي الصغر
            </th>
            <td />
            <td className="title bold">
              {branchDetails.name} - {branchDetails.governorate}
            </td>
          </tr>
          <tr>
            <td>{timeToArabicDateNow(true)}</td>
            <td className="title2 bold">
              <u>السداد المعجل</u>
            </td>
            <td>1/1</td>
          </tr>
        </tbody>
      </table>
      <table className="border">
        <tbody>
          <tr>
            <td>
              العميل
              <div className="frame">
                {data?.product?.beneficiaryType === 'individual'
                  ? numbersToArabic(data?.customer?.key)
                  : numbersToArabic(
                      data?.group?.individualsInGroup.find(
                        (member) => member.type === 'leader'
                      )?.customer.key
                    )}
              </div>
              <div className="frame">
                {data?.product?.beneficiaryType === 'individual'
                  ? data?.customer?.customerName
                  : data?.group?.individualsInGroup.find(
                      (member) => member.type === 'leader'
                    )?.customer.customerName}
              </div>
            </td>
            <td>
              التاريخ
              <div className="frame">{timeToArabicDateNow(false)}</div>
            </td>
            <td>
              المندوب
              <div className="frame">
                {data?.product?.beneficiaryType === 'group'
                  ? data?.group?.individualsInGroup.find(
                      (member) => member.type === 'leader'
                    )?.customer.representativeName
                  : data?.customer?.representativeName}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td>
              تاريخ الحساب
              <div className="frame">{timeToArabicDateNow(false)}</div>
            </td>
            <td>
              فترة السداد
              <div className="frame">
                {data?.product?.periodType === 'days'
                  ? local.daily
                  : local.inAdvanceFromMonthly}
              </div>
            </td>
            <td>
              عدد الاقساط
              <div className="frame">
                {numbersToArabic(data?.installmentsObject?.installments.length)}
              </div>
            </td>
            <td>
              فترة السماح
              <div className="frame">
                {numbersToArabic(data?.product?.gracePeriod)}
              </div>
              <div className="frame">
                {data?.product?.beneficiaryType === 'individual'
                  ? data?.customer?.businessActivity
                  : 'تمويل رأس المال'}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td>
              عدد ايام التأخير :
              <span className="frame">{numbersToArabic(totalDaysLate)}</span>
            </td>
            <td>
              غرامات المسدده :
              <span className="frame">
                {numbersToArabic(data.penaltiesPaid)}
              </span>
            </td>
            <td>
              غرامات معفاة :
              <div className="frame">
                {numbersToArabic(data.penaltiesCanceled)}
              </div>
            </td>
            <td>
              رسوم تحصيل
              <div className="frame">{numbersToArabic(applicationFees)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="tablestyle">
        <tbody>
          <tr>
            <th className="border">القسط</th>
            <th className="border">تاريخ الآستحقاق</th>
            <th className="border"> اصل القسط</th>
            <th className="border">تكلفه التمويل</th>
            <th className="border">اجمالي القيمة</th>
            <th className="border">قيمه مسدده</th>
            <th className="border">تكلفه التمويل مسدده</th>
            <th className="border">الحاله</th>
            <th className="border">تاريخ الحاله</th>
            <th className="border">ايام التأخير</th>
            <th className="border">الملاحظات</th>
          </tr>
          {data?.installmentsObject?.installments.map((installment, index) => {
            const installmentDateOfPayment = new Date(
              installment?.dateOfPayment
            ).setHours(23, 59, 59, 59)

            const installmentPaidAt = new Date(installment.paidAt).setHours(
              23,
              59,
              59,
              59
            )
            return (
              <tr key={index}>
                <td>
                  {numbersToArabic(data.applicationKey) +
                    '/' +
                    numbersToArabic(installment.id)}
                </td>
                <td
                  className={
                    installmentsDue.includes(installment.id) ? 'due' : ''
                  }
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
                          installmentPaidAt - installmentDateOfPayment
                        ) / DAY_IN_MS
                      )
                    : new Date().setHours(23, 59, 59, 59).valueOf() >
                        installmentDateOfPayment &&
                      installment.status !== 'rescheduled'
                    ? numbersToArabic(
                        Math.round(
                          (new Date().setHours(23, 59, 59, 59).valueOf() -
                            installmentDateOfPayment) /
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
              {numbersToArabic(
                data?.installmentsObject?.totalInstallments.principal
              )}
            </td>
            <td className="border">
              {numbersToArabic(
                data?.installmentsObject?.totalInstallments.feesSum
              )}
            </td>
            <td className="border">
              {numbersToArabic(
                data?.installmentsObject?.totalInstallments.installmentSum
              )}
            </td>
            <td className="border">
              {numbersToArabic(
                getInstallmentKeySum(
                  'principalPaid',
                  data?.installmentsObject?.installments
                )
              )}
            </td>
            <td className="border">
              {numbersToArabic(
                getInstallmentKeySum(
                  'feesPaid',
                  data?.installmentsObject?.installments
                )
              )}
            </td>
            <th className="border">ايام التأخير</th>
            <td className="border">
              {totalDaysLate > 0
                ? numbersToArabic(totalDaysLate)
                : numbersToArabic(0)}
            </td>
            <th className="border">ايام التبكير</th>
            <td className="border">
              {numbersToArabic(
                totalDaysEarly < 0 ? totalDaysEarly * -1 : totalDaysEarly
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ border: '1px solid black' }} />

      <table className="tablestyle">
        <tbody>
          <tr>
            <td />
            <th className="border">الاجمالي</th>
            <th className="border">تكلفه التمويل</th>
            <th className="border">الأصل</th>
            <td />
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <th>الرصيد</th>
            <td className="border">{numbersToArabic(totalLoanAmount)}</td>
            <td className="border">
              {numbersToArabic(
                Number(data?.installmentsObject?.totalInstallments?.feesSum) -
                  getInstallmentKeySum(
                    'feesPaid',
                    data?.installmentsObject?.installments
                  )
              )}
            </td>
            <td className="border">{numbersToArabic(remainingPrincipal)}</td>
            <td />
            <td />
            <th className="border">الخصم</th>
            <td className="border">
              {numbersToArabic(totalLoanAmount - totalEarlyPaymentAmount)}
            </td>
          </tr>
          <tr>
            <td />
            <th className="border">اقساط يجب سدادها</th>
            <th className="border">الرصيد الأصل</th>
            <th className="border">
              {numbersToArabic(data?.product?.earlyPaymentFees)}% (تكلفه تمويل
              الترحيل)
            </th>
            <th className="border">إجمالي السداد المعجل</th>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <th>السداد المعجل</th>
            <td className="border">{numbersToArabic(remainingInstallments)}</td>
            <td className="border">
              {numbersToArabic(earlyPaymentBaseAmount)}
            </td>
            <td className="border">
              {numbersToArabic(
                (Number(data?.product?.earlyPaymentFees) *
                  earlyPaymentBaseAmount) /
                  100
              )}
            </td>
            <td className="border">
              {numbersToArabic(totalEarlyPaymentAmount)}
            </td>
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EarlyPaymentPDF
