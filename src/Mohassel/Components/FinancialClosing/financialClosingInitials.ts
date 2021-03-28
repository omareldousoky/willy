import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { Tab } from '../HeaderWithCards/headerWithCards'
export const financialClosingArray = (): Tab[] => {
  const financialClosingArr: Tab[] = []
  if (ability.can('financialClosing', 'application')) {
    financialClosingArr.push({
      icon: 'roles',
      header: local.financialClosing,
      desc: local.ltsClosing,
      path: '/financial-closing/lts-closing',
    })
  }
  if (ability.can('financialBlocking', 'application')) {
    financialClosingArr.push({
      icon: 'assignProductToBranch',
      header: local.financialBlocking,
      desc: local.ltsBlocking,
      path: '/financial-closing/financial-blocking',
    })
  }  
  if(ability.can('financialUnBlocking', 'application')) {
    financialClosingArr.push({
      icon: 'issuedLoans',
      header: local.financialUnblocking,
      desc: local.ltsUnblocking,
      path: '/financial-closing/financial-unblocking',
    })
  }
  return financialClosingArr
}
