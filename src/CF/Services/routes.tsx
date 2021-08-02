import * as React from 'react'
import local from '../../Shared/Assets/ar.json'
import { Landing } from '../../Shared/Components/Landing'

import { generateAppRoutes } from '../../Shared/Services/utils'

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
      {
        path: '/manage-accounts/roles',
        label: local.manageAccounts,
        render: () => <h1 className="m-4">Roles</h1>,
      },
    ],
  },
]

export const routes = generateAppRoutes(appRoutes)
