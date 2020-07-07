import * as local from '../../Shared/Assets/ar.json';
import jwtDecode from 'jwt-decode';

export const timeToDate = (timeStampe: number): any => {
  if (timeStampe > 0) {
    const date = new Date(timeStampe).toLocaleDateString();
    return date;
  } else return '';
}
export const timeToDateyyymmdd = (timeStamp: number): any => {
  if (timeStamp > 0)
    return new Date(timeStamp).toISOString().slice(0, 10)
  else return new Date().toISOString().slice(0, 10);
}

export function parseJwt(token: string) {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
export function dayOfWeek(number: number) {
  switch (number) {
    case 0:
      return local.saturday
    case 1:
      return local.sunday
    case 2:
      return local.monday
    case 3:
      return local.tuesday
    case 4:
      return local.wednesday
    case 5:
      return local.thursday
    case 6:
      return local.friday
    default:
      return ''
  }
}
export function documentTypeLocalization(val: string) {
  switch (val) {
    case 'customer':
      return local.customer
    case 'loanApplication':
      return local.loanApplicationId
    case 'issuedLoan':
      return local.issuedLoan
    default:
      return ''
  }
}
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
export function loanNature(val: string) {
  switch (val) {
    case 'cash':
      return local.cash
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
export function interestType(val: string) {
  switch (val) {
    case 'flat':
      return local.interestTypeFlat
    case 'reducing':
      return local.interestTypeReducing
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
export function inAdvanceFrom(val: string) {
  switch (val) {
    case 'principal':
      return local.inAdvanceFromPrinciple
    case 'monthly':
      return local.inAdvanceFromMonthly
    case 'yearly':
      return local.inAdvanceFromYearly
    default:
      return ''
  }
}
export function inAdvanceType(val: string) {
  switch (val) {
    case 'cut':
      return local.inAdvanceFeesCut
    case 'uncut':
      return local.inAdvanceFeesUncut
    default:
      return ''
  }
}
export function installmentType(val: string) {
  switch (val) {
    case 'principalAndFees':
      return local.installmentTypePrincipalAndFees
    case 'feesFirst':
      return local.installmentTypeFeesFirst
    default:
      return ''
  }
}
export function roundDirection(val: string) {
  switch (val) {
    case 'up':
      return local.roundUp
    case 'down':
      return local.roundDown
    default:
      return ''
  }
}
export function roundWhat(val: string) {
  switch (val) {
    case 'principal':
      return local.roundPrincipal
    case 'fees':
      return local.roundFees
    case 'principalAndFees':
      return local.roundPrincipalAndFees
    case 'installmentAndPrincipal':
      return local.roundInstallmentAndPrincipal
    case 'installmentAndFees':
      return local.roundInstallmentAndFees
    case 'installment':
      return local.roundInstallment
    case 'principalAndTotalFees':
      return local.roundPrincipalAndTotalFees
    default:
      return ''
  }
}
export function ageCalculate(val) {
  const dateNow = new Date();
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
  if (diffDays > 2555) {
    return local.expired;
  } else return '';
}


export const combinePaths = (parent, child) =>
  `${parent.replace(/\/$/, "")}/${child.replace(/^\//, "")}`;

export const buildPaths = (routes, parentPath = "") =>
  routes.map(route => {
    const path = combinePaths(parentPath, route.path);

    return {
      ...route,
      path,
      ...(route.routes && { routes: buildPaths(route.routes, path) })
    };
  });


export const setupParents = (routes, parentRoute = {}) =>
  routes.map(route => {
    const withParent = {
      ...route,
      ...(parentRoute && { parent: parentRoute })
    };

    return {
      ...withParent,
      ...(withParent.routes && {
        routes: setupParents(withParent.routes, withParent)
      })
    };
  });


export const flattenRoutes = routes =>
  routes
    .map(route => [route.routes ? flattenRoutes(route.routes) : [], route])
    .flat(Infinity);


export const generateAppRoutes = routes => {
  return flattenRoutes(setupParents(buildPaths(routes)));
};


export const pathTo = route => {
  if (!route.parent) {
    return [route];
  }

  return [...pathTo(route.parent), route];
};

export const numbersToArabic = (input: number | string) => {
  if (input || input === 0) {
    const id = ['۰', '۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹'];
    const inputStr = input.toString();
    return inputStr.replace(/[0-9]/g, (number) => {
      return id[number]
    });
  } else return '';
}

export const timeToArabicDate = (timeStamp: number, fullDate: boolean): string => {
  if (timeStamp > 0)
    return fullDate ? new Date(timeStamp).toLocaleString('ar-EG') : new Date(timeStamp).toLocaleString('ar-EG').slice(0, 12)
  else return fullDate ? new Date().toLocaleString('ar-EG') : new Date().toLocaleString('ar-EG').slice(0, 12)
}

export const dayToArabic = (index: number): string => {
  const weekday = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return weekday[index];
}
export const customFilterOption = (option, rawInput) => {
  if (option.label) {
    const words = rawInput.split(' ');
    return words.reduce(
      (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
      true,
    );
  }
};