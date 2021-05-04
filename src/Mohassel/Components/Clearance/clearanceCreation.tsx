import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Card, Container } from 'react-bootstrap'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import CustomerBasicsCard from './basicInfoCustomer'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer'
import { ClearanceCreationForm } from './clearanceCreationForm'
import {
  clearanceStep1CreationValidation,
  clearanceData,
  ClearanceDataValues,
  clearanceDocuments,
  ClearanceDocumentsValues,
  clearanceStep2EditValidation,
  clearanceStep2CreationValidation,
  ClearanceRequest,
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
import ClearanceCreationDocuments from './clearanceCreationDocuments'

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
  step1: ClearanceDataValues
  step2: ClearanceDocumentsValues
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
      step2: clearanceDocuments,
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
        const clearanceStep1: ClearanceDataValues = {
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
          manualReceipt: res.body.data.manualReceipt
            ? res.body.data.manualReceipt
            : '',
          status: res.body.data.status,
        }
        if (res.body.data.receiptDate)
          clearanceStep1.receiptDate = timeToDateyyymmdd(
            res.body.data.receiptDate
          )
        if (res.body.data.registrationDate)
          clearanceStep1.registrationDate = timeToDateyyymmdd(
            res.body.data.registrationDate
          )
        const clearanceStep2: ClearanceDocumentsValues = {
          receiptPhotoURL: res.body.data.receiptPhotoURL,
          documentPhotoURL: res.body.data.documentPhotoURL,
        }
        this.setState({
          step1: clearanceStep1,
          step2: clearanceStep2,
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
    if (this.state.step === 1) {
      this.setState(
        (prevState) =>
          ({
            [`step${prevState.step}`]: values,
            step: prevState.step + 1,
          } as State)
      )
    } else {
      this.setState({ step2: values })
      const clearance = this.prepareClearance()
      if (this.props.edit) {
        await this.editClearance(clearance)
      } else {
        await this.createNewClearance(clearance)
      }
    }
  }

  prepareClearance = () => {
    const clearance: ClearanceRequest = {
      ...this.state.step1,
      receiptPhoto: this.state.step2.receiptPhoto,
      documentPhoto: this.state.step2.documentPhoto,
    }
    if (!clearance.customerId) {
      clearance.customerId = this.props.location.state?.customerId || ''
    }
    if (clearance.receiptDate) {
      clearance.receiptDate = new Date(clearance.receiptDate).valueOf()
    }
    clearance.registrationDate = new Date(clearance.registrationDate).valueOf()
    const formData = new FormData()
    Object.entries(clearance).map(([key, value]) => {
      if (value) formData.append(key, value)
    })

    return formData
  }

  cancel() {
    this.setState({
      step: 1,
      step1: clearanceData,
      step2: clearanceDocuments,
    })
    this.props.history.goBack()
  }

  previousStep(step: number): void {
    this.setState({
      step: step - 1,
    } as State)
  }

  async createNewClearance(clearance) {
    this.setState({ loading: true })
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

  async editClearance(clearance) {
    this.setState({ loading: true })
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
        validationSchema={clearanceStep1CreationValidation}
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

  renderStepTwo() {
    return (
      <Container>
        <Formik
          enableReinitialize
          initialValues={this.state.step2}
          validationSchema={
            this.props.edit
              ? clearanceStep2EditValidation
              : clearanceStep2CreationValidation
          }
          onSubmit={this.submit}
          validateOnChange
        >
          {(formikProps) => (
            <ClearanceCreationDocuments
              {...formikProps}
              edit={this.props.edit}
              previousStep={() => this.previousStep(2)}
            />
          )}
        </Formik>
      </Container>
    )
  }

  renderSteps() {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne()
      case 2:
        return this.renderStepTwo()
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
