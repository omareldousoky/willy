import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { getRoles } from '../../../Shared/Services/APIs/Roles/roles'
import Can from '../../config/Can'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageAccountsArray } from './manageAccountsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'

interface State {
  data: any
  totalCount: number
  filterRoles: string
  loading: boolean
  manageAccountTabs: any[]
}

class RolesList extends Component<RouteComponentProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      totalCount: 0,
      loading: false,
      filterRoles: '',
      manageAccountTabs: [],
    }
  }

  componentDidMount() {
    this.getRoles()
    this.setState({
      manageAccountTabs: manageAccountsArray(),
    })
  }

  async getRoles() {
    this.setState({ loading: true })
    const res = await getRoles()
    if (res.status === 'success') {
      this.setState({
        data: res.body.roles,
        totalCount: res.body.roles.length,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  render() {
    return (
      <div>
        <HeaderWithCards
          header={local.manageAccounts}
          array={this.state.manageAccountTabs}
          active={this.state.manageAccountTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('role')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.roles}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfRoles + ` (${this.state.totalCount})`}
                </span>
              </div>
              <div>
                <Can I="createRoles" a="user">
                  <Button
                    className="big-button"
                    style={{ marginLeft: 20 }}
                    onClick={() =>
                      this.props.history.push('/manage-accounts/roles/new-role')
                    }
                  >
                    {local.createNewRole}
                  </Button>
                </Can>
              </div>
            </div>
            {this.state.data.length > 0 && (
              <div className="d-flex flex-row justify-content-center">
                <Form.Control
                  type="text"
                  data-qc="filterLoanUsage"
                  placeholder={local.search}
                  style={{ marginBottom: 20, width: '60%' }}
                  maxLength={100}
                  value={this.state.filterRoles}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ filterRoles: e.currentTarget.value })
                  }
                />
              </div>
            )}
            {this.state.data
              .filter((loanUse) =>
                loanUse.roleName
                  .toLocaleLowerCase()
                  .includes(this.state.filterRoles.toLocaleLowerCase())
              )
              .map((el, index) => {
                const role = el
                return (
                  <Card
                    style={{ margin: '2rem', cursor: 'pointer' }}
                    key={index}
                    onClick={() =>
                      this.props.history.push(
                        `/manage-accounts/roles/role-profile`,
                        role
                      )
                    }
                  >
                    <Card.Body>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <h5 style={{ marginLeft: 50, minWidth: 50 }}>
                            #{index + 1}
                          </h5>
                          <div style={{ marginLeft: 150, minWidth: 200 }}>
                            <span className="text-muted">{local.roleName}</span>
                            <h6>{el.roleName}</h6>
                          </div>
                          <div>
                            <span className="text-muted">
                              {local.permissions}
                            </span>
                            <h6>
                              {el.hasBranch
                                ? local.branchPermissions
                                : local.allPermissions}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )
              })}
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default withRouter(RolesList)
