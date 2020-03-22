import * as Yup from 'yup';
const date = new Date();
export interface Formula {
    loanCalculationFormulaName: string;
    interestType: string;
    installmentType: string;
    gracePeriodFees: boolean;
    rounding: boolean;
    roundDirection: string;
    roundTo: string;
    roundWhat: string;
    equalInstallments: boolean;
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
    roundTo: '1',
    roundWhat: 'principal',
    equalInstallments: true
}
export const loanFormulaTest: FormulaTestClass = {
    calculationFormulaId: '',
    principal: 10000,
    pushPayment:0,
    noOfInstallments:12,
    gracePeriod:0,
    periodLength:1,
    periodType:'months',
    interest:30,
    interestPeriod:'yearly',
    adminFees:20,
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
    roundTo: Yup.string().required('required!'),
    roundWhat: Yup.string().required('required!'),
    equalInstallments: Yup.boolean()
})
export const loanFormulaTestValidation = Yup.object().shape({
    calculationFormulaId:Yup.string().required('required!'),
    principal: Yup.number().min(1,"Can't be less than 1").required('required!'),
    pushPayment: Yup.number().min(0,"Can't be less than zero"),
    noOfInstallments:Yup.number().min(0,"Can't be less than zero").required('required!'),
    gracePeriod:Yup.number().min(0,"Can't be less than zero"),
    periodLength:Yup.number().min(1,"Can't be less than 1").required('required!'),
    periodType:Yup.string().required('required!'),
    interest:Yup.number().min(0,"Can't be less than zero").required('required!'),
    interestPeriod:Yup.string().required('required!'),
    adminFees:Yup.number().min(0,"Can't be less than zero").required('required!'),
    loanStartDate: Yup.date().test(
        "Min Date", "Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() >= new Date().setHours(0, 0, 0, 0) : true }
    ).required('required!'),
    pushHolidays: Yup.string().required('required!'),
    inAdvanceFees:Yup.number().min(0,"Can't be less than zero"),
    inAdvanceFrom:Yup.string(),
    inAdvanceType:Yup.string()
})