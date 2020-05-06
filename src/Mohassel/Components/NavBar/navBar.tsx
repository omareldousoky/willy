import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import { Loader } from '../../../Shared/Components/Loader';
import { getCookie } from '../../Services/getCookie';
import { contextBranch } from '../../Services/APIs/Login/contextBranch';
import './styles.scss';

interface Props {
  history: any;
}
interface State {
  selectedBranch: string;
  branches: Array<string>;
  openBranchList: boolean;
  loading: boolean;
}
class NavBar extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedBranch: "",
      branches: [],
      openBranchList: false,
      loading: false
    }
  }
  componentDidMount() {
    const branches = JSON.parse(getCookie('branches'));
    const token = getCookie('token');
    const tokenData = this.parseJwt(token);
    if (branches.length === 1) {
      this.setState({ selectedBranch: branches[0] })
    } else {
      this.setState({ branches: branches })
    }
  }
  parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
  async goToBranch(branch: string) {
    this.setState({ loading: true })
    const res = await contextBranch(branch);
    if (res.status === "success") {
      this.setState({ loading: false, selectedBranch: branch })
      document.cookie = "token=" + res.body.token + ";path=/;";
      const tokenData = this.parseJwt(res.body.token);
      console.log('eltoken', tokenData);
    } else console.log(res)
  }
  renderBranchList() {
    return (
      <div className="navbar-branch-list">
        {this.state.branches.map((branch, index) => {
          return (
            <div key={index}>
              <div className="item" onClick={() => this.goToBranch(branch)}>
                <div style={{ display: 'flex' }}>
                  <div className="pin-icon"><span className="fa fa-map-marker-alt fa-lg"></span></div>
                  <div className="branch-name">
                    <span className="text-muted">{local.goToBranch}</span>
                    <h6>{'دمنهور (دمنهور)'}</h6>
                  </div>
                </div>
                <span className="fa fa-arrow-left"></span>
              </div>
              <hr style={{ margin: 0 }} />
            </div>
          )
        })}
        <div className="item">
          <Button variant="outline-primary" onClick={() => {
                document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = process.env.REACT_APP_LOGIN_URL || '';
              }}>{local.logOut}</Button>
        </div>
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
                  <span style={{ marginLeft: 50 }} className="primary-color">  29/02/2020  </span>
                </div>
              </div>
              <div className="navbar-choose-branch" onClick={() => this.setState({ openBranchList: !this.state.openBranchList })}>
                <div>
                  <div className="selected-branch">
                    <div className="pin-icon"><span className="fa fa-map-marker-alt fa-lg"></span></div>
                    <span>{this.state.selectedBranch === "" ? local.selectBranch : this.state.selectedBranch}</span>
                  </div>
                </div>
                <img alt="drop-down-arrow" src={require('../../Assets/dropDownArrow.svg')} />
                {this.state.openBranchList ? this.renderBranchList() : null}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Navbar style={{ backgroundColor: '#2a3390', height: 75, marginBottom: 20 }} expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link><img alt="home-icon" src={require('../../Assets/homeIcon.svg')} /></Nav.Link>
              {<Can I='create' a='Customer'><Nav.Link onClick={() => this.props.history.push('/new-customer')}>{'Create Customer'}</Nav.Link></Can>}
              {<Can I='edit' a='Customer'><Nav.Link onClick={() => this.props.history.push('/edit-customer')}>{'Edit User'}</Nav.Link></Can>}
              {<Can I='create' a='CalculationMethod'><Nav.Link onClick={() => this.props.history.push('/new-formula')}>Create Calculation Method</Nav.Link></Can>}
              {<Can I='test' a='CalculationMethod'><Nav.Link onClick={() => this.props.history.push('/test-formula')}>Test Calculation Method</Nav.Link></Can>}
              {<Can I='create' a='LoanProduct'><Nav.Link onClick={() => this.props.history.push('/new-loan-product')}>Create Loan Product</Nav.Link></Can>}
              {<Can I='assignToBranch' a='LoanProduct'><Nav.Link onClick={() => this.props.history.push('/assign-branch-products')}>Assign Products To Branch</Nav.Link></Can>}
              {<Can I='create' a='Application'><Nav.Link onClick={() => this.props.history.push('/new-loan-application', { id: '', action: 'under_review' })}>Create Loan Application</Nav.Link></Can>}
              {<Can I='view' a='Application'><Nav.Link onClick={() => this.props.history.push('/track-loan-applications')}>Track Loan Applications</Nav.Link></Can>}
              {<Can I='bulkApprove' a='Application'><Nav.Link onClick={() => this.props.history.push('/bulk-approvals')}>Bulk Loan Applications Approval</Nav.Link></Can>}
              {<Can I='create' a='LoanUsage'><Nav.Link onClick={() => this.props.history.push('/loan-uses')}>Loan Uses</Nav.Link></Can>}
              <Nav.Link onClick={() => this.props.history.push('/manage-accounts')}>Manage Accounts</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/loans')}>Issued Loans</Nav.Link>

              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    )
  }
}

export default withRouter(NavBar);