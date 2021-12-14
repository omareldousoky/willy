import * as local from '../../../Shared/Assets/ar.json'

import ability from '../../config/ability'
import { Card } from '../ManageAccounts/manageAccountsInitials'

export const manageLoanDetailsArray = (): Card[] => {
  const mangeLoanDetailsArr: Card[] = []
  if (ability.can('loanUsage', 'config')) {
    mangeLoanDetailsArr.push({
      icon: 'loan-uses',
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
  if (ability.can('loanReviewNote', 'config')) {
    mangeLoanDetailsArr.push({
      icon: 'applications',
      header: local.comments,
      desc: local.comments,
      path: '/manage-loan-details/comments',
    })
  }
  return mangeLoanDetailsArr
}
