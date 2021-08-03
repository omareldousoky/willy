import * as React from 'react'
import local from '../../Shared/Assets/ar.json'
import { Landing } from '../../Shared/Components/Landing'

import { generateAppRoutes } from '../../Shared/Services/utils'

const appRoutes = [
  {
    path: '/',
    label: local.consumerFinance,
    render: () => <Landing appName={local.consumerFinance} />,
  },
]

export const routes = generateAppRoutes(appRoutes)
