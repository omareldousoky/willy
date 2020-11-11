import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import * as local from '../../Assets/ar.json';
import Can from '../../../Mohassel/config/Can';
import { Loader } from '../Loader';
import { getCookie } from '../../Services/getCookie';
import { parseJwt, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import { contextBranch } from '../../../Mohassel/Services/APIs/Login/contextBranch';
import ability from '../../../Mohassel/config/ability';
import './styles.scss';
import { setToken } from '../../token';
import { connect } from 'react-redux';
import { Auth } from '../../redux/auth/types'
interface Props {
  history: any;
  auth: Auth;
  hide: boolean;
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
  constructor(props: Props) {
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
      const selectedBranch = getCookie('ltsbranch') ? JSON.parse(getCookie('ltsbranch')) : '';
      if (tokenData?.requireBranch === false) {
        if (branches) {
          return { branches: [...branches, { _id: 'hq', name: local.headquarters }], selectedBranch: { _id: 'hq', name: local.headquarters } }
        } else return { branches: [...state.branches, { _id: 'hq', name: local.headquarters }], selectedBranch: { _id: 'hq', name: local.headquarters } }
      } else return { selectedBranch: selectedBranch? selectedBranch: branches[0], branches: branches }
    } else return null;
  }
  componentDidUpdate(prevProps, prevState){
    if(this.props.auth.validBranches && this.props.auth.validBranches[0] && !prevProps.auth.validBranches ){
      const selectedBranch = getCookie('ltsbranch') ? JSON.parse(getCookie('ltsbranch')) : '';
      this.goToBranch(selectedBranch, false);
    }
  }
  async goToBranch(branch: Branch, refresh: boolean) {
    document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    this.setState({ loading: true, openBranchList: false })
    const res = await contextBranch(branch._id);
    if (res.status === "success") {
      document.cookie = 'ltsbranch=' + JSON.stringify(branch) + (process.env.REACT_APP_DOMAIN ? `;domain=${process.env.REACT_APP_DOMAIN}`: '') + ';path=/;';
      setToken(res.body.token);
      this.setState({ loading: false, selectedBranch: branch })
      if(refresh) this.props.history.push("/");
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
                  <div className="item" onClick={() => this.goToBranch(branch, true)}>
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
            document.cookie = "ltsbranch=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
        {<Navbar style={{ backgroundColor: '#2a3390', height: 75, marginBottom: 20 }} expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize:'.9em' }}>
              <Nav.Link><img alt="home-icon" src={require('../../Assets/homeIcon.svg')} /></Nav.Link>
              {ability.can('getCustomer', 'customer') ? <Nav.Link onClick={() => this.props.history.push('/customers')}>{local.customers}</Nav.Link> 
                : !this.props.hide && ability.can('changeOfficer', 'customer') ? <Nav.Link onClick={() => this.props.history.push('/customers/move-customers')}>{local.customers}</Nav.Link> : null}
              {!this.props.hide && ability.can('getLoanProduct', 'product') ? <Nav.Link onClick={() => this.props.history.push('/manage-loans/loan-products')}>{local.loans}</Nav.Link>
               : !this.props.hide && ability.can('getCalculationFormula' ,'product') ? <Nav.Link onClick={() => this.props.history.push('/manage-loans/calculation-formulas')}>{local.loans}</Nav.Link>
                : !this.props.hide && ability.can('assignProductToBranch', 'product') ? <Nav.Link onClick={() => this.props.history.push('/manage-loans/assign-products-branches')}>{local.assignProductToBranch}</Nav.Link> : null}
              {ability.can('getLoanApplication', 'application') ? <Nav.Link onClick={() => this.props.history.push('/track-loan-applications')}>{local.loanApplications}</Nav.Link> 
               : !this.props.hide && ability.can('approveLoanApplication', 'application') ? <Nav.Link onClick={() => this.props.history.push('/track-loan-applications/bulk-approvals')}>{local.loanApplications}</Nav.Link> 
                : !this.props.hide && ability.can('createLoan', 'application') ? <Nav.Link onClick={() => this.props.history.push('/track-loan-applications/bulk-creation')}>{local.loanApplications}</Nav.Link> : null}
              {!this.props.hide && <Can I='loanUsage' a='config'><Nav.Link onClick={() => this.props.history.push('/loan-uses')}>{local.loanUses}</Nav.Link></Can>}
              {!this.props.hide && ability.can('getRoles', 'user') ? <Nav.Link onClick={() => this.props.history.push('/manage-accounts/roles')}>{local.manageAccounts}</Nav.Link>
                : !this.props.hide && ability.can('getUser', 'user') ? <Nav.Link onClick={() => this.props.history.push('/manage-accounts/users')}>{local.manageAccounts}</Nav.Link>
                  : !this.props.hide && ability.can('getBranch', 'branch') ? <Nav.Link onClick={() => this.props.history.push('/manage-accounts/branches')}>{local.manageAccounts}</Nav.Link> : null}
              {!this.props.hide && ability.can('documentTypes', 'config') ? <Nav.Link onClick={() => this.props.history.push('/tools/encoding-files')}>{local.tools}</Nav.Link>
                : !this.props.hide && ability.can('geoArea', 'config') ? <Nav.Link onClick={() => this.props.history.push('/tools/geo-areas')}>{local.tools}</Nav.Link>
                 : !this.props.hide && ability.can('createMaxPrincipal', 'config') ? <Nav.Link onClick={() => this.props.history.push('/tools/principalRange')}>{local.tools}</Nav.Link> : null}
              {(ability.can('getIssuedLoan',"application") || ability.can('branchIssuedLoan', "application")) ? <Nav.Link onClick={() => this.props.history.push('/loans')}>{local.issuedLoans}</Nav.Link>
               : !this.props.hide && ability.can('cibScreen', 'report') ? <Nav.Link onClick={() => this.props.history.push('/loans/cib')}>{local.issuedLoans}</Nav.Link> 
                 : !this.props.hide && ability.can('cibScreen', 'report') ? <Nav.Link onClick={() => this.props.history.push('/loans/source-of-fund')}>{local.issuedLoans}</Nav.Link> : null}
            {!this.props.hide && <Can  I="viewActionLogs" a='user' ><Nav.Link onClick={()=> this.props.history.push('/logs')}>{local.logs}</Nav.Link></Can>}
            {!this.props.hide && <Can I="viewReports" a='report' ><Nav.Link onClick={() => this.props.history.push('/reports')}>{local.reports}</Nav.Link></Can>}
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