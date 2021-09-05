import React from 'react'
import local from '../../../Shared/Assets/ar.json'
import { LoanList, LoanProfile, LoanRollBack } from '.'

export const loansRoute = {
  path: '/loans',
  label: local.issuedLoans,
  render: (props) => <LoanList {...props} />,
  routes: [
    {
      path: '/loan-profile',
      label: local.loanDetails,
      render: (props) => <LoanProfile {...props} />,
    },
    {
      path: '/loan-roll-back',
      label: local.previousActions,
      render: (props) => <LoanRollBack {...props} />,
    },
  ],
}
