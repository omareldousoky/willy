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
        {(ability.can('getIssuedLoan', 'application') ||
          ability.can('branchIssuedLoan', 'application')) && (
          <Nav.Link onClick={() => history.push('/loans')}>
            {local.issuedLoans}
          </Nav.Link>
        )}
        {ability.can('documentTypes', 'config') ? (
          <Nav.Link onClick={() => history.push('/tools/encoding-files')}>
            {local.tools}
          </Nav.Link>
        ) : ability.can('geoArea', 'config') ? (
          <Nav.Link onClick={() => history.push('/tools/geo-areas')}>
            {local.tools}
          </Nav.Link>
        ) : null}
        {ability.can('getLead', 'halanuser') && (
          <Nav.Link onClick={() => history.push('/halan-integration/leads')}>
            {local.halan}
          </Nav.Link>
        )}
        {ability.can('getClearance', 'application') && (
          <Nav.Link onClick={() => history.push('/clearances')}>
            {local.clearances}
          </Nav.Link>
        )}
        {ability.can('getDefaultingCustomer', 'legal') && (
          <Nav.Link onClick={() => history.push('/legal-affairs/late-list')}>
            {local.legalAffairs}
          </Nav.Link>
        )}
        {ability.can('viewActionLogs', 'user') && (
          <Nav.Link onClick={() => history.push('/logs')}>
            {local.logs}
          </Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  )
}

export const CfNav = withRouter(CfNavbar)
