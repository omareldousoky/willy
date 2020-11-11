import * as local from '../../../Shared/Assets/ar.json';
import { Card } from '../ManageAccounts/manageAccountsInitials';
import ability from '../../config/ability'


export const manageCustomersArray = (): Card[] => {
  const manageLoanArr: Card[] = [];
  if (ability.can('getCustomer', 'customer')) {
    manageLoanArr.push({
      icon: 'customers',
      header: local.customers,
      desc: local.customers,
      path: '/customers',
    })
  }
  if (ability.can('changeOfficer', 'customer')) {
    manageLoanArr.push({
      icon: 'changeOfficer',
      header: local.moveCustomers,
      desc: local.moveCustomers,
      path: '/customers/move-customers',
    })
  }
  return manageLoanArr;
}
