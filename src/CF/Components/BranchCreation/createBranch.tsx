import React, { Component } from 'react'
import { Formik } from 'formik'
import Card from 'react-bootstrap/Card'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import StepOneForm from './stepOneForm'
import { BasicValues } from './branchCreationInterfaces'
import {
  step1,
  branchCreationValidationStepOne,
} from './branchCreationInitialState'
import { Loader } from '../../../Shared/Components/Loader'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import {
  createNewBranch,
  editBranchById,
  getBranchById,
} from '../../../Shared/redux/branch/actions'
import { Branch } from '../../../Shared/Services/interfaces'
import {
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'

interface State {
  step1: BasicValues
}
interface Props extends RouteComponentProps<{}, {}, { details: string }> {
  loading: boolean
  createNewBranch: typeof createNewBranch
  getBranchById: typeof getBranchById
  editBranchById: typeof editBranchById
  branch: any
  edit: boolean
}

class CreateBranch extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      step1,
    }
  }

  async componentDidMount() {
    if (this.props.edit) {
      this.getBranch()
    }
  }

  async getBranch() {
    const _id = this.props.location.state.details
    await this.props.getBranchById(_id)
    if (this.props.branch.status === 'success') {
      const branch = this.props.branch.body.data
      branch.licenseDate = timeToDateyyymmdd(
        this.props.branch.body.data.licenseDate
      )
      this.setState({
        step1: branch,
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

  submit = (values) => {
    this.setState({
      step1: values,
    })
    if (this.props.edit) {
      this.editBranch(this.state.step1)
    } else {
      this.createBranch(this.state.step1)
    }
  }

  prepareBranch = (values: BasicValues) => {
    const branch: Branch = values
    branch.longitude = values.branchAddressLatLong?.lng
    branch.latitude = values.branchAddressLatLong?.lat
    branch.licenseDate = new Date(values.licenseDate).valueOf()

    return branch
  }

  cancel() {
    this.setState({
      step1,
    })
    this.props.history.goBack()
  }

  async createBranch(values) {
    const branch = this.prepareBranch(values)
    await this.props.createNewBranch(branch)
    if (this.props.branch.status === 'success') {
      Swal.fire({
        title: local.success,
        text: local.branchCreated,
        confirmButtonText: local.confirmationText,
      }).then(() => this.props.history.goBack())
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(this.props.branch.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  async editBranch(values) {
    const _id = this.props.location.state.details
    const branch = this.prepareBranch(values)
    await this.props.editBranchById(branch, _id)
    if (this.props.branch.status === 'success') {
      Swal.fire({
        title: local.success,
        text: local.branchUpdated,
        confirmButtonText: local.confirmationText,
        icon: 'success',
      })
      this.props.history.goBack()
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(this.props.branch.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  render() {
    return (
      <div>
        <Loader type="fullscreen" open={this.props.loading} />
        <BackButton
          title={this.props.edit ? local.editBranch : local.newBranch}
        />
        <Container>
          <Card>
            <Card.Body>
              <Formik
                enableReinitialize
                initialValues={this.state.step1}
                validationSchema={branchCreationValidationStepOne}
                onSubmit={this.submit}
                validateOnChange
                validateOnBlur
              >
                {(formikProps) => (
                  <StepOneForm {...formikProps} cancel={() => this.cancel()} />
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Container>
      </div>
    )
  }
}

const addBranchToProps = (dispatch) => {
  return {
    createNewBranch: (branch) => dispatch(createNewBranch(branch)),
    getBranchById: (_id) => dispatch(getBranchById(_id)),
    editBranchById: (branch, _id) => dispatch(editBranchById(branch, _id)),
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
  addBranchToProps
)(withRouter(CreateBranch))
