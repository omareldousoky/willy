import local from '../../../../Shared/Assets/ar.json'
import { ManagerReveiwEnum } from '../types'

const managerTypes = [
  {
    value: ManagerReveiwEnum.BranchManager,
    text: local.branchManagerReview,
    permission: ManagerReveiwEnum.BranchManager,
    key: 'legal',
  },
  {
    value: ManagerReveiwEnum.AreaManager,
    text: local.areaManagerReview,
    permission: ManagerReveiwEnum.AreaManager,
    key: 'legal',
  },
  {
    value: ManagerReveiwEnum.AreaSupervisor,
    text: local.areaSupervisorReview,
    permission: ManagerReveiwEnum.AreaSupervisor,
    key: 'legal',
  },
  {
    value: ManagerReveiwEnum.FinancialManager,
    text: local.financialManagerReview,
    permission: ManagerReveiwEnum.FinancialManager,
    key: 'legal',
  },
]

export default managerTypes
