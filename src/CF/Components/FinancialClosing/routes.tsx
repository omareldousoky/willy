import React from 'react'

import local from '../../../Shared/Assets/ar.json'

import Can from '../../../Shared/config/Can'
import FinancialBlocking from './financialBlocking'
import FinancialClosing from './financialClosing'
import FinancialReviewing from './FinancialReviewing'

export const financialClosingRoutes = {
  path: '/financial-closing',
  label: local.manageFinancialTransaction,
  render: (props) => (
    <Can I="getFinancialBlocking" a="application">
      <FinancialBlocking {...props} withHeader />
    </Can>
  ),
  routes: [
    {
      path: '/lts-closing',
      label: local.ltsClosing,
      render: (props) => (
        <Can I="financialClosing" a="application">
          <FinancialClosing {...props} withHeader />
        </Can>
      ),
    },
    {
      path: '/lts-blocking',
      label: local.financialBlocking,
      render: (props) => (
        <Can I="getFinancialBlocking" a="application">
          <FinancialBlocking {...props} withHeader />
        </Can>
      ),
    },
    {
      path: '/lts-review-oracle',
      label: local.oracleReports,
      render: (props) => (
        <Can I="summarizeTransactions" a="oracleIntegration">
          <FinancialReviewing {...props} withHeader />
        </Can>
      ),
    },
  ],
}
