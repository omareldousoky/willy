import * as React from 'react'

import Can from '../../../Shared/config/Can'
import local from '../../../Shared/Assets/ar.json'

import TerrorismList from './terrorismList'
import TerrorismUnList from './terrorismUnList'

export const terrorismRoutes = {
  path: '/manage-anti-terrorism',
  label: local.antiTerrorismMoneyLaundering,
  render: (props) => (
    <Can I="getTerrorist" a="customer">
      <TerrorismList {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/anti-terrorism',
      label: local.antiTerrorism,
      render: (props) => (
        <Can I="getTerrorist" a="customer">
          <TerrorismList {...props} />
        </Can>
      ),
    },
    {
      path: '/anti-union-terrorism',
      label: local.antiTerrorism,
      render: (props) => (
        <Can I="getTerrorist" a="customer">
          <TerrorismUnList {...props} />
        </Can>
      ),
    },
  ],
}
