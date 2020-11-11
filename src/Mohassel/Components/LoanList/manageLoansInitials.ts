import * as local from '../../../Shared/Assets/ar.json';
import { Card } from '../ManageAccounts/manageAccountsInitials';
import ability from '../../config/ability'


export const manageLoansArray = (): Card[] => {
  const manageLoanArr: Card[] = [];
  if (ability.can('getIssuedLoan', 'application')) {
    manageLoanArr.push({
      icon: 'issuedLoans',
      header: local.issuedLoans,
      desc: local.issuedLoans,
      path: '/loans',
    })
  }
  if (ability.can('cibScreen', 'report')) {
    manageLoanArr.push({
      icon: 'cib',
      header: local.cib,
      desc: local.cib,
      path: '/loans/cib',
    })
  }
  if (ability.can('cibScreen', 'report')) {
    manageLoanArr.push({
      icon: 'changeSourceOfFund',
      header: local.changeSourceOfFund,
      desc: local.changeSourceOfFund,
      path: '/loans/source-of-fund'
    })
  }
  return manageLoanArr;
}
