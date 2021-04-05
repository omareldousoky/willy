import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { Tab } from '../HeaderWithCards/headerWithCards'
export const financialClosingArray = (): Tab[] => {
  const financialClosingArr: Tab[] = []
  if (ability.can('financialBlocking', 'application')|| ability.can('financialUnBlocking', 'application')) {
    financialClosingArr.push({
      icon: 'blocking',
      header: local.financialBlocking,
      desc: local.ltsBlocking,
      path: '/financial-closing/financial-blocking',
    })
  }  
  if (ability.can('financialClosing', 'application')) {
    financialClosingArr.push({
      icon: 'assignProductToBranch',
      header: local.financialClosing,
      desc: local.ltsClosing,
      path: '/financial-closing/lts-closing',
    })
  }
  return financialClosingArr
}
