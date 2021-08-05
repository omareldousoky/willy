import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import { manualPaymentValidation } from './paymentValidation'
import {
  getDateString,
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'
import { PendingActions } from '../../../Shared/Services/interfaces'
import { payment } from '../../../Shared/redux/payment/actions'
import PayInstallment from './payInstallment'
import {
  manualPayment,
  payFutureInstallment,
  payInstallment,
} from '../../../Shared/Services/APIs/Payment'
import * as local from '../../../Shared/Assets/ar.json'
import './styles.scss'
import PaymentIcons from './paymentIcons'
import ManualPayment from './manualPayment'
import { LtsIcon } from '../../../Shared/Components'
import { randomManualPayment } from '../../../Mohassel/Services/APIs/Payment/randomManualPayment'

interface Installment {
  id: number
  installmentResponse: number
  principalInstallment: number
  feesInstallment: number
  totalPaid: number
  principalPaid: number
  feesPaid: number
  dateOfPayment: number
  status: string
}
interface PenaltiesActionLogObject {
  action: string
  id: string
  reference: PenaltiesActionLogObjectReference
  trace: PenaltiesActionLogObjectTrace
  type: string
}
interface PenaltiesActionLogObjectReference {
  branchId: string
  customerId: string
}
interface PenaltiesActionLogObjectTrace {
  at: number
  by: string
}
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
  manualPaymentEditId: string
  paymentType: string
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
  requiredAmount: number
  installmentNumber: number
  penalty: number
  penaltyAction: string
  payerType: string
  payerNationalId: string
  payerName: string
  payerId: string
  employees: Array<Employee>
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
      requiredAmount: 0,
      installmentNumber: -1,
      penalty: -1,
      penaltyAction: '',
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      employees: [],
    }
    this.mappers = normalTableMappers
  }

  componentDidMount() {
    if (this.props.manualPaymentEditId) {
      this.setManualPaymentValues()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.manualPaymentEditId !== this.props.manualPaymentEditId) {
      this.setManualPaymentValues()
    }
  }

  componentWillUnmount() {
    this.props.changePaymentState(0)
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
      }
    } else if (this.props.paymentType === 'normal') {
      if (this.props.manualPaymentEditId === '') {
        const obj = {
          id: this.props.applicationId,
          receiptNumber: values.receiptNumber,
          truthDate: new Date(values.truthDate).valueOf(),
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
      }
      // edit logic
      // else {
      //   const obj = {
      //     id: this.props.applicationId,
      //     payAmount: values.payAmount,
      //     receiptNumber: values.receiptNumber,
      //     truthDate: new Date(values.truthDate).valueOf(),
      //     payerType: values.payerType,
      //     payerId: values.payerId,
      //     payerName: values.payerName,
      //     payerNationalId: values.payerNationalId.toString(),
      //     installmentNumber:
      //       values.installmentNumber !== -1
      //         ? Number(values.installmentNumber)
      //         : undefined,
      //     futurePayment: values.installmentNumber !== -1 || undefined,
      //   }
      //   const res = await editManualPayment(obj)
      //   if (res.status === 'success') {
      //     this.setState({ loadingFullScreen: false })
      //     Swal.fire('', local.editManualPaymentSuccess, 'success').then(() =>
      //       this.props.refreshPayment()
      //     )
      //   } else {
      //     this.setState({ loadingFullScreen: false }, () =>
      //       Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      //     )
      //   }
      // }
    } else {
      const obj = {
        id: this.props.applicationId,
        receiptNumber: values.receiptNumber,
        truthDate: new Date(values.truthDate).valueOf(),
        payAmount: values.payAmount,
        payerType: values.payerType,
        payerId: values.payerId,
        payerName: values.payerName,
        payerNationalId: values.payerNationalId
          ? values.payerNationalId.toString()
          : '',
        type: values.randomPaymentType,
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
      }
    }
    this.props.changePaymentState(0)
  }

  setManualPaymentValues() {
    const payAmount = this.props.pendingActions.transactions?.reduce(
      (accumulator, pendingAct) => {
        return accumulator + pendingAct.transactionAmount
      },
      0
    )
    this.setState({
      payAmount: payAmount || 0,
      payerType: this.props.pendingActions.payerType
        ? this.props.pendingActions.payerType
        : '',
      payerNationalId: this.props.pendingActions.payerNationalId
        ? this.props.pendingActions.payerNationalId
        : '',
      payerName: this.props.pendingActions.payerName
        ? this.props.pendingActions.payerName
        : '',
      payerId: this.props.pendingActions.payerId
        ? this.props.pendingActions.payerId
        : '',
      receiptNumber: this.props.pendingActions.receiptNumber
        ? this.props.pendingActions.receiptNumber
        : '',
      installmentNumber: this.props.pendingActions.transactions
        ? this.props.pendingActions.transactions[0].installmentSerial
        : -1,
      truthDate: this.props.pendingActions.transactions
        ? timeToDateyyymmdd(this.props.pendingActions.transactions[0].truthDate)
        : timeToDateyyymmdd(-1),
    })
  }

  renderPaymentMethods() {
    switch (this.props.paymentState) {
      case 0:
        return (
          <PaymentIcons
            paymentType={this.props.paymentType}
            application={this.props.application}
            installments={this.props.installments}
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
          />
        )
      case 3:
        return (
          <Card className="payment-menu">
            <div className="payment-info" style={{ textAlign: 'center' }}>
              <LtsIcon name="pay-installment" size="90px" color="#7dc255" />

              <h6
                style={{ cursor: 'pointer' }}
                onClick={() => this.props.changePaymentState(0)}
              >
                <span className="fa fa-long-arrow-alt-right" />
                <span className="font-weight-bolder">
                  &nbsp;{local.manualPayment}
                </span>
              </h6>
            </div>
            <div className="verticalLine" />
            <div style={{ width: '100%', padding: 20 }}>
              <Formik
                enableReinitialize
                initialValues={{
                  ...this.state,
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
                    payAmount={this.state.payAmount}
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
