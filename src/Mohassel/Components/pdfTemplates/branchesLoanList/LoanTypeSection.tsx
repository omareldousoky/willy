import React from 'react'

import './branchesLoanList.scss'
import { LoanTypeRow } from './LoanTypeRow'
import { LoanTypeSectionProps } from './types'

export const LoanTypeSection = ({
  loanTypeName,
  data,
  withHeader = true,
}: LoanTypeSectionProps) => {
  let totalRow
  return (
    <tbody>
      {withHeader && (
        <>
          <tr>
            <th colSpan={2}>{loanTypeName}</th>
          </tr>
          <tr>
            <th rowSpan={3}>م</th>
            <th rowSpan={3}>اسم الفرع</th>
            <th colSpan={6}>الفروع</th>
            <th colSpan={6}>**الحالات</th>
            <th colSpan={2} rowSpan={2}>
              إجمالي عام
            </th>
          </tr>
          <tr>
            <th colSpan={2}>غير مصدر</th>
            <th colSpan={2}>مصدر</th>
            <th colSpan={2}>إجمالي</th>
            <th colSpan={2}>منتظر قرار</th>
            <th colSpan={2}>موافق عليه</th>
            <th colSpan={2}>إجمالي</th>
          </tr>
          <tr>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
            <th colSpan={2}>عدد / مبلغ بالالف</th>
          </tr>
        </>
      )}
      {data &&
        data.rows.map((row, index) => {
          const branchNameLowerCase = row.branchName.toLowerCase()
          const isTotal = branchNameLowerCase === 'total'
          if (isTotal) {
            totalRow = row
            return <React.Fragment key={index} />
          }
          return (
            <LoanTypeRow key={index} row={row} loanTypeName={loanTypeName} />
          )
        })}
      {totalRow && (
        <LoanTypeRow isTotal row={totalRow} loanTypeName={loanTypeName} />
      )}
    </tbody>
  )
}
