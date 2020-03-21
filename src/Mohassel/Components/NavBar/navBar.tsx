import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withRouter } from 'react-router-dom';

interface Props {
    history: [];
}
class NavBar extends Component <Props> {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={()=> this.props.history.push('/new-user')}>Create User</Nav.Link>
                        <Nav.Link onClick={()=> this.props.history.push('/new-formula')}>Create Calculation Method</Nav.Link>
                        <Nav.Link onClick={()=> this.props.history.push('/test-formula')}>Test Calculation Method</Nav.Link>
                        <Nav.Link onClick={()=> this.props.history.push('/new-loan-product')}>Create Loan Product</Nav.Link>
                        <Nav.Link onClick={()=> {
                            document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                            window.location.href = process.env.REACT_APP_LOGIN_URL;
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
        )
    }
}

export default withRouter(NavBar);