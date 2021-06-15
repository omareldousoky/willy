import React from 'react'
import './branchesLoanList.scss'
import { Header } from '../pdfTemplateCommon/header'
import Orientation from '../../Common/orientation'
import { LoanTypeSection } from './LoanTypeSection'
import { BranchesLoanListProps } from './types'

export const BranchesLoanList = ({
  data,
  fromDate,
  toDate,
}: BranchesLoanListProps) => {
  return (
    <div className="branches-loan-list" lang="ar">
      <Orientation size="portrait" />
      <Header title="القروض والحالات" fromDate={fromDate} toDate={toDate} />
      <table className="body">
        {data.result[0] && (
          <LoanTypeSection data={data.result[0]} loanTypeName="مجموعة" />
        )}
        {data.result[1] && (
          <LoanTypeSection data={data.result[1]} loanTypeName="فردي" />
        )}
        {data.result[2] && (
          <LoanTypeSection data={data.result[2]} loanTypeName="sme" />
        )}
        {data.result[3] && (
          <LoanTypeSection
            data={data.result[3]}
            loanTypeName="ﺷرﻛﺔ ﺗﺳﺎھﯾل ﻟﻠﺗﻣوﯾل ﻣﺗﻧﺎھﻰ اﻟﺻﻐر"
            withHeader={false}
          />
        )}
      </table>
    </div>
  )
}
