import React from 'react'
import './styles.scss'

import { timeToArabicDateNow } from '../../../Services/utils'
import * as local from '../../../Assets/ar.json'

export const RisksReport = (report) => {
  const formatTier = (tier) => {
    switch (tier) {
      case 'Undeserved Credit':
        return local.undeservedCreditGeneral
      case 'rescheduled credit':
        return local.rescheduledCredit
      case 'doubtful credit':
        return local.doubtfulCredit
      case 'total':
        return local.totalGeneral
      default:
        if (tier.includes('+')) {
          return `اكثر من ${tier.replace('+', '')}`
        }
        if (tier.includes('-')) {
          return ` من ${tier.replace('-', ` إلى `)} يوم`
        }
        return tier
    }
  }
  return (
    <div lang="ar" className="report text-center font-weight-bold">
      <table className="my-4 mx-2" style={{ fontSize: '12px' }}>
        <thead>
          <tr className="bg-white text-left">
            <td colSpan={6} className="font-weight-bold">
              <div>
                ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
              </div>
              <div>شركة تساهيل للتمويل متناهي الصغر</div>
              <div>المركز الرئيسي</div>
              <div>{timeToArabicDateNow(true)}</div>
            </td>
            <td colSpan={6}>
              <div className="logo-print-tb" />
            </td>
          </tr>
        </thead>
      </table>
      <table>
        <thead className="report-header">
          <tr className="font-weight-bold" style={{ fontSize: '14px' }}>
            <th className="text-center">{local.risksReportTitle}</th>
          </tr>
          <tr className="font-weight-bold text-center">
            <th>{report.date}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <table>
                <tbody>
                  <tr>
                    <td rowSpan={2}>{local.clientsCreditsAge}</td>
                    <td colSpan={3}>{local.totalWallet}</td>
                    <td colSpan={2}>{local.customDebtRequired}</td>
                  </tr>
                  <tr>
                    <td>{local.noOfCustomers}</td>
                    <td>{local.value}</td>
                    <td>%</td>
                    <td>%</td>
                    <td>{local.value}</td>
                  </tr>
                  {report &&
                    report.tasaheelRisksRow?.map((row, index) => (
                      <tr key={index}>
                        <td>{formatTier(row.tier)}</td>
                        <td>{row.customersCount || 0}</td>
                        <td>{Number(row.wallet).toLocaleString() || 0}</td>
                        <td>{`${row.arrearsPercentage || 0}%`}</td>
                        <td>{`${row.feesPercentage || 0}%`}</td>
                        <td>{Number(row.provisions).toLocaleString() || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </th>
          </tr>
        </tbody>
      </table>

      <table className="my-4">
        <tbody>
          <tr>
            <td>{local.numberOfClientsWithPartialPayments}</td>

            <td>{report.customersWithPartialPayments}</td>
          </tr>
          <tr>
            <td>{local.undeservedCredit}</td>
            <td>{Number(report.undeservedCredit).toLocaleString()}</td>
          </tr>
          <tr>
            <td>{local.lateCredit}</td>
            <td>{Number(report.lateCredit).toLocaleString()}</td>
          </tr>
          <tr>
            <td>{local.totalCredit}</td>
            <td>{Number(report.totalCredit).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
