import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import './userDetails.scss'
import UserDetailsView from './userDetailsView'
import { getUserDetails } from '../../../Shared/Services/APIs/Users/userDetails'
import { UserDateValues } from './userDetailsInterfaces'
import { Loader } from '../../../Shared/Components/Loader'
import UserRolesView from './userRolesView'
import { setUserActivation } from '../../../Shared/Services/APIs/Users/userActivation'
import CustomersForUser from './customersForUser'
import {
  CardNavBar,
  Tab,
} from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import Can from '../../config/Can'
import ability from '../../config/ability'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { ProfileActions } from '../../../Shared/Components'

interface State {
  activeTab: string
  isLoading: boolean
  data: UserDateValues
  tabsArray: Array<Tab>
}
class UserDetails extends Component<
  RouteComponentProps<{}, {}, { details: string }>,
  State
> {
  constructor(props: RouteComponentProps<{}, {}, { details: string }>) {
    super(props)
    this.state = {
      activeTab: 'userDetails',
      isLoading: false,
      tabsArray: [],
      data: {
        updated: { by: '', at: 0 },
        created: { by: '', at: 0 },
        username: '',
        name: '',
        nationalId: '',
        nationalIdIssueDate: 0,
        gender: '',
        birthDate: 0,
        branches: [],
        roles: [],
        _id: '',
        hiringDate: 0,
        hrCode: '',
        mobilePhoneNumber: '',
        mainBranchId: '',
        status: '',
        branchesObjects: [{ _id: '', name: '' }],
      },
    }
  }

  componentDidMount() {
    const tabsToRender = [
      {
        header: local.userBasicData,
        stringKey: 'userDetails',
      },
    ]
    if (ability.can('getRoles', 'user')) {
      tabsToRender.push({
        header: local.userRoles,
        stringKey: 'userRoles',
      })
    }
    if (ability.can('moveOfficerCustomers', 'user')) {
      tabsToRender.push({
        header: local.customers,
        stringKey: 'customersForUser',
      })
    }
    this.setState(
      {
        isLoading: true,
        tabsArray: tabsToRender,
      },
      () => this.getUserDetails()
    )
  }

  async handleActivationClick() {
    const id = this.props.location.state.details
    const req = {
      id,
      status: this.state.data.status === 'active' ? 'inactive' : 'active',
    }
    this.setState({ isLoading: true })

    const res = await setUserActivation(req)
    if (res.status === 'success') {
      await this.getUserDetails()
      Swal.fire({
        title: local.success,
        text: `${this.state.data.username} is ${req.status} now`,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
    } else {
      this.setState({ isLoading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  setUserDetails(data: any): UserDateValues {
    const { user } = data
    user.branches = data.branches?.map((branch) => {
      return branch.name
    })
    user.branchesObjects = data.branches ? data.branches : []
    user.roles = data.roles
    return user
  }

  async getUserDetails() {
    const _id = this.props.location.state.details
    const res = await getUserDetails(_id)
    const user = this.setUserDetails(res.body)
    if (res.status === 'success') {
      this.setState({
        data: user,
        isLoading: false,
      })
    } else {
      this.setState({ isLoading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  renderICons() {
    const id = this.props.location.state.details
    return (
      <div className="rowContainer">
        <ProfileActions
          actions={[
            {
              onActionClick: () =>
                this.props.history.push({
                  pathname: '/manage-accounts/users/edit-user',
                  state: { details: id },
                }),
              icon: 'edit',
              title: local.edit,
              permission: ability.can('updateUser', 'user'),
            },
            {
              onActionClick: async () => this.handleActivationClick(),
              icon:
                this.state.data.status === 'active'
                  ? 'deactivate-user'
                  : 'check-circle',
              title:
                this.state.data.status === 'active'
                  ? local.deactivate
                  : local.activate,
              permission: ability.can('userActivation', 'user'),
            },
          ]}
        />
      </div>
    )
  }

  renderTabs(): any {
    switch (this.state.activeTab) {
      case 'userDetails':
        return <UserDetailsView data={this.state.data} />
      case 'userRoles':
        return (
          <Can I="getRoles" a="user">
            <UserRolesView roles={this.state.data.roles} />
          </Can>
        )
      case 'customersForUser':
        return (
          <Can I="moveOfficerCustomers" a="user">
            <CustomersForUser
              id={this.state.data._id}
              name={this.state.data.name}
              user={this.state.data}
            />
          </Can>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="rowContainer">
          <BackButton
            title={
              this.props.location?.pathname?.includes('loanOfficer-details')
                ? local.loanOfficerDetails
                : local.userDetails
            }
          />
          {this.renderICons()}
        </div>
        <Card className="card">
          <Loader type="fullsection" open={this.state.isLoading} />
          <CardNavBar
            array={this.state.tabsArray}
            active={this.state.activeTab}
            selectTab={(index: string) => this.setState({ activeTab: index })}
          />
          <Card.Body>{this.renderTabs()}</Card.Body>
        </Card>
      </>
    )
  }
}

export default withRouter(UserDetails)
