import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

export const manageApplicationsArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getLoanApplication', 'application')) {
    manageLoanArr.push({
      icon: 'applications',
      header: local.loanApplications,
      desc: local.loanApplications,
      path: '/track-loan-applications',
    })
  }
  if (
    ability.can('secondReview', 'application') ||
    ability.can('thirdReview', 'application')
  ) {
    manageLoanArr.push({
      icon: 'bulk-loan-applications-review',
      header: local.bulkLoanApplicationReviews,
      desc: local.bulkLoanApplicationReviews,
      path: '/track-loan-applications/bulk-reviews',
    })
  }
  if (ability.can('approveLoanApplication', 'application')) {
    manageLoanArr.push({
      icon: 'bulk-loan-applications-approval',
      header: local.bulkLoanApplicationsApproval,
      desc: local.bulkLoanApplicationsApproval,
      path: '/track-loan-applications/bulk-approvals',
    })
  }
  if (ability.can('createLoan', 'application')) {
    manageLoanArr.push({
      icon: 'bulk-application-creation',
      header: local.bulkApplicationCreation,
      desc: local.bulkApplicationCreation,
      path: '/track-loan-applications/bulk-creation',
    })
  }
  return manageLoanArr
}
