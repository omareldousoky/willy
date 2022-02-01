import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import {
  CardNavBar,
  Tab,
} from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import * as local from '../../../Shared/Assets/ar.json'
import BranchDetailsView from './branchDetailsView'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import { getBranchById } from '../../../Shared/redux/branch/actions'
import { BranchBasicsView } from './branchDetailsInterfaces'
import UsersList from '../ManageAccounts/usersList'
import CustomersList from '../CustomerCreation/CustomersList'
import TrackLoanApplications from '../TrackLoanApplications/trackLoanApplications'
import LoanList from '../LoanList/loanList'
import { getProductsByBranch } from '../../../Shared/Services/APIs/Branch/getBranches'
import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../config/Can'
import ability from '../../config/ability'
import {
  getErrorMessage,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import ManagerProfile from '../managerHierarchy/managersProfile'
import SupervisionsProfile from '../managerHierarchy/supervisionsProfile'
import { ProfileActions } from '../../../Shared/Components'

interface Props extends RouteComponentProps<{}, {}, { details: string }> {
  getBranchById: typeof getBranchById
  loading: boolean
  step: number
  branch: any
}

interface State {
  data: BranchBasicsView
  _id: string
  productsLoading: boolean
  tabsArray: Array<Tab>
  activeTab: string
}

class BranchDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      _id: '',
      activeTab: 'branchDetails',
      tabsArray: [],
      data: {
        _id: '',
        created: { at: 0, by: '' },
        updated: { at: 0, by: '' },
        name: '',
        address: '',
        longitude: 0,
        latitude: 0,
        phoneNumber: '',
        faxNumber: '',
        branchCode: 0,
        governorate: '',
        status: '',
        products: [],
        licenseDate: 0,
        licenseNumber: '',
        bankAccount: '',
        bankAddress: '',
        bankName: '',
        costCenter: '',
      },
      productsLoading: false,
    }
  }

  componentDidMount() {
    const tabsToRender = [
      {
        header: local.basicInfo,
        stringKey: 'branchDetails',
      },
    ]
    if (ability.can('getUser', 'user')) {
      tabsToRender.push({
        header: local.users,
        stringKey: 'users',
      })
    }
    if (ability.can('getCustomer', 'customer')) {
      tabsToRender.push({
        header: local.customers,
        stringKey: 'customers',
      })
    }
    if (ability.can('getLoanApplication', 'application')) {
      tabsToRender.push({
        header: local.loanApplication,
        stringKey: 'loanApplication',
      })
    }
    if (ability.can('getIssuedLoan', 'application')) {
      tabsToRender.push({
        header: local.issueLoan,
        stringKey: 'issuedLoan',
      })
    }
    if (ability.can('getBranchManagersHierarchy', 'branch')) {
      tabsToRender.push({
        header: local.managers,
        stringKey: 'managers',
      })
    }
    if (ability.can('getOfficersGroups', 'branch')) {
      tabsToRender.push({
        header: local.levelsOfSupervision,
        stringKey: 'levelsOfSupervision',
      })
    }

    this.setState(
      {
        tabsArray: tabsToRender,
      },
      () => this.getBranch()
    )
  }

  async getBranch() {
    const _id = this.props.location.state.details
    const products = await this.getProductsByBranch(_id)
    await this.props.getBranchById(_id)
    if (this.props.branch.status === 'success') {
      this.setState({
        data: { ...this.props.branch.body.data, products },
        _id,
      })
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(this.props.branch.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  async getProductsByBranch(_id: string) {
    this.setState({ productsLoading: true })
    const branchsProducts = await getProductsByBranch(_id)
    if (branchsProducts.status === 'success') {
      const products = branchsProducts.body.data.productIds
        ? branchsProducts.body.data.productIds.map(
            (product) => product.productName
          )
        : []
      this.setState({ productsLoading: false })
      return products
    }
    this.setState({ productsLoading: false }, () =>
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(this.props.branch.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    )
    return []
  }

  renderTabs() {
    switch (this.state.activeTab) {
      case 'branchDetails':
        return <BranchDetailsView data={this.state.data} />
      case 'users':
        return (
          <Can I="getUser" a="user">
            <UsersList {...{ branchId: this.state._id, withHeader: false }} />
          </Can>
        )
      case 'customers':
        return (
          <Can I="getCustomer" a="customer">
            <CustomersList {...{ branchId: this.state._id }} />
          </Can>
        )
      case 'loanApplication':
        return (
          <Can I="getLoanApplication" a="application">
            <TrackLoanApplications {...{ branchId: this.state._id }} />
          </Can>
        )
      case 'issuedLoan':
        return (
          <Can I="getIssuedLoan" a="application">
            <LoanList
              {...{
                branchId: this.state._id,
                fromBranch: true,
                hideTabs: true,
              }}
            />
          </Can>
        )
      case 'managers':
        return (
          <Can I="getBranchManagersHierarchy" a="branch">
            <ManagerProfile
              branchId={this.state._id}
              branchCode={this.state.data.branchCode}
              name={this.state.data.name}
              createdAt={
                this.state.data.created?.at
                  ? timeToArabicDate(this.state.data.created.at, true)
                  : ''
              }
              status={this.state.data.status}
            />
          </Can>
        )
      case 'levelsOfSupervision':
        return (
          <Can I="getOfficersGroups" a="branch">
            <SupervisionsProfile
              branchId={this.state._id}
              branchCode={this.state.data.branchCode}
              name={this.state.data.name}
              createdAt={
                this.state.data.created?.at
                  ? timeToArabicDate(this.state.data.created.at, true)
                  : ''
              }
              status={this.state.data.status}
            />
          </Can>
        )
      default:
        return null
    }
  }

  renderEditIcon() {
    const _id = this.props.location.state.details
    return (
      <div className="rowContainer">
        <ProfileActions
          actions={[
            {
              icon: 'edit',
              title: local.edit,
              permission: true,
              onActionClick: () =>
                this.props.history.push({
                  pathname: '/manage-accounts/branches/edit-branch',
                  state: { details: _id },
                }),
            },
          ]}
        />
      </div>
    )
  }

  render() {
    return (
      <>
        <div className="rowContainer">
          <BackButton title={local.branchDetails} />
          <Can I="createBranch" a="branch">
            {this.renderEditIcon()}
          </Can>
        </div>
        <Card className="card">
          <Loader
            type="fullscreen"
            open={this.props.loading || this.state.productsLoading}
          />
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
const addGetBranchToProps = (dispatch) => {
  return {
    getBranchById: (_id) => dispatch(getBranchById(_id)),
  }
}
const mapStateToProps = (state) => {
  return {
    branch: state.branch,
    loading: state.loading,
  }
}

export default connect(
  mapStateToProps,
  addGetBranchToProps
)(withRouter(BranchDetails))
