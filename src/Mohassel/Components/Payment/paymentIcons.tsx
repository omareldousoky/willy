import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import Can from '../../config/Can'
import { Installment } from './payInstallment'
import { payment } from '../../../Shared/redux/payment/actions'
import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { LtsIcon } from '../../../Shared/Components'

type ContractType = 'standard' | 'masterGas'

interface Props {
  paymentType: string
  penalty: number
  application: {
    status: string
    writeOff: boolean
    product: {
      type: string
      contractType: ContractType
    }
  }
  installments: Array<Installment>
  changePaymentState: (data) => void
  handleClickEarlyPayment: () => void
  handleChangePenaltyAction: (key: string) => void
  isPendingAction: boolean
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
            ability.can('payByInsurance', 'application')) &&
            this.props.application.product.type !== 'sme' && (
              <div className="payment-icon m-4">
                <LtsIcon
                  name={
                    this.props.paymentType === 'penalties'
                      ? 'pay-penalty'
                      : 'pay-installment'
                  }
                  size="90px"
                  color="#7dc255"
                />
                <Button
                  className="my-4"
                  disabled={
                    (this.props.application.status === 'pending' &&
                      this.props.paymentType === 'normal') ||
                    (this.props.paymentType === 'penalties' &&
                      this.props.isPendingAction)
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
                <div className="payment-icon m-4">
                  <LtsIcon name="cancel-penalty" color="#7dc255" size="90px" />

                  <Button
                    className="my-4"
                    onClick={() => {
                      this.props.handleChangePenaltyAction('cancel')
                      this.props.changePaymentState(1)
                    }}
                    variant="primary"
                    disabled={this.props.isPendingAction}
                  >
                    {local.cancelPenalty}
                  </Button>
                </div>
              </Can>
              <Can I="payInstallment" a="application">
                <div className="payment-icon m-4">
                  <LtsIcon name="pay-installment" size="90px" color="#7dc255" />

                  <Button
                    className="my-4"
                    onClick={() => {
                      this.props.changePaymentState(3)
                    }}
                    variant="primary"
                    disabled={this.props.isPendingAction}
                  >
                    {local.manualPayment}
                  </Button>
                </div>
              </Can>
            </>
          ) : null}
          {this.props.paymentType === 'normal' &&
            (ability.can('payInstallment', 'application') ||
              ability.can('payByInsurance', 'application')) &&
            this.props.application.product.type === 'sme' && (
              <div className="payment-icon m-4">
                <LtsIcon name="pay-installment" size="90px" color="#7dc255" />

                <Button
                  className="my-4"
                  disabled={this.props.application.status === 'pending'}
                  onClick={() => this.props.changePaymentState(4)}
                  variant="primary"
                >
                  {local.bankPayment}
                </Button>
              </div>
            )}
          {this.props.paymentType === 'normal' &&
          !this.props.application.writeOff &&
          this.props.application.product.contractType === 'standard' ? (
            <Can I="payEarly" a="application">
              <div className="payment-icon m-4">
                <LtsIcon name="early-payment" size="90px" color="#7dc255" />
                <Button
                  className="my-4"
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
              <div className="payment-icon m-4">
                <LtsIcon name="pay-installment" size="90px" color="#7dc255" />
                <Button
                  className="my-4"
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
              <div className="payment-icon m-4">
                <LtsIcon name="pay-installment" size="90px" color="#7dc255" />

                <Button
                  className="my-4"
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
