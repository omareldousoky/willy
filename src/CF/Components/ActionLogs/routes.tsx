import * as React from 'react'
import Can from '../../../Shared/config/Can'
import local from '../../../Shared/Assets/ar.json'
import ActionLogs from './ActionLogs'

export const actionLogsRoutes = {
  path: '/logs',
  label: local.logs,
  render: (props) => (
    <Can I="viewActionLogs" a="user">
      <ActionLogs {...props} />
    </Can>
  ),
}
