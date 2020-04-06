import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withRouter } from 'react-router-dom';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
  history: Array<string>;
}
class NavBar extends Component<Props> {
  render() {
    return (
      <>
        <Navbar expand="lg" style={{ background: '#f5f5f5', padding: 0 }}>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" style={{ flex: 'auto', alignItems: 'center', margin: '0px 30px', justifyContent: 'space-evenly' }}>
              <Navbar.Brand><img alt="navbar-logo" src="/src/Login/Assets/Logo.svg" /></Navbar.Brand>
              <Navbar.Text><h5 className="primary-color">{local.lowRateLoan}</h5></Navbar.Text>
              <div className="refresh-logo-navbar"><img alt="navbar-refresh" src="/src/Mohassel/Assets/refresh.svg" /></div>
              <div className="info-navbar">
                <span>{local.currentPeriodStartsIn}</span>
                <span>  01/02/2020  </span>
                <span>{local.andEndsIn}</span>
                <span style={{marginLeft: 100}} className="primary-color">  29/02/2020  </span>
                <span className="fa fa-map-marker-alt fa-lg" style={{marginLeft: 20, color: '#7dc356'}}></span>
                <span>سوهاج</span>
              </div>
              <span>{local.welcome}, <span className="primary-color">Ahmed</span> </span>
              <img alt="drop-down-arrow" src="/src/Mohassel/Assets/dropDownArrow.svg"/>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.props.history.push('/new-customer')}>Create User</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/edit-customer')}>Edit User</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/new-formula')}>Create Calculation Method</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/test-formula')}>Test Calculation Method</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/new-loan-product')}>Create Loan Product</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/assign-branch-products')}>Assign Products To Branch</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/new-loan-application')}>Create Loan Application</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/track-loan-applications')}>Track Loan Applications</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/bulk-approvals')}>Bulk Loan Applications Approval</Nav.Link>
              <Nav.Link onClick={() => this.props.history.push('/loan-uses')}>Loan Uses</Nav.Link>
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