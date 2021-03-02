import React from 'react'
import './doubtfulPayments.scss'
import {
  timeToArabicDate,
  getTimestamp,
  getLoanStatus,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'
import * as local from '../../../../Shared/Assets/ar.json'

const DoubtfulPayments = (props) => {
  const tempData = props.data.data
  const reportDate =
    props.data.req.startDate === props.data.req.endDate
      ? timeToArabicDate(props.data.req.startDate, false)
      : `من ${timeToArabicDate(
          props.data.req.startDate,
          false
        )} الي ${timeToArabicDate(props.data.req.endDate, false)}`
  return (
    <div className="doubtful-payments" lang="ar">
      <table
        style={{
          fontSize: '12px',
          margin: '10px 0px',
          textAlign: 'center',
          width: '100%',
        }}
      >
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
            <div className="logo-print" />
          </th>
          <th colSpan={6}>
            ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
          </th>
        </tr>
        <tr style={{ height: '10px' }} />
      </table>
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={6}>قائمة حركة القروض المشكوك في سدادها</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>المركز الرئيسي</th>
            <th colSpan={6}>{`تاريخ الحركه ${reportDate}`}</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>{timeToArabicDateNow(true)}</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
          <tr>
            <th>رقم مسلسل</th>
            <th>كود العميل</th>
            <th colSpan={1}>أسم العميل</th>
            <th>مسلسل القرض</th>
            <th colSpan={1}>قيمة</th>
            <th colSpan={3}>تاريخ القرض</th>
            <th colSpan={1}>الحالة الان</th>
            <th>أصل</th>
            <th colSpan={1}>قيمة تكلفه التمويل</th>
            <th>إجمالي</th>
            <th colSpan={2}>حالة الحركة</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
        </thead>

        {tempData.days.map((day, x) => (
          <React.Fragment key={x}>
            <tbody>
              <tr>
                <th className="gray frame" colSpan={2}>
                  تاريخ الحركه
                </th>
                <th className="gray frame" colSpan={2}>
                  {timeToArabicDate(new Date(day.truthDate).valueOf(), false)}
                </th>
              </tr>
            </tbody>
            {day.branches.map((branch, i) => (
              <React.Fragment key={i}>
                <tbody>
                  <tr>
                    <th className="gray frame" colSpan={2}>
                      بنك / خرينه{' '}
                    </th>
                    <th className="gray frame" colSpan={2}>
                      {branch.branchName}
                    </th>
                  </tr>
                  {branch.rows.map((transaction, z) => (
                    <tr key={z}>
                      <td>{transaction.serialNo}</td>
                      <td>{transaction.customerKey}</td>
                      <td colSpan={1}>{transaction.customerName}</td>
                      <td>{transaction.loanSerial}</td>
                      <td colSpan={1}>{transaction.loanPrincipal}</td>
                      <td colSpan={3}>
                        {timeToArabicDate(
                          getTimestamp(transaction.issueDate),
                          false
                        )}
                      </td>
                      <td colSpan={1}>
                        {getLoanStatus(transaction.stateFlags)}
                      </td>
                      <td>{transaction.transactionPrincipal}</td>
                      <td colSpan={1}>{transaction.transactionInterest}</td>
                      <td>{transaction.transactionAmount}</td>
                      <td colSpan={2}>
                        {transaction.canceled === 1
                          ? local.cancelledTransaction
                          : null}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                  <tr>
                    <td className="frame" colSpan={2}>
                      إجمالي فرع
                    </td>
                    <td className="frame" colSpan={2}>
                      {branch.branchName}
                    </td>
                    <td className="frame" colSpan={1}>
                      {timeToArabicDate(getTimestamp(branch.truthDate), false)}
                    </td>
                    <td className="frame">{branch.numTrx}</td>
                    <td />
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
              </React.Fragment>
            ))}
            <tr style={{ height: '1em' }} />

            <tbody className="tbodyborder">
              <tr>
                <td className="gray frame" colSpan={2}>
                  إجمالي تاريخ الحركه
                </td>
                <td className="gray frame">
                  {timeToArabicDate(new Date(day.truthDate).valueOf(), false)}
                </td>
                <td className="frame" colSpan={2}>
                  إجمالي عدد الحركات
                </td>
                <td className="frame">{day.numTrx}</td>
                <td />
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
            </tbody>
          </React.Fragment>
        ))}

        {/* <tr style={{ height: "1em" }}></tr> */}

        <tbody className="tbodyborder">
          <tr>
            <td className="gray frame" colSpan={2}>
              إجمالي بالعمله
            </td>
            <td className="gray frame">جنيه مصري</td>
            <td className="frame" colSpan={2}>
              إجمالي عدد الحركات
            </td>
            <td className="frame">{tempData.trx}</td>
            <td />
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">{tempData.transactionPrincipal}</td>
            <td className="frame">{tempData.transactionInterest}</td>
            <td className="frame">{tempData.transactionAmount}</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">{tempData.rbPrincipal}</td>
            <td className="frame">{tempData.rbInt}</td>
            <td className="frame">{tempData.rbAmount}</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">{tempData.netPrincipal}</td>
            <td className="frame">{tempData.netInt}</td>
            <td className="frame">{tempData.netAmount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DoubtfulPayments
