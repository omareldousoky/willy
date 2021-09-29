import React from 'react'
import './randomPayment.scss'
import { RandomPaymentProps } from './types'
import Orientation from '../../../Common/orientation'
import { Header } from '../../pdfTemplateCommon/header'

const actionsLocalization = (action: string) => {
  switch (action) {
    case 'reissuingFees':
      return 'رسوم إعادة إصدار'
    case 'clearanceFees':
      return 'رسوم تحرير مخالصة'
    case 'applicationFees':
      return 'رسوم طلب قرض'
    case 'collectionCommission':
      return 'عموله تحصيل قرض'
    case 'penalty':
      return 'غرامات'
    case 'toktokStamp':
      return 'دفعه مقدم توكتَوك'
    case 'tricycleStamp':
      return 'دفعه مقدم تروسكل'
    case 'legalFees':
      return 'تكلفه تمويل قضائية'

    default:
      return null
  }
}

export const RandomPayment = ({
  branches,
  startDate,
  endDate,
  isCF,
}: RandomPaymentProps) => {
  return (
    <div lang="ar" className="random-payment-print">
      <Orientation size="portrait" />
      <Header
        fromDate={startDate}
        toDate={endDate}
        title="الحركات المالية (حركات السداد المنفذة)"
        cf={isCF}
      />
      {branches?.map((branch, index) => {
        return (
          <table key={index} style={{ padding: '10px' }}>
            <thead>
              <tr>
                <th colSpan={3}>
                  <div className="frame">{branch.branchName} </div>
                </th>
              </tr>
              <tr>
                <td colSpan={10} className="border" />
              </tr>
              <tr>
                <th />
                <th>كود العميل</th>
                <th>اسم العميل</th>
                <th>كود الحركه</th>
                <th>تاريخ الحركه</th>
                <th>قيمة الحركه</th>
                <th>نوع الحركه الماليه</th>
                <th>حالة الحركة</th>
                <th>نوع القرض</th>
              </tr>
              <tr>
                <td colSpan={10} className="border" />
              </tr>
            </thead>
            {branch.rows.map((row, rowIndex) => {
              return (
                <tbody key={rowIndex}>
                  <tr>
                    <td />
                    <td>{row.customerKey}</td>
                    <td>{row.customerName}</td>
                    <td>{row.trxCode}</td>
                    <td className="text-nowrap">{row.trxDate}</td>
                    <td>{row.trxAmount}</td>
                    <td>{actionsLocalization(row.trxAction)}</td>
                    <td>{row.canceled === '1' ? 'الحركة ملغاه' : ''}</td>
                    <td>{row?.loanType || ''}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} />
                    <td />
                    <td>{row.trxAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={10} className="border" />
                  </tr>
                </tbody>
              )
            })}
            {/* TODO: Fix invalid DOM nesting <tr> can not be nested in <tr> */}
            <tbody className="tbody-border">
              <tr>
                <td colSpan={3}>إجمالي الحركه {branch.branchName}</td>
                <td />
                <td>عدد&nbsp;{branch.trxCount}</td>
                <tr>
                  <td>إجمالي المبلغ </td>
                  <td>{branch.trxSum}</td>
                </tr>
                <tr>
                  <td>القيمة الملغاه </td>
                  <td>{branch.trxRb}</td>
                </tr>
                <tr>
                  <td>صافي المبلغ </td>
                  <td>{branch.trxNet}</td>
                </tr>
              </tr>
            </tbody>
          </table>
        )
      })}
    </div>
  )
}
