import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'

function getMaxDate(selectedReviewedLoans) {
  let maxDate = 0
  selectedReviewedLoans.forEach((loan) => {
    if (loan.application.secondReviewDate) {
      if (loan.application.secondReviewDate > maxDate) {
        maxDate = loan.application.secondReviewDate
      }
    } else if (loan.application.reviewedDate > maxDate) {
      maxDate = loan.application.reviewedDate
    }
  })
  return maxDate
}
export const bulkApplicationReviewValidation = Yup.object().shape({
  date: Yup.string()
    .test(
      'Should not be before acceptance date',
      local.signedDateCannotBeBeforeReviewDate,
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
  action: Yup.string().required(local.required),
})
