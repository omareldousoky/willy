import * as local from '../../../Assets/ar.json'

export const moneyPlaceholder = '٠.٠٠'
export const numPlaceholder = '٠'
export const stringPlaceholder = 'لا يوجد'

export const loanStatusLocal = {
  unpaid: local.unpaid,
  pending: local.pending,
  paid: local.paid,
  partiallyPaid: local.partiallyPaid,
  rescheduled: local.rescheduled,
  cancelled: local.cancelled,
  canceled: local.cancelled,
  issued: local.issued,
  created: local.created,
  underReview: local.underReview,
  reviewed: local.reviewed,
  secondReview: local.secondReviewed,
  thirdReview: local.thirdReviewed,
  approved: local.approved,
  writtenOff: local.writtenOffLoan,
  Doubtful: local.doubtedLoan,
  // eslint-disable-next-line @typescript-eslint/camelcase
  doubt_cancelled: local.cancelled,
  rejected: local.rejected,
  default: '',
}
