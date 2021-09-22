import React from 'react'

import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'

import SupervisionGroupsList from './supervisionGroupsList'

export const supervisionLevelsRoute = {
  path: '/supervisions-levels',
  label: local.levelsOfSupervision,
  render: (props) => (
    <Can I="getOfficersGroups" a="branch">
      <SupervisionGroupsList {...props} />
    </Can>
  ),
}
