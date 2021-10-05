import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

export const manageToolsArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('documentTypes', 'config')) {
    manageLoanArr.push({
      icon: 'encoding-files',
      header: local.encodingFiles,
      desc: local.encodingFiles,
      path: '/tools/encoding-files',
    })
  }
  if (ability.can('geoArea', 'config')) {
    manageLoanArr.push({
      icon: 'branch-areas',
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
  if (ability.can('getCBEFiles', 'customer')) {
    manageLoanArr.push({
      icon: 'business-specialities',
      header: local.cbeCodes,
      desc: local.cbeCodes,
      path: '/tools/cbe-codes',
    })
  }
  return manageLoanArr
}
