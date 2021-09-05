import React from 'react'
import local from '../../../Shared/Assets/ar.json'
import ability from '../../../Shared/config/ability'
import { LoanList, LoanProfile, LoanRollBack } from '.'

export const loansRoute = {
  path: '/loans',
  label: local.issuedLoans,
  render: (props) =>
    (ability.can('getIssuedLoan', 'application') ||
      ability.can('branchIssuedLoan', 'application')) && (
      <LoanList {...props} />
    ),
  routes: [
    {
      path: '/loan-profile',
      label: local.loanDetails,
      render: (props) =>
        (ability.can('getIssuedLoan', 'application') ||
          ability.can('branchIssuedLoan', 'application')) && (
          <LoanProfile {...props} />
        ),
    },
    {
      path: '/loan-roll-back',
      label: local.previousActions,
      render: (props) => <LoanRollBack {...props} />,
    },
  ],
}
