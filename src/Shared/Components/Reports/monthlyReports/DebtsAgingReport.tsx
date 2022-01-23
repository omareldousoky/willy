import React from 'react'
import './styles.scss'

import { timeToArabicDateNow } from '../../../Services/utils'
import * as local from '../../../Assets/ar.json'

export const DebtsAgingReport = (report) => {
  const formatTier = (tier) => {
    switch (tier) {
      case 'Undeserved Credit':
        return local.undeservedCreditGeneral
      case 'rescheduled credit':
        return local.rescheduledCredit
      case 'doubtful credit':
        return local.doubtfulCredit
      case 'total':
        return local.totalLoansWallet
      case 'current credit':
        return local.currentCredit
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

      <h2 className="text-center font-weight-bold">
        {local.debtsAgingTitle} {report.date}
      </h2>
      <table>
        <tbody>
          <tr>
            <td />
            <td colSpan={7}>{local.lateCredits}</td>
          </tr>
          <tr>
            <td rowSpan={2}>{local.clientsAgingDebts}</td>

            <td colSpan={4}>{local.value}</td>
            <td colSpan={3}>{local.latePercentage}</td>
          </tr>
          <tr>
            <th rowSpan={1}>{local.noOfCustomers}</th>

            <td>{local.principalOrigin}</td>
            <td>{local.costs}</td>
            <td>{local.totalGeneral}</td>
            <td>{local.principalOrigin}</td>
            <td>{local.costs}</td>
            <td>{local.totalGeneral}</td>
          </tr>
          {report &&
            report.debtsAgingRows?.map((row, index) => (
              <tr key={index}>
                <td>{formatTier(row.tier)}</td>
                <td>{row.customersCount || 0}</td>
                <td>{Number(row.principal).toLocaleString() || 0}</td>
                <td>{Number(row.costs).toLocaleString() || 0}</td>
                <td>{Number(row.total).toLocaleString() || 0}</td>
                <td>{`${row.arrearsPercentage || 0}%`}</td>
                <td>{`${row.costsPercentage || 0}%`}</td>
                <td>{`${row.totalPercentage || 0}%`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
