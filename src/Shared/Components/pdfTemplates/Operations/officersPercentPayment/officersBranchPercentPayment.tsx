import React from 'react'
import { Header } from '../../pdfTemplateCommon/header'
import { OfficerBranchPercentPaymentResponse } from '../../../../../Mohassel/Services/interfaces'
import { formatPercent } from './officersPercentPayment'
import './officersPercentPayment.scss'
import OfficersPercentPaymentFooter from './officersPercentPaymentFooter'

interface OfficerPercentPaymentProps {
  fromDate: string
  toDate: string
  data: OfficerBranchPercentPaymentResponse
}

const OfficerBranchPercentPayment = (props: OfficerPercentPaymentProps) => {
  const { fromDate, toDate, data } = props
  return (
    <div className="officers-payment officers-branch-payment" lang="ar">
      <Header
        toDate={toDate}
        fromDate={fromDate}
        title="تقرير نسب السداد و الانتاجيه للمندوبين"
      />
      <table className="body">
        <thead>
          <tr>
            <th colSpan={3} />
            <th />
            <th colSpan={2}>الاصدار</th>
            <th colSpan={2} rowSpan={2}>
              سدادات متوقعه
              <br /> فى هذه الفتره
            </th>
            <th colSpan={2} rowSpan={2}>
              مسدد حتى نهاية
              <br /> الفتره
            </th>
            <th />
            <th colSpan={4}>المحفظه الان</th>
            <th colSpan={2} />
          </tr>
          <tr>
            <th colSpan={3}>الفرع</th>
            <th />
            <th>عدد</th>
            <th>مبلغ</th>
            <th>نسبة السداد</th>
            <th>عدد</th>
            <th />
            <th>مبلغ</th>
            <th />
            <th colSpan={2}>متحصلات الفتره</th>
          </tr>
        </thead>
        <tbody>
          {data.branches &&
            data.branches.map((branch, index) => (
              <tr key={index}>
                <td colSpan={3} className="text-right">
                  {branch.branch}
                </td>
                <td />
                <td>{branch.issuedLoans || '0'}</td>
                <td>{branch.principalIssuedLoans || '0.00'}</td>
                <td colSpan={2}>{branch.expectedPayments || '0.00'}</td>
                <td colSpan={2}>{branch.paid || '0.00'}</td>
                <td>{formatPercent(branch.paidPercentage) || '%00.00'}</td>
                <td>{branch.walletActiveLoans || '0'}</td>
                <td>{formatPercent(branch.walletActivePercent) || '%00.00'}</td>
                <td>{branch.walletAmount || '0.00'}</td>
                <td>{formatPercent(branch.walletAmountPercent) || '%00.00'}</td>
                <td colSpan={2}>{branch.periodCollections || '0.00'}</td>
              </tr>
            ))}
          <tr>
            <td colSpan={3} className="text-right">
              عدد الفروع
            </td>
            <td>{data.branchesCount || '0'}</td>
            <td>{data.issuedLoans || '0'}</td>
            <td>{data.principalIssuedLoans || '0.00'}</td>
            <td colSpan={2}>{data.expectedPayments || '0.00'}</td>
            <td colSpan={2}>{data.paid || '0.00'}</td>
            <td>{formatPercent(data.paidPercentage) || '%00.00'}</td>
            <td colSpan={2}>{data.walletActiveLoans}</td>
            <td colSpan={2}>{data.walletAmount}</td>
            <td colSpan={2}>{data.periodCollections || '0'}</td>
          </tr>
        </tbody>
      </table>
      <OfficersPercentPaymentFooter />
    </div>
  )
}

export default OfficerBranchPercentPayment
