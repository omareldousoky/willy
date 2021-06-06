import React from 'react'
import './loanPenaltiesList.scss'
import * as local from '../../../../Shared/Assets/ar.json'
import { timeToArabicDate } from '../../../../Shared/Services/utils'
import Orientation from '../../Common/orientation'

const LoanPenaltiesList = (props) => {
  const { data } = props
  const { days } = data
  const totalNumberOfTransactions = Number(data.totalNumberOfTransactions)
  const totalTransactionAmount = Number(data.totalTransactionAmount)
  const startDate = timeToArabicDate(props.data.startDate, false)
  const endDate = timeToArabicDate(props.data.endDate, false)
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
      case 'canceled':
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
          <BranchComponent key={idx} branch={branch} />
        ))}

        <tbody className="tbodyborder">
          <tr style={{ height: '1em' }} />
          <tr>
            <td />
            <td className="gray horizontal-line" colSpan={2}>
              إجمالي تاريخ الحركه
            </td>
            <td className="gray horizontal-line">
              {day.truthDate.substring(0, 10)}
            </td>
            <td />
            <td className="horizontal-line">إجمالي عدد الحركات</td>
            <td className="horizontal-line">{day.numTrx}</td>
            <td />
            <td className="horizontal-line">إجمالي المبلغ</td>
            <td className="horizontal-line">{day.transactionAmount}</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="horizontal-line">القيمة الملغاه</td>
            <td className="horizontal-line">{day.rbAmount}</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="horizontal-line">القيمة المسدده</td>
            <td className="horizontal-line">{day.netAmount}</td>
          </tr>
        </tbody>
      </>
    )
  }

  const BranchComponent = ({ branch }) => {
    return (
      <tbody>
        <tr>
          <th className="gray horizontal-line" colSpan={2}>
            {branch.branchName}
          </th>
        </tr>

        {branch.rows.map((row, idx) => (
          <tr key={idx + row.loanId}>
            <td>{idx + 1}</td>
            {/* <td>{row.transactionCode}</td> */}
            <td colSpan={2}>{row.customerKey}</td>
            <td colSpan={2}>{row.customerName}</td>
            <td colSpan={1}>{row.loanSerial}</td>
            {/* <td>0004519</td> */}
            <td>{row.loanPrincipal}</td>
            <td colSpan={2}>{row.issueDate}</td>
            <td colSpan={1}>{getStatus(row.loanStatus)}</td>
            <td colSpan={1} />
            <td colSpan={2}>{row.transactionAmount}</td>
            <td colSpan={2}>
              {row.canceled === '1' ? local.cancelledTransaction : null}
            </td>
            <td>{row?.loanType || ''}</td>
          </tr>
        ))}

        <tr>
          <th colSpan={16} className="border-line" />
        </tr>

        <tr>
          <td />
          <td className="horizontal-line" colSpan={2}>
            إجمالي
          </td>
          <td className="horizontal-line" colSpan={2}>
            {branch.branchName}
          </td>
          <td className="horizontal-line" colSpan={1}>
            {branch.truthDate.substring(0, 10)}
          </td>
          <td className="horizontal-line">{branch.numTrx}</td>
          <td />
          <td className="horizontal-line">إجمالي المبلغ</td>
          <td className="horizontal-line">{branch.transactionAmount}</td>
        </tr>
        <tr>
          <td colSpan={8} />
          <td className="horizontal-line">القيمة الملغاه</td>
          <td className="horizontal-line">{branch.rbAmount}</td>
        </tr>
        <tr>
          <td colSpan={8} />
          <td className="horizontal-line">القيمة المسدده</td>
          <td className="horizontal-line">{branch.netAmount}</td>
        </tr>
        <tr>
          <th colSpan={16} className="border-line" />
        </tr>
      </tbody>
    )
  }

  return (
    <>
      <Orientation size="portrait" />
      <div className="loan-penalties-list" dir="rtl" lang="ar">
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
              <th colSpan={6} style={{ backgroundColor: 'red' }}>
                <div className="logo-print-tb" />
              </th>
              <th colSpan={6} style={{ backgroundColor: 'blue' }}>
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
              <th colSpan={6}>قائمة حركة غرامات القروض المنفذة</th>
            </tr>
            <tr className="headtitle">
              <th colSpan={4}>المركز الرئيسي</th>
              <th colSpan={6}>
                تاريخ الحركه من {startDate} الي {endDate}
              </th>
            </tr>
            {/* <tr className="headtitle">
            <th colSpan={4}>12:17:26 &emsp; 2020/07/05</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr> */}
            <tr>
              <th colSpan={16} className="border-line" />
            </tr>
            <tr>
              <th>رقم مسلسل</th>
              {/* <th>كود الحركه</th> */}
              <th colSpan={2}>كود العميل</th>
              <th colSpan={2}>أسم العميل</th>
              <th colSpan={1}>مسلسل القرض</th>
              {/* <th>رقم الشيك</th> */}
              <th>قيمة</th>
              <th colSpan={2}>تاريخ القرض</th>
              <th colSpan={1}>حالة القرض</th>
              <th colSpan={1}>مستند الحركة</th>
              <th colSpan={2}>قيمة الغرامة</th>
              <th colSpan={2}>حالة الحركة</th>
              <th>نوع القرض</th>
            </tr>
            <tr>
              <th colSpan={16} className="border-line" />
            </tr>
          </thead>

          {days.map((day, idx) => (
            <DayComponent key={idx} day={day} />
          ))}

          <tbody className="tbodyborder">
            <tr style={{ height: '1em' }} />
            <tr>
              <td />
              <td className="gray horizontal-line" colSpan={2}>
                إجمالي بالعمله
              </td>
              <td className="gray horizontal-line">جنيه مصري</td>
              <td />
              <td className="horizontal-line">إجمالي عدد الحركات</td>
              <td className="horizontal-line">{totalNumberOfTransactions}</td>
              <td />
              <td className="horizontal-line">إجمالي المبلغ</td>
              <td className="horizontal-line">{totalTransactionAmount}</td>
            </tr>

            <tr>
              <td colSpan={8} />
              <td className="horizontal-line">القيمة الملغاه</td>
              <td className="horizontal-line">{data.rbAmount}</td>
            </tr>
            <tr>
              <td colSpan={8} />
              <td className="horizontal-line">القيمة المسدده</td>
              <td className="horizontal-line">{data.netAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default LoanPenaltiesList
