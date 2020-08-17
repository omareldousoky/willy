import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const loanCreationValidation = Yup.object().shape({
    loanCreationDate: Yup.string().test("Should not be before acceptance date", local.creationDateCannotBeBeforeAcceptanceDate,
        function (this: any, value: string) {
            const { approvalDate } = this.parent;
            return (new Date(value).valueOf() >= approvalDate)
        }
    ).required(local.required)
})

export const loanIssuanceValidation = Yup.object().shape({
    loanIssuanceDate: Yup.string().test("Should not be before creation date", local.issuanceDateCannotBeBeforeCreationDate,
        function (this: any, value: string) {
            const { loanCreationDate } = this.parent;
            return (new Date(value).valueOf() >= loanCreationDate)
        }
    ).required(local.required),
    fieldManagerId: Yup.string().required(local.required)
})