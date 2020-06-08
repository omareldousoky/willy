export const timeToDate = (timeStampe: number): any =>{
  if(timeStampe>0){
    const date = new Date(timeStampe).toLocaleDateString();
    return date;
  } else return '';
}
export const timeToDateyyymmdd = (timeStampe: number): any => {
  if(timeStampe>0){
    const date = new Date(timeStampe);
   let month = '' + (date.getMonth() + 1);
   let day = '' + date.getDate();
   const  year = date.getFullYear();

if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;

return [year, month, day].join('-');
  
  } else  return '';
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
