import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import CustomerBasicsCard from './basicInfoCustomer'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer'
import { CreateClearanceForm } from './createClearanceForm'
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
import { calculatePenalties } from '../../Services/APIs/Payment/calculatePenalties'
import { updateClearance } from '../../Services/APIs/clearance/updateClearance'
import { Loader } from '../../../Shared/Components/Loader'
import { reviewClearance } from '../../Services/APIs/clearance/reviewClearance'

interface Props {
  history: any
  location: {
    state: {
      id: string
      clearance?: {
        id: string
      }
    }
  }
  edit: boolean
  review: boolean
}
interface State {
  customer: {
    key: string
    branchName: string
    customerName: string
  }
  loading: boolean
  step1: ClearanceValues
  paidLoans: {
    Key: number
    id: string
  }[]
  penalty: number
}
class CreateClearance extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      customer: {
        key: '',
        branchName: '',
        customerName: '',
      },
      step1: clearanceData,
      paidLoans: [],
      loading: false,
      penalty: 0,
    }
  }

  componentDidMount() {
    if (this.props.edit || this.props.review) {
      this.getClearanceById()
    } else {
      this.getCustomer(this.props.location.state.id)
      this.getCustomerPaidLoans(this.props.location.state.id)
    }
  }

  async getClearanceById() {
    if (this.props.location.state.clearance?.id) {
      this.setState({ loading: true })
      const res = await getClearance(this.props.location.state.clearance?.id)
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
        await this.calculatePenalty(res.body.data.loanId)
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
    } else if (this.props.review) {
      await this.reviewClearance(values)
    } else {
      await this.createNewClearance(values)
    }
  }

  prepareClearance = (values: ClearanceValues) => {
    const clearance = values
    if (!clearance.customerId) {
      clearance.customerId = this.props.location.state.id
    }
    if (clearance.transactionKey) {
      clearance.transactionKey = Number(clearance.transactionKey)
    }
    if (clearance.receiptDate) {
      clearance.receiptDate = new Date(clearance.receiptDate).valueOf()
    }
    delete clearance.receiptPhotoURL
    delete clearance.documentPhotoURL
    delete clearance.status
    clearance.registrationDate = new Date(clearance.registrationDate).valueOf()
    const formData = new FormData()
    for (const key in clearance) {
      formData.append(key, clearance[key])
    }
    return formData
  }

  cancel() {
    this.setState({
      step1: clearanceData,
    })
    this.props.history.goBack()
  }

  async calculatePenalty(loanId: string) {
    this.setState({ loading: true })
    const res = await calculatePenalties({
      id: loanId,
      truthDate: new Date().getTime(),
    })
    if (res.body) {
      this.setState({ penalty: res.body.penalty, loading: false })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
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
    if (this.props.location.state.clearance?.id) {
      const res = await updateClearance(
        this.props.location.state.clearance?.id,
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

  async reviewClearance(values) {
    if (this.props.location.state.clearance?.id) {
      this.setState({ loading: true })
      const res = await reviewClearance(
        this.props.location.state.clearance?.id,
        { status: values.status }
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

  renderPenaltyStrike() {
    return this.state.penalty ? (
      <div className="error-container">
        <img
          alt="error"
          src={require('../../Assets/error-red-circle.svg')}
          style={{ marginLeft: 20 }}
        />
        <h4>
          <span style={{ margin: '0 10px' }}> {local.penaltyMessage}</span>{' '}
          <span style={{ color: '#d51b1b' }}>{this.state.penalty}</span>
        </h4>
      </div>
    ) : null
  }

  render() {
    return (
      <>
        {this.renderPenaltyStrike()}
        <Card>
          <Card.Title>
            <CustomerBasicsCard
              customerKey={this.state.customer.key}
              branchName={this.state.customer.branchName}
              customerName={this.state.customer.customerName}
            />
          </Card.Title>
          <Loader open={this.state.loading} type="fullscreen" />
          {this.state.paidLoans.length > 0 ? (
            <Card.Body>
              <Formik
                enableReinitialize
                initialValues={this.state.step1}
                validationSchema={
                  this.props.edit || this.props.review
                    ? clearanceEditValidation
                    : clearanceCreationValidation
                }
                onSubmit={this.submit}
                validateOnChange
                validateOnBlur
              >
                {(formikProps) => (
                  <CreateClearanceForm
                    {...formikProps}
                    cancel={() => this.cancel()}
                    edit={this.props.edit}
                    review={this.props.review}
                    customerKey={this.state.customer.key}
                    paidLoans={this.state.paidLoans}
                    penalty={this.state.penalty}
                  />
                )}
              </Formik>
            </Card.Body>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <img
                alt="no-data-found"
                src={require('../../../Shared/Assets/no-results-found.svg')}
              />
              <h4>{local.noLoansForClearance}</h4>
            </div>
          )}
        </Card>
      </>
    )
  }
}

export default withRouter(CreateClearance)
