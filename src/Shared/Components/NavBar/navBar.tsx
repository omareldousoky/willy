import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import InputGroup from 'react-bootstrap/InputGroup'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import * as local from '../../Assets/ar.json'
import Can from '../../../Mohassel/config/Can'
import { Loader } from '../Loader'
import { clearAllCookies, getCookie } from '../../Services/getCookie'
import { parseJwt, timeToDateyyymmdd } from '../../Services/utils'
import { contextBranch } from '../../../Mohassel/Services/APIs/Login/contextBranch'
import ability from '../../../Mohassel/config/ability'
import './styles.scss'
import { setToken } from '../../token'
import { Auth } from '../../redux/auth/types'
import { logout } from '../../../Mohassel/Services/APIs/Auth/logout'
import ChangePasswordModal from '../changePasswordModal/changePasswordModal'

interface Props extends RouteComponentProps {
  auth: Auth
  hide?: boolean
}
interface Branch {
  _id: string
  name: string
}
interface State {
  selectedBranch: Branch
  branches: Array<Branch>
  openBranchList: boolean
  loading: boolean
  searchKeyWord: string
  openChangePassword: boolean
}
class NavBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedBranch: {
        _id: '',
        name: '',
      },
      searchKeyWord: '',
      branches: [],
      openBranchList: false,
      loading: false,
      openChangePassword: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.auth.loading === false && state.branches.length === 0) {
      const token = getCookie('token')
      const tokenData = parseJwt(token)
      const branches = props.auth.validBranches
      const selectedBranch = getCookie('ltsbranch')
        ? JSON.parse(getCookie('ltsbranch'))
        : ''
      if (tokenData?.requireBranch === false) {
        if (branches) {
          return {
            branches: [...branches, { _id: 'hq', name: local.headquarters }],
            selectedBranch: { _id: 'hq', name: local.headquarters },
          }
        }
        return {
          branches: [
            ...state.branches,
            { _id: 'hq', name: local.headquarters },
          ],
          selectedBranch: { _id: 'hq', name: local.headquarters },
        }
      }
      return {
        selectedBranch: selectedBranch || branches[0],
        branches,
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.auth.validBranches &&
      this.props.auth.validBranches[0] &&
      !prevProps.auth.validBranches
    ) {
      const selectedBranch = getCookie('ltsbranch')
        ? JSON.parse(getCookie('ltsbranch'))
        : ''
      this.goToBranch(selectedBranch, false)
    } else if (
      this.state.selectedBranch._id === 'hq' &&
      prevState.selectedBranch._id !== 'hq'
    ) {
      this.goToBranch(this.state.selectedBranch, false)
    }
  }

  getDaysOfMonth() {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const firstDay = new Date(y, m, 2).valueOf()
    const lastDay = new Date(y, m + 1, 1).valueOf()
    return {
      firstDay: timeToDateyyymmdd(firstDay),
      lastDay: timeToDateyyymmdd(lastDay),
    }
  }

  async goToBranch(branch: Branch, refresh: boolean) {
    document.cookie = 'token=; expires = Thu, 01 Jan 1970 00:00:00 GMT'
    this.setState({ loading: true, openBranchList: false })
    const res = await contextBranch(branch._id)
    if (res.status === 'success') {
      document.cookie =
        'ltsbranch=' +
        JSON.stringify(branch) +
        (process.env.REACT_APP_DOMAIN
          ? `;domain=${process.env.REACT_APP_DOMAIN}`
          : '') +
        ';path=/;'
      setToken(res.body.token)
      this.setState({
        loading: false,
        selectedBranch: branch,
        openBranchList: false,
      })
      if (refresh) this.props.history.push('/')
    } else console.log(res)
  }

  renderBranchList() {
    return (
      <div className="navbar-branch-list">
        <InputGroup style={{ marginLeft: 20 }}>
          <InputGroup.Append>
            <InputGroup.Text className="bg-white rounded-0 p-3">
              <span className="fa fa-search fa-rotate-90" />
            </InputGroup.Text>
          </InputGroup.Append>
          <Form.Control
            type="text"
            name="searchKeyWord"
            data-qc="searchKeyWord"
            className="border-right-0 rounded-0 p-4"
            onChange={(e) =>
              this.setState({ searchKeyWord: e.currentTarget.value })
            }
            style={{ padding: 22 }}
            placeholder={local.searchForBranch}
          />
        </InputGroup>
        <div className={this.state.branches?.length > 5 ? 'scrollable' : ''}>
          {this.state.branches
            ?.filter((branch) => branch.name.includes(this.state.searchKeyWord))
            .map((branch, index) => {
              return (
                <div key={index}>
                  <div
                    className="item"
                    onClick={() => this.goToBranch(branch, true)}
                  >
                    <div style={{ display: 'flex' }}>
                      <div className="pin-icon">
                        <span className="fa fa-map-marker-alt fa-lg" />
                      </div>
                      <div className="branch-name">
                        <span className="text-muted">{local.goToBranch}</span>
                        <h6>{branch.name}</h6>
                      </div>
                    </div>
                    <span className="fa fa-arrow-left" />
                  </div>
                  <hr style={{ margin: 0 }} />
                </div>
              )
            })}
        </div>
        {this.state.branches?.filter((branch) =>
          branch.name.includes(this.state.searchKeyWord)
        ).length === 0
          ? this.renderNoResults()
          : null}
        <div className="d-flex mt-3 mx-4">
          <Button
            variant="success"
            className="w-100 text-white m-auto"
            onClick={() => {
              this.setState({ openChangePassword: true })
            }}
          >
            {local.changePassword}
          </Button>
        </div>
        <div className="d-flex my-3 mx-4">
          <Button
            variant="outline-secondary"
            className="w-100 m-auto"
            onClick={async () => {
              await logout()
              clearAllCookies()
              window.location.href = process.env.REACT_APP_LOGIN_URL || ''
            }}
          >
            {local.logOut}
          </Button>
        </div>
      </div>
    )
  }

  renderNoResults() {
    return (
      <div className="no-branches-container">
        <img
          alt="no-branches-found"
          src={require('../../Assets/noBranchesFound.svg')}
        />
        <h4>{local.noResults}</h4>
        <h6 className="text-muted">{local.looksLikeYouCantFindResults}</h6>
      </div>
    )
  }

  render() {
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <Navbar expand="lg" style={{ background: '#f5f5f5', padding: 0 }}>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="logo-navbar">
              <Navbar.Brand className="ml-4">
                <img alt="navbar-logo" src={require('../../Assets/Logo.svg')} />
              </Navbar.Brand>
              <Navbar.Text className="mx-5">
                <h5 className="text-primary font-weight-bold">
                  {local.lowRateLoan}
                </h5>
              </Navbar.Text>
              <div style={{ flex: 2, display: 'flex', width: '100%' }}>
                <div className="info-navbar">
                  <span>{local.currentPeriodStartsIn}</span>
                  <span className="text-primary mx-2 font-weight-bold">
                    {this.getDaysOfMonth().firstDay}
                  </span>
                  <span>{local.andEndsIn}</span>
                  <span className="text-primary mx-2 font-weight-bold">
                    {this.getDaysOfMonth().lastDay}
                  </span>
                </div>
              </div>
              <div className="navbar-choose-branch">
                <div
                  className="d-flex"
                  onClick={() =>
                    this.setState((prevState) => ({
                      openBranchList: !prevState.openBranchList,
                    }))
                  }
                >
                  <div className="selected-branch">
                    <div className="pin-icon">
                      <span className="fa fa-map-marker-alt fa-lg" />
                    </div>
                    <span className="text-white font-weight-bold">
                      {this.state.selectedBranch._id === ''
                        ? local.selectBranch
                        : this.state.selectedBranch.name}
                    </span>
                  </div>
                  <img
                    className="mx-2"
                    style={{ width: '40px' }}
                    alt="drop-down-arrow"
                    src={require('../../Assets/dropDownArrow.svg')}
                  />
                </div>
                {this.state.openBranchList ? this.renderBranchList() : null}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Navbar
          className="text-white bold"
          style={{ backgroundColor: '#2a3390', height: 75, marginBottom: 20 }}
          expand="lg"
          variant="dark"
        >
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '.9em',
              }}
            >
              <Nav.Link>
                <img
                  alt="home-icon"
                  src={require('../../Assets/homeIcon.svg')}
                />
              </Nav.Link>
              {/* //TODO come back to after we figure permissions */}
              {ability.can('getCustomer', 'customer') ? (
                <NavDropdown title={local.customers} id="basic-nav-dropdown">
                  <NavDropdown.Item
                    className="primary"
                    onClick={() => this.props.history.push('/customers')}
                  >
                    {local.persons}
                  </NavDropdown.Item>
                  <Can I="getCompany" a="customer">
                    <NavDropdown.Item
                      className="primary"
                      onClick={() => this.props.history.push('/company')}
                    >
                      {local.companies}
                    </NavDropdown.Item>
                  </Can>
                </NavDropdown>
              ) : !this.props.hide &&
                ability.can('changeOfficer', 'customer') ? (
                <NavDropdown title={local.customers} id="basic-nav-dropdown">
                  <NavDropdown.Item
                    className="primary"
                    onClick={() =>
                      this.props.history.push('/customers/move-customers')
                    }
                  >
                    {local.persons}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    className="primary"
                    onClick={() =>
                      this.props.history.push('/company//move-company')
                    }
                  >
                    {local.companies}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
              {!this.props.hide && ability.can('getLoanProduct', 'product') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/manage-loans/loan-products')
                  }
                >
                  {local.loans}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('getCalculationFormula', 'product') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push(
                      '/manage-loans/calculation-formulas'
                    )
                  }
                >
                  {local.loans}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('assignProductToBranch', 'product') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push(
                      '/manage-loans/assign-products-branches'
                    )
                  }
                >
                  {local.assignProductToBranch}
                </Nav.Link>
              ) : null}
              {ability.can('getLoanApplication', 'application') ? (
                // <Nav.Link
                //   onClick={() =>
                //     this.props.history.push('/track-loan-applications')
                //   }
                // >
                //   {local.loanApplications}
                // </Nav.Link>
                <NavDropdown
                  title={local.loanApplications}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    className="primary"
                    onClick={() =>
                      this.props.history.push('/track-loan-applications')
                    }
                  >
                    {local.persons}
                  </NavDropdown.Item>
                  <Can I="getSMEApplication" a="application">
                    <NavDropdown.Item
                      className="primary"
                      onClick={() =>
                        this.props.history.push('/track-loan-applications', {
                          sme: true,
                        })
                      }
                    >
                      {local.companies}
                    </NavDropdown.Item>
                  </Can>
                </NavDropdown>
              ) : !this.props.hide &&
                ability.can('approveLoanApplication', 'application') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push(
                      '/track-loan-applications/bulk-approvals'
                    )
                  }
                >
                  {local.loanApplications}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('createLoan', 'application') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push(
                      '/track-loan-applications/bulk-creation'
                    )
                  }
                >
                  {local.loanApplications}
                </Nav.Link>
              ) : null}
              {!this.props.hide && ability.can('loanUsage', 'config') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/manage-loan-details/loan-uses')
                  }
                >
                  {local.manageLoanDetails}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('viewBusinessSectorConfig', 'config') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push(
                      '/manage-loan-details/business-activities'
                    )
                  }
                >
                  {local.manageLoanDetails}
                </Nav.Link>
              ) : null}
              {!this.props.hide && ability.can('getRoles', 'user') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/manage-accounts/roles')
                  }
                >
                  {local.manageAccounts}
                </Nav.Link>
              ) : !this.props.hide && ability.can('getUser', 'user') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/manage-accounts/users')
                  }
                >
                  {local.manageAccounts}
                </Nav.Link>
              ) : !this.props.hide && ability.can('getBranch', 'branch') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/manage-accounts/branches')
                  }
                >
                  {local.manageAccounts}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('updateLoanOfficer', 'user') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/manage-accounts/loan-officers')
                  }
                >
                  {local.manageAccounts}
                </Nav.Link>
              ) : null}
              {!this.props.hide && ability.can('documentTypes', 'config') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/tools/encoding-files')
                  }
                >
                  {local.tools}
                </Nav.Link>
              ) : !this.props.hide && ability.can('geoArea', 'config') ? (
                <Nav.Link
                  onClick={() => this.props.history.push('/tools/geo-areas')}
                >
                  {local.tools}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('createMaxPrincipal', 'config') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/tools/principalRange')
                  }
                >
                  {local.tools}
                </Nav.Link>
              ) : null}
              {this.props.hide && (
                <Can I="documentTypes" a="config">
                  <Nav.Link
                    onClick={() => this.props.history.push('/encoding-files')}
                  >
                    {local.tools}
                  </Nav.Link>
                </Can>
              )}
              {ability.can('getIssuedLoan', 'application') ||
              ability.can('branchIssuedLoan', 'application') ? (
                <Nav.Link onClick={() => this.props.history.push('/loans')}>
                  {local.issuedLoans}
                </Nav.Link>
              ) : !this.props.hide && ability.can('cibScreen', 'report') ? (
                <Nav.Link onClick={() => this.props.history.push('/loans/cib')}>
                  {local.issuedLoans}
                </Nav.Link>
              ) : !this.props.hide && ability.can('cibScreen', 'report') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/loans/source-of-fund')
                  }
                >
                  {local.issuedLoans}
                </Nav.Link>
              ) : null}
              {!this.props.hide && (
                <Can I="viewActionLogs" a="user">
                  <Nav.Link onClick={() => this.props.history.push('/logs')}>
                    {local.logs}
                  </Nav.Link>
                </Can>
              )}
              {!this.props.hide && (
                <Can I="viewReports" a="report">
                  <Nav.Link onClick={() => this.props.history.push('/reports')}>
                    {local.reports}
                  </Nav.Link>
                </Can>
              )}
              {!this.props.hide && (
                <Can I="getLead" a="halanuser">
                  <Nav.Link
                    onClick={() =>
                      this.props.history.push('/halan-integration/leads')
                    }
                  >
                    {local.halan}
                  </Nav.Link>
                </Can>
              )}
              {!this.props.hide && (
                <Can I="getClearance" a="application">
                  <Nav.Link
                    onClick={() => this.props.history.push('/clearances')}
                  >
                    {local.clearances}
                  </Nav.Link>
                </Can>
              )}
              {!this.props.hide && (
                <Can I="getOfficersGroups" a="branch">
                  <Nav.Link
                    onClick={() =>
                      this.props.history.push('/supervisions-levels')
                    }
                  >
                    {local.levelsOfSupervision}
                  </Nav.Link>
                </Can>
              )}
              {!this.props.hide && ability.can('getTerrorist', 'customer') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push(
                      '/manage-anti-terrorism/anti-terrorism'
                    )
                  }
                >
                  {local.antiTerrorism}
                </Nav.Link>
              ) : null}
              {!this.props.hide &&
              ability.can('financialBlocking', 'application') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/financial-closing/lts-blocking')
                  }
                >
                  {local.manageFinancialTransaction}
                </Nav.Link>
              ) : !this.props.hide &&
                ability.can('financialClosing', 'application') ? (
                <Nav.Link
                  onClick={() =>
                    this.props.history.push('/financial-closing/lts-closing')
                  }
                >
                  {local.manageFinancialTransaction}
                </Nav.Link>
              ) : null}
              {!this.props.hide && (
                <Can I="getDefaultingCustomer" a="legal">
                  <Nav.Link
                    onClick={() =>
                      this.props.history.push('/legal-affairs/late-list')
                    }
                  >
                    {local.legalAffairs}
                  </Nav.Link>
                </Can>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ChangePasswordModal
          show={this.state.openChangePassword}
          handleClose={() => this.setState({ openChangePassword: false })}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(withRouter(NavBar))
