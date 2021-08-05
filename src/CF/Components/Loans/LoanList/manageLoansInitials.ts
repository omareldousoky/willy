import * as local from '../../../../Shared/Assets/ar.json'
import { Card } from '../../ManageAccounts/manageAccountsInitials'
import ability from '../../../../Shared/config/ability'

export const manageLoansArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getIssuedLoan', 'application')) {
    manageLoanArr.push({
      icon: 'issued-loans',
      header: local.issuedLoans,
      desc: local.individuals,
      path: '/loans',
    })
  }
  return manageLoanArr
}
