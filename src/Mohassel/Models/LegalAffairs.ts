import { Signature } from './common'

interface SignatureWithNote extends Signature {
  notes?: string
}
export interface CourtSession {
  confinementNumber: string
  date: number
  decision: string
}
export interface LegalHistoryResponse {
  history: {
    _id: string
    customerId: string
    loanId: string
    customerName: string
    nationalId: string
    customerKey: number
    customerBranchId: string
    statementOfClaim: string
    status: string
    statusNumber: string
    customerType: string
    created?: Signature
    updated?: Signature
    branchManagerReview?: SignatureWithNote
    areaSupervisorReview?: SignatureWithNote
    areaManagerReview?: SignatureWithNote
    financialManagerReview?: SignatureWithNote
    caseNumber: string
    caseStatus: string
    caseStatusSummary: string
    court: string
    active: true
    loanKey: number
    finalConfinementNumber: string
    finalVerdict: string
    finalVerdictDate: number
    misdemeanorAppealNumber: string
    firstCourtSession?: CourtSession
    misdemeanorAppealSession: CourtSession
    oppositionSession?: CourtSession
    oppositionAppealSession?: CourtSession
  }[]
}
