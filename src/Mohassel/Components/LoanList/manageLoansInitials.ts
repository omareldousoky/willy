import * as local from 'Shared/Assets/ar.json'
import { Tab } from 'Shared/Components/HeaderWithCards/headerWithCards'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

const changeSourceOfFundTabs = [
  {
    header: `${local.from} ${local.tasaheel} ${local.to} ${local.cib}`,
    stringKey: 'tasaheelToCib',
    permission: 'cibScreen',
    permissionKey: 'report',
  },
  {
    header: `${local.from} ${local.cib} ${local.to} ${local.tasaheel}`,
    stringKey: 'cibToTasaheel',
    permission: 'cibScreen',
    permissionKey: 'report',
  },
  {
    header: `${local.from} ${local.tasaheel} ${local.to} ${local.cibPortfolioSecuritization}`,
    stringKey: 'cibPortfolioSecuritization',
    permission: 'cibPortfolioSecuritization',
    permissionKey: 'application',
  },
  {
    header: `${local.from} ${local.cibPortfolioSecuritization} ${local.to} ${local.tasaheel}`,
    stringKey: 'fromCibPortToTasaheel',
    permission: 'cibPortfolioSecuritization',
    permissionKey: 'application',
  },
]

export const handleSourceOfFundTabs = (): Tab[] => {
  const canTabs: Tab[] = []
  changeSourceOfFundTabs.forEach(
    (t) => ability.can(t.permission, t.permissionKey) && canTabs.push(t)
  )
  return canTabs
}

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
