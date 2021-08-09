import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { withRouter } from 'react-router-dom'

export const CfNavbar = () => {
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
      </Nav>
    </Navbar.Collapse>
  )
}

export const CfNav = withRouter(CfNavbar)
