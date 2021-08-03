import * as React from 'react'
import local from '../../Shared/Assets/ar.json'
import { Landing } from '../../Shared/Components/Landing'

import { generateAppRoutes } from '../../Shared/Services/utils'
import { manageAccountsRoute } from '../Components/ManageAccounts/routes'

const appRoutes = [
  {
    path: '/',
    label: local.consumerFinance,
    render: () => <Landing appName={local.consumerFinance} />,
    routes: [
      {
        path: '/customers',
        label: local.customers,
        render: () => <h1 className="m-4">Customers</h1>,
      },
      manageAccountsRoute,
    ],
  },
]

export const routes = generateAppRoutes(appRoutes)
