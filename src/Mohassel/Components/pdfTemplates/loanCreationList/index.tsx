import React from 'react'
import './loanCreationList.scss'
import {
  timeToArabicDate,
  getTimestamp,
  timeToArabicDateNow,
  statusLocale,
} from 'Shared/Services/utils'
import Orientation from 'Shared/Components/Common/orientation'
import { Header } from 'Shared/Components/pdfTemplates/pdfTemplateCommon/header'

export const LoanCreationList = ({
  data: { financialLeasing, to, from, total, canceled, net, trx, result },
}) => {
  return (
    <div className="loan-creation-list" lang="ar">
      <Orientation size="portrait" />
      <Header
        fl={financialLeasing}
        title="قائمة حركة انشاء القروض المنفذه"
        fromDate={from}
        toDate={to}
      />
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={4}>المركز الرئيسي</th>
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
            <th>أسم العميل</th>
            <th>مسلسل القرض</th>
            <th>قيمة</th>
            <th colSpan={2}>تاريخ القرض</th>
            <th>الحالة الان</th>
            <th>أصل</th>
            <th colSpan={2}>قيمة تكلفه التمويل</th>
            <th colSpan={2}>إجمالي</th>
            <th>حالة الحركة</th>
            <th>نوع القرض</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
        </thead>
        {result.map((day, x) => (
          <React.Fragment key={x}>
            <tbody>
              <tr>
                <th className="gray frame" colSpan={2}>
                  تاريخ الحركه
                </th>
                <th className="gray frame" colSpan={2}>
                  {timeToArabicDate(new Date(day.day).valueOf(), false)}
                </th>
              </tr>
            </tbody>
            {day.branches.map((branch, i) => (
              <React.Fragment key={i}>
                <tbody>
                  <tr>
                    <th className="gray frame" colSpan={2}>
                      بنك / خرينه
                    </th>
                    <th className="gray frame" colSpan={2}>
                      {branch.branchName}
                    </th>
                  </tr>
                  {branch.df.map((transaction, z) => (
                    <tr key={z}>
                      <td>{transaction.serialNo}</td>
                      <td>{transaction.customerKey}</td>
                      <td>{transaction.customerName}</td>
                      <td>{transaction.loanSerial}</td>
                      <td>{transaction.principalAmount}</td>
                      <td colSpan={2} className="text-nowrap">
                        {timeToArabicDate(
                          getTimestamp(transaction.truthDate),
                          false
                        )}
                      </td>
                      <td>{statusLocale[transaction.status].text}</td>
                      <td>{transaction.principalAmount}</td>
                      <td colSpan={2}>{transaction.transactionInterest}</td>
                      <td colSpan={2}>{transaction.transactionAmount}</td>
                      <td>
                        {transaction.canceled === 1 ? 'الحركة ملغاه' : ''}
                      </td>
                      <td>{transaction?.loanType || ''}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td className="frame" colSpan={2}>
                      إجمالي فرع
                    </td>
                    <td className="frame" colSpan={2}>
                      {branch.branchName}
                    </td>
                    <td className="frame text-nowrap" colSpan={1}>
                      {timeToArabicDate(new Date(day.day).valueOf(), false)}
                    </td>
                    <td className="frame">{branch.df.length}</td>
                    <td />
                    <td />
                    <td className="frame">إجمالي المبلغ</td>
                    <td className="frame">{branch.total[0]}</td>
                    <td className="frame">{branch.total[1]}</td>
                    <td className="frame">{branch.total[2]}</td>
                  </tr>

                  <tr>
                    <td colSpan={8} />
                    <td className="frame">القيمة الملغاه</td>
                    <td className="frame">{branch.canceled[0]}</td>
                    <td className="frame">{branch.canceled[1]}</td>
                    <td className="frame">{branch.canceled[2]}</td>
                  </tr>
                  <tr>
                    <td colSpan={8} />
                    <td className="frame">صافي المبلغ</td>
                    <td className="frame">{branch.net[0]}</td>
                    <td className="frame">{branch.net[1]}</td>
                    <td className="frame">{branch.net[2]}</td>
                  </tr>
                  <tr>
                    <th colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
              </React.Fragment>
            ))}

            {/* <tr style={{ height: "0.5em" }}></tr> */}

            <tbody className="tbodyborder">
              <tr style={{ height: '0.5em' }} />
              <tr>
                <td className="gray frame" colSpan={2}>
                  إجمالي تاريخ الحركه
                </td>
                <td className="gray frame text-nowrap">
                  {timeToArabicDate(new Date(day.day).valueOf(), false)}
                </td>
                <td className="frame" colSpan={2}>
                  إجمالي عدد الحركات
                </td>
                <td className="frame">{day.trx}</td>
                <td />
                <td />
                <td className="frame">إجمالي المبلغ</td>
                <td className="frame">{day.total[0]}</td>
                <td className="frame">{day.total[1]}</td>
                <td className="frame">{day.total[2]}</td>
              </tr>

              <tr>
                <td colSpan={8} />
                <td className="frame">القيمة الملغاه</td>
                <td className="frame">{day.canceled[0]}</td>
                <td className="frame">{day.canceled[1]}</td>
                <td className="frame">{day.canceled[2]}</td>
              </tr>
              <tr>
                <td colSpan={8} />
                <td className="frame">صافي المبلغ</td>
                <td className="frame">{day.net[0]}</td>
                <td className="frame">{day.net[1]}</td>
                <td className="frame">{day.net[2]}</td>
              </tr>
              <tr style={{ height: '0.5em' }} />
            </tbody>
          </React.Fragment>
        ))}

        {/* <tr style={{ height: "0.5em" }}></tr> */}

        <tbody className="tbodyborder">
          <tr style={{ height: '0.5em' }} />
          <tr>
            <td className="gray frame" colSpan={2}>
              إجمالي بالعمله
            </td>
            <td className="gray frame">جنيه مصري</td>
            <td className="frame" colSpan={2}>
              إجمالي عدد الحركات
            </td>
            <td className="frame">{trx}</td>
            <td />
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">{total[0]}</td>
            <td className="frame">{total[1]}</td>
            <td className="frame">{total[2]}</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">{canceled[0]}</td>
            <td className="frame">{canceled[1]}</td>
            <td className="frame">{canceled[2]}</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">{net[0]}</td>
            <td className="frame">{net[1]}</td>
            <td className="frame">{net[2]}</td>
          </tr>
          <tr style={{ height: '0.5em' }} />
        </tbody>
      </table>
    </div>
  )
}
