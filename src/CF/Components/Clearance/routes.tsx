import * as React from 'react'

import Can from '../../../Shared/config/Can'
import local from '../../../Shared/Assets/ar.json'

import ClearanceCreation from './clearanceCreation'
import ClearancesList from './clearancesList'
import ClearanceProfile from './clearanceProfile'

export const clearanceRoutes = {
  path: '/clearances',
  label: local.clearances,
  render: (props) => (
    <Can I="getClearance" a="application">
      <ClearancesList {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/edit-clearance',
      label: local.editClearance,
      render: (props) => (
        <Can I="editClearance" a="application">
          <ClearanceCreation {...props} edit />
        </Can>
      ),
    },
    {
      path: '/review-clearance',
      label: local.reviewClearance,
      render: (props) => (
        <Can I="reviewClearance" a="application">
          <ClearanceProfile {...props} review />
        </Can>
      ),
    },
    {
      path: '/clearance-profile',
      label: local.clearanceDetails,
      render: (props) => (
        <Can I="getClearance" a="application">
          <ClearanceProfile {...props} />
        </Can>
      ),
    },
  ],
}
