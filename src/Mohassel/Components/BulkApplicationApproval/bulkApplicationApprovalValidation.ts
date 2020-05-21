import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

function getMaxDate(selectedReviewedLoans){
    let maxDate = 0;
    selectedReviewedLoans.forEach(loan => {
        if(loan.application.reviewedDate > maxDate){
            maxDate = loan.application.reviewedDate;
        }
    });
    return maxDate;
}
export const bulkApplicationApprovalValidation = Yup.object().shape({
    approvalDate: Yup.string()
    .test("Should not be before acceptance date", local.approvalDateShouldNotBeSmallerThanReviewedDate,
        function (this: any, value: string) {
            const { selectedReviewedLoans } = this.parent;
            const date = new Date(value).valueOf();
            return getMaxDate(selectedReviewedLoans) <= date
        }
    ).required(local.required),
    fundSource: Yup.string().required(local.required),
})