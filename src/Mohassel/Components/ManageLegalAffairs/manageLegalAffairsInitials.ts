import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

export const manageLegalAffairsArray = (): Card[] => {
  const mangeLegalAffairsArr: Card[] = []
  if (ability.can('getDefaultingCustomer', 'legal')) {
    mangeLegalAffairsArr.push({
      icon: 'loanUses',
      header: local.lateList,
      desc: local.lateList,
      path: '/legal-affairs/late-list',
    })
  }
  return mangeLegalAffairsArr
}
