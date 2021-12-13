import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

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
  if (ability.can('cibScreen', 'report')) {
    manageLoanArr.push({
      icon: 'change-source-of-fund',
      header: local.changeSourceOfFund,
      desc: local.changeSourceOfFund,
      path: '/loans/source-of-fund',
    })
  }
  return manageLoanArr
}

export const manageSMELoansArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getIssuedSMELoan', 'application')) {
    manageLoanArr.push({
      icon: 'issued-loans',
      header: local.issuedLoans,
      desc: local.companies,
      path: '/loans',
    })
  }
  return manageLoanArr
}
