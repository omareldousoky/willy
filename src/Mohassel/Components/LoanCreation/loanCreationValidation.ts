import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

export const loanCreationValidation = Yup.object().shape({
    loanCreationDate: Yup.string().test(
        "Max Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }
    ).test("Should not be before acceptance date", local.creationDateCannotBeBeforeAcceptanceDate,
        function (this: any, value: string) {
            const { approvalDate } = this.parent;
            return (new Date(value).valueOf() >= approvalDate)
        }
    ).required(local.required)
})

export const loanIssuanceValidation = Yup.object().shape({
    loanIssuanceDate: Yup.string().test(
        "Max Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }
    ).test("Should not be before creation date", local.issuanceDateCannotBeBeforeCreationDate,
    function (this: any, value: string) {
        const { loanCreationDate } = this.parent;
        return (new Date(value).valueOf() >= loanCreationDate)
    }
).required(local.required)
})