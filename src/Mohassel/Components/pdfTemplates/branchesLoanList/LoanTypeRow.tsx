import React, { FunctionComponent } from 'react'
import DataRow from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/dataRow'

import './branchesLoanList.scss'
import { LoanTypeRowProps } from './types'

export const LoanTypeRow: FunctionComponent<LoanTypeRowProps> = ({
  isTotal = false,
  row,
  loanTypeName,
}: LoanTypeRowProps) => {
  return (
    <tr>
      {isTotal ? (
        <th colSpan={2}>إجمالي {loanTypeName}</th>
      ) : (
        <>
          <td />
          <td>{row.branchName}</td>
        </>
      )}
      <DataRow value={row.createdCount} type="number" />
      <DataRow value={row.createdSum} type="number" />
      <DataRow value={row.issuedCount} type="number" />
      <DataRow value={row.issuedSum} type="number" />
      <DataRow value={row.totalCreatedIssuedCount} type="number" />
      <DataRow value={row.totalCreatedIssuedSum} type="number" />
      <DataRow value={row.reviewedCount} type="number" />
      <DataRow value={row.reviewedSum} type="number" />
      <DataRow value={row.approvedCount} type="number" />
      <DataRow value={row.approvedSum} type="number" />
      <DataRow value={row.totalReviewedApprovedCount} type="number" />
      <DataRow value={row.totalReviewedApprovedSum} type="number" />
      <DataRow value={row.totalAllCount} type="number" />
      <DataRow value={row.totalAllSum} type="number" />
    </tr>
  )
}
