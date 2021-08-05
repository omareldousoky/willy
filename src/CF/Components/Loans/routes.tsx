import React from 'react'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import { LoanList, LoanProfile } from '.'

export const loansRoute = {
  path: '/loans',
  label: local.issuedLoans,
  disableLink: true,
  render: (props) => (
    <Can I="getIssuedLoan" a="application">
      <LoanList {...props} />{' '}
    </Can>
  ),
  routes: [
    {
      path: '/loan-profile',
      label: local.loanDetails,
      render: (props) => (
        <Can I="getIssuedLoan" a="application">
          <LoanProfile {...props} />
        </Can>
      ),
    },
  ],
}
