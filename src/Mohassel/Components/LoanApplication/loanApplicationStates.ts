import * as Yup from 'yup';

export interface Vice {
    name: string;
    phoneNumber: string;
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
}
export const LoanApplicationValidation = Yup.object().shape({
    productID: Yup.string().required('required!'),
    calculationFormulaId: Yup.string().required('required!'),
    interest: Yup.number().moreThan(0, "Can't be 0 or less").max(100, "Can't be more than 100").required('required!'),
    interestPeriod: Yup.string().required('required!'),
    inAdvanceFees: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    inAdvanceFrom: Yup.string().required('required!'),
    inAdvanceType: Yup.string().required('required!'),
    periodLength: Yup.number().integer('Must be int').min(1, "Can't be less than 1").required('required!'),
    periodType: Yup.string().required('required!'),
    gracePeriod: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required('required!'),
    pushPayment: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required('required!'),
    noOfInstallments: Yup.number().integer('Must be int').min(1, "Can't be less than 1").required('required!'),
    principal: Yup.number().moreThan(0, "Can't be 0 or less").required('required!'),
    applicationFee: Yup.number().min(0, "Can't be less than 0").required('required!'),
    individualApplicationFee: Yup.number().min(0, "Can't be less than 0").required('required!'),
    applicationFeePercent: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    applicationFeeType: Yup.string().required('required!'),
    applicationFeePercentPerPerson: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    applicationFeePercentPerPersonType: Yup.string().required('required!'),
    representativeFees: Yup.number().min(0, "Can't be less than 0").required('required!'),
    stamps: Yup.number().min(0, "Can't be less than 0").required('required!'),
    adminFees: Yup.number().min(0, "Can't be less than 0").required('required!'),
    entryDate: Yup.date().test(
        "Min Date", "Can't Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true }
    ).required('required!'),
    usage: Yup.string().required('required!'),
    enquirorId: Yup.string().required('required!'),
    visitationDate: Yup.date().test(
        "Min Date", "Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() >= new Date().setHours(0, 0, 0, 0) : true }
    ).required('required!'),
})