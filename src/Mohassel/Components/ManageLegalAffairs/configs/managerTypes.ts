import local from '../../../../Shared/Assets/ar.json'
import { ManagerReviewEnum } from '../types'

const managerTypes = [
  {
    value: ManagerReviewEnum.BranchManager,
    text: local.branchManagerReview,
    permission: ManagerReviewEnum.BranchManager,
    key: 'legal',
  },
  {
    value: ManagerReviewEnum.AreaManager,
    text: local.areaManagerReview,
    permission: ManagerReviewEnum.AreaManager,
    key: 'legal',
  },
  {
    value: ManagerReviewEnum.AreaSupervisor,
    text: local.areaSupervisorReview,
    permission: ManagerReviewEnum.AreaSupervisor,
    key: 'legal',
  },
  {
    value: ManagerReviewEnum.FinancialManager,
    text: local.financialManagerReview,
    permission: ManagerReviewEnum.FinancialManager,
    key: 'legal',
  },
]

export default managerTypes
