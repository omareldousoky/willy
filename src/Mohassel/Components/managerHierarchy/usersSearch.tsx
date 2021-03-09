import React, { Component } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import AsyncSelect from 'react-select/async'
import { theme } from '../../../theme'
import * as local from '../../../Shared/Assets/ar.json'
import { searchUsers } from '../../Services/APIs/Users/searchUsers'
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer'
import { LoanOfficer } from '../../../Shared/Services/interfaces'

const dropDownKeys = ['name', 'hrCode', 'nationalId']
interface State {
  dropDownValue: string
  showError: boolean
  users: Array<LoanOfficer>
  updateKey: string
}
interface Props {
  objectKey: string | number
  item: object | Array<object>
  disabled?: boolean
  isLoanOfficer?: boolean
  branchId?: string
  usersInitial: Array<LoanOfficer>
}
class UsersSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      dropDownValue: 'name',
      showError: false,
      users: [],
      updateKey: '',
    }
  }

  getArValue(key: string) {
    switch (key) {
      case 'name':
        return local.name
      case 'nationalId':
        return local.nationalId
      case 'hrCode':
        return local.hrCode
      default:
        return ''
    }
  }

  getUsers = async (input: string) => {
    const query = {
      from: 0,
      size: 500,
      hrCode: '',
      name: '',
      nationalId: '',
      branchId: this.props.objectKey === 'leader' ? this.props.branchId : '',
    }
    query[this.state.dropDownValue] = input

    if (this.props.isLoanOfficer) {
      const officerQuery = { ...query, branchId: this.props.branchId }
      const res = await searchLoanOfficer(officerQuery)
      if (res.status === 'success' && res.body.data) {
        this.setState({ users: res.body.data })
        return res.body.data
      }
      this.setState({ users: [] })
      return []
    }
    const res = await searchUsers({ ...query, status: 'active' })
    if (res.status === 'success' && res.body.data) {
      this.setState({ users: res.body.data })
      return res.body.data
    }
    this.setState({ users: [] })
    return []
  }

  static getDerivedStateFromProps(props, state) {
    if (
      state.updateKey !== 'updated' &&
      props.usersInitial.length > 0 &&
      props.usersInitial !== state.users
    ) {
      return {
        updateKey: 'updated',
        users: props.usersInitial,
      }
    }
    return null
  }

  checkError() {
    if (this.props.item[this.props.objectKey] === '') {
      this.setState({ showError: true })
    } else {
      this.setState({ showError: false })
    }
  }

  selectUser(event) {
    this.props.item[this.props.objectKey] = { id: event._id, name: event.name }
    const index = this.state.users.findIndex((user) => user._id === event._id)

    this.setState((prevState) => {
      const newUsers = prevState.users
      newUsers.splice(index, 1)
      return { users: newUsers }
    })
    this.checkError()
  }

  render() {
    return (
      <>
        <InputGroup className="row-nowrap">
          {dropDownKeys && dropDownKeys.length ? (
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              title={this.getArValue(this.state.dropDownValue)}
              id="input-group-dropdown-2"
              data-qc="search-dropdown"
            >
              {dropDownKeys.map((key, index) => (
                <Dropdown.Item
                  key={index}
                  data-qc={key}
                  onClick={() => {
                    this.setState({ dropDownValue: key })
                  }}
                >
                  {this.getArValue(key)}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          ) : null}
          <InputGroup.Append>
            <InputGroup.Text style={{ background: '#fff' }}>
              <span className="fa fa-search fa-rotate-90" />
            </InputGroup.Text>
          </InputGroup.Append>
          <div style={{ margin: 0, width: '60%' }}>
            <AsyncSelect
              key={this.props.objectKey}
              onBlur={() => {
                this.checkError()
              }}
              name="users"
              data-qc="users"
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              getOptionValue={(option) => option[this.state.dropDownValue]}
              getOptionLabel={(option) => option.name}
              loadOptions={this.getUsers}
              onChange={(user) => {
                this.selectUser(user)
              }}
              value={
                this.state.users?.find(
                  (item) =>
                    item?._id === this.props.item[this.props.objectKey]?.id
                )
                  ? this.state.users?.find(
                      (item) =>
                        item._id === this.props.item[this.props.objectKey].id
                    )
                  : this.props.item[this.props.objectKey]
              }
              cacheOptions
              defaultOptions
            />
          </div>
          {this.state.showError && (
            <Form.Label className="error-label">{local.required}</Form.Label>
          )}
        </InputGroup>
      </>
    )
  }
}

export default UsersSearch
