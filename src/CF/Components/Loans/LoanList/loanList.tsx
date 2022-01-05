import React, { FunctionComponent, useEffect, useState } from 'react'
import { ListView } from 'Shared/Layouts'
import { Application } from 'Shared/Services/interfaces'
import local from '../../../../Shared/Assets/ar.json'
import { manageLoansArray } from './manageLoansInitials'
import { LoanListProps } from './types'

import useLoan from '../../../../Shared/hooks/useLoan'

const LoanList: FunctionComponent<LoanListProps> = (props: LoanListProps) => {
  const [from, setFrom] = useState(0)
  const [size, setSize] = useState(10)

  const { fromBranch = false, branchId } = props

  const [
    {
      tableMappers,
      loanSearchKeys,
      loanDropDownKeys,
      loans,
      loading,
      totalCount,
      getLoans,
    },
  ] = useLoan(fromBranch, branchId, from, size, 'consumerFinance')

  useEffect(() => {
    getLoans()
  }, [from, size])

  const manageLoansTabs = manageLoansArray()

  return (
    <ListView<Application>
      headerTitle={local.issuedLoans}
      // to remove tabs in case inside branch
      headerTabs={fromBranch ? [] : manageLoansTabs}
      activeTab={fromBranch ? '' : 'issued-loans'}
      isLoading={loading}
      viewTitle={local.issuedLoans}
      sideTitleText={local.noOfIssuedLoans + ` (${totalCount ?? 0})`}
      tableFrom={from}
      tableSize={size}
      tableTotalCount={totalCount}
      tableUrl="loan"
      tableMappers={tableMappers}
      tableData={loans}
      onChangeTableNumber={(key: 'from' | 'size', number: number) => {
        if (key === 'from') setFrom(number)
        else setSize(number)
      }}
      isCf
      searchKeys={loanSearchKeys}
      dropDownKeys={loanDropDownKeys}
      searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
      searchSetFrom={(fromValue) => setFrom(fromValue)}
      datePlaceholder={local.issuanceDate}
      searchUrl="loan"
      hqBranchIdRequest={branchId}
    />
  )
}

export default LoanList
