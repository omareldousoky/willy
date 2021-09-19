import * as local from '../../../Shared/Assets/ar.json'
import { Tab } from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import ability from '../../../Shared/config/ability'

export const manageCustomersArray = (): Tab[] => {
  const manageLoanArr: Tab[] = []
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
      icon: 'exchange',
      header: local.moveCustomers,
      desc: local.moveCustomers,
      path: '/customers/move-customers',
    })
  }
  return manageLoanArr
}
