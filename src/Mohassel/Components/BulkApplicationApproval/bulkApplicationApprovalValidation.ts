import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'

function getMaxDate(selectedReviewedLoans) {
  let maxDate = 0
  selectedReviewedLoans.forEach((loan) => {
    if (loan.application.thirdReviewDate > maxDate) {
      maxDate = loan.application.thirdReviewDate
    }
  })
  return maxDate
}
export const bulkApplicationApprovalValidation = Yup.object().shape({
  approvalDate: Yup.string()
    .test(
      'Should not be before acceptance date',
      local.allDatesShouldSameMonth,
      function (this: any, value: string) {
        const todaysDate = new Date().getMonth()
        const creationDate = new Date(value).getMonth()
        return todaysDate === creationDate
      }
    )
    .test(
      'Should all be in the same month',
      local.reviewDateCannotBeBeforeApprovalDate,
      function (this: any, value: string) {
        const { selectedReviewedLoans } = this.parent
        const date = new Date(value).valueOf()
        return (
          timeToDateyyymmdd(getMaxDate(selectedReviewedLoans)) <=
          timeToDateyyymmdd(date)
        )
      }
    )
    .required(local.required),
  fundSource: Yup.string().required(local.required),
})
