import * as Yup from 'yup';
const date = new Date();
export interface Formula {
    loanCalculationFormulaName: string;
    interestType: string;
    installmentType: string;
    gracePeriodFees: boolean;
    rounding: boolean;
    roundDirection: string;
    roundTo: number;
    roundWhat: string;
    equalInstallments: boolean;
    roundLastInstallment: boolean;
}
export interface FormulaTestClass{
    calculationFormulaId: string;
    principal: number;
    pushPayment: number;
    noOfInstallments: number;
    gracePeriod: number;
    periodLength: number;
    periodType: string;
    interest: number;
    interestPeriod: string;
    adminFees: number;
    loanStartDate: string|number;
    pushHolidays: string;
    inAdvanceFees: number;
    inAdvanceFrom: string;
    inAdvanceType: string;
}
export const loanFormula: Formula = {
    loanCalculationFormulaName: '',
    interestType: 'flat',
    installmentType: 'up',
    gracePeriodFees: false,
    rounding: true,
    roundDirection: 'up',
    roundTo: 1,
    roundWhat: 'principal',
    equalInstallments: false,
    roundLastInstallment:false
}
export const loanFormulaTest: FormulaTestClass = {
    calculationFormulaId: '',
    principal: 1,
    pushPayment:0,
    noOfInstallments:1,
    gracePeriod:0,
    periodLength:1,
    periodType:'months',
    interest:0,
    interestPeriod:'yearly',
    adminFees:0,
    loanStartDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
    .toISOString()
    .split("T")[0],
    pushHolidays:'next',
    inAdvanceFees:0,
    inAdvanceFrom:'principal',
    inAdvanceType:'cut'
}
export const loanFormulaCreationValidation = Yup.object().shape({
    loanCalculationFormulaName: Yup.string().trim().max(100, "Can't be more than 100 characters").required('required!'),
    interestType: Yup.string().required('required!'),
    installmentType: Yup.string().required('required!'),
    gracePeriodFees: Yup.boolean(),
    rounding: Yup.boolean(),
    roundDirection: Yup.string(),
    roundTo: Yup.number().moreThan(0,"Can't be 0 or less").required('required!'),
    roundWhat: Yup.string().required('required!'),
    equalInstallments: Yup.boolean(),
    roundLastInstallment: Yup.boolean()
})
export const loanFormulaTestValidation = Yup.object().shape({
    calculationFormulaId:Yup.string().required('required!'),
    principal: Yup.number().min(1,"Can't be less than 1").required('required!'),
    pushPayment: Yup.number().integer('Must be int').min(0,"Can't be less than zero").required('required!'),
    noOfInstallments:Yup.number().integer('Must be int').min(1,"Can't be less than one").required('required!'),
    gracePeriod:Yup.number().integer('Must be int').min(0,"Can't be less than zero").required('required!'),
    periodLength:Yup.number().integer('Must be int').min(1,"Can't be less than 1").required('required!'),
    periodType:Yup.string().required('required!'),
    interest:Yup.number().min(0,"Can't be less than zero").max(100,"Can't be more than 100").required('required!'),
    interestPeriod:Yup.string().required('required!'),
    adminFees:Yup.number().min(0,"Can't be less than zero").required('required!'),
    loanStartDate: Yup.date().test(
        "Min Date", "Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() >= new Date().setHours(0, 0, 0, 0) : true }
    ).required('required!'),
    pushHolidays: Yup.string().required('required!'),
    inAdvanceFees:Yup.number().min(0,"Can't be less than zero").max(100,"Can't be more than 100").required('required!'),
    inAdvanceFrom:Yup.string().required('required!'),
    inAdvanceType:Yup.string().required('required!'),
})