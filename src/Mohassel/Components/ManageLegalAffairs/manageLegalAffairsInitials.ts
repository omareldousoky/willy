import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

export const manageLegalAffairsArray = (): Card[] => {
  const mangeLegalAffairsArr: Card[] = []
  if (ability.can('getDefaultingCustomer', 'legal')) {
    mangeLegalAffairsArr.push({
      icon: 'loan-uses',
      header: local.lateList,
      desc: local.lateList,
      path: '/legal-affairs/late-list',
    })
  }

  if (ability.can('getDefaultingCustomer', 'legal')) {
    mangeLegalAffairsArr.push(
      {
        icon: 'legal-actions',
        header: local.legalAffairs,
        desc: local.legalAffairs,
        path: '/legal-affairs/legal-actions',
      },
      {
        icon: 'legal-actions',
        header: local.legalCalendar,
        desc: local.legalCalendar,
        path: '/legal-affairs/legal-calendar',
      }
    )
  }

  return mangeLegalAffairsArr
}
