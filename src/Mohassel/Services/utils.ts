import * as local from '../../Shared/Assets/ar.json';

export const timeToDate = (timeStampe: number): any => {
  if (timeStampe > 0) {
    const date = new Date(timeStampe).toLocaleDateString();
    return date;
  } else return '';
}
export const timeToDateyyymmdd = (timeStampe: number): any => {
  if (timeStampe > 0) {
    const date = new Date(timeStampe);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');

  } else return '';
}

export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
export function beneficiaryType(val: string) {
  switch (val) {
    case 'individual':
      return local.individual
    case 'group':
      return local.group
    default:
      return ''
  }
}
export function currency(val: string) {
  switch (val) {
    case 'egp':
      return local.egp
    default:
      return ''
  }
}
export function interestPeriod(val: string) {
  switch (val) {
    case 'yearly':
      return 'نسبه سنويه'
    case 'monthly':
      return 'نسبه شهريه'
    default:
      return ''
  }
}
export function periodType(val: string) {
  switch (val) {
    case 'months':
      return 'اشهر'
    case 'days':
      return 'يوم'
    default:
      return ''
  }
}
export function ageCalculate(val) {
  const dateNow =  new Date();
  const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;
  const years = Math.floor((dateNow.getTime() - val) / MS_PER_YEAR);
  return years
}

export function checkIssueDate(issueDate) {
  const date = new Date(issueDate).valueOf();
  const endOfDay: Date = new Date();
  endOfDay.setHours(23, 59, 59, 59);
  const diffTime = Math.abs(endOfDay.valueOf() - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  //2555 = 7 years
  if(diffDays > 2555){
    return local.expired;
  } else return '';
}