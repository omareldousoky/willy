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
import { parseJwt } from '../../Services/utils';
import { contextBranch } from '../../Services/APIs/Login/contextBranch';
import store from '../../redux/store';
import './styles.scss';
import { setToken } from  '../../../Shared/token';
interface Props {
  history: any;
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
  componentDidMount() {
    store.subscribe(() => {
      if (store.getState().auth.loading === false) {
        const branches = store.getState().auth.validBranches;
        if (branches?.length === 1) {
          this.setState({ selectedBranch: branches[0], branches: branches })
        }
        const token = getCookie('token');
        const tokenData = parseJwt(token);
        if (tokenData?.requireBranch === false) {
          if (branches) {
            this.setState({ branches: [...branches, { _id: 'hq', name: local.headquarters }], selectedBranch: { _id: 'hq', name: local.headquarters } })
          } else this.setState({ branches: [...this.state.branches, { _id: 'hq', name: local.headquarters }], selectedBranch: { _id: 'hq', name: local.headquarters } })
        } else this.setState({ branches })
        if (tokenData.branch !== "") {
          this.setState({ selectedBranch: branches.find(branch => branch._id === tokenData.branch) })
        }
      }
    });
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
                  <span style={{ marginLeft: 10 }} className="primary-color">  01/02/2020  </span>
                  <span style={{ marginLeft: 10 }}>{local.andEndsIn}</span>
                  <span className="primary-color">  29/02/2020  </span>
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
            <Nav className="mr-auto">
              <Nav.Link><img alt="home-icon" src={require('../../Assets/homeIcon.svg')} /></Nav.Link>
              {<Can I='getCustomer' a='customer'><Nav.Link onClick={() => this.props.history.push('/customers')}>{local.customers}</Nav.Link></Can>}
              {<Can I='createCalculationFormula' a='product'><Nav.Link onClick={() => this.props.history.push('/new-formula')}>{local.createCalculationMethod}</Nav.Link></Can>}
              {<Can I='testCalculate' a='product'><Nav.Link onClick={() => this.props.history.push('/test-formula')}>{local.testCalculationMethod}</Nav.Link></Can>}
              {<Can I='createLoanProduct' a='product'><Nav.Link onClick={() => this.props.history.push('/new-loan-product')}>{local.createLoanProduct}</Nav.Link></Can>}
              {<Can I='assignProductToBranch' a='product'><Nav.Link onClick={() => this.props.history.push('/assign-branch-products')}>{local.assignProductToBranch}</Nav.Link></Can>}
              {<Can I='assignProductToCustomer' a='application'><Nav.Link onClick={() => this.props.history.push('/new-loan-application', { id: '', action: 'under_review' })}>{local.createLoanApplication}</Nav.Link></Can>}
              {<Can I='getLoanApplication' a='application'><Nav.Link onClick={() => this.props.history.push('/track-loan-applications')}>{local.loanApplications}</Nav.Link></Can>}
              {<Can I='approveLoanApplication' a='application'><Nav.Link onClick={() => this.props.history.push('/bulk-approvals')}>{local.bulkLoanApplicationsApproval}</Nav.Link></Can>}
              {<Can I='loanUsage' a='config'><Nav.Link onClick={() => this.props.history.push('/loan-uses')}>{local.loanUses}</Nav.Link></Can>}
              {<Can I='getUser' a='user'><Can I='getRoles' a='user'><Can I='getBranch' a='branch'><Nav.Link onClick={() => this.props.history.push('/manage-accounts/roles')}>{local.manageAccounts}</Nav.Link></Can></Can></Can>}
              {<Can I='getIssuedLoan' a='application'><Nav.Link onClick={() => this.props.history.push('/loans')}>{local.issuedLoans}</Nav.Link></Can>}

              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>}
      </>
    )
  }
}

export default withRouter(NavBar);