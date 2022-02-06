import React from 'react'
import './issuedLoanList.scss'
import {
  timeToArabicDate,
  getTimestamp,
  timeToArabicDateNow,
  statusLocale,
} from '../../../../Services/utils'
import { Header } from '../../pdfTemplateCommon/header'

export const IssuedLoanList = ({
  isCF = false,
  data: { financialLeasing, from, to, result, total, canceled, trx, net },
}) => {
  const reportDate =
    from === to
      ? timeToArabicDate(from, false)
      : `من ${timeToArabicDate(from, false)} الي ${timeToArabicDate(to, false)}`
  return (
    <div className="issued-loan-list" lang="ar">
      <Header cf={isCF} fl={financialLeasing} />
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={4}>
              {isCF
                ? 'حالا للتمويل الاستهلاكي ش. م. م.'
                : 'شركة تساهيل للتمويل متناهي الصغر'}
            </th>
            <th colSpan={6}>قائمة حركات إصدار القروض المنفذه</th>
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
            <th colSpan={2}>كود العميل</th>
            <th>أسم العميل</th>
            <th>مسلسل القرض</th>
            <th colSpan={2}>قيمة</th>
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
                <th colSpan={2}>تاريخ الحركه</th>
                <th colSpan={2} className="text-nowrap">
                  {timeToArabicDate(new Date(day.day).valueOf(), false)}
                </th>
              </tr>
            </tbody>

            {day.branches.map((branch, i) => (
              <React.Fragment key={i}>
                <tbody>
                  <tr>
                    <th colSpan={2}>بنك / خرينه </th>
                    <th colSpan={2}>{branch.branchName}</th>
                  </tr>
                  {branch.df.map((transaction, z) => (
                    <tr key={z}>
                      <td>{transaction.serialNo}</td>
                      <td colSpan={2}>{transaction.customerKey}</td>
                      <td>{transaction.customerName}</td>
                      <td>{transaction.loanSerial}</td>
                      <td colSpan={2}>{transaction.principalAmount}</td>
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
                    <td colSpan={100} className="horizontal-line" />
                  </tr>
                </tbody>
                <tbody className="framecell">
                  <tr>
                    <td colSpan={2}>إجمالي فرع</td>
                    <td colSpan={2}>{branch.branchName}</td>
                    <td colSpan={1} className="text-nowrap">
                      {timeToArabicDate(new Date(day.day).valueOf(), false)}
                    </td>
                    <td>{branch.df.length}</td>
                    <td colSpan={2} className="border-0" />
                    <td>إجمالي المبلغ</td>
                    <td>{branch.total[0]}</td>
                    <td>{branch.total[1]}</td>
                    <td>{branch.total[2]}</td>
                  </tr>

                  <tr>
                    <td colSpan={8} className="border-0" />
                    <td>القيمة الملغاه</td>
                    <td>{branch.canceled[0]}</td>
                    <td>{branch.canceled[1]}</td>
                    <td>{branch.canceled[2]}</td>
                  </tr>
                  <tr>
                    <td colSpan={8} className="border-0" />
                    <td>صافي المبلغ</td>
                    <td>{branch.net[0]}</td>
                    <td>{branch.net[1]}</td>
                    <td>{branch.net[2]}</td>
                  </tr>
                </tbody>
              </React.Fragment>
            ))}
            <tbody>
              <tr>
                <td className="horizontal-line" colSpan={100} />
              </tr>
              <tr style={{ height: '0.5em' }} />
            </tbody>

            <tbody className="tbodyborder framecell">
              <tr style={{ height: '0.5em' }} />
              <tr>
                <th colSpan={2}>إجمالي تاريخ الحركه</th>
                <th>{timeToArabicDate(new Date(day.day).valueOf(), false)}</th>
                <td colSpan={2}>إجمالي عدد الحركات</td>
                <td>{day.trx}</td>
                <td colSpan={2} className="border-0" />
                <td>إجمالي المبلغ</td>
                <td>{day.total[0]}</td>
                <td>{day.total[1]}</td>
                <td>{day.total[2]}</td>
              </tr>

              <tr>
                <td colSpan={8} className="border-0" />
                <td>القيمة الملغاه</td>
                <td>{day.canceled[0]}</td>
                <td>{day.canceled[1]}</td>
                <td>{day.canceled[2]}</td>
              </tr>
              <tr>
                <td colSpan={8} className="border-0" />
                <td>صافي المبلغ</td>
                <td>{day.net[0]}</td>
                <td>{day.net[1]}</td>
                <td>{day.net[2]}</td>
              </tr>
              <tr style={{ height: '0.5em' }} />
            </tbody>
          </React.Fragment>
        ))}

        {/* <tr style={{ height: "0.5em" }}></tr> */}

        <tbody className="tbodyborder framecell">
          <tr style={{ height: '0.5em' }} />
          <tr>
            <th colSpan={2}>إجمالي بالعمله</th>
            <th>جنيه مصري</th>
            <td colSpan={2}>إجمالي عدد الحركات</td>
            <td>{trx}</td>
            <td colSpan={2} className="border-0" />
            <td>إجمالي المبلغ</td>
            <td>{total[0]}</td>
            <td>{total[1]}</td>
            <td>{total[2]}</td>
          </tr>

          <tr>
            <td colSpan={8} className="border-0" />
            <td>القيمة الملغاه</td>
            <td>{canceled[0]}</td>
            <td>{canceled[1]}</td>
            <td>{canceled[2]}</td>
          </tr>
          <tr>
            <td colSpan={8} className="border-0" />
            <td>صافي المبلغ</td>
            <td>{net[0]}</td>
            <td>{net[1]}</td>
            <td>{net[2]}</td>
          </tr>
          <tr style={{ height: '0.5em' }} />
        </tbody>
      </table>
    </div>
  )
}
