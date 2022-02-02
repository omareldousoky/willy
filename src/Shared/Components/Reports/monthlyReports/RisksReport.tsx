import React from 'react'
import './styles.scss'

import * as local from '../../../Assets/ar.json'
import { Header } from '../../pdfTemplates/pdfTemplateCommon/header'
import { isCF, timeToArabicDate } from '../../../Services/utils'

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
      <Header
        cf={isCF}
        showCurrentUser={false}
        showCurrentTime={false}
        showCurrentDate
        title={`${local.risksReportTitle} ${timeToArabicDate(
          report.date,
          false
        )}`}
      />
      <table>
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
                    report.tasaheelRisksRow?.map(
                      (row, index) =>
                        Object.keys(row).length > 0 && (
                          <tr key={index}>
                            <td>{formatTier(row.tier)}</td>
                            <td>{row.customersCount || 0}</td>
                            <td>{Number(row.wallet || 0).toLocaleString()}</td>
                            <td>{`${row.arrearsPercentage || 0}%`}</td>
                            <td>{`${row.feesPercentage || 0}%`}</td>
                            <td>
                              {Number(row.provisions || 0).toLocaleString()}
                            </td>
                          </tr>
                        )
                    )}
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
