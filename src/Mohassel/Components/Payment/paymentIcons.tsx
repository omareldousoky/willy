import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Can from '../../config/Can';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Installment } from './payInstallment';
import { payment } from '../../../Shared/redux/payment/actions';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
  paymentType: string;
  penalty: number;
  application: {
    status: string;
    writeOff: boolean;
  };
  installments: Array<Installment>;
  changePaymentState: (data) => void;
  handleClickEarlyPayment: () => void;
  handleChangePenaltyAction: (key: string) => void;
}
class PaymentIcons extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  getRequiredAmount() {
    const todaysDate = new Date().valueOf();
    let total = 0;
    const installments: Array<number> = [];
    this.props.installments.forEach(installment => {
      if (todaysDate >= installment.dateOfPayment) {
        if (installment.status !== "paid")
          total = total + installment.installmentResponse - installment.totalPaid;
        installments.push(installment.id);
      } else return total;
    })
    return { total: total, installments: installments };
  }
  render() {
    return (
      <Card className="payment-menu">
        {this.props.paymentType === "normal" ? (
          <div className="payment-info">
            <h6>{local.requiredAmount}</h6>
            <h6>{this.getRequiredAmount().total}</h6>
            <h6>{local.forInstallments}</h6>
            <h6>
              {this.getRequiredAmount().installments.toString()}
            </h6>
            <h6>{local.dateOfPayment}</h6>
            <h6>{}</h6>
          </div>
        ) : null}
        {this.props.paymentType === "penalties" ? (
          <div className="payment-info">
            <h6>{local.requiredAmount}</h6>
            <h6>{this.props.penalty}</h6>
          </div>
        ) : null}
        <div className="verticalLine"></div>
        <div className="payment-icons-container">
          <Can I="payInstallment" a="application">
            <div className="payment-icon">
              <img
                alt={this.props.paymentType === "penalties" ? "pay-penalty" : "pay-installment"}
                src={this.props.paymentType === "penalties" ? require("../../Assets/payPenalty.svg") : require("../../Assets/payInstallment.svg")}
              />
              <Button
                disabled={this.props.application.status === "pending" && this.props.paymentType === "normal"}
                onClick={() => {
                  if (this.props.paymentType === "penalties") {
                    this.props.handleChangePenaltyAction("pay")
                    this.props.changePaymentState(1);
                  } else this.props.changePaymentState(1);
                }}
                variant="primary"
              >
                {this.props.paymentType === "penalties" ? local.payPenalty : local.payInstallment}
              </Button>
            </div>
          </Can>
          {this.props.paymentType === "penalties" ? (
            <>
              <Can I="cancelPenalty" a="application">
                <div className="payment-icon">
                  <img alt="cancel-penalty" src={require("../../Assets/cancelPenalty.svg")} />
                  <Button
                    onClick={() => { this.props.handleChangePenaltyAction("cancel"); this.props.changePaymentState(1); }}
                    variant="primary">
                    {local.cancelPenalty}
                  </Button>
                </div>
              </Can>
              <Can I="payInstallment" a="application">
                <div className="payment-icon">
                  <img alt="pay-installment" src={require("../../Assets/payInstallment.svg")} />
                  <Button
                    onClick={() => { this.props.changePaymentState(3); this.setState({ randomType: 'manual' }) }}
                    variant="primary">
                    {local.manualPayment}
                  </Button>
                </div>
              </Can>
            </>
          ) : null}
          {(this.props.paymentType === "normal" && !this.props.application.writeOff) ? (
            <Can I="payEarly" a="application">
              <div className="payment-icon">
                <img alt="early-payment" src={require("../../Assets/earlyPayment.svg")} />
                <Button
                  disabled={this.props.application.status === "pending"}
                  onClick={() => this.props.handleClickEarlyPayment()}
                  variant="primary"
                >
                  {local.earlyPayment}
                </Button>
              </div>
            </Can>
          ) : null}
          {this.props.paymentType === "normal" ? (
            <Can I="payInstallment" a="application">
              <div className="payment-icon">
                <img alt="pay-installment" src={require("../../Assets/payInstallment.svg")} />
                <Button
                  disabled={this.props.application.status === "pending"}
                  onClick={() => this.props.changePaymentState(3)}
                  variant="primary"
                >
                  {local.manualPayment}
                </Button>
              </div>
            </Can>
          ) : null}
          {this.props.paymentType === "random" ? (
            <Can I="payInstallment" a="application">
              <div className="payment-icon">
                <img alt="pay-installment" src={require("../../Assets/payInstallment.svg")} />
                <Button
                  onClick={() => { this.props.changePaymentState(3); this.setState({ randomType: 'manual' }) }}
                  variant="primary">
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

const addPaymentToProps = dispatch => {
  return {
    changePaymentState: data => dispatch(payment(data)),
  };
};

export default connect(null, addPaymentToProps)(PaymentIcons) 