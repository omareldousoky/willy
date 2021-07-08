import * as local from '../../../Shared/Assets/ar.json'

import ability from '../../config/ability'
import { Card } from '../ManageAccounts/manageAccountsInitials'

export interface Specialty {
  businessSpecialtyName: { ar: string }
  id: string
  active: boolean
}

export interface Activities {
  i18n: { ar: string }
  id: string
  specialties: Array<Specialty>
  active: boolean
}

export interface BusinessSector {
  i18n: { ar: string }
  id: string
  activities: Array<Activities>
}

export const manageLoanDetailsArray = (): Card[] => {
  const mangeLoanDetailsArr: Card[] = []
  if (ability.can('loanUsage', 'config')) {
    mangeLoanDetailsArr.push({
      icon: 'loanUses',
      header: local.loanUses,
      desc: local.loanUses,
      path: '/manage-loan-details/loan-uses',
    })
  }
  if (ability.can('viewBusinessSectorConfig', 'config')) {
    mangeLoanDetailsArr.push(
      {
        icon: 'business-activities',
        header: local.businessActivities,
        desc: local.businessActivities,
        path: '/manage-loan-details/business-activities',
      },
      {
        icon: 'business-specialities',
        header: local.businessSpecialities,
        desc: local.businessSpecialities,
        path: '/manage-loan-details/business-specialities',
      }
    )
  }
  return mangeLoanDetailsArr
}
