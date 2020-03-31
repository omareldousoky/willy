import * as Yup from 'yup';
const date = new Date();

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
    entryDate: Date|string;
    usage: string;
    representative: string;
    enquirorId: string;
    visitationDate: Date|string;
    guarantorIds: Array<string>;
    viceCustomers: Array<Vice>;
    applicationFeePercentPerPersonType: string;
}

export const LoanApplication: Application = {
    customerID: '',
    customerName: '',
    customerCode: '',
    nationalId: '',
    birthDate: '',
    gender: '',
    nationalIdIssueDate: '',
    businessSector: '',
    businessActivity: '',
    businessSpeciality: '',
    permanentEmployeeCount: '',
    partTimeEmployeeCount: '',
    productID: '',
    calculationFormulaId: '',
    currency: 'egp',
    interest: 0,
    interestPeriod: 'yearly',
    inAdvanceFees: 0,
    inAdvanceFrom: 'principal',
    inAdvanceType: 'uncut',
    periodLength: 1,
    periodType: 'days',
    gracePeriod: 0,
    pushPayment: 0,
    noOfInstallments: 1,
    principal: 0,
    applicationFee: 0,
    individualApplicationFee: 0,
    applicationFeePercent: 0,
    applicationFeeType: 'principal',
    applicationFeePercentPerPerson: 0,
    applicationFeePercentPerPersonType: 'principal',
    representativeFees: 0,
    allowRepresentativeFeesAdjustment: true,
    stamps: 0,
    allowStampsAdjustment: true,
    adminFees: 0,
    allowAdminFeesAdjustment: true,
    entryDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0],
    usage: '',
    representative: '',
    enquirorId: '',
    visitationDate: '',
    guarantorIds: [],
    viceCustomers: []
}
export const LoanApplicationValidation = Yup.object().shape({
    productID: Yup.string().required('required!'),
    calculationFormulaId: Yup.string().required('required!'),
    interest: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    interestPeriod: Yup.string().required('required!'),
    inAdvanceFees: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    inAdvanceFrom: Yup.string().required('required!'),
    inAdvanceType: Yup.string().required('required!'),
    periodLength: Yup.number().min(1, "Can't be less than 1").required('required!'),
    periodType: Yup.string().required('required!'),
    gracePeriod: Yup.number().min(0, "Can't be less than 0").required('required!'),
    pushPayment: Yup.number().min(0, "Can't be less than 0").required('required!'),
    noOfInstallments: Yup.number().min(1, "Can't be less than 1").required('required!'),
    principal: Yup.number().min(0, "Can't be less than 0").required('required!'),
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