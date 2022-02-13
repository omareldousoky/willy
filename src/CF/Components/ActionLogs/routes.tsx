import * as React from 'react'
import ActionLogs from './ActionLogs'
import Can from '../../../Shared/config/Can'
import local from '../../../Shared/Assets/ar.json'

export const actionLogsRoutes = {
  path: '/logs',
  label: local.logs,
  render: (props) => (
    <Can I="viewActionLogs" a="user">
      <ActionLogs {...props} />
    </Can>
  ),
}
