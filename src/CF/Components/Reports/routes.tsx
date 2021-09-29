import React from 'react'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import ReportsHome from './reports-Home'

export const reportRoutes = {
  path: '/reports',
  label: local.reports,
  render: () => (
    <Can I="viewReports" a="report">
      <ReportsHome />
    </Can>
  ),
}
