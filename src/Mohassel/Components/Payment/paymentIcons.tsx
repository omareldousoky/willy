import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import Can from '../../config/Can'
import { Installment } from './payInstallment'
import { payment } from '../../../Shared/redux/payment/actions'
import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'

interface Props {
  paymentType: string
  penalty: number
  application: {
    status: string
    writeOff: boolean
  }
  installments: Array<Installment>
  changePaymentState: (data) => void
  handleClickEarlyPayment: () => void
  handleChangePenaltyAction: (key: string) => void
}
class PaymentIcons extends Component<Props, {}> {
  getRequiredAmount() {
    const todaysDate = new Date().valueOf()
    let total = 0
    const installments: Array<number> = []
    this.props.installments.forEach((installment) => {
      if (todaysDate >= installment.dateOfPayment) {
        if (
          installment.status !== 'paid' &&
          installment.status !== 'rescheduled'
        ) {
          total =
            total + installment.installmentResponse - installment.totalPaid
          installments.push(installment.id)
        }
      } else return total
    })
    return { total, installments }
  }

  render() {
    const installments = this.getRequiredAmount().installments.toString()
    return (
      <Card className="payment-menu">
        {this.props.paymentType === 'normal' ? (
          <div className="payment-info">
            <h6>{local.requiredAmount}</h6>
            <h6>{this.getRequiredAmount().total}</h6>
            <h6>{local.forInstallments}</h6>
            <h6 title={installments}>{installments}</h6>
            <h6>{local.dateOfPayment}</h6>
            <h6>{}</h6>
          </div>
        ) : null}
        {this.props.paymentType === 'penalties' ? (
          <div className="payment-info">
            <h6>{local.requiredAmount}</h6>
            <h6>{this.props.penalty}</h6>
          </div>
        ) : null}
        <div className="verticalLine" />
        <div className="payment-icons-container p-4">
          {(ability.can('payInstallment', 'application') ||
            ability.can('payByInsurance', 'application')) && (
            <div className="payment-icon">
              <img
                height="90"
                alt={
                  this.props.paymentType === 'penalties'
                    ? 'pay-penalty'
                    : 'pay-installment'
                }
                src={
                  this.props.paymentType === 'penalties'
                    ? require('../../Assets/payPenalty.svg')
                    : require('../../Assets/payInstallment.svg')
                }
              />
              <Button
                disabled={
                  this.props.application.status === 'pending' &&
                  this.props.paymentType === 'normal'
                }
                onClick={() => {
                  if (this.props.paymentType === 'penalties') {
                    this.props.handleChangePenaltyAction('pay')
                    this.props.changePaymentState(1)
                  } else this.props.changePaymentState(1)
                }}
                variant="primary"
              >
                {this.props.paymentType === 'penalties'
                  ? local.payPenalty
                  : local.payInstallment}
              </Button>
            </div>
          )}
          {this.props.paymentType === 'penalties' ? (
            <>
              <Can I="cancelPenalty" a="application">
                <div className="payment-icon">
                  <img
                    height="90"
                    alt="cancel-penalty"
                    src={require('../../Assets/cancelPenalty.svg')}
                  />
                  <Button
                    onClick={() => {
                      this.props.handleChangePenaltyAction('cancel')
                      this.props.changePaymentState(1)
                    }}
                    variant="primary"
                  >
                    {local.cancelPenalty}
                  </Button>
                </div>
              </Can>
              <Can I="payInstallment" a="application">
                <div className="payment-icon">
                  <img
                    height="90"
                    alt="pay-installment"
                    src={require('../../Assets/payInstallment.svg')}
                  />
                  <Button
                    onClick={() => {
                      this.props.changePaymentState(3)
                    }}
                    variant="primary"
                  >
                    {local.manualPayment}
                  </Button>
                </div>
              </Can>
            </>
          ) : null}
          {this.props.paymentType === 'normal' &&
          !this.props.application.writeOff ? (
            <Can I="payEarly" a="application">
              <div className="payment-icon">
                <img
                  height="90"
                  alt="early-payment"
                  src={require('../../Assets/earlyPayment.svg')}
                />
                <Button
                  disabled={
                    this.props.application.status === 'pending' ||
                    this.props.installments.some(
                      (installment) => installment.status === 'partiallyPaid'
                    )
                  }
                  onClick={() => this.props.handleClickEarlyPayment()}
                  variant="primary"
                >
                  {local.earlyPayment}
                </Button>
              </div>
            </Can>
          ) : null}
          {this.props.paymentType === 'normal' &&
            (ability.can('payInstallment', 'application') ||
              ability.can('payByInsurance', 'application')) && (
              <div className="payment-icon">
                <img
                  height="90"
                  alt="pay-installment"
                  src={require('../../Assets/payInstallment.svg')}
                />
                <Button
                  disabled={this.props.application.status === 'pending'}
                  onClick={() => this.props.changePaymentState(3)}
                  variant="primary"
                >
                  {local.manualPayment}
                </Button>
              </div>
            )}
          {this.props.paymentType === 'random' ? (
            <Can I="payInstallment" a="application">
              <div className="payment-icon">
                <img
                  height="90"
                  alt="pay-installment"
                  src={require('../../Assets/payInstallment.svg')}
                />
                <Button
                  onClick={() => {
                    this.props.changePaymentState(3)
                  }}
                  variant="primary"
                >
                  {local.manualPayment}
                </Button>
              </div>
            </Can>
          ) : null}
        </div>
      </Card>
    )
  }
}

const addPaymentToProps = (dispatch) => {
  return {
    changePaymentState: (data) => dispatch(payment(data)),
  }
}

export default connect(null, addPaymentToProps)(PaymentIcons)
