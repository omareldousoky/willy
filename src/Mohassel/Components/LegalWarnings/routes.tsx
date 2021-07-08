import React from 'react'
import Can from '../../config/Can'
import local from '../../../Shared/Assets/ar.json'
import { LegalWarnings } from '.'

export const legalWarningRoute = {
  path: '/legal-warnings',
  label: local.legalAffairs,
  render: (props) => (
    <Can I="getLegalWarning" a="legal">
      <LegalWarnings {...props} />
    </Can>
  ),
}
