import React from "react";
import { NavLink } from "react-router-dom";
import { pathTo } from "../../Services/utils";

const Breadcrumbs = ({ route }) => {
  return (
  <nav className="breadcrumbs">
    {pathTo(route).map((crumb, index, breadcrumbs) => (
      crumb.path &&
      <div key={index} className="item">
        {index < breadcrumbs.length - 1  && (
          <NavLink to={crumb.path}>{crumb.label}</NavLink>
        )}
        {index === breadcrumbs.length - 1 && crumb.label}
      </div>
        ))}
  </nav>
  )
};

export default Breadcrumbs;
