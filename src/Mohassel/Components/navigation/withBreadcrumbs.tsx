import React from "react";
import Breadcrumbs from "./breadcrumbs";

const WithBreadcrumbs = ({ route }) => {
  const PageBody = route.render||route.component;
  return (
    <>
  
      {Object.keys(route.parent).length > 0 && <Breadcrumbs route={route} />}
       <PageBody /> 
    </>
  );
};
export default WithBreadcrumbs;