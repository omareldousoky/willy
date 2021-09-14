import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../../Shared/config/ability'

export const manageLoansArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getLoanProduct', 'product')) {
    manageLoanArr.push({
      icon: 'loan-products',
      header: local.loanProducts,
      desc: local.loanProductsDesc,
      path: '/manage-loans/loan-products',
    })
  }
  if (ability.can('getCalculationFormula', 'product')) {
    manageLoanArr.push({
      icon: 'calculation-formulas',
      header: local.calculationForumlas,
      desc: local.calculationForumlasDesc,
      path: '/manage-loans/calculation-formulas',
    })
  }
  if (ability.can('testCalculate', 'product')) {
    manageLoanArr.push({
      icon: 'calculation-method',
      header: local.testCalculationMethod,
      desc: local.testCalculationMethodDesc,
      path: '/manage-loans/test-formula',
    })
  }
  // if (ability.can('assignProductToBranch', 'product')) {
  //   manageLoanArr.push({
  //     icon: 'assign-product-to-branch',
  //     header: local.assignProductToBranch,
  //     desc: local.assignProductToBranch,
  //     path: '/manage-loans/assign-products-branches',
  //   })
  // }
  return manageLoanArr
}
