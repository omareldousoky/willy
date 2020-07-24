import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Formik, FormikProps } from "formik";
import * as local from "../../../Shared/Assets/ar.json";
import { paymentValidation } from "./paymentValidation";
import { connect } from "react-redux";
import { payment } from "../../redux/payment/actions";
import "./styles.scss";

interface FormValues {
  requiredAmount: number;
  truthDate: string;
  payAmount: number;
  randomPaymentType: string;
  max: number;
  paymentType: string;
  penaltyAction: string;
  byInsurance: boolean;
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
  paymentType: string;
  penaltyAction: string;
  byInsurance: boolean;
}
interface SelectObject {
  label: string;
  value: string;
}
interface State {
  payAmount: number;
  truthDate: string;
  randomPaymentType: string;
  requiredAmount: number;
  paymentType: string;
  randomPaymentTypes: Array<SelectObject>;
  penaltyAction: string;
}
class PayInstallment extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payAmount: this.props.payAmount,
      truthDate: this.props.truthDate,
      randomPaymentType: "",
      requiredAmount: 0,
      paymentType: this.props.paymentType,
      randomPaymentTypes: [
        { label: local.collectionCommission, value: "collectionCommission" },
        { label: local.reissuingFees, value: "reissuingFees" },
        { label: local.legalFees, value: "legalFees" },
        { label: local.clearanceFees, value: "clearanceFees" },
        { label: local.toktokStamp, value: "toktokStamp" },
        { label: local.tricycleStamp, value: "tricycleStamp" }
      ],
      penaltyAction: this.props.penaltyAction
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.penaltyAction !== this.props.penaltyAction)
      this.setState({ penaltyAction: prevProps.penaltyAction });
  }

  getRequiredAmount() {
    // const todaysDate = new Date("2020-06-30").valueOf();
    const todaysDate = new Date().valueOf();
    let total = 0;
    const installments: Array<number> = [];
    this.props.installments.forEach(installment => {
      if (todaysDate >= installment.dateOfPayment) {
        if (installment.status !== "paid")
          total =
            total + installment.installmentResponse - installment.totalPaid;
        installments.push(installment.id);
      } else return total;
    });
    return { total: total, installments: installments };
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
              {local.payInstallment}
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
                .installmentSum,
              byInsurance: this.props.byInsurance
            }}
            onSubmit={this.props.handleSubmit}
            validationSchema={paymentValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikBag: FormikProps<FormValues>) => (
              <Form onSubmit={formikBag.handleSubmit}>
                <Container>
                  <Form.Group as={Row} md={12}>
                    {/* `${this.props.paymentType==="normal"? local.installmentToBePaid: local.randomPaymentToBePaid}`} */}
                    {this.props.paymentType === "normal" ? (
                      <>
                        <Form.Group
                          as={Col}
                          md={6}
                          controlId="installmentNumber"
                        >
                          <Form.Label
                            style={{ textAlign: "right", paddingRight: 0 }}
                            column
                          >{`${local.installmentToBePaid}`}</Form.Label>
                          <Col>
                            <Form.Control
                              as="select"
                              name="installmentNumber"
                              data-qc="installmentNumber"
                              onChange={event => {
                                formikBag.setFieldValue(
                                  "installmentNumber",
                                  event.currentTarget.value
                                );
                                formikBag.setFieldValue(
                                  "requiredAmount",
                                  this.props.installments.find(
                                    installment =>
                                      installment.id ===
                                      Number(event.currentTarget.value)
                                  )?.installmentResponse
                                );
                              }}
                            >
                              <option value={-1}></option>
                              {this.props.installments.map(installment => {
                                if (
                                  installment.status !== "partiallyPaid" &&
                                  installment.status !== "paid" &&
                                  installment.status !== "rescheduled" &&
                                  installment.dateOfPayment > Date.now()
                                )
                                  return (
                                    <option
                                      key={installment.id}
                                      value={installment.id}
                                    >
                                      {installment.id}
                                    </option>
                                  );
                              })}
                            </Form.Control>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="requiredAmount">
                          <Form.Label
                            style={{ textAlign: "right", paddingRight: 0 }}
                            column
                          >{`${local.requiredAmount}`}</Form.Label>
                          <Col>
                            <Form.Control
                              type="number"
                              name="requiredAmount"
                              value={
                                formikBag.values.requiredAmount ||
                                this.getRequiredAmount().total
                              }
                              disabled
                            ></Form.Control>
                          </Col>
                        </Form.Group>
                      </>
                    ) : null}
                    {this.props.paymentType === "random" ? (
                      <Form.Group as={Col} md={6} controlId="randomPaymentType">
                        <Form.Label
                          style={{ textAlign: "right", paddingRight: 0 }}
                          column
                        >{`${local.randomPaymentToBePaid}`}</Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="randomPaymentType"
                            data-qc="randomPaymentType"
                            onChange={event => {
                              formikBag.setFieldValue(
                                "randomPaymentType",
                                event.currentTarget.value
                              );
                            }}
                          >
                            <option value={-1}></option>
                            {this.state.randomPaymentTypes.map(
                              (randomPaymentType: SelectObject) => {
                                return (
                                  <option
                                    key={randomPaymentType.value}
                                    value={randomPaymentType.value}
                                  >
                                    {randomPaymentType.label}
                                  </option>
                                );
                              }
                            )}
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    ) : null}
                    <Form.Group as={Col} md={6} controlId="payAmount">
                      <Form.Label
                        style={{ textAlign: "right", paddingRight: 0 }}
                        column
                      >{`${local.amountCollectedFromCustomer}`}</Form.Label>
                      <Col>
                        <Form.Control
                          type="number"
                          name="payAmount"
                          data-qc="payAmount"
                          value={formikBag.values.payAmount.toString()}
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
                    {this.state.penaltyAction !== "cancel" ? (
                      <Form.Group as={Col} md={6} controlId="truthDate">
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
                    ) : null}
                  </Form.Group>
                </Container>
                {this.props.penaltyAction === "normal" ? (
                  <div style={{ display: "flex" }}>
                    <Form.Label
                      style={{ textAlign: "right", paddingRight: 0 }}
                    >{`${local.byInsurance}`}</Form.Label>
                    <Form.Check
                      name="byInsurance"
                      id="byInsurance"
                      data-qc="byInsurance"
                      type="checkbox"
                      checked={formikBag.values.byInsurance}
                      onChange={formikBag.handleChange}
                    />
                  </div>
                ) : null}
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
