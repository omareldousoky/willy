import React, { FunctionComponent } from 'react'

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
      <td>{row.createdCount}</td>
      <td>{row.createdSum}</td>
      <td>{row.issuedCount}</td>
      <td>{row.issuedSum}</td>
      <th>{row.totalCreatedIssuedCount}</th>
      <th>{row.totalCreatedIssuedSum}</th>
      <td>{row.reviewedCount}</td>
      <td>{row.reviewedSum}</td>
      <td>{row.approvedCount}</td>
      <td>{row.approvedSum}</td>
      <th>{row.totalReviewedApprovedCount}</th>
      <th>{row.totalReviewedApprovedSum}</th>
      <th>{row.totalAllCount}</th>
      <th>{row.totalAllSum}</th>
    </tr>
  )
}
