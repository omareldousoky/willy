import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { manageAccountsArray } from './manageAccountsInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import Can from '../../../Shared/config/Can'
import { getRoles } from '../../../Shared/Services/APIs/Roles/roles'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'

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
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  render() {
    return (
      <div>
        <HeaderWithCards
          header={local.manageAccounts}
          array={this.state.manageAccountTabs}
          active={0}
        />
        <Card className="m-4">
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body className="p-0">
            <div className="d-flex justify-content-between m-3">
              <div className="d-flex align-items-center">
                <Card.Title className="mr-4 mb-0">{local.roles}</Card.Title>
                <span>{local.noOfRoles + ` (${this.state.totalCount})`}</span>
              </div>
              <div>
                <Can I="createRoles" a="user">
                  <Button
                    className="mr-4 big-button"
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
                  className="mb-4 w-50"
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
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <h5 style={{ marginLeft: 50, minWidth: 50 }}>
                            #{index + 1}
                          </h5>
                          <div style={{ marginLeft: 150, minWidth: 200 }}>
                            <span className="text-primary">
                              {local.roleName}
                            </span>
                            <h6>{el.roleName}</h6>
                          </div>
                          <div>
                            <span className="text-primary">
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
