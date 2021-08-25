export interface MonthlyAnalysis1 {
  totalIssuedLoansLifetime: number
  newIssuedLoansLifetime: number
  renewalIssuedLoansLifetime: number
  membersLifetime: number

  totalIssuedLoansLifetimePrincipals: number
  newIssuedLoansLifetimePrincipals: number
  renewalIssuedLoansLifetimePrincipals: number

  totalIssuedLoans: number
  newIssuedLoans: number
  renewalIssuedLoans: number
  members: number

  totalIssuedLoansPrincipals: number
  newIssuedLoansPrincipals: number
  renewalIssuedLoansPrincipals: number

  writtenOffLoans: number
  writtenOffLoansPrincipal: number
  paidBeforeWrittenOff: number
  paidAfterWrittenOff: number
  allSystemCustomers: number
  averageCustomersWithLoanPerOfficer: number
  customersTookLoans: number
  memberCustomersTookLoans: number
  averageLoansPerOfficer: number
  activeLoanCustomers: number
  memberActiveLoanCustomers: number
  averageNewLoansPerOfficer: number
  totalIssuedLoanOfficers: number
  averageRenewalLoansPerOfficer: number
  IssuedLoanOfficers: number
  averageLoanPrincipal: number
  maleIssuedLoanOfficers: number
  averageLoanPrincipalNew: number
  femaleIssuedLoanOfficers: number
  averageLoanPrincipalRenewal: number
  averageInstallments: number
  wallet: number
  totalPaidPenaltiesLastMonth: number
  pastMonthPaidFees: number
  totalPaidPenaltiesCurrentMonth: number
  currentMonthPaidFees: number
  branches: number
  femalesUnder3000: number
  paidPercentage: number
  currentMonthPaidPercentage: number
  latePercentage: number
  issuedLoanGrowth: number
  issuedLoanGrowthPrincipal: number
}

export interface MonthlyAnalysis2 {
  principal0to3kCount: number
  principal0to3kCountPercentage: number
  principal0to3kPrincipal: number
  principal0to3kPrincipalPercentage: number

  principal3kto5kCount: number
  principal3kto5kCountPercentage: number
  principal3kto5kPrincipal: number
  principal3kto5kPrincipalPercentage: number

  principal5kto10kCount: number
  principal5kto10kCountPercentage: number
  principal5kto10kPrincipal: number
  principal5kto10kPrincipalPercentage: number

  principal10kto50kCount: number
  principal10kto50kCountPercentage: number
  principal10kto50kPrincipal: number
  principal10kto50kPrincipalPercentage: number

  principalGreaterThan50kCount: number
  principalGreaterThan50kCountPercentage: number
  principalGreaterThan50kPrincipal: number
  principalGreaterThan50kPrincipalPercentage: number

  genderNotApplicable: number
  genderNotApplicableCountPercentage: number
  genderNotApplicablePrincipal: number
  genderNotApplicablePrincipalPercentage: number

  male: number
  maleCountPercentage: number
  malePrincipal: number
  malePrincipalPercentage: number

  female: number
  femalePrincipal: number
  femaleCountPercentage: number
  femalePrincipalPercentage: number

  sectorNotApplicable: number
  sectorNotApplicablePrincipal: number
  sectorNotApplicablePecentage: number
  sectorNotApplicablePrincipalPecentage: number

  commercialSector: number
  commercialSectorCountPercentage: number
  commercialSectorPrincipal: number
  commercialSectorPrincipalPercentage: number

  productionSector: number
  productionSectorCountPercentage: number
  productionSectorPrincipal: number
  productionSectorPrincipalPercentage: number

  serviceSector: number
  serviceSectorPrincipal: number
  serviceSectorCountPercentage: number
  serviceSectorPrincipalPercentage: number

  agricultureSector: number
  agricultureSectorPrincipal: number
  agricultureSectorCountPercentage: number
  agricultureSectorPrincipalPercentage: number
}

export interface MonthlyAnalysisReportProps {
  date: string
  monthlyAnalysis1: MonthlyAnalysis1
  monthlyAnalysis2: MonthlyAnalysis2
  monthlyAnalysis2Members: MonthlyAnalysis2
}
