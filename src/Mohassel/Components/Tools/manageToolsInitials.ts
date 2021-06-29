import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

export const manageToolsArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('documentTypes', 'config')) {
    manageLoanArr.push({
      icon: 'encodingFiles',
      header: local.encodingFiles,
      desc: local.encodingFiles,
      path: '/tools/encoding-files',
    })
  }
  if (ability.can('geoArea', 'config')) {
    manageLoanArr.push({
      icon: 'branchAreas',
      header: local.branchAreas,
      desc: local.branchAreas,
      path: '/tools/geo-areas',
    })
  }
  if (ability.can('createMaxPrincipal', 'config')) {
    manageLoanArr.push({
      icon: 'principal-range',
      header: local.principalRange,
      desc: local.principalRange,
      path: '/tools/principalRange',
    })
  }
  return manageLoanArr
}
