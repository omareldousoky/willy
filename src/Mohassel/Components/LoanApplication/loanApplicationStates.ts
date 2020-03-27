import * as Yup from 'yup';

export const LoanApplication: any = {
    customerName: '',
    customerCode:'',
    nationalId: '',
    birthDate: '',
    gender: '',
    nationalIdIssueDate: '',
    businessSector: '',
    businessActivity: '',
    businessSpeciality: '',
    permanentEmployeeCount: '',
    partTimeEmployeeCount: '',
    productName:'',
    calculationFormulaId:'',
    currency:'egp',
    interest:0,
    interestPeriod:'yearly',
    inAdvanceFees:0,
    inAdvanceFrom:'principal',
    periodLength:14,
    periodType:'days',
    gracePeriod:0,
    pushPayment:0,
    noOfInstallments:0,
    principal:0,
    applicationFee:0,
    individualApplicationFee:0,
    applicationFeePercent:0,
    applicationFeeType:'principal',
    applicationFeePercentPerPerson:0,
    applicationFeePercentPerPersonType:'principal',
    representativeFees:0,
    allowRepresentativeFeesAdjustment:true,
    stamps:0,
    allowStampsAdjustment:true,
    adminFees:0,
    allowAdminFeesAdjustment:true,
    entryDate: '',
    usage: '',
    representativeId: '',
    enquirorId: '',
    visitationDate: '',
    guarantors:[]
}
export const LoanApplicationValidation = Yup.object().shape({
})