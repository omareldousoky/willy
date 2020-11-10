import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import AsyncSelect from 'react-select/async';
import { Formik, FormikProps } from "formik";
import * as local from "../../../Shared/Assets/ar.json";
import { paymentValidation } from "./paymentValidation";
import { searchUserByAction } from "../../Services/APIs/UserByAction/searchUserByAction";
import { connect } from "react-redux";
import { payment } from "../../../Shared/redux/payment/actions";
import "./styles.scss";
import { Employee } from "./payment";

interface FormValues {
  requiredAmount: number;
  truthDate: string;
  payAmount: number;
  randomPaymentType: string;
  max: number;
  paymentType: string;
  penaltyAction: string;
  payerType: string;
  payerNationalId: string;
  payerName: string;
  payerId: string;
  installmentNumber: number;
}
export interface Installment {
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
  group: any;
  product: any;
  beneficiaryType: string;
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
  payerType: string;
  payerNationalId: string;
  payerName: string;
  payerId: string;
  installmentNumber: number;
  employees: Array<Employee>;
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
      penaltyAction: this.props.penaltyAction,
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      installmentNumber: -1,
      employees: [],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.penaltyAction !== this.props.penaltyAction)
      this.setState({ penaltyAction: prevProps.penaltyAction });
  }
  getUsersByAction = async (input: string, values) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey:'halan.com/application',
      action:'acceptPayment',
      name: input
    }
    const res = await searchUserByAction(obj);
    if(res.status === 'success') {
      this.setState({ ...values, employees: res.body.data, payerType: 'employee' });
      return res.body.data;
    } else { 
      this.setState({ employees: [] });
      return [];
    }
  }

  getRequiredAmount() {
    const installment = this.props.installments.find(installment => {
        return (installment.status !== "paid" && installment.status !== "rescheduled" && installment.status !== "pending")
    });
    return installment? installment.installmentResponse - installment.totalPaid : 0;
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
              max: this.props.application.installmentsObject.totalInstallments.installmentSum,
              beneficiaryType: this.props.application.product.beneficiaryType,
              payAmount: this.props.paymentType === "normal" ? this.getRequiredAmount() : this.state.payAmount
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
                                this.getRequiredAmount()
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
                    {this.props.penaltyAction !== "cancel" &&
                    <Form.Group as={Col} md={6} controlId="whoPaid">
                      <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.whoMadeThePayment}`}</Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="payerType"
                          data-qc="payerType"
                          value={formikBag.values.payerType}
                          onChange={formikBag.handleChange}
                          onBlur={formikBag.handleBlur}
                          isInvalid={Boolean(formikBag.errors.payerType) && Boolean(formikBag.touched.payerType)}
                        >
                          <option value={''}></option>
                          <option value='beneficiary' data-qc='beneficiary'>{local.customer}</option>
                          <option value='employee' data-qc='employee'>{local.employee}</option>
                          <option value='family' data-qc='family'>{local.familyMember}</option>
                          <option value='nonFamily' data-qc='nonFamily'>{local.nonFamilyMember}</option>
                          <option value='insurance' data-qc='insurance'>{local.byInsurance}</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikBag.errors.payerType}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>}
                    {formikBag.values.payerType === 'beneficiary' && this.props.application.product.beneficiaryType === "group" && <Form.Group as={Col} md={6} controlId="customer">
                      <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.customer}`}</Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="payerId"
                          data-qc="payerId"
                          onChange={formikBag.handleChange}
                          onBlur={formikBag.handleBlur}
                          isInvalid={Boolean(formikBag.errors.payerId) && Boolean(formikBag.touched.payerId)}
                        >
                          <option value={''}></option>
                          {this.props.application.group.individualsInGroup.map((member, index) => {
                            return <option key={index} value={member.customer._id}>{member.customer.customerName}</option>
                          })}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikBag.errors.payerId}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>}
                    {formikBag.values.payerType === 'employee' && <Form.Group as={Col} md={6} controlId="whoPaid">
                      <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.employee}`}</Form.Label>
                      <Col>
                        <AsyncSelect
                          className={formikBag.errors.payerId ? "error" : ""}
                          name="payerId"
                          data-qc="payerId"
                          value={this.state.employees.find(employee => employee._id === formikBag.values.payerId)}
                          onBlur={formikBag.handleBlur}
                          onChange={(employee: any) => formikBag.setFieldValue("payerId", employee._id)}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option._id}
                          loadOptions={(input) => this.getUsersByAction(input, formikBag.values)}
                          cacheOptions defaultOptions
                        />
                        {formikBag.touched.payerId && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#d51b1b' }}>
                          {formikBag.errors.payerId}
                        </div>}
                      </Col>
                    </Form.Group>}
                    {(formikBag.values.payerType === 'family' || formikBag.values.payerType === 'nonFamily') &&
                      <>
                        <Form.Group as={Col} md={6} controlId="whoPaid">
                          <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.name}`}</Form.Label>
                          <Col>
                            <Form.Control
                              name="payerName"
                              data-qc="payerName"
                              value={formikBag.values.payerName.toString()}
                              onBlur={formikBag.handleBlur}
                              onChange={formikBag.handleChange}
                              isInvalid={Boolean(formikBag.errors.payerName) && Boolean(formikBag.touched.payerName)} />
                            <Form.Control.Feedback type="invalid">
                              {formikBag.errors.payerName}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Col} md={6} controlId="whoPaid">
                          <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.nationalId}`}</Form.Label>
                          <Col>
                            <Form.Control
                              type="text"
                              name="payerNationalId"
                              data-qc="payerNationalId"
                              maxLength={14}
                              value={formikBag.values.payerNationalId.toString()}
                              onBlur={formikBag.handleBlur}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const re = /^\d*$/;
                                if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                  formikBag.setFieldValue('payerNationalId', event.currentTarget.value)
                                }}}
                              isInvalid={Boolean(formikBag.errors.payerNationalId) && Boolean(formikBag.touched.payerNationalId)} />
                            <Form.Control.Feedback type="invalid">
                              {formikBag.errors.payerNationalId}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      </>
                    }
                  </Form.Group>
                </Container>
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
