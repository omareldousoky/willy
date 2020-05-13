import * as Yup from 'yup';
import { Customer, Results } from './loanApplicationCreation';
import * as local from './../../../Shared/Assets/ar.json';
export interface Vice {
    name: string;
    phoneNumber: string;
}
interface Guarantor {
    searchResults: Results;
    guarator: Customer;
}
export interface Application {
    customerID: string;
    customerName: string;
    customerCode: string;
    nationalId: string;
    birthDate: string;
    gender: string;
    nationalIdIssueDate: string;
    businessSector: string;
    businessActivity: string;
    businessSpeciality: string;
    permanentEmployeeCount: string;
    partTimeEmployeeCount: string;
    productID: string;
    calculationFormulaId: string;
    currency: string;
    interest: number;
    interestPeriod: string;
    allowInterestAdjustment: boolean;
    minPrincipal: number;
    maxPrincipal: number;
    minInstallment: number;
    maxInstallment: number;
    inAdvanceFees: number;
    inAdvanceFrom: string;
    inAdvanceType: string;
    periodLength: number;
    periodType: string;
    gracePeriod: number;
    principal: number;
    pushPayment: number;
    noOfInstallments: number;
    applicationFee: number;
    individualApplicationFee: number;
    applicationFeePercent: number;
    applicationFeeType: string;
    applicationFeePercentPerPerson: number;
    representativeFees: number;
    allowRepresentativeFeesAdjustment: boolean;
    stamps: number;
    allowStampsAdjustment: boolean;
    adminFees: number;
    allowAdminFeesAdjustment: boolean;
    entryDate: string;
    usage: string;
    representative: string;
    enquirorId: string;
    visitationDate: string;
    guarantorIds: Array<string>;
    viceCustomers: Array<Vice>;
    applicationFeePercentPerPersonType: string;
    state?: string;
    id?: string;
    reviewedDate: any;
    undoReviewDate: any;
    rejectionDate: any;
    noOfGuarantors: number;
    guarantors: Array<Guarantor>;
}
export const LoanApplicationValidation = Yup.object().shape({
    productID: Yup.string().required(local.required),
    calculationFormulaId: Yup.string().required(local.required),
    interest: Yup.number().moreThan(0, "Can't be 0 or less").max(100, "Can't be more than 100").required(local.required),
    interestPeriod: Yup.string().required(local.required),
    inAdvanceFees: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required(local.required),
    inAdvanceFrom: Yup.string().required(local.required),
    inAdvanceType: Yup.string().required(local.required),
    minPrincipal: Yup.number(),
    maxPrincipal: Yup.number(),
    minInstallment: Yup.number(),
    maxInstallment: Yup.number(),
    periodLength: Yup.number().integer('Must be int').min(1, "Can't be less than 1").required(local.required),
    periodType: Yup.string().required(local.required),
    gracePeriod: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required(local.required),
    pushPayment: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required(local.required),
    noOfInstallments: Yup.number().integer('Must be int').min(1, "Can't be less than 1").required(local.required),
    principal: Yup.number().min(Yup.ref('minPrincipal'), 'Value should be greater than min').max(Yup.ref('maxPrincipal'), 'Value should be less than max').required(local.required),
    applicationFee: Yup.number().min(0, "Can't be less than 0").required(local.required),
    individualApplicationFee: Yup.number().min(0, "Can't be less than 0").required(local.required),
    applicationFeePercent: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required(local.required),
    applicationFeeType: Yup.string().required(local.required),
    applicationFeePercentPerPerson: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required(local.required),
    applicationFeePercentPerPersonType: Yup.string().required(local.required),
    representativeFees: Yup.number().min(0, "Can't be less than 0").required(local.required),
    stamps: Yup.number().min(0, "Can't be less than 0").required(local.required),
    adminFees: Yup.number().min(0, "Can't be less than 0").required(local.required),
    entryDate: Yup.date().test(
        "Min Date", "Can't Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true }
    ).required(local.required),
    usage: Yup.string().required(local.required),
    enquirorId: Yup.string().required(local.required),
    visitationDate: Yup.date().test(
        "Min Date", "Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() >= new Date().setHours(0, 0, 0, 0) : true }
    ).required(local.required),
    viceCustomers: Yup.array().of(
        Yup.object().shape({
            name: Yup.string(),
            phoneNumber: Yup.string().min(10).max(11)
        })
    ),
});
export const ReviewLoanValidation = Yup.object().shape({
    reviewStatus: Yup.string().required(local.required),
    reviewDate: Yup.date().test(
        "Date should be smaller than entry date", local.reviewDateCannotBeBeforeEntryDate,
        function (this: any, value: any) {
            const { entryDate } = this.parent;
            console.log(new Date(entryDate).valueOf(), entryDate, new Date(value).valueOf())
            return value ? new Date(value).setHours(23, 59, 0, 0).valueOf() >= new Date(entryDate).valueOf() : true
        }
    ).test("Min Date", local.dateShouldBeBeforeToday,
        (value: any) => {
            return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true
        }
    ).required(local.required),
})
export const UnReviewLoanValidation = Yup.object().shape({
    unreviewStatus: Yup.string().required(local.required),
    unreviewDate: Yup.date().test(
        "Min Date", local.UnreviewDateCannotBeForeReviewDate,
        function (this: any, value: any) {
            const { reviewedDate } = this.parent;
            return value ? new Date(value).setHours(23, 59, 0, 0).valueOf() >= new Date(reviewedDate).valueOf() : true
        }
    ).test("Min Date", local.dateShouldBeBeforeToday,
        (value: any) => {
            return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true
        }
    ).required(local.required),
})
export const RejectLoanValidation = Yup.object().shape({
    rejectionStatus: Yup.string().required(local.required),
    rejectionReason: Yup.string().required(local.required),
    rejectionDate: Yup.date().test(
        "Min Date", local.rejectionDateCannotBeForeReviewDate,
        function (this: any, value: any) {
            const { reviewedDate } = this.parent;
            console.log(reviewedDate)
            return value ? new Date(value).setHours(23, 59, 0, 0).valueOf() >= new Date(reviewedDate).valueOf() : true
        }
    ).test("Min Date", local.dateShouldBeBeforeToday,
        (value: any) => {
            return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true
        }
    ).required(local.required),
})