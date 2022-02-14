import React from 'react'
import './crossedOutLoansList.scss'
import * as local from '../../../../Assets/ar.json'
import { timeToArabicDate } from '../../../../Services/utils'
import Orientation from '../../../Common/orientation'
import { Header } from '../../pdfTemplateCommon/header'

export const CrossedOutLoansList = ({
  isCF = false,
  data: {
    financialLeasing,
    days,
    numTrx,
    transactionAmount,
    transactionInterest,
    transactionPrincipal,
    startDate,
    endDate,
    rbPrincipal,
    rbInt,
    rbAmount,
    netPrincipal,
    netInt,
    netAmount,
  },
}) => {
  const totalNumberOfTransactions = Number(numTrx)
  const totalTransactionAmount = Number(transactionAmount)
  const totalTransactionInterest = Number(transactionInterest)
  const totalTransactionPrincipal = Number(transactionPrincipal)
  const startD = timeToArabicDate(startDate, false)
  const endD = timeToArabicDate(endDate, false)

  const getStatus = (value) => {
    switch (value) {
      case 'unpaid':
        return local.unpaid
      case 'pending':
        return local.pending
      case 'paid':
        return local.paid
      case 'partiallyPaid':
        return local.partiallyPaid
      case 'rescheduled':
        return local.rescheduled
      case 'cancelled':
        return local.cancelled
      case 'issued':
        return local.issued
      case 'created':
        return local.created
      case 'approved':
        return local.approved
      default:
        return ''
    }
  }

  const DayComponent = ({ day }) => {
    return (
      <>
        {day.branches.map((branch, idx) => (
          <BranchComponent
            key={idx + branch.branchName.trim() + branch.netAmount}
            branch={branch}
          />
        ))}

        <tbody className="tbodyborder">
          <tr style={{ height: '1em' }} />
          <tr>
            <td />
            <td className="gray frame" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray frame text-nowrap">
              {day.truthDate.substring(0, 10)}
            </td>
            <td />
            <td className="frame">إجمالي عدد الحركات</td>
            <td className="frame">{day.numTrx}</td>
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">{day.transactionPrincipal}</td>
            <td className="frame">{day.transactionInterest}</td>
            <td className="frame">{day.transactionAmount}</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">{day.rbPrincipal}</td>
            <td className="frame">{day.rbInt}</td>
            <td className="frame">{day.rbAmount}</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">{day.netPrincipal}</td>
            <td className="frame">{day.netInt}</td>
            <td className="frame">{day.netAmount}</td>
          </tr>
          <tr style={{ height: '1em' }} />
        </tbody>
      </>
    )
  }

  const BranchComponent = ({ branch }) => {
    return (
      <tbody>
        <tr>
          <th className="gray frame" colSpan={2}>
            {branch.branchName}
          </th>
        </tr>

        {branch.rows.map((row, idx) => (
          <tr key={idx + row.loanId}>
            <td>{idx + 1}</td>
            <td>{row.customerKey}</td>
            <td>{row.customerName}</td>
            <td>{row.loanSerial}</td>
            <td colSpan={1}>{row.loanPrincipal}</td>
            <td colSpan={3} className="text-nowrap">
              {row.issueDate}
            </td>
            <td>{getStatus(row.loanStatus)}</td>
            <td>{row.transactionPrincipal}</td>
            <td>{row.transactionInterest}</td>
            <td colSpan={1}>{row.transactionAmount}</td>
            <td colSpan={2}>
              {row.canceled === '1' ? local.cancelledTransaction : null}
            </td>
            <td>{row?.loanType || ''}</td>
          </tr>
        ))}

        <tr>
          <th colSpan={100} className="horizontal-line" />
        </tr>

        <tr>
          <td />
          <td className="frame" colSpan={2}>
            إجمالي
          </td>
          <td className="frame" colSpan={2}>
            {branch.branchName}
          </td>
          <td className="frame text-nowrap" colSpan={1}>
            {branch.truthDate.substring(0, 10)}
          </td>
          <td className="frame">{branch.numTrx}</td>
          <td />
          <td className="frame">إجمالي المبلغ</td>
          <td className="frame">{branch.transactionPrincipal}</td>
          <td className="frame">{branch.transactionInterest}</td>
          <td className="frame">{branch.transactionAmount}</td>
        </tr>

        <tr>
          <td colSpan={8} />
          <td className="frame">القيمة الملغاه</td>
          <td className="frame">{branch.rbPrincipal}</td>
          <td className="frame">{branch.rbInt}</td>
          <td className="frame">{branch.rbAmount}</td>
        </tr>
        <tr>
          <td colSpan={8} />
          <td className="frame">صافي المبلغ</td>
          <td className="frame">{branch.netPrincipal}</td>
          <td className="frame">{branch.netInt}</td>
          <td className="frame">{branch.netAmount}</td>
        </tr>
        <tr>
          <th colSpan={100} className="horizontal-line" />
        </tr>
      </tbody>
    )
  }

  return (
    <>
      <Orientation size="portrait" />
      <div className="crossed-out-loans-list" lang="ar">
        <Header
          cf={isCF}
          fl={financialLeasing}
          title="قائمة حركات إعدام ديون القروض المنفذة"
        />
        <table className="report-container">
          <thead className="report-header">
            <tr className="headtitle">
              <th colSpan={4}>المركز الرئيسي</th>
              <th colSpan={6}>
                تاريخ الحركه من {startD} الي {endD}
              </th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>{new Date().toDateString()}</th>
              <th colSpan={6}>جنيه مصري</th>
            </tr>
            <tr>
              <th colSpan={100} className="horizontal-line" />
            </tr>
            <tr>
              <th>كود الحركة</th>
              <th>كود العميل</th>
              <th>أسم العميل</th>
              <th>مسلسل القرض</th>
              <th colSpan={1}>قيمة</th>
              <th colSpan={3}>تاريخ القرض</th>
              <th>الحالةالان</th>
              <th>أصل</th>
              <th>قيمة تكلفه التمويل</th>
              <th colSpan={1}>إجمالي</th>
              <th colSpan={2}>حالةالحركة</th>
              <th>نوع القرض</th>
            </tr>
            <tr>
              <th colSpan={100} className="horizontal-line" />
            </tr>
            {/* <tr>
            <th className="gray frame" colSpan={2}>
              تاريخ الحركه
            </th>
            <th className="gray frame" colSpan={2}>
              2020/06/09
            </th>
          </tr> */}
          </thead>

          {days.map((day, idx) => (
            <DayComponent key={idx} day={day} />
          ))}

          <tbody className="tbodyborder">
            <tr style={{ height: '1em' }} />

            <tr>
              <td />
              <td className="gray frame" colSpan={2}>
                إجمالي بالعمله
              </td>
              <td className="gray frame">جنيه مصري</td>
              <td />
              <td className="frame">إجمالي عدد الحركات</td>
              <td className="frame">{totalNumberOfTransactions}</td>
              <td />
              <td className="frame">إجمالي المبلغ</td>
              <td className="frame">{totalTransactionPrincipal}</td>
              <td className="frame">{totalTransactionInterest}</td>
              <td className="frame">{totalTransactionAmount}</td>
            </tr>

            <tr>
              <td colSpan={8} />
              <td className="frame">القيمة الملغاه</td>
              <td className="frame">{rbPrincipal}</td>
              <td className="frame">{rbInt}</td>
              <td className="frame">{rbAmount}</td>
            </tr>
            <tr>
              <td colSpan={8} />
              <td className="frame">صافي المبلغ</td>
              <td className="frame">{netPrincipal}</td>
              <td className="frame">{netInt}</td>
              <td className="frame">{netAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
