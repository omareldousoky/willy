import React, { Component } from 'react'
import './userCreation.scss'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import Container from 'react-bootstrap/Container'
import * as local from '../../../Shared/Assets/ar.json'
import { theme } from '../../../Shared/theme'
import { RolesBranchesValues } from './userCreationinterfaces'
import DualBox from '../../../Shared/Components/DualListBox/dualListBox'
import { customFilterOption } from '../../../Shared/Services/utils'
import { LtsIcon } from '../../../Shared/Components'

interface Props {
  values: RolesBranchesValues
  userRolesOptions: Array<object>
  userBranchesOptions: Array<object>
  handleSubmit: any
  previousStep: any
}
interface State {
  hasBranch: boolean
  showRolesError: boolean
  showBranchesError: boolean
  roles: Array<object>
  branches: Array<object>
  key: string
}
class UserRolesAndPermissionsFrom extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasBranch: false,
      showBranchesError: false,
      showRolesError: false,
      roles: [],
      // eslint-disable-next-line react/no-unused-state
      branches: [],
      key: '',
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.values.roles !== state.roles && state.key !== 'updated') {
      let rolesState = false
      // eslint-disable-next-line no-unused-expressions
      props.values.roles?.map((role) => {
        if (role.hasBranch === true) {
          rolesState = true
        }
      })
      return {
        roles: props.values.roles,
        branches: props.values.branches,
        hasBranch: rolesState,
        key: 'updated',
      }
    }
    return null
  }

  handleChange(list) {
    this.props.values.branches = list
    // eslint-disable-next-line react/no-unused-state
    this.setState({ branches: list })
    if (this.state.hasBranch && list.length === 0) {
      this.setState({ showBranchesError: true })
    } else {
      this.setState({ showBranchesError: false })
    }
  }

  hasBranch(roles): boolean {
    let rolesState = false
    // eslint-disable-next-line no-unused-expressions
    roles?.map((role) => {
      if (role.hasBranch === true) {
        rolesState = true
      }
    })
    return rolesState
  }

  render() {
    return (
      <Container>
        <Form.Group controlId="roles">
          <Form.Label className="user-role-label">
            {local.selectUserPermission}
          </Form.Label>
          <Select
            styles={theme.selectStyleWithBorder}
            theme={theme.selectTheme}
            isMulti
            isSearchable
            filterOption={customFilterOption}
            placeholder={
              <span style={{ width: '100%', padding: '5px', margin: '5px' }}>
                <LtsIcon name="search" />

                {local.searchByUserRole}
              </span>
            }
            name="roles"
            data-qc="roles"
            onChange={(event: any) => {
              this.props.values.roles = event
              const check = this.hasBranch(event)
              this.setState({
                hasBranch: check,
                showRolesError: !event,
              })
              this.props.values.roles = event
              this.setState({ roles: event })

              if (!check || !event) {
                this.props.values.branches = []
                // eslint-disable-next-line react/no-unused-state
                this.setState({ branches: [] })
              }

              this.setState({
                showBranchesError: check && !this.props.values.branches,
              })
            }}
            value={this.state.roles}
            options={this.props.userRolesOptions}
          />
          {this.state.showRolesError && (
            <div style={{ color: 'red', fontSize: '15px', margin: '10px' }}>
              {local.rolesIsRequired}
            </div>
          )}
        </Form.Group>
        {this.state.hasBranch && (
          <Form.Group controlId="branches">
            <Form.Label className="user-role-label">{local.branch}</Form.Label>
            {this.state.showBranchesError && (
              <div style={{ color: 'red', fontSize: '15px', margin: '10px' }}>
                {local.branchIsRequired}
              </div>
            )}
            <DualBox
              labelKey="branchName"
              selected={this.props.values.branches}
              onChange={(list) => {
                this.handleChange(list)
              }}
              rightHeader={local.allBranches}
              leftHeader={local.selectedBranches}
              options={this.props.userBranchesOptions}
              className="p-0"
            />
          </Form.Group>
        )}
        <div className="d-flex justify-content-between">
          <Button
            className="btn-cancel-prev w-25"
            data-qc="previous"
            onClick={() => {
              this.props.previousStep(this.props.values)
            }}
          >
            {local.previous}
          </Button>
          <Button
            variant="primary"
            className="w-25"
            onClick={this.props.handleSubmit}
            disabled={
              this.state.showRolesError ||
              this.state.showBranchesError ||
              (this.state.hasBranch && this.props.values.branches?.length === 0)
            }
            type="button"
            data-qc="next"
          >
            {local.next}
          </Button>
        </div>
      </Container>
    )
  }
}

export default UserRolesAndPermissionsFrom
