import * as local from '../../Shared/Assets/ar.json';

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
