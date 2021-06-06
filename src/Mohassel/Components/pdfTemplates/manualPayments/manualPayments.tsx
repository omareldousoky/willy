import React from 'react'
import './manualPayments.scss'
import {
  timeToArabicDate,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import Orientation from '../../Common/orientation'

interface Props {
  result: {
    days: {
      branches: {
        rows: [
          {
            branchName: string
            truthDate: string
            customerKey: string
            customerName: string
            loanSerial: string
            dateOfPayment: string
            installmentStatus: string
            loanApplicationKey: string
            installmentValue: string
            issueDate: string
            loanStatus: string
            transactionPrincipal: string
            transactionInterest: string
            transactionAmount: string
            loanType?: string
          }
        ]
        branchName: string
        truthDate: string
        numTrx: string
        transactionPrincipal: string
        transactionInterest: string
        transactionAmount: string
      }[]
      truthDate: string
      numTrx: number
      transactionPrincipal: string
      transactionInterest: string
      transactionAmount: string
    }[]
    numTrx: number
    transactionAmount: string
    transactionPrincipal: string
    transactionInterest: string
  }
  fromDate: any
  toDate: any
}
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

const ManualPayments = (props: Props) => {
  return (
    <>
      <Orientation size="portrait" />
      <div className="manual-payments" dir="rtl" lang="ar">
        <table
          style={{
            fontSize: '12px',
            margin: '10px 0px',
            textAlign: 'center',
            width: '100%',
          }}
        >
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
              <th colSpan={6}>
                <div className="logo-print-tb" />
              </th>
              <th colSpan={6}>
                ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
              </th>
            </tr>
            <tr style={{ height: '10px' }} />
          </tbody>
        </table>
        <table className="report-container">
          <thead className="report-header">
            <tr className="headtitle">
              <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
              <th colSpan={6}>مراجعه حركات السداد اليدوي</th>
            </tr>
          </thead>
          <thead>
            <tr className="headtitle">
              <th colSpan={6}>
                تاريخ الحركه من {timeToArabicDate(props.fromDate, false)} الي
                {timeToArabicDate(props.toDate, false)}
              </th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>{timeToArabicDateNow(true)}</th>
              <th colSpan={6}>جنيه مصري</th>
            </tr>
          </thead>
          {props.result.days.map((day) => {
            return (
              <>
                <tr>
                  <th colSpan={13} className="border" />
                </tr>
                <thead>
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
                </thead>
                {day.branches.map((branch) => {
                  return (
                    <>
                      {branch.rows.map((row) => {
                        return (
                          <>
                            <tr style={{ height: '1em' }} />
                            <tbody>
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
                            </tbody>
                          </>
                        )
                      })}
                      <tbody>
                        <tr>
                          <td className="frame" colSpan={2}>
                            إسم الفرع
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
                      </tbody>
                    </>
                  )
                })}

                <tr style={{ height: '1em' }} />

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

                <tr style={{ height: '1em' }} />
              </>
            )
          })}
          <tr style={{ height: '1em' }} />
          <tbody className="tbodyborder">
            <tr>
              <td className="gray frame" colSpan={2}>
                إجمالي بالعمله
              </td>
              <td className="gray frame">جنيه مصري</td>
              <td />
              <td className="frame">إجمالي عدد الحركات</td>
              <td className="frame">{props.result.numTrx}</td>
              <td />
              <td />
              <td />
              <td className="frame">{props.result.transactionPrincipal}</td>
              <td className="frame">{props.result.transactionInterest}</td>
              <td className="frame">{props.result.transactionAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ManualPayments
