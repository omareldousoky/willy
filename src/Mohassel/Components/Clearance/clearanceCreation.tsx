import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import CustomerBasicsCard from './basicInfoCustomer'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer'
import { ClearanceCreationForm } from './clearanceCreationForm'
import {
  clearanceCreationValidation,
  clearanceData,
  clearanceEditValidation,
  ClearanceValues,
} from './clearanceFormIntialState'
import * as local from '../../../Shared/Assets/ar.json'
import { getCustomersBalances } from '../../Services/APIs/Customer-Creation/customerLoans'
import {
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'
import { getApplicationsKeys } from '../../Services/APIs/clearance/getApplicagionsKey'
import { createClearance } from '../../Services/APIs/clearance/createClearance'
import { getClearance } from '../../Services/APIs/clearance/getClearance'
import { updateClearance } from '../../Services/APIs/clearance/updateClearance'
import { Loader } from '../../../Shared/Components/Loader'
import PenaltyStrike from './penaltyStrike'
import Wizard from '../wizard/Wizard'

interface CreateClearanceRouteState {
  customerId?: string
  clearanceId?: string
}

interface Props extends RouteComponentProps<{}, {}, CreateClearanceRouteState> {
  edit: boolean
}
interface State {
  customer: {
    key: string
    branchName: string
    customerName: string
  }
  step: number
  loading: boolean
  step1: ClearanceValues
  paidLoans: {
    Key: number
    id: string
  }[]
  penalty: number
}
class ClearanceCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      customer: {
        key: '',
        branchName: '',
        customerName: '',
      },
      step: 1,
      step1: clearanceData,
      paidLoans: [],
      loading: false,
      penalty: 0,
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.getClearanceById()
    } else if (this.props.location.state?.customerId) {
      this.getCustomer(this.props.location.state.customerId)
      this.getCustomerPaidLoans(this.props.location.state.customerId)
    }
  }

  async getClearanceById() {
    if (this.props.location.state?.clearanceId) {
      this.setState({ loading: true })
      const res = await getClearance(this.props.location.state.clearanceId)
      if (res.status === 'success') {
        const clearance: ClearanceValues = {
          customerId: res.body.data.customerId,
          loanId: res.body.data.loanId,
          transactionKey: res.body.data.transactionKey
            ? res.body.data.transactionKey
            : '',
          clearanceReason: res.body.data.clearanceReason,
          bankName: res.body.data.bankName,
          notes: res.body.data.notes,
          registrationDate: res.body.data.registrationDate,
          receiptDate: res.body.data.receiptDate,
          receiptPhotoURL: res.body.data.receiptPhotoURL,
          documentPhotoURL: res.body.data.documentPhotoURL,
          manualReceipt: res.body.data.manualReceipt
            ? res.body.data.manualReceipt
            : '',
          status: res.body.data.status,
        }
        if (res.body.data.receiptDate)
          clearance.receiptDate = timeToDateyyymmdd(res.body.data.receiptDate)
        if (res.body.data.registrationDate)
          clearance.registrationDate = timeToDateyyymmdd(
            res.body.data.registrationDate
          )
        this.setState({
          step1: clearance,
          customer: {
            key: res.body.data.customerKey,
            customerName: res.body.data.customerName,
            branchName: res.body.data.branchName,
          },
        })
        await this.getCustomerPaidLoans(res.body.data.customerId)
      }
      this.setState({ loading: false })
    }
  }

  async getCustomerPaidLoans(id: string) {
    this.setState({ loading: true })
    const res = await getCustomersBalances({ ids: [id] })
    if (res.status === 'success') {
      const paidLoansIds: string[] = res.body.data[0].paidLoans
      if (paidLoansIds) {
        const paidLoans = await getApplicationsKeys({ ids: paidLoansIds })
        if (paidLoans.status === 'success') {
          this.setState({ paidLoans: paidLoans.body.data })
        } else {
          Swal.fire('Error !', getErrorMessage(paidLoans.error.error), 'error')
        }
      }
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
    this.setState({ loading: false })
  }

  async getCustomer(id: string) {
    this.setState({ loading: true })
    const res = await getCustomerByID(id)
    if (res.status === 'success') {
      this.setState({
        customer: {
          key: res.body.key,
          branchName: res.body.branchName,
          customerName: res.body.customerName,
        },
      })
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
    this.setState({ loading: false })
  }

  submit = async (values) => {
    if (this.props.edit) {
      await this.editClearance(values)
    } else {
      await this.createNewClearance(values)
    }
  }

  prepareClearance = (values: ClearanceValues) => {
    const clearance = values
    if (!clearance.customerId) {
      clearance.customerId = this.props.location.state?.customerId || ''
    }
    if (clearance.receiptDate) {
      clearance.receiptDate = new Date(clearance.receiptDate).valueOf()
    }
    delete clearance.receiptPhotoURL
    delete clearance.documentPhotoURL
    delete clearance.status
    clearance.registrationDate = new Date(clearance.registrationDate).valueOf()
    const formData = new FormData()
    Object.entries(clearance).map(([key, value]) => {
      formData.append(key, value)
    })
    return formData
  }

  cancel() {
    this.setState({
      step1: clearanceData,
    })
    this.props.history.goBack()
  }

  async createNewClearance(values) {
    this.setState({ loading: true })
    const clearance = this.prepareClearance(values)
    const res = await createClearance(clearance)
    if (res.status === 'success') {
      Swal.fire('Success', '', 'success').then(() =>
        this.props.history.goBack()
      )
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
    this.setState({ loading: false })
  }

  async editClearance(values) {
    this.setState({ loading: true })
    const clearance = this.prepareClearance(values)
    if (this.props.location.state?.clearanceId) {
      const res = await updateClearance(
        this.props.location.state?.clearanceId,
        clearance
      )
      if (res.status === 'success') {
        Swal.fire('Success', '', 'success').then(() =>
          this.props.history.goBack()
        )
      } else {
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      }
    }
    this.setState({ loading: false })
  }

  renderStepOne() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.step1}
        validationSchema={
          this.props.edit
            ? clearanceEditValidation
            : clearanceCreationValidation
        }
        onSubmit={this.submit}
        validateOnChange
        validateOnBlur
      >
        {(formikProps) => (
          <ClearanceCreationForm
            {...formikProps}
            cancel={() => this.cancel()}
            edit={this.props.edit}
            customerKey={this.state.customer.key}
            paidLoans={this.state.paidLoans}
            penalty={this.state.penalty}
          />
        )}
      </Formik>
    )
  }

  renderSteps() {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Loader open={this.state.loading} type="fullscreen" />
        {this.state.step1.loanId && (
          <PenaltyStrike loanId={this.state.step1.loanId} />
        )}
        <Card.Title>
          <CustomerBasicsCard
            customerKey={this.state.customer.key}
            branchName={this.state.customer.branchName}
            customerName={this.state.customer.customerName}
          />
        </Card.Title>
        <div className="container">
          <Card className="w-100">
            {this.state.paidLoans.length > 0 ? (
              <div className="d-flex flex-row">
                <Wizard
                  currentStepNumber={this.state.step - 1}
                  stepsDescription={[local.mainInfo, local.documents]}
                />
                <Card.Body>{this.renderSteps()}</Card.Body>
              </div>
            ) : (
              <div className="text-align-center my-2">
                <img
                  alt="no-data-found"
                  src={require('../../../Shared/Assets/no-results-found.svg')}
                />
                <h4>{local.noLoansForClearance}</h4>
              </div>
            )}
          </Card>
        </div>
      </>
    )
  }
}

export default withRouter(ClearanceCreation)
