import * as local from '../../../Shared/Assets/ar.json'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import ability from '../../config/ability'

export const manageApplicationsArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getLoanApplication', 'application')) {
    manageLoanArr.push({
      icon: 'applications',
      header: local.loanApplications,
      desc: local.individuals,
      path: '/track-loan-applications',
    })
  }
  if (
    ability.can('secondReview', 'application') ||
    ability.can('thirdReview', 'application')
  ) {
    manageLoanArr.push({
      icon: 'bulkLoanApplicationsReview',
      header: local.bulkLoanApplicationReviews,
      desc: local.individuals,
      path: '/track-loan-applications/bulk-reviews',
    })
  }
  if (ability.can('approveLoanApplication', 'application')) {
    manageLoanArr.push({
      icon: 'bulkLoanApplicationsApproval',
      header: local.bulkLoanApplicationsApproval,
      desc: local.individuals,
      path: '/track-loan-applications/bulk-approvals',
    })
  }
  if (ability.can('createLoan', 'application')) {
    manageLoanArr.push({
      icon: 'bulkApplicationCreation',
      header: local.bulkApplicationCreation,
      desc: local.individuals,
      path: '/track-loan-applications/bulk-creation',
    })
  }
  return manageLoanArr
}

export const manageSMEApplicationsArray = (): Card[] => {
  const manageLoanArr: Card[] = []
  if (ability.can('getLoanApplication', 'application')) {
    manageLoanArr.push({
      icon: 'applications',
      header: local.loanApplications,
      desc: local.companies,
      path: { pathname: '/track-loan-applications', state: { sme: true } },
    })
  }
  if (
    ability.can('secondReview', 'application') ||
    ability.can('thirdReview', 'application')
  ) {
    manageLoanArr.push({
      icon: 'bulkLoanApplicationsReview',
      header: local.bulkLoanApplicationReviews,
      desc: local.companies,
      path: {
        pathname: '/track-loan-applications/bulk-reviews',
        state: { sme: true },
      },
    })
  }
  if (ability.can('approveLoanApplication', 'application')) {
    manageLoanArr.push({
      icon: 'bulkLoanApplicationsApproval',
      header: local.bulkLoanApplicationsApproval,
      desc: local.companies,
      path: {
        pathname: '/track-loan-applications/bulk-approvals',
        state: { sme: true },
      },
    })
  }
  if (ability.can('createLoan', 'application')) {
    manageLoanArr.push({
      icon: 'bulkApplicationCreation',
      header: local.bulkApplicationCreation,
      desc: local.companies,
      path: {
        pathname: '/track-loan-applications/bulk-creation',
        state: { sme: true },
      },
    })
  }
  return manageLoanArr
}
