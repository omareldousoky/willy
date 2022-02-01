import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from 'react-bootstrap/Container'
import { getApplication } from '../../../Shared/Services/APIs/loanApplication/getApplication'
import { Loader } from '../../../Shared/Components/Loader'
import StatusHelper from './statusHelper'
import {
  rejectApplication,
  undoreviewApplication,
  reviewApplication,
} from '../../../Shared/Services/APIs/loanApplication/stateHandler'
import * as local from '../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../Shared/Services/utils'
import {
  BranchDetails,
  BranchDetailsResponse,
  getBranch,
} from '../../../Shared/Services/APIs/Branch/getBranch'
import { getGeoAreasByBranch } from '../../../Shared/Services/APIs/geoAreas/getGeoAreas'

interface State {
  loading: boolean
  application: any
  geoAreas: Array<any>
  branchDetails?: BranchDetails
}

interface LoanStatusChangeRouteState {
  id?: string
  action?: string
  sme?: boolean
}

class LoanStatusChange extends Component<
  RouteComponentProps<{}, {}, LoanStatusChangeRouteState>,
  State
> {
  constructor(props: RouteComponentProps<{}, {}, LoanStatusChangeRouteState>) {
    super(props)
    this.state = {
      application: {},
      loading: false,
      geoAreas: [],
    }
  }

  componentDidMount() {
    const appId = this.props.location.state.id
    this.getAppByID(appId)
  }

  async handleStatusChange(values, status) {
    this.setState({ loading: true })
    if (status === 'review') {
      const res = await reviewApplication({
        id: this.state.application._id,
        date: new Date(values.reviewDate).valueOf(),
      })
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire({
          title: local.success,
          text: local.reviewSuccess,
          confirmButtonText: local.confirmationText,
          icon: 'success',
        }).then(() => {
          this.props.history.push('/track-loan-applications', {
            sme: this.state.application.customer.customerType === 'company',
          })
        })
      } else {
        Swal.fire({
          title: local.errorTitle,
          confirmButtonText: local.confirmationText,
          text: getErrorMessage(res.error.error),
          icon: 'error',
        })
        this.setState({ loading: false })
      }
    } else if (status === 'unreview') {
      const res = await undoreviewApplication({
        id: this.state.application._id,
        date: new Date(values.unreviewDate).valueOf(),
      })
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire({
          title: local.success,
          text: local.unreviewSuccess,
          confirmButtonText: local.confirmationText,
          icon: 'success',
        }).then(() => {
          this.props.history.push('/track-loan-applications', {
            sme: this.state.application.customer.customerType === 'company',
          })
        })
      } else {
        Swal.fire({
          title: local.errorTitle,
          confirmButtonText: local.confirmationText,
          text: getErrorMessage(res.error.error),
          icon: 'error',
        })
        this.setState({ loading: false })
      }
    } else if (status === 'reject') {
      const res = await rejectApplication({
        applicationIds: [this.state.application._id],
        rejectionDate: new Date(values.rejectionDate).valueOf(),
        rejectionReason: values.rejectionReason,
      })
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire({
          title: local.success,
          text: local.rejectSuccess,
          confirmButtonText: local.confirmationText,
          icon: 'success',
        }).then(() => {
          this.props.history.push('/track-loan-applications', {
            sme: this.state.application.customer.customerType === 'company',
          })
        })
      } else {
        Swal.fire({
          title: local.errorTitle,
          confirmButtonText: local.confirmationText,
          text: getErrorMessage(res.error.error),
          icon: 'error',
        })
        this.setState({ loading: false })
      }
    }
  }

  async getBranchData(branchId: string) {
    const res = await getBranch(branchId)
    if (res.status === 'success') {
      this.setState({
        branchDetails: (res.body as BranchDetailsResponse)?.data,
      })
    } else {
      const err = res.error as Record<string, string>
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(err.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  getCustomerGeoArea(geoArea) {
    const geoAreaObject = this.state.geoAreas.filter(
      (area) => area._id === geoArea
    )
    if (geoAreaObject.length === 1) {
      return geoAreaObject[0]
    }
    return { name: '-', active: false }
  }

  async getGeoAreas(branch) {
    this.setState({ loading: true })
    const resGeo = await getGeoAreasByBranch(branch)
    if (resGeo.status === 'success') {
      this.setState({ loading: false, geoAreas: resGeo.body.data })
    } else this.setState({ loading: false })
  }

  async getAppByID(id) {
    this.setState({ loading: true })
    const application = await getApplication(id)
    if (application.status === 'success') {
      if (application.body.guarantors.length > 0)
        this.getGeoAreas(application.body.branchId)
      this.getBranchData(application.body.branchId)
      this.setState({
        application: application.body,
        loading: false,
      })
    } else {
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.fetchError,
        icon: 'error',
      })
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <Container style={{ textAlign: 'right' }}>
        <Loader type="fullscreen" open={this.state.loading} />
        {Object.keys(this.state.application).length > 0 &&
          this.props.location.state.action && (
            <div>
              <StatusHelper
                status={this.props.location.state.action}
                id={this.state.application._id}
                handleStatusChange={(values, status) => {
                  this.handleStatusChange(values, status)
                }}
                application={this.state.application}
                getGeoArea={(area) => this.getCustomerGeoArea(area)}
                branchName={this.state.branchDetails?.name}
              />
            </div>
          )}
      </Container>
    )
  }
}
export default withRouter(LoanStatusChange)
