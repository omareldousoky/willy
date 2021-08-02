import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useHistory, withRouter } from 'react-router-dom'
import local from '../../Assets/ar.json'
import ability from '../../config/ability'

export const CfNavbar = () => {
  const history = useHistory()
  return (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav
        className="d-flex justify-content-between align-items-center"
        style={{
          fontSize: '.9em',
        }}
      >
        <Nav.Link onClick={() => history.push('/')}>
          <img alt="home-icon" src={require('../../Assets/homeIcon.svg')} />
        </Nav.Link>
        {ability.can('getCustomer', 'customer') && (
          <Nav.Link onClick={() => history.push('/customers')}>
            {local.customers}
          </Nav.Link>
        )}
        {ability.can('getRoles', 'user') ? (
          <Nav.Link onClick={() => history.push('/manage-accounts/roles')}>
            {local.manageAccounts}
          </Nav.Link>
        ) : ability.can('getUser', 'user') ? (
          <Nav.Link onClick={() => history.push('/manage-accounts/users')}>
            {local.manageAccounts}
          </Nav.Link>
        ) : ability.can('getBranch', 'branch') ? (
          <Nav.Link onClick={() => history.push('/manage-accounts/branches')}>
            {local.manageAccounts}
          </Nav.Link>
        ) : ability.can('updateLoanOfficer', 'user') ? (
          <Nav.Link
            onClick={() => history.push('/manage-accounts/loan-officers')}
          >
            {local.manageAccounts}
          </Nav.Link>
        ) : null}
      </Nav>
    </Navbar.Collapse>
  )
}

export const CfNav = withRouter(CfNavbar)
