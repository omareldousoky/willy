import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { withRouter } from 'react-router-dom'
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import RoleTable from './roleTable'
import { getPermissions } from '../../Services/APIs/Roles/roles'
import { Section } from './roleCreation'
import RoleUsers from './roleUsers'
import BackButton from '../BackButton/back-button'
import { getErrorMessage } from '../../../Shared/Services/utils'

interface Role {
  permissions: Array<any>
  hasBranch: boolean
  roleName: string
  _id: string
}
interface State {
  role: Role
  activeTab: string
  allSections: Array<Section>
  tabsArray: Array<Tab>
  loading: boolean
}

interface Props {
  history: any
  location: any
}
class RoleProfile extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      role: {
        _id: '',
        hasBranch: false,
        permissions: [],
        roleName: '',
      },
      activeTab: 'roleDetails',
      tabsArray: [
        {
          header: local.roles,
          stringKey: 'roleDetails',
        },
        {
          header: local.users,
          stringKey: 'roleUsers',
        },
      ],
      loading: false,
      allSections: [],
    }
  }

  componentDidMount() {
    const role = this.props.history.location.state
    this.setState(
      {
        role,
      },
      () => this.getAllPermissions()
    )
  }

  async getAllPermissions() {
    this.setState({ loading: true })
    const id = this.state.role.hasBranch ? 'branch' : 'hq'
    const res = await getPermissions(id)
    if (res.status === 'success') {
      this.setState({
        loading: false,
        allSections: res.body.actions,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'roleDetails':
        return (
          <div>
            <Form
              style={{
                textAlign: 'right',
                backgroundColor: '#f7fff2',
                padding: 15,
                border: '1px solid #e5e5e5',
              }}
            >
              <h5>{local.role}</h5>
              <Form.Row>
                <Form.Group as={Col} md="4" className="d-flex flex-column">
                  <Form.Label style={{ color: '#6e6e6e' }}>
                    {local.roleName}
                  </Form.Label>
                  <Form.Label>{this.state.role.roleName} </Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="4" className="d-flex flex-column">
                  <Form.Label style={{ color: '#6e6e6e' }}>
                    {local.permissions}
                  </Form.Label>
                  <Form.Label>
                    {this.state.role.hasBranch
                      ? local.branchPermissions
                      : local.allPermissions}
                  </Form.Label>
                </Form.Group>
              </Form.Row>
            </Form>
            <div className="d-flex">
              <span
                style={{
                  padding: '5px',
                  margin: ' 30px 30px 10px 0px',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                <img
                  style={{ float: 'right', margin: '0px 5px' }}
                  alt="search-icon"
                  src={require('../../Assets/permissions-inactive.svg')}
                />{' '}
                {local.permissions}
              </span>
            </div>
            <RoleTable
              sections={this.state.allSections}
              permissions={this.state.role.permissions}
            />
          </div>
        )
      case 'roleUsers':
        return <RoleUsers {...this.state.role} />
      default:
        return null
    }
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        {Object.keys(this.state.role).length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <BackButton title={local.roleDetails} />
              <div>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.props.history.push({
                      pathname: '/manage-accounts/roles/edit-role',
                      state: { role: this.state.role },
                    })
                  }}
                >
                  <img alt="edit" src={require('../../Assets/editIcon.svg')} />{' '}
                  {local.edit}
                </span>
              </div>
            </div>
            <Card style={{ marginTop: 15 }}>
              <CardNavBar
                header="here"
                array={this.state.tabsArray}
                active={this.state.activeTab}
                selectTab={(index: string) =>
                  this.setState({ activeTab: index })
                }
              />
              <Loader type="fullscreen" open={this.state.loading} />
              <div>{this.renderContent()}</div>
            </Card>
          </div>
        )}
      </div>
    )
  }
}
export default withRouter(RoleProfile)
