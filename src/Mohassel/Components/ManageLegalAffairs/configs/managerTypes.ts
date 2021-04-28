import local from '../../../../Shared/Assets/ar.json'

const managerTypes = [
  {
    value: 'branchManagerReview',
    text: local.branchManagerReview,
    permission: 'branchManagerReview',
    key: 'legal',
  },
  {
    value: 'areaManagerReview',
    text: local.areaManagerReview,
    permission: 'areaManagerReview',
    key: 'legal',
  },
  {
    value: 'areaSupervisorReview',
    text: local.areaSupervisorReview,
    permission: 'areaSupervisorReview',
    key: 'legal',
  },
  {
    value: 'financialManagerReview',
    text: local.financialManagerReview,
    permission: 'financialManagerReview',
    key: 'legal',
  },
]

export default managerTypes
