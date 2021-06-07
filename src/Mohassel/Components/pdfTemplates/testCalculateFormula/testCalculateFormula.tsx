import React from 'react'
import './testCalculateFormula.scss'
import {
  timeToArabicDate,
  numbersToArabic,
  dayToArabic,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import store from '../../../../Shared/redux/store'

const TestCalculateFormulaPDF = (props) => {
  return (
    <div className="test-calculate-formula" dir="rtl" lang="ar">
      <table className="margin">
        <thead style={{ fontSize: '12px' }}>
          <tr style={{ height: '10px' }} />
          <tr
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <th colSpan={6}>
              <div className="logo-print-tb" />
            </th>
            <th colSpan={6}>
              ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
            </th>
          </tr>
          <tr style={{ height: '10px' }} />
        </thead>
        <tbody>
          <tr>
            <td>{props.branchName}</td>
            <td />
            <td>{store.getState().auth.name}</td>
          </tr>
          <tr>
            <td>{timeToArabicDateNow(true)}</td>
            <td />
            <td>{dayToArabic(new Date().getDay())}</td>
          </tr>
          <tr>
            <td />
            <td className="title2 bold">
              <u>{props.data.formulaName} - إختبار طريقة حساب الاقساط</u>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
      <table className="table-content" style={{ width: '50%' }}>
        <tbody>
          <tr>
            <th>الرقم المسلسل</th>
            <th>قيمة القسط</th>
            <th>الأصل</th>
            <th>تكلفه التمويل</th>
            <th>تاريخ الآستحقاق</th>
          </tr>
          {props.data.result?.output.map((installment) => {
            return (
              <tr key={installment.id}>
                <td>{numbersToArabic(installment.id)}</td>
                <td>
                  {installment.installmentResponse
                    ? numbersToArabic(installment.installmentResponse)
                    : numbersToArabic(0)}
                </td>
                <td>
                  {installment.principalInstallment
                    ? numbersToArabic(installment.principalInstallment)
                    : numbersToArabic(0)}
                </td>
                <td>
                  {installment.feesInstallment
                    ? numbersToArabic(installment.feesInstallment)
                    : numbersToArabic(0)}
                </td>
                <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
              </tr>
            )
          })}
          <tr>
            <td>الإجمالي</td>
            <td>{numbersToArabic(props.data.result?.sum.installmentSum)}</td>
            <td>{numbersToArabic(props.data.result?.sum.principal)}</td>
            <td>
              {numbersToArabic(
                props.data.result?.sum.feesSum
                  ? props.data.result?.sum.feesSum
                  : 0
              )}
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TestCalculateFormulaPDF
