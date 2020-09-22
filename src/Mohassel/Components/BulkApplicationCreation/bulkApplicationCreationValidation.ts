import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

function getMaxDate(selectedApplications) {
    let maxDate = 0;
    selectedApplications.forEach(application => {
        if (application.application.approvalDate > maxDate) {
            maxDate = application.application.approvalDate;
        }
    });
    console.log(maxDate, selectedApplications)
    return maxDate;
}

export const bulkApplicationCreationValidation = Yup.object().shape({
    creationDate: Yup.string()
        .test("Creation date should be in the same month", local.creationDateShouldBeInTheSameMonth,
            function (this: any, value: string) {
                const todaysDate = new Date().getMonth();
                const creationDate = new Date(value).getMonth();
                return (todaysDate === creationDate)
            }
        ).test("Should not be before acceptance date", local.reviewDateShouldNotBeSmallerThanCreationDate,
            function (this: any, value: string) {
                const { selectedApplications } = this.parent;
                const date = new Date(value).valueOf();
                return getMaxDate(selectedApplications) <= date
            }
        )
        .required(local.required)
})