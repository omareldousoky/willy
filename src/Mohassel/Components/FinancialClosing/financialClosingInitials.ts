import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { Tab } from '../HeaderWithCards/headerWithCards'
export const financialClosingArray = (): Tab[] => {
  const financialClosingArr: Tab[] = []
  if (ability.can('financialClosing', 'application')) {
    financialClosingArr.push({
      icon: 'roles',
      header: local.bulkClosing,
      desc: local.bulkClosing,
      path: '/financial-closing/bulk-closing',
    })
  }
  if (true) { // TODO: add permissions
    financialClosingArr.push({
      icon: 'assignProductToBranch',
      header: local.financialBlocking,
      desc: local.financialBlocking,
      path: '/financial-closing/financial-blocking',
    })
  }
  return financialClosingArr
}
