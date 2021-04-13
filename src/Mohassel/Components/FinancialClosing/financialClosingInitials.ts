import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { Tab } from '../HeaderWithCards/headerWithCards'
export const financialClosingArray = (): Tab[] => {
  const financialClosingArr: Tab[] = []
  if (ability.can('financialBlocking', 'application')|| ability.can('financialUnBlocking', 'application')) {
    financialClosingArr.push({
      icon: 'blocking',
      header: local.financialBlocking,
      path: '/financial-closing/lts-blocking',
    })
  }
  if(ability.can('summarizeTransactions','oracleIntegration')){
    financialClosingArr.push({
      icon: 'bulkLoanApplicationsReview',
      header: local.oracleReports,
      path: '/financial-closing/lts-review-oracle'
    })
  }
  if (ability.can('financialClosing', 'application')) {
    financialClosingArr.push({
      icon: 'assignProductToBranch',
      header: local.financialClosing,
      path: '/financial-closing/lts-closing',
    })
  }
  return financialClosingArr
}
