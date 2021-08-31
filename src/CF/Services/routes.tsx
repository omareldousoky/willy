import * as React from 'react'
import local from '../../Shared/Assets/ar.json'
import { Landing } from '../../Shared/Components/Landing'

import { generateAppRoutes } from '../../Shared/Services/utils'
import { manageAccountsRoute } from '../Components/ManageAccounts/routes'
import { customerCreationRoutes } from '../Components/CustomerCreation/routes'
import { loansRoute } from '../Components/Loans/routes'
import { toolsRoutes } from '../Components/Tools/routes'
import { leadsRoutes } from '../Components/Leads/routes'

const appRoutes = [
  {
    path: '/',
    label: local.halan,
    render: () => <Landing appName={local.halan} />,
    routes: [
      manageAccountsRoute,
      customerCreationRoutes,
      loansRoute,
      toolsRoutes,
      leadsRoutes,
    ],
  },
]

export const routes = generateAppRoutes(appRoutes)
