import * as local from '../../../Shared/Assets/ar.json';

import ability from '../../config/ability';

export interface Card {
  icon: string;
  header: string;
  desc: string;
  path: string;
}
export const manageAccountsArray = (): Card[] => {
  const mangeAccountArr: Card[] = [];
  if (ability.can('getRoles', 'user')) {
    mangeAccountArr.push({
      icon: 'roles',
      header: local.roles,
      desc: local.rolesDesc,
      path: '/manage-accounts/roles',
    });
  }
  if (ability.can('getUser', 'user')) {
    mangeAccountArr.push({
      icon: 'users',
      header: local.users,
      desc: local.usersDesc,
      path: '/manage-accounts/users',
    });
  }

  if (ability.can('getBranch', 'branch')) {
    mangeAccountArr.push({
      icon: 'branches',
      header: local.branches,
      desc: local.branchesDesc,
      path: '/manage-accounts/branches',
    });
  }
  if (ability.can('updateLoanOfficer', 'user')) {
    mangeAccountArr.push({
      icon: 'customers',
      header: local.loanOfficers,
      desc: local.officersDesc,
      path: '/manage-accounts/loan-officers',
    });
  }
  return mangeAccountArr;
};
