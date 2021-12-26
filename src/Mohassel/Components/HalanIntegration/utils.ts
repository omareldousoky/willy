import { Tab } from 'Shared/Components/HeaderWithCards/headerWithCards'
import local from 'Shared/Assets/ar.json'

export const leadsTabs: Tab[] = [
  {
    icon: 'user',
    header: local.microLeads,
    desc: local.createAndEditApplicantLeads,
    path: '/halan-integration/leads',
    stringKey: 'micro',
  },
  {
    icon: 'user',
    header: local.nanoLeads,
    desc: local.createAndEditApplicantLeads,
    path: '/halan-integration/leads',
    stringKey: 'nano',
  },
]

export const statusClasses = {
  approved: 'paid',
  rejected: 'late',
  'in-review': 'under-review',
  submitted: 'rescheduled',
}
export const getLeadStatus = (status: string) => {
  switch (status) {
    case 'submitted':
      return local.submitted
    case 'in-review':
      return local.underReview
    case 'approved':
      return local.approved
    case 'rejected':
      return local.rejected
    default:
      return ''
  }
}

export const REJECTION_REASONS = [
  'العميل تحت السن المسموح به',
  'التمويل بمبلغ اكتر بالمسموح به',
  'العميل محتاج القرض بدون ضمانات',
  'العميل لا يمتلك مشروع',
  'اخري',
]
