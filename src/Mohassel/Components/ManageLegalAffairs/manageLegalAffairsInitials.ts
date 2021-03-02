import * as local from '../../../Shared/Assets/ar.json';
import { Card } from '../ManageAccounts/manageAccountsInitials';
import ability from '../../config/ability'

export const  manageLegalAffairsArray =  (): Card[] => {
  const mangeLegalAffairsArr: Card[]= [];
if(ability.can('loanUsage','config')){
  mangeLegalAffairsArr.push({
    icon: 'loanUses',
    header: local.lateList,
    desc: local.lateList,
    path: '/manage-loan-details/loan-uses',
  })
}
return mangeLegalAffairsArr;
}