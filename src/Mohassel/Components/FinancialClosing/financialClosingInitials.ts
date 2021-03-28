import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { Tab } from '../HeaderWithCards/headerWithCards'
export const financialClosingArray = (): Tab[] => {
  const financialClosingArr: Tab[] = []
  if (ability.can('financialClosing', 'application')) {
    financialClosingArr.push({
      icon: 'roles',
      header: local.financialClosing,
      desc: local.companyClosing,
      path: '/financial-closing/company-closing',
    })
  }
  if (ability.can('financialBlocking', 'application')) {
    financialClosingArr.push({
      icon: 'assignProductToBranch',
      header: local.financialBlocking,
      desc: local.companyBlocking,
      path: '/financial-closing/financial-blocking',
    })
  }  
  if(ability.can('financialUnBlocking', 'application')) {
    financialClosingArr.push({
      icon: 'issuedLoans',
      header: local.financialUnblocking,
      desc: local.companyUnblocking,
      path: '/financial-closing/financial-unblocking',
    })
  }
  return financialClosingArr
}
