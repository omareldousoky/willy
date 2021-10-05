import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import {
  earlyPaymentValidation,
  manualPaymentValidation,
} from './paymentValidation'
import {
  getDateString,
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'
import {
  Installment,
  PendingActions,
} from '../../../Shared/Services/interfaces'
import { payment } from '../../../Shared/redux/payment/actions'
import PayInstallment from './payInstallment'
import {
  editManualOtherPayment,
  otherPayment,
  earlyPayment,
  payFutureInstallment,
  payInstallment,
  randomManualPayment,
  manualPayment,
  editManualPayment,
  payPenalties,
  cancelPenalties,
} from '../../../Shared/Services/APIs/payment'
import * as local from '../../../Shared/Assets/ar.json'
import './styles.scss'
import PaymentIcons from './paymentIcons'
import ManualPayment from './manualPayment'
import { LtsIcon } from '../../../Shared/Components'
import { EarlyPayment } from './earlyPayment'
import { getFirstDueInstallment } from '../../../Shared/Utils/payment'
import { calculatePenalties } from '../../../Shared/Services/APIs/clearance/calculatePenalties'
import { calculateEarlyPayment } from '../../../Mohassel/Services/APIs/Payment'

interface Props {
  installments: Array<Installment>
  currency: string
  applicationId: string
  application: any
  paymentState: number
  pendingActions: PendingActions
  changePaymentState: (data) => void
  setReceiptData: (data) => void
  print: (data) => void
  refreshPayment: () => void
  setEarlyPaymentData: (data) => void
  manualPaymentEditId: string
  paymentType: string
  randomPendingActions: Array<any>
}
export interface Employee {
  _id: string
  username: string
  name: string
}
interface State {
  receiptData: any
  payAmount: number
  receiptNumber: string
  truthDate: string
  dueDate: string
  loading: boolean
  loadingFullScreen: boolean
  remainingPrincipal: number
  earlyPaymentFees: number
  requiredAmount: number
  installmentNumber: number
  penalty: number
  penaltyAction: string
  payerType: string
  payerNationalId: string
  payerName: string
  payerId: string
  employees: Array<Employee>
  randomPaymentType: string
  bankOfPayment: string
  bankOfPaymentBranch: string
}

class Payment extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]

  constructor(props: Props) {
    super(props)
    const normalTableMappers = [
      {
        title: local.installmentNumber,
        key: 'id',
        render: (data) => data.id,
      },
      {
        title: local.principalInstallment,
        key: 'principalInstallment',
        render: (data) => data.principalInstallment,
      },
      {
        title: local.feesInstallment,
        key: 'feesInstallment',
        render: (data) => data.feesInstallment,
      },
      {
        title: local.installmentResponse,
        key: 'installmentResponse',
        render: (data) => data.installmentResponse,
      },
      {
        title: local.feesPaid,
        key: 'feesPaid',
        render: (data) => data.feesPaid,
      },
      {
        title: local.principalPaid,
        key: 'principalPaid',
        render: (data) => data.principalPaid,
      },
      {
        title: local.totalPaid,
        key: 'totalPaid',
        render: (data) => data.totalPaid,
      },
      {
        title: local.dateOfPayment,
        key: 'dateOfPayment',
        render: (data) => getDateString(data.dateOfPayment),
      },
      {
        title: local.installmentStatus,
        key: 'installmentStatus',
        render: (data) => this.getStatus(data),
      },
    ]
    this.state = {
      receiptData: {},
      payAmount: 0,
      receiptNumber: '',
      truthDate: timeToDateyyymmdd(-1),
      dueDate: timeToDateyyymmdd(-1),
      loading: false,
      loadingFullScreen: false,
      remainingPrincipal: 0,
      earlyPaymentFees: 0,
      requiredAmount: 0,
      installmentNumber: -1,
      penalty: -1,
      penaltyAction: '',
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      employees: [],
      randomPaymentType: '',
      bankOfPayment: '',
      bankOfPaymentBranch: '',
    }
    this.mappers = normalTableMappers
  }

  componentDidMount() {
    if (this.props.paymentType === 'penalties' && this.state.penalty === -1) {
      this.calculatePenalties()
    }
    if (this.props.manualPaymentEditId) {
      this.setManualPaymentValues()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.paymentType !== this.props.paymentType &&
      this.props.paymentType === 'penalties' &&
      this.state.penalty === -1
    ) {
      this.calculatePenalties()
    }
    if (prevProps.manualPaymentEditId !== this.props.manualPaymentEditId) {
      this.setManualPaymentValues()
    }
  }

  componentWillUnmount() {
    this.props.changePaymentState(0)
  }

  async handleClickEarlyPayment() {
    this.props.changePaymentState(2)
    this.setState({ loading: true })
    const res = await calculateEarlyPayment(this.props.applicationId)
    if (res.status === 'success') {
      this.props.setEarlyPaymentData({
        remainingPrincipal: res.body.remainingPrincipal,
        earlyPaymentFees: res.body.earlyPaymentFees,
        requiredAmount: res.body.requiredAmount,
      })
      this.setState({
        loading: false,
        remainingPrincipal: res.body.remainingPrincipal,
        earlyPaymentFees: res.body.earlyPaymentFees,
        requiredAmount: res.body.requiredAmount,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  getStatus(data) {
    const todaysDate = new Date().setHours(0, 0, 0, 0).valueOf()
    switch (data.status) {
      case 'unpaid':
        if (new Date(data.dateOfPayment).setHours(23, 59, 59, 59) < todaysDate)
          return <div className="status-chip late">{local.late}</div>
        return <div className="status-chip unpaid">{local.unpaid}</div>
      case 'rescheduled':
        return (
          <div className="status-chip rescheduled">{local.rescheduled}</div>
        )
      case 'partiallyPaid':
        return (
          <div className="status-chip partially-paid">
            {local.partiallyPaid}
          </div>
        )
      case 'cancelled':
        return <div className="status-chip cancelled">{local.cancelled}</div>
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'pending':
        return <div className="status-chip pending">{local.pending}</div>
      default:
        return null
    }
  }

  handleSubmit = async (values) => {
    this.setState({ loadingFullScreen: true })
    const truthDateTimestamp = new Date(values.truthDate).valueOf()

    if (this.props.paymentState === 1) {
      if (this.props.paymentType === 'normal') {
        if (Number(values.installmentNumber) === -1) {
          const obj = {
            id: this.props.applicationId,
            payAmount: values.payAmount,
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
          }
          const res = await payInstallment(obj)
          if (res.status === 'success') {
            this.props.setReceiptData(res.body)
            this.props.print({ print: 'payment' })
            this.setState({ loadingFullScreen: false }, () =>
              this.props.refreshPayment()
            )
          } else {
            this.setState({ loadingFullScreen: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        } else {
          const obj = {
            id: this.props.applicationId,
            payAmount: values.payAmount,
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
            installmentNumber: Number(values.installmentNumber),
          }
          const res = await payFutureInstallment(obj)
          if (res.status === 'success') {
            this.props.setReceiptData(res.body)
            this.props.print({ print: 'payment' })
            this.setState({ loadingFullScreen: false }, () =>
              this.props.refreshPayment()
            )
          } else {
            this.setState({ loadingFullScreen: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        }
      } else if (this.props.paymentType === 'random') {
        const data = {
          payAmount: values.payAmount,
          truthDate: truthDateTimestamp,
          type: values.randomPaymentType,
          payerType: values.payerType,
          payerId: values.payerId,
          payerName: values.payerName,
          payerNationalId: values.payerNationalId?.toString(),
        }
        const res = await otherPayment({ id: this.props.applicationId, data })
        if (res.status === 'success') {
          const resBody = res.body
          resBody[0].type = 'randomPayment'
          resBody[0].randomPaymentType = values.randomPaymentType
          this.props.setReceiptData(resBody)
          this.props.print({ print: 'randomPayment' })
          this.setState({ loadingFullScreen: false }, () =>
            this.props.refreshPayment()
          )
        } else {
          this.setState({ loadingFullScreen: false }, () =>
            Swal.fire('', getErrorMessage(res.error.error), 'error')
          )
        }
      } else if (this.props.paymentType === 'penalties') {
        if (this.state.penaltyAction === 'pay') {
          const data = {
            payAmount: values.payAmount,
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
          }
          const res = await payPenalties({ id: this.props.applicationId, data })
          if (res.status === 'success') {
            const resBody = res.body
            resBody[0].type = 'penalty'
            this.props.setReceiptData(resBody)
            this.props.print({ print: 'penalty' })
            this.setState({ loadingFullScreen: false }, () =>
              this.props.refreshPayment()
            )
            this.calculatePenalties()
          } else {
            this.setState({ loadingFullScreen: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        } else if (this.state.penaltyAction === 'cancel') {
          const data = {
            cancelAmount: values.payAmount,
          }
          const res = await cancelPenalties({
            id: this.props.applicationId,
            data,
          })
          if (res.status === 'success') {
            this.setState({ loadingFullScreen: false })
            Swal.fire('', local.penaltyCancelledSuccessfully, 'success')
            this.calculatePenalties()
          } else {
            this.setState({ loadingFullScreen: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        }
      }
    } else if (this.props.paymentState === 2) {
      const obj = {
        id: this.props.applicationId,
        payAmount: values.requiredAmount,
        payerType: values.payerType,
        payerId: values.payerId,
        payerName: values.payerName,
        payerNationalId: values.payerNationalId.toString(),
        truthDate: truthDateTimestamp,
      }
      const res = await earlyPayment(obj)
      this.setState({ payAmount: values.payAmount })
      if (res.status === 'success') {
        this.props.setReceiptData(res.body)
        this.props.print({ print: 'payEarly' })
        this.setState({ loadingFullScreen: false }, () =>
          this.props.refreshPayment()
        )
      } else {
        this.setState({ loadingFullScreen: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    } else if (this.props.paymentType === 'normal') {
      if (this.props.manualPaymentEditId === '') {
        const obj = {
          id: this.props.applicationId,
          receiptNumber: values.receiptNumber,
          truthDate: truthDateTimestamp,
          payAmount: values.payAmount,
          payerType: values.payerType,
          payerId: values.payerId,
          payerName: values.payerName,
          payerNationalId: values.payerNationalId.toString(),
          installmentNumber:
            values.installmentNumber !== -1
              ? Number(values.installmentNumber)
              : undefined,
          futurePayment: values.installmentNumber !== -1 || undefined,
        }
        const res = await manualPayment(obj)
        if (res.status === 'success') {
          this.setState({ loadingFullScreen: false })
          Swal.fire('', local.manualPaymentSuccess, 'success').then(() =>
            this.props.refreshPayment()
          )
        } else {
          this.setState({ loadingFullScreen: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      } else {
        const obj = {
          id: this.props.applicationId,
          payAmount: values.payAmount,
          receiptNumber: values.receiptNumber,
          truthDate: truthDateTimestamp,
          payerType: values.payerType,
          payerId: values.payerId,
          payerName: values.payerName,
          payerNationalId: values.payerNationalId.toString(),
          installmentNumber:
            values.installmentNumber !== -1
              ? Number(values.installmentNumber)
              : undefined,
          futurePayment: values.installmentNumber !== -1 || undefined,
        }
        const res = await editManualPayment(obj)
        if (res.status === 'success') {
          this.setState({ loadingFullScreen: false })
          Swal.fire('', local.editManualPaymentSuccess, 'success').then(() =>
            this.props.refreshPayment()
          )
        } else {
          this.setState({ loadingFullScreen: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      }
    } else {
      const obj = {
        id: this.props.applicationId,
        receiptNumber: values.receiptNumber,
        truthDate: truthDateTimestamp,
        payAmount: values.payAmount,
        payerType: values.payerType,
        payerId: values.payerId,
        payerName: values.payerName,
        payerNationalId: values.payerNationalId
          ? values.payerNationalId.toString()
          : '',
        type:
          this.props.paymentType === 'random'
            ? values.randomPaymentType
            : 'penalty',
        actionId: this.props.manualPaymentEditId
          ? this.props.manualPaymentEditId
          : '',
      }
      if (this.props.manualPaymentEditId === '') {
        const res = await randomManualPayment(obj)
        if (res.status === 'success') {
          this.setState({ loadingFullScreen: false })
          Swal.fire('', local.manualPaymentSuccess, 'success').then(() =>
            this.props.refreshPayment()
          )
        } else {
          this.setState({ loadingFullScreen: false }, () =>
            Swal.fire('', getErrorMessage(res.error.error), 'error')
          )
        }
      } else {
        const res = await editManualOtherPayment(obj)
        if (res.status === 'success') {
          this.setState({ loadingFullScreen: false })
          Swal.fire('', local.editManualPaymentSuccess, 'success').then(() =>
            this.props.refreshPayment()
          )
        } else {
          this.setState({ loadingFullScreen: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      }
    }
    this.props.changePaymentState(0)
  }

  setManualPaymentValues() {
    const pendingAction = this.props.randomPendingActions.find(
      (el) => el._id === this.props.manualPaymentEditId
    )
    if (pendingAction) {
      this.setState({
        randomPaymentType: pendingAction.transactions[0].action,
        payAmount: pendingAction.transactions[0].transactionAmount,
        payerType: pendingAction.payerType,
        payerNationalId: pendingAction.payerNationalId,
        payerName: pendingAction.transactions[0].payerName,
        payerId: pendingAction.transactions[0].payerId,
        receiptNumber: pendingAction.receiptNumber,
        installmentNumber: pendingAction.transactions[0].installmentSerial,
        truthDate: timeToDateyyymmdd(pendingAction.transactions[0].truthDate),
      })
    } else {
      const { pendingActions } = this.props
      const payAmount = this.props.pendingActions.transactions?.reduce(
        (accumulator, pendingAct) => {
          return accumulator + pendingAct.transactionAmount
        },
        0
      )
      this.setState({
        payAmount: payAmount || 0,
        payerType: pendingActions.payerType ? pendingActions.payerType : '',
        payerNationalId: pendingActions.payerNationalId
          ? pendingActions.payerNationalId
          : '',
        payerName: pendingActions.payerName ? pendingActions.payerName : '',
        payerId: pendingActions.payerId ? pendingActions.payerId : '',
        receiptNumber: pendingActions.receiptNumber
          ? pendingActions.receiptNumber
          : '',
        installmentNumber: pendingActions.transactions
          ? pendingActions.transactions[0].installmentSerial
          : -1,
        truthDate: pendingActions.transactions
          ? timeToDateyyymmdd(pendingActions.transactions[0].truthDate)
          : timeToDateyyymmdd(-1),
      })
    }
  }

  async calculatePenalties() {
    this.setState({ loadingFullScreen: true })
    const res = await calculatePenalties({
      id: this.props.applicationId,
      truthDate: new Date().getTime(),
    })
    if (res.body) {
      this.setState({ penalty: res.body.penalty, loadingFullScreen: false })
    } else
      this.setState({ loadingFullScreen: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  renderPaymentMethods() {
    const firstDueInstallment = getFirstDueInstallment(this.props.application)
    const isNormalPayment = this.props.paymentType === 'normal'
    const payAmountValue =
      isNormalPayment && firstDueInstallment && !this.props.manualPaymentEditId
        ? firstDueInstallment.installmentResponse -
          firstDueInstallment?.totalPaid
        : this.state.payAmount

    switch (this.props.paymentState) {
      case 0:
        return (
          <PaymentIcons
            paymentType={this.props.paymentType}
            penalty={this.state.penalty}
            application={this.props.application}
            installments={this.props.installments}
            handleClickEarlyPayment={() => this.handleClickEarlyPayment()}
            handleChangePenaltyAction={(key: string) =>
              this.setState({ penaltyAction: key })
            }
          />
        )
      case 1:
        return (
          <PayInstallment
            penalty={this.state.penalty}
            installments={this.props.installments}
            application={this.props.application}
            handleSubmit={this.handleSubmit}
            payAmount={this.state.payAmount}
            truthDate={this.state.truthDate}
            paymentType={this.props.paymentType}
            penaltyAction={this.state.penaltyAction}
          />
        )
      case 2:
        return (
          <Card className="payment-menu">
            <Loader type="fullsection" open={this.state.loading} />
            <div className="payment-info" style={{ textAlign: 'center' }}>
              <LtsIcon name="early-payment" size="90px" color="#7dc255" />
              <Button
                variant="default"
                onClick={() => this.props.changePaymentState(0)}
              >
                <span className="font-weight-bolder text-primary">&#8702;</span>
                <small className="font-weight-bolder text-primary">
                  &nbsp;{local.earlyPayment}
                </small>
              </Button>
            </div>
            <div className="verticalLine" />
            <div style={{ width: '100%', padding: 20 }}>
              <span
                style={{
                  cursor: 'pointer',
                  float: 'left',
                  background: '#E5E5E5',
                  padding: 10,
                  borderRadius: 15,
                }}
                onClick={() =>
                  this.props.print({
                    print: 'earlyPayment',
                    remainingPrincipal: this.state.remainingPrincipal,
                    earlyPaymentFees: this.state.earlyPaymentFees,
                    requiredAmount: this.state.requiredAmount,
                  })
                }
              >
                <span
                  className="fa fa-download"
                  style={{ margin: '0px 0px 0px 5px' }}
                />
                {local.downloadPDF}
              </span>
              <Formik
                enableReinitialize
                initialValues={{
                  ...this.state,
                  max: this.props.application.installmentsObject
                    .totalInstallments.installmentSum,
                }}
                onSubmit={this.handleSubmit}
                validationSchema={earlyPaymentValidation}
                validateOnBlur
                validateOnChange
              >
                {(formikProps) => (
                  <EarlyPayment
                    loading={this.state.loading}
                    application={this.props.application}
                    formikProps={formikProps}
                    installments={this.props.installments}
                    remainingPrincipal={this.state.remainingPrincipal}
                    earlyPaymentFees={this.state.earlyPaymentFees}
                    requiredAmount={this.state.requiredAmount}
                    setPayerType={(payerType: string) =>
                      this.setState({ payerType })
                    }
                  />
                )}
              </Formik>
            </div>
          </Card>
        )

      case 3:
        return (
          <Card className="payment-menu">
            <div className="payment-info" style={{ textAlign: 'center' }}>
              <LtsIcon name="pay-installment" size="90px" color="#7dc255" />
              <Button
                variant="default"
                onClick={() => this.props.changePaymentState(0)}
              >
                <span className="font-weight-bolder text-primary">&#8702;</span>
                <small className="text-primary font-weight-bolder">
                  &nbsp;{local.manualPayment}
                </small>
              </Button>
            </div>
            <div className="verticalLine" />
            <div style={{ width: '100%', padding: 20 }}>
              <Formik
                enableReinitialize
                initialValues={{
                  ...this.state,
                  payAmount: payAmountValue,
                  dueDate: isNormalPayment
                    ? timeToDateyyymmdd(
                        firstDueInstallment?.dateOfPayment || -1
                      )
                    : this.state.dueDate,
                  max:
                    this.props.application.status === 'canceled'
                      ? this.props.application.principal
                      : this.props.application.installmentsObject
                          .totalInstallments.installmentSum,
                  paymentType: this.props.paymentType,
                }}
                onSubmit={this.handleSubmit}
                validationSchema={() =>
                  manualPaymentValidation(this.state.penalty)
                }
                validateOnBlur
                validateOnChange
              >
                {(formikProps) => (
                  <ManualPayment
                    payAmount={payAmountValue}
                    truthDate={this.state.truthDate}
                    paymentType={this.props.paymentType}
                    receiptNumber={this.state.receiptNumber}
                    setPayerType={(payerType: string) =>
                      this.setState({ payerType })
                    }
                    application={this.props.application}
                    handleSubmit={this.handleSubmit}
                    // randomPendingActions={this.props.randomPendingActions}
                    formikProps={formikProps}
                    retainState={(values) => this.setState({ ...values })}
                  />
                )}
              </Formik>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Loader type="fullscreen" open={this.state.loadingFullScreen} />
        {this.props.paymentType === 'normal' ? (
          <DynamicTable
            totalCount={0}
            pagination={false}
            data={this.props.installments.sort((a, b) => {
              return a.id - b.id
            })}
            mappers={this.mappers}
          />
        ) : null}
        {this.renderPaymentMethods()}
      </>
    )
  }
}
const addPaymentToProps = (dispatch) => {
  return {
    changePaymentState: (data) => dispatch(payment(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    paymentState: state.payment,
  }
}
export default connect(mapStateToProps, addPaymentToProps)(Payment)
