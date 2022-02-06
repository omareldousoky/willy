import React from 'react'
import './loanApplicationFees.scss'
import { timeToArabicDate, timeToArabicDateNow } from 'Shared/Services/utils'
import { stringPlaceholder } from 'Shared/Components/pdfTemplates/pdfTemplateCommon/reportLocal'
import Orientation from 'Shared/Components/Common/orientation'
import { Header } from 'Shared/Components/pdfTemplates/pdfTemplateCommon/header'
import { LoanApplicationFeesProps } from './types'

const statusLocalization = (status: string) => {
  switch (status) {
    case 'paid':
      return 'مدفوع'
    case 'issued':
      return 'مصدر'
    case 'canceled':
      return 'ملغي'
    case 'pending':
      return 'قيد التحقيق'
    default:
      return status
  }
}
export const LoanApplicationFees = (props: LoanApplicationFeesProps) => {
  return (
    <div className="loan-application-fees" lang="ar">
      <Orientation size="portrait" />
      <Header fl={props.financialLeasing} />
      <table className="report-container">
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={4}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={6}>قائمة حركات رسوم طلب القرض المنفذه</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>المركز الرئيسي</th>
            <th colSpan={6}>
              تاريخ الحركه من {timeToArabicDate(props.startDate, false)} الي
              {timeToArabicDate(props.endDate, false)}
            </th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>{timeToArabicDateNow(true)}</th>
            <th colSpan={6}>جنيه مصري</th>
          </tr>
          <tr>
            <th colSpan={100} className="horizontal-line" />
          </tr>
        </thead>
      </table>
      <table>
        {props.result.map((res, index) => {
          return (
            <React.Fragment key={index}>
              {res.branches.map((branch, branchIndex) => {
                return (
                  <React.Fragment key={branchIndex}>
                    <thead>
                      <tr>
                        <th>رقم مسلسل</th>
                        <th>كود العميل</th>
                        <th>اسم العميل</th>
                        <th>مسلسل القرض</th>
                        <th>قيمة</th>
                        <th>تاريخ القرض</th>
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
                      <tr>
                        <th className="gray frame" colSpan={2}>
                          تاريخ الحركه
                        </th>
                        <th className="gray frame" colSpan={2}>
                          {res.day}
                        </th>
                      </tr>
                      <tr>
                        <th className="gray frame" colSpan={2}>
                          اسم الفرع
                        </th>
                        <th className="gray frame" colSpan={2}>
                          {branch.branchName}
                        </th>
                      </tr>
                    </thead>
                    {branch.df.map((row, dfIndex) => {
                      return (
                        <tbody key={dfIndex}>
                          <tr>
                            <td>{row.serialNo}</td>
                            <td>{row.customerKey}</td>
                            <td>{row.customerName}</td>
                            <td>{row.loanSerial}</td>
                            <td>{row.principal}</td>
                            <td className="text-nowrap">{row.truthDate}</td>
                            <td>{statusLocalization(row.status)}</td>
                            <td>{row.principalAmount}</td>
                            <td colSpan={2}>{row.transactionInterest}</td>
                            <td colSpan={2}>{row.transactionAmount}</td>
                            <td>{row.canceled === 1 ? 'الحركة ملغاه' : ''}</td>
                            <td>{row?.loanType || stringPlaceholder}</td>
                          </tr>
                          <tr>
                            <th colSpan={100} className="horizontal-line" />
                          </tr>
                        </tbody>
                      )
                    })}
                    <tbody key={branchIndex} style={{ marginTop: '1rem' }}>
                      <tr>
                        <td className="frame" colSpan={2}>
                          إجمالي الفرع
                        </td>
                        <td className="frame" colSpan={2}>
                          {branch.branchName}
                        </td>
                        <td className="frame" colSpan={1}>
                          {res.day}
                        </td>
                        <td className="frame" />
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
                  <td className="gray frame">{res.day}</td>
                  <td className="frame" colSpan={2}>
                    إجمالي عدد الحركات
                  </td>
                  <td className="frame">{res.trx}</td>
                  <td />
                  <td />
                  <td className="frame">إجمالي المبلغ</td>
                  <td className="frame">{res.total[0]}</td>
                  <td className="frame">{res.total[1]}</td>
                  <td className="frame">{res.total[2]}</td>
                </tr>

                <tr>
                  <td colSpan={8} />
                  <td className="frame">القيمة الملغاه</td>
                  <td className="frame">{res.canceled[0]}</td>
                  <td className="frame">{res.canceled[1]}</td>
                  <td className="frame">{res.canceled[2]}</td>
                </tr>
                <tr>
                  <td colSpan={8} />
                  <td className="frame">صافي المبلغ</td>
                  <td className="frame">{res.net[0]}</td>
                  <td className="frame">{res.net[1]}</td>
                  <td className="frame">{res.net[2]}</td>
                </tr>
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
            <td className="frame" colSpan={2}>
              إجمالي عدد الحركات
            </td>
            <td className="frame">{props.trx}</td>
            <td />
            <td />
            <td className="frame">إجمالي المبلغ</td>
            <td className="frame">{props.total[0]}</td>
            <td className="frame">{props.total[1]}</td>
            <td className="frame">{props.total[2]}</td>
          </tr>

          <tr>
            <td colSpan={8} />
            <td className="frame">القيمة الملغاه</td>
            <td className="frame">{props.canceled[0]}</td>
            <td className="frame">{props.canceled[1]}</td>
            <td className="frame">{props.canceled[2]}</td>
          </tr>
          <tr>
            <td colSpan={8} />
            <td className="frame">صافي المبلغ</td>
            <td className="frame">{props.net[0]}</td>
            <td className="frame">{props.net[1]}</td>
            <td className="frame">{props.net[2]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
