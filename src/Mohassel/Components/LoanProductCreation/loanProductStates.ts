import * as Yup from 'yup';

export const LoanProductValidation = Yup.object().shape({
    productName: Yup.string().required('required!'),
    beneficiaryType: Yup.string().required('required!'),
    calculationFormulaId: Yup.string().required('required!'),
    periodLength: Yup.number().integer('Must be int').min(1, "Can't be less than 1").required('required!'),
    noOfInstallments: Yup.number().integer('Must be int').min(0, "Can't be less than 0").test("noOfInstallments", `outOfRange`,
        function (this: any, value: any) {
            const { minInstallment, maxInstallment } = this.parent
            if (minInstallment === 0 && maxInstallment === 0) {
                return true
            } else {
                return (value >= minInstallment && value <= maxInstallment)
            }
        }).required('required!'),
    lateDays: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required('required!'),
    gracePeriod: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required('required!'),
    interest: Yup.number().moreThan(0, "Can't be less than zero").max(100, "Can't be more than 100").required('required!'),
    inAdvanceFees: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    stamps: Yup.number().min(0, "Can't be less than 0").required('required!'),
    representativeFees: Yup.number().min(0, "Can't be less than 0").required('required!'),
    adminFees: Yup.number().min(0, "Can't be less than 0").required('required!'),
    earlyPaymentFees: Yup.number().min(0, "Can't be less than 0").required('required!'),
    maxNoOfRestructuring: Yup.number().integer('Must be int').min(0, "Can't be less than 0").required('required!'),
    minPrincipal: Yup.number().min(0, "Can't be less than 0").required('required!'),
    maxPrincipal: Yup.number().min(Yup.ref('minPrincipal'), `Max should be greater than ${Yup.ref('minPrincipal')}`).required('required!'),
    minInstallment: Yup.number().min(0, "Can't be less than 0").required('required!'),
    maxInstallment: Yup.number().min(Yup.ref('minInstallment'), 'Max should be greater than min').required('required!'),
    applicationFee: Yup.number().min(0, "Can't be less than 0").required('required!'),
    individualApplicationFee: Yup.number().min(0, "Can't be less than 0").required('required!'),
    applicationFeePercent: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    applicationFeePercentPerPerson: Yup.number().min(0, "Can't be less than 0").max(100, "Can't be more than 100").required('required!'),
    loanNature: Yup.string().required('required!'),
    currency: Yup.string().required('required!'),
    periodType: Yup.string().required('required!'),
    interestPeriod: Yup.string().required('required!'),
    inAdvanceFrom: Yup.string().required('required!'),
    inAdvanceType: Yup.string().required('required!'),
    applicationFeeType: Yup.string().required('required!'),
    applicationFeePercentPerPersonType: Yup.string().required('required!'),
    pushHolidays: Yup.string().required('required!'),
    allowInterestAdjustment: Yup.boolean().required('required!'),
    allowStampsAdjustment: Yup.boolean().required('required!'),
    allowRepresentativeFeesAdjustment: Yup.boolean().required('required!'),
    allowAdminFeesAdjustment: Yup.boolean().required('required!'),
    allowApplicationFeeAdjustment: Yup.boolean().required('required!'),
    spreadApplicationFee: Yup.boolean().required('required!'),
    loanImpactPrincipal: Yup.boolean().required('required!'),
    mustEnterGuarantor: Yup.boolean().required('required!'),
    noOfGuarantors: Yup.number().integer().required('required!'),
    guarantorGuaranteesMultiple: Yup.boolean().required('required!'),
})