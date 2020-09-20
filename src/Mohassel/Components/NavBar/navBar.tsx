import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import { Loader } from '../../../Shared/Components/Loader';
import { getCookie } from '../../Services/getCookie';
import { parseJwt, timeToDateyyymmdd } from '../../Services/utils';
import { contextBranch } from '../../Services/APIs/Login/contextBranch';
import ability from '../../config/ability';
import './styles.scss';
import { setToken } from '../../../Shared/token';
import { connect } from 'react-redux';
import { Auth } from '../../redux/auth/types'
interface Props {
  history: any;
  auth: Auth;
}
interface Branch {
  _id: string;
  name: string;
}
interface State {
  selectedBranch: Branch;
  branches: Array<Branch>;
  openBranchList: boolean;
  loading: boolean;
  searchKeyWord: string;
}
class NavBar extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedBranch: {
        _id: '',
        name: ''
      },
      searchKeyWord: '',
      branches: [],
      openBranchList: false,
      loading: false
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.auth.loading === false && state.branches.length === 0) {
      const token = getCookie('token');
      const tokenData = parseJwt(token);
      const branches = props.auth.validBranches;
      if (tokenData?.requireBranch === false) {
        if (branches) {
          return { branches: [...branches, { _id: 'hq', name: local.headquarters }], selectedBranch: { _id: 'hq', name: local.headquarters } }
        } else return { branches: [...state.branches, { _id: 'hq', name: local.headquarters }], selectedBranch: { _id: 'hq', name: local.headquarters } }
      } else return { selectedBranch: branches[0], branches: branches }
    } else return null;
  }
  async goToBranch(branch: Branch) {
    document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    this.setState({ loading: true, openBranchList: false })
    const res = await contextBranch(branch._id);
    if (res.status === "success") {
      setToken(res.body.token);
      this.props.history.push('/');
      this.setState({ loading: false, selectedBranch: branch })
    } else console.log(res)
  }
  renderBranchList() {
    return (
      <div className="navbar-branch-list">
        <InputGroup style={{ direction: 'ltr', marginLeft: 20 }}>
          <Form.Control
            type="text"
            name="searchKeyWord"
            data-qc="searchKeyWord"
            onChange={(e) => this.setState({ searchKeyWord: e.currentTarget.value })}
            style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
            placeholder={local.searchForBranch}
          />
          <InputGroup.Append>
            <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <div className={this.state.branches?.length > 5 ? "scrollable" : ""}>
          {this.state.branches?.filter(branch => branch.name.includes(this.state.searchKeyWord))
            .map((branch, index) => {
              return (
                <div key={index}>
                  <div className="item" onClick={() => this.goToBranch(branch)}>
                    <div style={{ display: 'flex' }}>
                      <div className="pin-icon"><span className="fa fa-map-marker-alt fa-lg"></span></div>
                      <div className="branch-name">
                        <span className="text-muted">{local.goToBranch}</span>
                        <h6>{branch.name}</h6>
                      </div>
                    </div>
                    <span className="fa fa-arrow-left"></span>
                  </div>
                  <hr style={{ margin: 0 }} />
                </div>
              )
            })}
        </div>
        {this.state.branches?.filter(branch => branch.name.includes(this.state.searchKeyWord)).length === 0 ? this.renderNoResults() : null}
        <div className="item">
          <Button variant="outline-secondary" onClick={() => {
            document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = process.env.REACT_APP_LOGIN_URL || '';
          }}>{local.logOut}</Button>
        </div>
      </div>
    )
  }
  renderNoResults() {
    return (
      <div className="no-branches-container">
        <img alt="no-branches-found" src={require('../../Assets/noBranchesFound.svg')} />
        <h4>{local.noResults}</h4>
        <h6 className="text-muted">{local.looksLikeYouCantFindResults}</h6>
      </div>
    )
  }
  getDaysOfMonth() {
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 2).valueOf();
    const lastDay = new Date(y, m + 1, 1).valueOf();
    return { firstDay: timeToDateyyymmdd(firstDay), lastDay: timeToDateyyymmdd(lastDay) }
  }
  render() {
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <Navbar expand="lg" style={{ background: '#f5f5f5', padding: 0 }}>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="logo-navbar">
              <div style={{ flex: 1 }}>
                <Navbar.Brand style={{ marginLeft: 40 }}><img alt="navbar-logo" src={require('../../../Shared/Assets/Logo.svg')} /></Navbar.Brand>
                <Navbar.Text style={{ marginLeft: 40 }}><h5 className="primary-color">{local.lowRateLoan}</h5></Navbar.Text>
              </div>
              <div style={{ flex: 2, display: 'flex', width: '100%' }}>
                <div className="refresh-logo-navbar"><img alt="navbar-refresh" src={require('../../Assets/refresh.svg')} /></div>
                <div className="info-navbar">
                  <span style={{ marginLeft: 10 }}>{local.currentPeriodStartsIn}</span>
                  <span style={{ marginLeft: 10 }} className="primary-color">  {this.getDaysOfMonth().firstDay}  </span>
                  <span style={{ marginLeft: 10 }}>{local.andEndsIn}</span>
                  <span className="primary-color">  {this.getDaysOfMonth().lastDay}  </span>
                </div>
              </div>
              <div className="navbar-choose-branch" onClick={() => this.setState({ openBranchList: !this.state.openBranchList })}>
                <div>
                  <div className="selected-branch">
                    <div className="pin-icon"><span className="fa fa-map-marker-alt fa-lg"></span></div>
                    <span>{this.state.selectedBranch._id === "" ? local.selectBranch : this.state.selectedBranch.name}</span>
                  </div>
                </div>
                <img alt="drop-down-arrow" src={require('../../Assets/dropDownArrow.svg')} />
              </div>
              {this.state.openBranchList ? this.renderBranchList() : null}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.state.selectedBranch._id && <Navbar style={{ backgroundColor: '#2a3390', height: 75, marginBottom: 20 }} expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize:'.9em' }}>
              <Nav.Link><img alt="home-icon" src={require('../../Assets/homeIcon.svg')} /></Nav.Link>
              {<Can I='getCustomer' a='customer'><Nav.Link onClick={() => this.props.history.push('/customers')}>{local.customers}</Nav.Link></Can>}
              {<Can I='getLoanProduct' a='product'><Can I='getCalculationFormula' a='product'><Nav.Link onClick={() => this.props.history.push('/manage-loans/loan-products')}>{local.loans}</Nav.Link></Can></Can>}
              {<Can I='assignProductToBranch' a='product'><Nav.Link onClick={() => this.props.history.push('/assign-branch-products')}>{local.assignProductToBranch}</Nav.Link></Can>}
              {<Can I='getLoanApplication' a='application'><Nav.Link onClick={() => this.props.history.push('/track-loan-applications')}>{local.loanApplications}</Nav.Link></Can>}
              {<Can I='approveLoanApplication' a='application'><Nav.Link onClick={() => this.props.history.push('/bulk-approvals')}>{local.bulkLoanApplicationsApproval}</Nav.Link></Can>}
              {<Can I='loanUsage' a='config'><Nav.Link onClick={() => this.props.history.push('/loan-uses')}>{local.loanUses}</Nav.Link></Can>}
              {ability.can('getRoles', 'user') ? <Nav.Link onClick={() => this.props.history.push('/manage-accounts/roles')}>{local.manageAccounts}</Nav.Link>
                : ability.can('getUser', 'user') ? <Nav.Link onClick={() => this.props.history.push('/manage-accounts/users')}>{local.manageAccounts}</Nav.Link>
                  : ability.can('getBranch', 'branch') ? <Nav.Link onClick={() => this.props.history.push('/manage-accounts/branches')}>{local.manageAccounts}</Nav.Link> : null}
              {<Can I='documentTypes' a='config'><Nav.Link onClick={() => this.props.history.push('/tools/encoding-files')}>{local.tools}</Nav.Link> </Can>}
              {(ability.can('getIssuedLoan',"application") || ability.can('branchIssuedLoan', "application")) && <Nav.Link onClick={() => this.props.history.push('/loans')}>{local.issuedLoans}</Nav.Link>}
            {<Can  I="viewActionLogs" a='user' ><Nav.Link onClick={()=> this.props.history.push('/logs')}>{local.logs}</Nav.Link></Can>}
            {<Can  I="cibScreen" a='report' ><Nav.Link onClick={() => this.props.history.push('/source-of-fund')}>{local.changeSourceOfFund}</Nav.Link></Can>}
            {<Can  I="cibScreen" a='report' ><Nav.Link onClick={() => this.props.history.push('/cib')}>{local.cib}</Nav.Link></Can>}
            {<Can I = "changeOfficer" a  ="customer"><Can  I='getCustomer' a='customer'><Nav.Link onClick={()=> this.props.history.push('/move-customers')}>{local.moveCustomers}</Nav.Link></Can></Can>}
            <Can I="viewReports" a='report' ><Nav.Link onClick={() => this.props.history.push('/reports')}>{local.reports}</Nav.Link></Can>
            <Nav.Link onClick={() => this.props.history.push('/bulk-creation')}>{local.bulkApplicationCreation}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>}
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(withRouter(NavBar));