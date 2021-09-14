import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../../Shared/config/ability'

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
  if (ability.can('viewBusinessSectorConfig', 'config')) {
    manageLoanArr.push(
      {
        icon: 'business-activities',
        header: local.businessActivities,
        desc: local.businessActivities,
        path: '/tools/business-activities',
      },
      {
        icon: 'business-specialities',
        header: local.businessSpecialities,
        desc: local.businessSpecialities,
        path: '/tools/business-specialities',
      }
    )
  }
  if (ability.can('createMaxPrincipal', 'config')) {
    manageLoanArr.push({
      icon: 'principal-range',
      header: local.principalRange,
      desc: local.principalRange,
      path: '/tools/limits-config',
    })
  }
  return manageLoanArr
}
