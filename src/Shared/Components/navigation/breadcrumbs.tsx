import React from 'react'
import { NavLink } from 'react-router-dom'
import { pathTo } from '../../Services/utils'

const Breadcrumbs = ({ route }) => {
  return (
    <nav className="breadcrumbs print-none">
      {pathTo(route).map(
        (crumb, index, breadcrumbs) =>
          crumb.path && (
            <React.Fragment key={index}>
              <div className="item">
                {index < breadcrumbs.length - 1 &&
                  (crumb.disableLink ? (
                    crumb.label
                  ) : (
                    <NavLink to={crumb.path}>{crumb.label}</NavLink>
                  ))}
                {index === breadcrumbs.length - 1 && crumb.label}
              </div>
            </React.Fragment>
          )
      )}
    </nav>
  )
}

export default Breadcrumbs
