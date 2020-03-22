import * as Yup from 'yup';

export const LoanProduct: any = {
    productName:'',
    calculationFormulaId:'5e7355c2f688997a4265b15c',
    loanNature:'cash',
    currency:'egp',
    periodLength:14,
    periodType:'days',
    noOfInstallments:20,
    lateDays:0,
    gracePeriod:0,
    interest:0,
    interestPeriod:'yearly',
    allowInterestAdjustment:false,
    inAdvanceFees:0,
    inAdvanceFrom:'principal',
    inAdvanceType:'uncut',
    stamps:0,
    allowStampsAdjustment:true,
    representativeFees:0,
    allowRepresentativeFeesAdjustment:false,
    adminFees:0,
    allowAdminFeesAdjustment:false,
    earlyPaymentFees:0,
    maxNoOfRestructuring:0,
    minPrincipal:0,
    maxPrincipal:0,
    minInstallment:0,
    maxInstallment:0,
    applicationFee:0,
    allowApplicationFeeAdjustment:false,
    spreadApplicationFee:false,
    individualApplicationFee:0,
    applicationFeePercent:0,
    applicationFeeType:'principal',
    applicationFeePercentPerPerson:0,
    applicationFeePercentPerPersonType:'principal',
    loanImpactPrincipal:true,
    mustEnterGuarantor:false,
    guarantorGuaranteesMultiple:false,
    deductionFee:0,
    allocatedDebtForGoodLoans:0,
    aging:[{from:0,to:1,fee:0},{from:0,to:1,fee:0},{from:0,to:1,fee:0},{from:0,to:1,fee:0},{from:0,to:1,fee:0},{from:0,to:1,fee:0},{from:0,to:1,fee:0}],
    mergeUndoubtedLoans:false,
    mergeUndoubtedLoansFees:0,
    mergeDoubtedLoans:false,
    mergeDoubtedLoansFees:0,
    pushPayment:0,
    pushDays:[0,0,0,0,0,0,0],
    pushHolidays:'previous',
    enabled:true,
    viceFieldManagerAndDate:true,
    reviewerChiefAndDate:true,
    branchManagerAndDate:true,
}
export const LoanProductValidation = Yup.object().shape({
    productName: Yup.string().required('required!'),
    // password: Yup.string().required('required!')
})