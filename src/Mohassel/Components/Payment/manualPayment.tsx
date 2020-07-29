import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Formik, FormikProps } from "formik";
import { paymentValidation } from "./paymentValidation";
import { timeToDateyyymmdd } from "../../Services/utils";
import * as local from "../../../Shared/Assets/ar.json";
import { connect } from "react-redux";
import { payment } from "../../redux/payment/actions";
import "./styles.scss";
interface State {
  payAmount: number;
  truthDate: string;
  randomPaymentType: string;
  dueDate: string;
  receiptNumber: string;
  paymentType: string;
}
interface FormValues {
  truthDate: string;
  payAmount: number;
  randomPaymentType: string;
  max: number;
  dueDate: string;
  receiptNumber: string;
  paymentType: string;
}
interface Installment {
  id: number;
  installmentResponse: number;
  principalInstallment: number;
  feesInstallment: number;
  totalPaid: number;
  principalPaid: number;
  feesPaid: number;
  dateOfPayment: number;
  status: string;
}
interface Application {
  installmentsObject: InstallmentsObject;
}
interface InstallmentsObject {
  totalInstallments: TotalInstallments;
}
interface TotalInstallments {
  installmentSum: number;
}
interface Props {
  installments: Array<Installment>;
  application: Application;
  changePaymentState: (data) => void;
  handleSubmit: (data) => void;
  payAmount: number;
  truthDate: string;
  receiptNumber: string;
  paymentType: string;
}
class PayInstallment extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payAmount: this.props.payAmount,
      truthDate: this.props.truthDate,
      randomPaymentType: "",
      dueDate: timeToDateyyymmdd(0),
      receiptNumber: this.props.receiptNumber,
      paymentType: this.props.paymentType
    };
  }
  render() {
    return (
      <Card className="payment-menu">
        <div className="payment-info" style={{ textAlign: "center" }}>
          <img
            alt="early-payment"
            src={require("../../Assets/payInstallment.svg")}
          />
          <h6
            style={{ cursor: "pointer" }}
            onClick={() => this.props.changePaymentState(0)}
          >
            {" "}
            <span className="fa fa-long-arrow-alt-right">
              {" "}
              {local.manualPayment}
            </span>
          </h6>
        </div>
        <div className="verticalLine"></div>
        <div style={{ width: "100%", padding: 20 }}>
          <Formik
            enableReinitialize
            initialValues={{
              ...this.state,
              max: this.props.application.installmentsObject.totalInstallments
                .installmentSum
            }}
            onSubmit={this.props.handleSubmit}
            validationSchema={paymentValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikBag: FormikProps<FormValues>) => (
              <Form onSubmit={formikBag.handleSubmit}>
                <Form.Group as={Row}>
                  <Form.Group as={Col} controlId="truthDate">
                    <Form.Label
                      style={{ textAlign: "right", paddingRight: 0 }}
                      column
                    >{`${local.truthDate}`}</Form.Label>
                    <Col>
                      <Form.Control
                        type="date"
                        name="truthDate"
                        data-qc="truthDate"
                        value={formikBag.values.truthDate}
                        onBlur={formikBag.handleBlur}
                        onChange={formikBag.handleChange}
                        isInvalid={
                          Boolean(formikBag.errors.truthDate) &&
                          Boolean(formikBag.touched.truthDate)
                        }
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikBag.errors.truthDate}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Col} controlId="dueDate">
                    <Form.Label
                      style={{ textAlign: "right", paddingRight: 0 }}
                      column
                    >{`${local.dueDate}`}</Form.Label>
                    <Col>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        data-qc="dueDate"
                        value={formikBag.values.dueDate}
                        disabled
                        isInvalid={
                          Boolean(formikBag.errors.dueDate) &&
                          Boolean(formikBag.touched.dueDate)
                        }
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikBag.errors.dueDate}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Group as={Col} controlId="payAmount">
                    <Form.Label
                      style={{ textAlign: "right", paddingRight: 0 }}
                      column
                    >{`${local.amountCollectedFromCustomer}`}</Form.Label>
                    <Col>
                      <Form.Control
                        type="number"
                        name="payAmount"
                        data-qc="payAmount"
                        value={formikBag.values.payAmount?.toString()}
                        onBlur={formikBag.handleBlur}
                        onChange={formikBag.handleChange}
                        isInvalid={
                          Boolean(formikBag.errors.payAmount) &&
                          Boolean(formikBag.touched.payAmount)
                        }
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikBag.errors.payAmount}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Col} controlId="receiptNumber">
                    <Form.Label
                      style={{ textAlign: "right", paddingRight: 0 }}
                      column
                    >{`${local.receiptNumber}`}</Form.Label>
                    <Col>
                      <Form.Control
                        name="receiptNumber"
                        data-qc="receiptNumber"
                        value={formikBag.values.receiptNumber}
                        onBlur={formikBag.handleBlur}
                        onChange={formikBag.handleChange}
                        isInvalid={
                          Boolean(formikBag.errors.receiptNumber) &&
                          Boolean(formikBag.touched.receiptNumber)
                        }
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikBag.errors.receiptNumber}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Form.Group>
                <div className="payments-buttons-container">
                  <Button
                    variant="outline-primary"
                    data-qc="cancel"
                    onClick={() => this.props.changePaymentState(0)}
                  >
                    {local.cancel}
                  </Button>
                  <Button variant="primary" data-qc="submit" type="submit">
                    {local.submit}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    );
  }
}

const addPaymentToProps = dispatch => {
  return {
    changePaymentState: data => dispatch(payment(data))
  };
};
const mapStateToProps = state => {
  return {
    paymentState: state.payment
  };
};
export default connect(mapStateToProps, addPaymentToProps)(PayInstallment);
