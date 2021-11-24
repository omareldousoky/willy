import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../../Shared/config/ability'

export interface Card {
  icon: string
  header: string
  desc: string
  path: string | object
}
export const manageAccountsArray = (): Card[] => {
  const mangeAccountArr: Card[] = []
  if (ability.can('getRoles', 'user')) {
    mangeAccountArr.push({
      icon: 'role',
      header: local.roles,
      desc: local.rolesDesc,
      path: '/manage-accounts/roles',
    })
  }
  if (ability.can('getUser', 'user')) {
    mangeAccountArr.push({
      icon: 'user',
      header: local.users,
      desc: local.usersDesc,
      path: '/manage-accounts/users',
    })
  }

  if (ability.can('getBranch', 'branch')) {
    mangeAccountArr.push({
      icon: 'branches',
      header: local.branches,
      desc: local.branchesDesc,
      path: '/manage-accounts/branches',
    })
  }
  if (ability.can('updateLoanOfficer', 'user')) {
    mangeAccountArr.push({
      icon: 'customers',
      header: local.loanOfficers,
      desc: local.officersDesc,
      path: '/manage-accounts/loan-officers',
    })
  }
  if (ability.can('getUpdateCustomerOfficerLog', 'search')) {
    mangeAccountArr.push({
      icon: 'customers',
      header: local.loanOfficersTransfers,
      desc: local.loanOfficersTransfers,
      path: '/manage-accounts/loan-officers/transfer-logs',
    })
  }
  return mangeAccountArr
}
