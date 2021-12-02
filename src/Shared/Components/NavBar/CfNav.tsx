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
        {ability.can('getLoanProduct', 'product') ? (
          <Nav.Link onClick={() => history.push('/manage-loans/loan-products')}>
            {local.loans}
          </Nav.Link>
        ) : ability.can('getCalculationFormula', 'product') ? (
          <Nav.Link
            onClick={() => history.push('/manage-loans/calculation-formulas')}
          >
            {local.loans}
          </Nav.Link>
        ) : null}
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
        ) : ability.can('getUpdateCustomerOfficerLog', 'search') ? (
          <Nav.Link
            onClick={() => history.push('/manage-accounts/transfer-logs')}
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
        {ability.can('getTerrorist', 'customer') && (
          <Nav.Link
            onClick={() =>
              history.push('/manage-anti-terrorism/anti-terrorism')
            }
          >
            {local.antiTerrorism}
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
        {ability.can('getOfficersGroups', 'branch') && (
          <Nav.Link onClick={() => history.push('/supervisions-levels')}>
            {local.levelsOfSupervision}
          </Nav.Link>
        )}
        {ability.can('financialBlocking', 'application') ? (
          <Nav.Link
            onClick={() => history.push('/financial-closing/lts-blocking')}
          >
            {local.manageFinancialTransaction}
          </Nav.Link>
        ) : ability.can('financialClosing', 'application') ? (
          <Nav.Link
            onClick={() => history.push('/financial-closing/lts-closing')}
          >
            {local.manageFinancialTransaction}
          </Nav.Link>
        ) : null}
        {ability.can('viewReports', 'report') && (
          <Nav.Link onClick={() => history.push('/reports')}>
            {local.reports}
          </Nav.Link>
        )}
        {ability.can('getMerchantOutstandingSettlement', 'cfApplication') && (
          <Nav.Link onClick={() => history.push('/vendor-settlements')}>
            {local.vendorSettlement}
          </Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  )
}

export const CfNav = withRouter(CfNavbar)
