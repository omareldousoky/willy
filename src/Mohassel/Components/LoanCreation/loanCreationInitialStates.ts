import * as Yup from 'yup';
const date = new Date();

export const loanFormula: any = {
    loanCalculationFormulaName: '',
    interestType: '1',
    installmentType: '0',
    gracePeriodFees: false,
    rounding: true,
    roundDirection: false,
    roundTo: '1.000',
    roundWhat: '1',
    equalInstallments: false
}
export const loanFormulaTest: any = {
    principal: 1,
    pushPayment:0,
    noOfInstallments:0,
    gracePeriod:0,
    periodLength:1,
    periodType:'months',
    interest:0,
    interestPeriod:'yearly',
    adminFees:0,
    loanStartDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
    .toISOString()
    .split("T")[0],
    pushHolidays:'previous',
    inAdvanceFees:0,
    inAdvanceFrom:'0',
    inAdvanceType:'1'
}
export const loanFormulaCreationValidation = Yup.object().shape({
    loanCalculationFormulaName: Yup.string().trim().max(100, "Can't be more than 100 characters").required('required!'),
    interestType: Yup.string().required('required!'),
    installmentType: Yup.string().required('required!'),
    gracePeriodFees: Yup.boolean(),
    rounding: Yup.boolean(),
    roundDirection: Yup.boolean(),
    roundTo: Yup.string().required('required!'),
    roundWhat: Yup.string().required('required!'),
    equalInstallments: Yup.boolean()
})
export const loanFormulaTestValidation = Yup.object().shape({
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