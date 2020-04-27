import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withRouter } from 'react-router-dom';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import { getCookie } from '../../Services/getCookie';

interface Props {
  history: any;
}
class NavBar extends Component<Props> {
  render() {
    const roles = JSON.parse(getCookie('roles'))
    return (
      <>
        <Navbar expand="lg" style={{ background: '#f5f5f5', padding: 0 }}>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ flex: 'auto', alignItems: 'center', justifyContent: 'center' }}>
              <Navbar.Brand style={{ marginLeft: 40 }}><img alt="navbar-logo" src={require('../../../Shared/Assets/Logo.svg')} /></Navbar.Brand>
              <Navbar.Text style={{ marginLeft: 40 }}><h5 className="primary-color">{local.lowRateLoan}</h5></Navbar.Text>
              <div className="refresh-logo-navbar"><img alt="navbar-refresh" src={require('../../Assets/refresh.svg')} /></div>
              <div className="info-navbar">
                <span style={{ marginLeft: 10 }}>{local.currentPeriodStartsIn}</span>
                <span style={{ marginLeft: 10 }}>  01/02/2020  </span>
                <span style={{ marginLeft: 10 }}>{local.andEndsIn}</span>
                <span style={{ marginLeft: 100 }} className="primary-color">  29/02/2020  </span>
                <span className="fa fa-map-marker-alt fa-lg" style={{ marginLeft: 20, color: '#7dc356' }}></span>
                <span>سوهاج</span>
              </div>
              <span style={{ marginLeft: 10 }}>{local.welcome}, </span>
              <span style={{ marginLeft: 100 }} className="primary-color">Ahmed({roles})</span>
              <img alt="drop-down-arrow" src={require('../../Assets/dropDownArrow.svg')} />
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
              <Nav.Link onClick={() => {
                document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = process.env.REACT_APP_LOGIN_URL || '';
              }}>Logout</Nav.Link>


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