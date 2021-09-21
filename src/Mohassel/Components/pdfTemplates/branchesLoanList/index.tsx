import React from 'react'
import './branchesLoanList.scss'
import Orientation from '../../../../Shared/Components/Common/orientation'
import { LoanTypeSection } from './LoanTypeSection'
import { BranchesLoanListProps } from './types'
import { Header } from '../../../../Shared/Components/pdfTemplates/pdfTemplateCommon/header'

export const BranchesLoanList = ({
  data,
  fromDate,
  toDate,
}: BranchesLoanListProps) => {
  const { loanType } = data
  const isAll = loanType === 'all'
  const isMicro = loanType === 'micro' || isAll
  const isSme = !isMicro || isAll

  const group = isMicro
    ? data.result.find((section) => section.responseType === 'group')
    : undefined
  const individual = isMicro
    ? data.result.find((section) => section.responseType === 'individual')
    : undefined
  const sme = isSme
    ? data.result.find((section) => section.responseType === 'sme')
    : undefined
  const totals = data.result.find(
    (section) => section.responseType === 'totals'
  )
  return (
    <div className="branches-loan-list" lang="ar">
      <Orientation size="portrait" />
      <Header title="القروض والحالات" fromDate={fromDate} toDate={toDate} />
      <table className="body">
        {group && <LoanTypeSection data={group} loanTypeName="مجموعة" />}
        {individual && (
          <LoanTypeSection data={individual} loanTypeName="فردي" />
        )}
        {sme && <LoanTypeSection data={sme} loanTypeName="sme" />}
        {totals && (
          <LoanTypeSection
            data={totals}
            loanTypeName="ﺷرﻛﺔ ﺗﺳﺎھﯾل ﻟﻠﺗﻣوﯾل ﻣﺗﻧﺎھﻰ اﻟﺻﻐر"
            withHeader={false}
          />
        )}
      </table>
    </div>
  )
}
