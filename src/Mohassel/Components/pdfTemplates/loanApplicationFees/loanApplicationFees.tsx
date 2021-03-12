import React from 'react'
import './loanApplicationFees.scss'
import {
  timeToArabicDate,
  timeToArabicDateNow,
} from '../../../../Shared/Services/utils'

interface Props {
  result: {
    branches: {
      df: {
        truthDate: string
        branchName: string
        serialNo: number
        customerKey: string
        customerName: string
        loanSerial: number
        principal: number
        status: string
        principalAmount: number
        transactionInterest: number
        transactionAmount: number
        canceled: number
      }[]
      total: number[]
      canceled: number[]
      net: number[]
      branchName: string
    }[]
    trx: number
    day: string
    total: number[]
    canceled: number[]
    net: number[]
  }[]
  total: number[]
  canceled: number[]
  net: number[]
  trx: number
  startDate: any
  endDate: any
}

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
const LoanApplicationFees = (props: Props) => {
  return (
    <div className="loan-application-fees" lang="ar">
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
            <div className="logo-print-tb" />
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
            <th colSpan={6}>قائمة حركات رسوم طلب القرض المنفذه</th>
          </tr>
          <tr className="headtitle">
            <th colSpan={4}>المركز الرئيسي</th>
            <th colSpan={6}>
              تاريخ الحركه من {timeToArabicDate(props.startDate, false)} الي{' '}
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
        {props.result.map((res) => {
          return (
            <>
              {res.branches.map((branch) => {
                return (
                  <>
                    <thead>
                      <tr>
                        <th>رقم مسلسل</th>
                        <th>كود العميل</th>
                        <th>أسم العميل</th>
                        <th>مسلسل القرض</th>
                        <th>قيمة</th>
                        <th>تاريخ القرض</th>
                        <th>الحالة الان</th>
                        <th>أصل</th>
                        <th colSpan={2}>قيمة تكلفه التمويل</th>
                        <th colSpan={2}>إجمالي</th>
                        <th>حالة الحركة</th>
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
                          إسم الفرع
                        </th>
                        <th className="gray frame" colSpan={2}>
                          {branch.branchName}
                        </th>
                      </tr>
                    </thead>
                    {branch.df.map((row) => {
                      return (
                        <>
                          <tbody>
                            <tr>
                              <td>{row.serialNo}</td>
                              <td>{row.customerKey}</td>
                              <td>{row.customerName}</td>
                              <td>{row.loanSerial}</td>
                              <td>{row.principal}</td>
                              <td>{row.truthDate}</td>
                              <td>{statusLocalization(row.status)}</td>
                              <td>{row.principalAmount}</td>
                              <td colSpan={2}>{row.transactionInterest}</td>
                              <td colSpan={2}>{row.transactionAmount}</td>
                              <td>
                                {row.canceled === 1 ? 'الحركة ملغاه' : ''}
                              </td>
                            </tr>
                            <tr>
                              <th colSpan={100} className="horizontal-line" />
                            </tr>
                          </tbody>
                        </>
                      )
                    })}
                    <tbody style={{ marginTop: '1rem' }}>
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
                  </>
                )
              })}
              <tr style={{ height: '1em' }} />

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

export default LoanApplicationFees
