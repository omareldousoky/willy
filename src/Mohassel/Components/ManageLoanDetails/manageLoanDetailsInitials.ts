;
import * as local from '../../../Shared/Assets/ar.json';

import ability from '../../config/ability'

export interface Card{
  icon: string;
  header: string;
  desc: string;
  path: string;
} 
export const  manageLoanDetailsArray =  (): Card[] => {
  const mangeLoanDetailsArr: Card[]= [];
if(ability.can('loanUsage','config')){
  mangeLoanDetailsArr.push({
    icon: 'loanUses',
    header: local.loanUses,
    desc: local.loanUses,
    path: '/manage-loan-details/loan-uses',
  })
}
return mangeLoanDetailsArr;
}