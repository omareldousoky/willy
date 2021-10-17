import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../../Shared/config/ability'
import { Card } from '../ManageAccounts/manageAccountsInitials'

export const manageVendorSettlementsArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getMerchantOutstandingSettlement', 'cfApplication')) {
    manageLoanArr.push({
      icon: 'issued-loans',
      header: local.vendorSettlement,
      desc: local.vendorSettlement,
      path: '/vendor-settlements',
    })
  }
  // if (ability.can('getMerchantOutstandingSettlement', 'cfApplication')) {
  //   manageLoanArr.push({
  //     icon: 'applications',
  //     header: local.vendorSettlementReports,
  //     desc: local.vendorSettlementReports,
  //     path: '/vendor-settlements/reports',
  //   })
  // }
  return manageLoanArr
}
