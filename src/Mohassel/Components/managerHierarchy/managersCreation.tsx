import React, { Component } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import UsersSearch from './usersSearch'
import { getManagerHierarchy } from '../../Services/APIs/ManagerHierarchy/getManagerHierarchy'
import { updateManagerHierarchy } from '../../Services/APIs/ManagerHierarchy/updateManagersHierarchy'
import { searchUsers } from '../../Services/APIs/Users/searchUsers'
import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../config/Can'
import ability from '../../config/ability'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { Managers } from './branchBasicsCard'

interface Props {
  branchId: string
}
interface State {
  values: Managers
  loading: boolean
  disabled: boolean
  users: []
}
class ManagersCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      values: {
        branchManager: { id: '', name: '' },
        operationsManager: { id: '', name: '' },
        areaManager: { id: '', name: '' },
        areaSupervisor: { id: '', name: '' },
        centerManager: { id: '', name: '' },
      },
      disabled: true,
      users: [],
    }
  }

  componentDidMount() {
    if (ability.can('updateBranchManagersHierarchy', 'branch')) {
      this.setState({ disabled: false })
    }
    this.setState({ loading: true })
    this.getManagers()
    this.getUsers()
    this.setState({ loading: false })
  }

  async getUsers() {
    this.setState({ loading: true })
    const query = { from: 0, size: 100, status: 'active' }
    const res = await searchUsers(query)
    if (res.status == 'success' && res.body.data) {
      this.setState({ users: res.body.data })
    }
    this.setState({ loading: false })
  }

  async getManagers() {
    const res = await getManagerHierarchy(this.props.branchId)
    if (res.status === 'success') {
      const values = {
        operationsManager: res.body.data.operationsManager,
        areaManager: res.body.data.areaManager,
        areaSupervisor: res.body.data.areaSupervisor,
        centerManager: res.body.data.centerManager,
        branchManager: res.body.data.branchManager,
      }
      this.setState({
        values,
      })
    }
  }

  async updateManagers() {
    this.setState({ loading: true })
    const obj = this.prepareManagers()
    const res = await updateManagerHierarchy(obj, this.props.branchId)
    if (res.status == 'success') {
      Swal.fire('Success !', local.updateSuccess, 'success')
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
    this.setState({ loading: false })
  }

  prepareManagers() {
    const managers = {
      operationsManager: this.state.values?.operationsManager?.id,
      areaManager: this.state.values?.areaManager?.id,
      areaSupervisor: this.state.values?.areaSupervisor?.id,
      centerManager: this.state.values?.centerManager?.id,
      branchManager: this.state.values?.branchManager?.id,
    }

    return managers
  }

  render() {
    return (
      <div>
        <Loader open={this.state.loading} type="fullscreen" />
        <Form className="managers-form">
          <Form.Group
            className="managers-form-group"
            as={Col}
            id="operationsManager"
          >
            <Form.Label className="managers-label">
              {local.operationsManager}
            </Form.Label>
            <Row>
              <UsersSearch
                usersInitial={this.state.users}
                objectKey="operationsManager"
                item={this.state.values}
                disabled={this.state.disabled}
              />{' '}
            </Row>
          </Form.Group>
          <Form.Group
            className="managers-form-group"
            as={Col}
            id="districtManager"
          >
            <Form.Label className="managers-label">
              {local.districtManager}
            </Form.Label>
            <Row>
              <UsersSearch
                usersInitial={this.state.users}
                objectKey="areaManager"
                item={this.state.values}
                disabled={this.state.disabled}
              />{' '}
            </Row>
          </Form.Group>
          <Form.Group
            className="managers-form-group"
            as={Col}
            id="districtSupervisor"
          >
            <Form.Label className="managers-label">
              {local.districtSupervisor}
            </Form.Label>
            <Row>
              <UsersSearch
                usersInitial={this.state.users}
                objectKey="areaSupervisor"
                item={this.state.values}
                disabled={this.state.disabled}
              />{' '}
            </Row>
          </Form.Group>
          <Form.Group
            className="managers-form-group"
            as={Col}
            id="centerManager"
          >
            <Form.Label className="managers-label">
              {local.centerManager}
            </Form.Label>
            <Row>
              <UsersSearch
                usersInitial={this.state.users}
                objectKey="centerManager"
                item={this.state.values}
                disabled={this.state.disabled}
              />{' '}
            </Row>
          </Form.Group>
          <Form.Group
            className="managers-form-group"
            as={Col}
            id="branchManager"
          >
            <Form.Label className="managers-label">
              {local.branchManager}
            </Form.Label>
            <Row>
              <UsersSearch
                usersInitial={this.state.users}
                objectKey="branchManager"
                item={this.state.values}
                disabled={this.state.disabled}
              />{' '}
            </Row>
          </Form.Group>
        </Form>
        <Can I="updateBranchManagersHierarchy" a="branch">
          <Form.Group>
            <Button
              className="save-button"
              onClick={async () => {
                await this.updateManagers()
              }}
            >
              {local.save}
            </Button>
          </Form.Group>
        </Can>
      </div>
    )
  }
}
export default withRouter(ManagersCreation)
