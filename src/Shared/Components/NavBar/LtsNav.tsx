import React from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import ability from '../../config/ability'
import Can from '../../config/Can'
import local from '../../Assets/ar.json'

interface Props extends RouteComponentProps {
  hide?: boolean
}

const LtsNavbar = (props: Props) => {
  return (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav
        className="d-flex justify-content-between align-items-center"
        style={{
          fontSize: '.9em',
        }}
      >
        <Nav.Link>
          <img alt="home-icon" src={require('../../Assets/homeIcon.svg')} />
        </Nav.Link>
        {/* //TODO come back to after we figure permissions */}
        {ability.can('getCustomer', 'customer') ? (
          <NavDropdown title={local.customers} id="basic-nav-dropdown">
            <NavDropdown.Item
              className="primary"
              onClick={() => props.history.push('/customers')}
            >
              {local.persons}
            </NavDropdown.Item>
            <Can I="getCompany" a="customer">
              <NavDropdown.Item
                className="primary"
                onClick={() => props.history.push('/company')}
              >
                {local.companies}
              </NavDropdown.Item>
            </Can>
          </NavDropdown>
        ) : !props.hide && ability.can('changeOfficer', 'customer') ? (
          <NavDropdown title={local.customers} id="basic-nav-dropdown">
            <NavDropdown.Item
              className="primary"
              onClick={() => props.history.push('/customers/move-customers')}
            >
              {local.persons}
            </NavDropdown.Item>
            <NavDropdown.Item
              className="primary"
              onClick={() => props.history.push('/company/move-company')}
            >
              {local.companies}
            </NavDropdown.Item>
          </NavDropdown>
        ) : null}
        {!props.hide && ability.can('getLoanProduct', 'product') ? (
          <Nav.Link
            onClick={() => props.history.push('/manage-loans/loan-products')}
          >
            {local.loans}
          </Nav.Link>
        ) : !props.hide && ability.can('getCalculationFormula', 'product') ? (
          <Nav.Link
            onClick={() =>
              props.history.push('/manage-loans/calculation-formulas')
            }
          >
            {local.loans}
          </Nav.Link>
        ) : !props.hide && ability.can('assignProductToBranch', 'product') ? (
          <Nav.Link
            onClick={() =>
              props.history.push('/manage-loans/assign-products-branches')
            }
          >
            {local.assignProductToBranch}
          </Nav.Link>
        ) : null}
        {ability.can('getLoanApplication', 'application') ? (
          <NavDropdown title={local.loanApplications} id="basic-nav-dropdown">
            <NavDropdown.Item
              className="primary"
              onClick={() => props.history.push('/track-loan-applications')}
            >
              {local.persons}
            </NavDropdown.Item>
            <Can I="getSMEApplication" a="application">
              <NavDropdown.Item
                className="primary"
                onClick={() =>
                  props.history.push('/track-loan-applications', {
                    sme: true,
                  })
                }
              >
                {local.companies}
              </NavDropdown.Item>
            </Can>
          </NavDropdown>
        ) : !props.hide &&
          ability.can('approveLoanApplication', 'application') ? (
          <NavDropdown title={local.loanApplications} id="basic-nav-dropdown">
            <NavDropdown.Item
              className="primary"
              onClick={() =>
                props.history.push('/track-loan-applications/bulk-approvals')
              }
            >
              {local.persons}
            </NavDropdown.Item>
            <Can I="getSMEApplication" a="application">
              <NavDropdown.Item
                className="primary"
                onClick={() =>
                  props.history.push(
                    '/track-loan-applications/bulk-approvals',
                    {
                      sme: true,
                    }
                  )
                }
              >
                {local.companies}
              </NavDropdown.Item>
            </Can>
          </NavDropdown>
        ) : !props.hide && ability.can('createLoan', 'application') ? (
          <NavDropdown title={local.loanApplications} id="basic-nav-dropdown">
            <NavDropdown.Item
              className="primary"
              onClick={() =>
                props.history.push('/track-loan-applications/bulk-creation')
              }
            >
              {local.persons}
            </NavDropdown.Item>
            <Can I="getSMEApplication" a="application">
              <NavDropdown.Item
                className="primary"
                onClick={() =>
                  props.history.push('/track-loan-applications/bulk-creation', {
                    sme: true,
                  })
                }
              >
                {local.companies}
              </NavDropdown.Item>
            </Can>
          </NavDropdown>
        ) : null}
        {!props.hide && ability.can('loanUsage', 'config') ? (
          <Nav.Link
            onClick={() => props.history.push('/manage-loan-details/loan-uses')}
          >
            {local.manageLoanDetails}
          </Nav.Link>
        ) : !props.hide && ability.can('viewBusinessSectorConfig', 'config') ? (
          <Nav.Link
            onClick={() =>
              props.history.push('/manage-loan-details/business-activities')
            }
          >
            {local.manageLoanDetails}
          </Nav.Link>
        ) : null}
        {!props.hide && ability.can('getRoles', 'user') ? (
          <Nav.Link
            onClick={() => props.history.push('/manage-accounts/roles')}
          >
            {local.manageAccounts}
          </Nav.Link>
        ) : !props.hide && ability.can('getUser', 'user') ? (
          <Nav.Link
            onClick={() => props.history.push('/manage-accounts/users')}
          >
            {local.manageAccounts}
          </Nav.Link>
        ) : !props.hide && ability.can('getBranch', 'branch') ? (
          <Nav.Link
            onClick={() => props.history.push('/manage-accounts/branches')}
          >
            {local.manageAccounts}
          </Nav.Link>
        ) : !props.hide && ability.can('updateLoanOfficer', 'user') ? (
          <Nav.Link
            onClick={() => props.history.push('/manage-accounts/loan-officers')}
          >
            {local.manageAccounts}
          </Nav.Link>
        ) : null}
        {!props.hide && ability.can('documentTypes', 'config') ? (
          <Nav.Link onClick={() => props.history.push('/tools/encoding-files')}>
            {local.tools}
          </Nav.Link>
        ) : !props.hide && ability.can('geoArea', 'config') ? (
          <Nav.Link onClick={() => props.history.push('/tools/geo-areas')}>
            {local.tools}
          </Nav.Link>
        ) : !props.hide && ability.can('createMaxPrincipal', 'config') ? (
          <Nav.Link onClick={() => props.history.push('/tools/principalRange')}>
            {local.tools}
          </Nav.Link>
        ) : null}
        {props.hide && (
          <Can I="documentTypes" a="config">
            <Nav.Link onClick={() => props.history.push('/encoding-files')}>
              {local.tools}
            </Nav.Link>
          </Can>
        )}
        {ability.can('getIssuedLoan', 'application') ||
        ability.can('branchIssuedLoan', 'application') ? (
          <NavDropdown title={local.issuedLoans} id="basic-nav-dropdown">
            <NavDropdown.Item
              className="primary"
              onClick={() => props.history.push('/loans')}
            >
              {local.persons}
            </NavDropdown.Item>
            <Can I="getIssuedSMELoan" a="application">
              <NavDropdown.Item
                className="primary"
                onClick={() =>
                  props.history.push('/loans', {
                    sme: true,
                  })
                }
              >
                {local.companies}
              </NavDropdown.Item>
            </Can>
          </NavDropdown>
        ) : !props.hide && ability.can('cibScreen', 'report') ? (
          <Nav.Link onClick={() => props.history.push('/loans/cib')}>
            {local.issuedLoans}
          </Nav.Link>
        ) : !props.hide && ability.can('cibScreen', 'report') ? (
          <Nav.Link onClick={() => props.history.push('/loans/source-of-fund')}>
            {local.issuedLoans}
          </Nav.Link>
        ) : null}
        {!props.hide && (
          <Can I="viewActionLogs" a="user">
            <Nav.Link onClick={() => props.history.push('/logs')}>
              {local.logs}
            </Nav.Link>
          </Can>
        )}
        {!props.hide && (
          <Can I="viewReports" a="report">
            <Nav.Link onClick={() => props.history.push('/reports')}>
              {local.reports}
            </Nav.Link>
          </Can>
        )}
        {!props.hide && (
          <Can I="getLead" a="halanuser">
            <Nav.Link
              onClick={() => props.history.push('/halan-integration/leads')}
            >
              {local.halan}
            </Nav.Link>
          </Can>
        )}
        {!props.hide && (
          <Can I="getClearance" a="application">
            <Nav.Link onClick={() => props.history.push('/clearances')}>
              {local.clearances}
            </Nav.Link>
          </Can>
        )}
        {!props.hide && (
          <Can I="getOfficersGroups" a="branch">
            <Nav.Link
              onClick={() => props.history.push('/supervisions-levels')}
            >
              {local.levelsOfSupervision}
            </Nav.Link>
          </Can>
        )}
        {!props.hide && ability.can('getTerrorist', 'customer') ? (
          <Nav.Link
            onClick={() =>
              props.history.push('/manage-anti-terrorism/anti-terrorism')
            }
          >
            {local.antiTerrorism}
          </Nav.Link>
        ) : null}
        {!props.hide && ability.can('financialBlocking', 'application') ? (
          <Nav.Link
            onClick={() =>
              props.history.push('/financial-closing/lts-blocking')
            }
          >
            {local.manageFinancialTransaction}
          </Nav.Link>
        ) : !props.hide && ability.can('financialClosing', 'application') ? (
          <Nav.Link
            onClick={() => props.history.push('/financial-closing/lts-closing')}
          >
            {local.manageFinancialTransaction}
          </Nav.Link>
        ) : null}
        {!props.hide && (
          <Can I="getDefaultingCustomer" a="legal">
            <Nav.Link
              onClick={() => props.history.push('/legal-affairs/late-list')}
            >
              {local.legalAffairs}
            </Nav.Link>
          </Can>
        )}
      </Nav>
    </Navbar.Collapse>
  )
}

export const LtsNav = withRouter(LtsNavbar)
