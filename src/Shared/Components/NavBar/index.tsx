import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import InputGroup from 'react-bootstrap/InputGroup'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import * as local from '../../Assets/ar.json'
import { Loader } from '../Loader'
import { clearAllCookies, getCookie } from '../../Services/getCookie'
import { parseJwt, timeToDateyyymmdd } from '../../Services/utils'
import { contextBranch } from '../../../Mohassel/Services/APIs/Login/contextBranch'
import './styles.scss'
import { setToken } from '../../token'
import { Auth } from '../../redux/auth/types'
import { logout } from '../../../Mohassel/Services/APIs/Auth/logout'
import ChangePasswordModal from '../changePasswordModal/changePasswordModal'
import { LtsNav } from './LtsNav'
import { CfNav } from './CfNav'

interface Props extends RouteComponentProps {
  auth: Auth
  isLTS: boolean
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
                <img
                  alt="navbar-logo"
                  className={this.props.isLTS ? '' : 'px-4'}
                  src={
                    this.props.isLTS
                      ? require('../../Assets/Logo.svg')
                      : require('../../Assets/HalanLogo.svg')
                  }
                />
              </Navbar.Brand>
              {this.props.isLTS && (
                <Navbar.Text className="mx-5">
                  <h5 className="text-primary font-weight-bold">
                    {local.lowRateLoan}
                  </h5>
                </Navbar.Text>
              )}
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
          {this.props.isLTS ? <LtsNav hide={this.props.hide} /> : <CfNav />}
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
