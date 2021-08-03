import * as React from 'react'
import local from '../../Shared/Assets/ar.json'
import { Landing } from '../../Shared/Components/Landing'

import { generateAppRoutes } from '../../Shared/Services/utils'
import { customerCreationRoutes } from '../Components/CustomerCreation/routes'

const appRoutes = [
  {
    path: '/',
    label: local.consumerFinance,
    render: () => <Landing appName={local.consumerFinance} />,
    routes: [
      customerCreationRoutes,
      {
        path: '/manage-accounts/roles',
        label: local.manageAccounts,
        render: () => <h1 className="m-4">Roles</h1>,
      },
    ],
  },
]

export const routes = generateAppRoutes(appRoutes)
