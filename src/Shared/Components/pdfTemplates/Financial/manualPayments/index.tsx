import React from 'react'
import './manualPayments.scss'
import { timeToArabicDateNow } from '../../../../Services/utils'
import Orientation from '../../../Common/orientation'
import { ManualPaymentsProps } from './types'
import { Header } from '../../pdfTemplateCommon/header'

const statusLocalization = (status: string) => {
  switch (status) {
    case 'paid':
      return 'مدفوع'
    case 'partiallyPaid':
      return 'مدفوع جزئيا'
    case 'unpaid':
      return 'غير مسدد'
    case 'pending':
      return 'قيد التحقيق'
    case 'issued':
      return 'مصدر'
    default:
      return status
  }
}

export const ManualPayments = ({
  fromDate,
  toDate,
  result,
  isCF,
  financialLeasing,
}: ManualPaymentsProps) => (
  <>
    <Orientation size="portrait" />
    <div className="manual-payments" lang="ar">
      <Header
        cf={isCF}
        fl={financialLeasing}
        title="مراجعه حركات السداد اليدوي"
        fromDate={fromDate}
        toDate={toDate}
      />
      <table className="report-container">
        <tbody>
          <tr className="headtitle">
            <th colSpan={4}>{timeToArabicDateNow(true)}</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr>
        </tbody>
        {result.days.map((day, index) => {
          return (
            <React.Fragment key={index}>
              <tbody>
                <tr>
                  <th colSpan={13} className="border" />
                </tr>
                <tr>
                  <th>رقم مسلسل</th>
                  <th>مسلسل القسط</th>
                  <th colSpan={2}>أسم العميل</th>
                  <th>قيمة القسط</th>
                  <th colSpan={2}>تاريخ استحقاق القسط</th>
                  <th colSpan={2}>حالة القسط</th>
                  <th>أصل</th>
                  <th>القيمه المسدده تكلفه تمويل </th>
                  <th>إجمالي</th>
                  <th>نوع القرض</th>
                </tr>
                <tr>
                  <th colSpan={13} className="border" />
                </tr>
              </tbody>
              {day.branches.map((branch, branchIndex) => {
                return (
                  <React.Fragment key={branchIndex}>
                    {branch.rows.map((row, rowIndex) => {
                      return (
                        <React.Fragment key={rowIndex}>
                          <tr style={{ height: '1em' }} />
                          <tr>
                            <th className="gray frame" colSpan={2}>
                              تاريخ الحركه
                            </th>
                            <th className="gray frame" colSpan={2}>
                              {row.truthDate}
                            </th>
                          </tr>
                          <tr>
                            <td>{row.loanSerial}</td>
                            <td>{row.loanApplicationKey}</td>
                            <td colSpan={2}>{row.customerName}</td>
                            <td>{row.installmentValue}</td>
                            <td colSpan={2}>{row.dateOfPayment}</td>
                            <td colSpan={2}>
                              {statusLocalization(row.installmentStatus)}
                            </td>
                            <td>{row.transactionPrincipal}</td>
                            <td>{row.transactionInterest}</td>
                            <td>{row.transactionAmount}</td>
                            <td>{row?.loanType || ''}</td>
                          </tr>
                          <tr>
                            <th colSpan={13} className="border" />
                          </tr>
                        </React.Fragment>
                      )
                    })}
                    <tr>
                      <td className="frame" colSpan={2}>
                        اسم الفرع
                      </td>
                      <td className="frame" colSpan={2}>
                        {branch.branchName}
                      </td>
                      <td className="frame" colSpan={1}>
                        {branch.truthDate}
                      </td>
                      <td className="frame">{branch.numTrx}</td>
                      <td />
                      <td />
                      <td />
                      <td>{branch.transactionPrincipal}</td>
                      <td>{branch.transactionInterest}</td>
                      <td>{branch.transactionAmount}</td>
                    </tr>
                    <tr>
                      <th colSpan={13} className="border" />
                    </tr>
                  </React.Fragment>
                )
              })}
              <tbody>
                <tr style={{ height: '1em' }} />
              </tbody>
              <tbody className="tbodyborder">
                <tr>
                  <td className="gray frame" colSpan={2}>
                    إجمالي تاريخ الحركه
                  </td>
                  <td className="gray frame">{day.truthDate}</td>
                  <td />
                  <td className="frame">إجمالي عدد الحركات</td>
                  <td className="frame">{day.numTrx}</td>
                  <td />
                  <td />
                  <td />
                  <td className="frame">{day.transactionPrincipal}</td>
                  <td className="frame">{day.transactionInterest}</td>
                  <td className="frame">{day.transactionAmount}</td>
                </tr>
              </tbody>
              <tbody>
                <tr style={{ height: '1em' }} />
              </tbody>
            </React.Fragment>
          )
        })}
        <tbody>
          <tr style={{ height: '1em' }} />
        </tbody>
        <tbody className="tbodyborder">
          <tr>
            <td className="gray frame" colSpan={2}>
              إجمالي بالعمله
            </td>
            <td className="gray frame">جنيه مصري</td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">{result.numTrx}</td>
            <td />
            <td />
            <td />
            <td className="frame">{result.transactionPrincipal}</td>
            <td className="frame">{result.transactionInterest}</td>
            <td className="frame">{result.transactionAmount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
)
