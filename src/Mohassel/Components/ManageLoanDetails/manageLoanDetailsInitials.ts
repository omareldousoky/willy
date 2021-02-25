;
import * as local from '../../../Shared/Assets/ar.json';

import ability from '../../config/ability'

export interface Specialty {
  businessSpecialtyName: { ar: string };
  id: string;
  active: boolean;
}

export interface Activities {
  i18n: { ar: string };
  id: string;
  specialties: Array<Specialty>;
  active: boolean;
}

export interface BusinessSector {
  i18n: { ar: string };
  id: string;
  activities: Array<Activities>;
}

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
if(ability.can('viewBusinessSectorConfig','config')){
  mangeLoanDetailsArr.push({
    icon: 'businessActivities',
    header: local.businessActivities,
    desc: local.businessActivities,
    path: '/manage-loan-details/business-activities',
  },{
    icon: 'businessSpecialities',
    header: local.businessSpecialities,
    desc: local.businessSpecialities,
    path: '/manage-loan-details/business-specialities',
  })
}
return mangeLoanDetailsArr;
}