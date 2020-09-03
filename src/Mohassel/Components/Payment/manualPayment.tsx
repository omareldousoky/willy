import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";
import AsyncSelect from 'react-select/async';
import { Formik, FormikProps } from "formik";
import { searchUserByAction } from "../../Services/APIs/UserByAction/searchUserByAction";
import { timeToDateyyymmdd } from "../../Services/utils";
import { payment } from "../../redux/payment/actions";
import { Employee } from "./payment";
import { manualPaymentValidation } from "./paymentValidation";
import * as local from "../../../Shared/Assets/ar.json";
import "./styles.scss";

interface SelectObject {
  label: string;
  value: string;
}
interface State {
  payAmount: number;
  truthDate: string;
  randomPaymentType: string;
  dueDate: string;
  receiptNumber: string;
  payerType: string;
  payerNationalId: string;
  payerName: string;
  payerId: string;
  employees: Array<Employee>;
  randomPaymentTypes: Array<SelectObject>;
}
interface FormValues {
  truthDate: string;
  payAmount: number;
  randomPaymentType: string;
  max: number;
  dueDate: string;
  receiptNumber: string;
  payerType: string;
  payerNationalId: string;
  payerName: string;
  payerId: string;
}
interface Member {
  customer: {
    customerName: string;
    _id: string;
  }
}
interface Application {
  installmentsObject: InstallmentsObject;
  product: {
    beneficiaryType: string;
  };
  group: {
    individualsInGroup: Array<Member>
  }
}
interface InstallmentsObject {
  totalInstallments: TotalInstallments;
}
interface TotalInstallments {
  installmentSum: number;
}
interface Props {
  application: Application;
  changePaymentState: (data) => void;
  handleSubmit: (data) => void;
  payAmount: number;
  paymentType: string;
  truthDate: string;
  receiptNumber: string;
  setPayerType: (data) => void;
}
class ManualPayment extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payAmount: this.props.payAmount,
      truthDate: this.props.truthDate,
      randomPaymentType: "",
      dueDate: timeToDateyyymmdd(0),
      receiptNumber: this.props.receiptNumber,
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      employees: [],
      randomPaymentTypes: [
        { label: local.collectionCommission, value: "collectionCommission" },
        { label: local.reissuingFees, value: "reissuingFees" },
        { label: local.legalFees, value: "legalFees" },
        { label: local.clearanceFees, value: "clearanceFees" },
        { label: local.toktokStamp, value: "toktokStamp" },
        { label: local.tricycleStamp, value: "tricycleStamp" }
      ],
    };
  }
  getUsersByAction = async (input: string, values) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey: 'halan.com/application',
      action: 'acceptPayment',
      name: input
    }
    const res = await searchUserByAction(obj);
    if (res.status === 'success') {
      this.setState({ ...values, employees: res.body.data, payerType: 'employee' });
      this.props.setPayerType('employee');
      return res.body.data;
    } else {
      this.setState({ employees: [] });
      return [];
    }
  }
  render() {
    return (
      <Card className="payment-menu">
        <div className="payment-info" style={{ textAlign: 'center' }}>
          <img alt="early-payment" src={require('../../Assets/payInstallment.svg')} />
          <h6 style={{ cursor: 'pointer' }} onClick={() => this.props.changePaymentState(0)}> <span className="fa fa-long-arrow-alt-right"> {local.manualPayment}</span></h6>
        </div>
        <div className="verticalLine"></div>
        <div style={{ width: '100%', padding: 20 }}>
          <Formik
            enableReinitialize
            initialValues={{ ...this.state, max: this.props.application.installmentsObject.totalInstallments.installmentSum, paymentType: this.props.paymentType }}
            onSubmit={this.props.handleSubmit}
            validationSchema={manualPaymentValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikProps: FormikProps<FormValues>) =>
              <Form onSubmit={formikProps.handleSubmit}>
                {this.props.paymentType === "random" ? (
                  <Form.Group as={Row}>
                    <Form.Group as={Col} controlId="randomPaymentType">
                      <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.randomPaymentToBePaid}`}</Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="randomPaymentType"
                          data-qc="randomPaymentType"
                          value={formikProps.values.randomPaymentType}
                          onChange={formikProps.handleChange}
                          onBlur={formikProps.handleBlur}
                          isInvalid={Boolean(formikProps.errors.randomPaymentType) && Boolean(formikProps.touched.randomPaymentType)}
                        >
                          <option value=""></option>
                          {this.state.randomPaymentTypes.map(
                            (randomPaymentType: SelectObject) => {
                              return (<option key={randomPaymentType.value} value={randomPaymentType.value}>{randomPaymentType.label}</option>);
                            }
                          )}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.randomPaymentType}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Form.Group>
                ) : null}
                <Form.Group as={Row}>
                  <Form.Group as={Col} controlId="truthDate">
                    <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.truthDate}`}</Form.Label>
                    <Col>
                      <Form.Control
                        type="date"
                        name="truthDate"
                        data-qc="truthDate"
                        value={formikProps.values.truthDate}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.truthDate) && Boolean(formikProps.touched.truthDate)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.truthDate}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Col} controlId="dueDate">
                    <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.dueDate}`}</Form.Label>
                    <Col>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        data-qc="dueDate"
                        value={formikProps.values.dueDate}
                        disabled
                        isInvalid={Boolean(formikProps.errors.dueDate) && Boolean(formikProps.touched.dueDate)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.dueDate}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Group as={Col} md={6} controlId="payAmount">
                    <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.amountCollectedFromCustomer}`}</Form.Label>
                    <Col>
                      <Form.Control
                        type="number"
                        name="payAmount"
                        data-qc="payAmount"
                        value={formikProps.values.payAmount?.toString()}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.payAmount) && Boolean(formikProps.touched.payAmount)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.payAmount}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="receiptNumber">
                    <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.receiptNumber}`}</Form.Label>
                    <Col>
                      <Form.Control
                        name="receiptNumber"
                        data-qc="receiptNumber"
                        value={formikProps.values.receiptNumber}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.receiptNumber) && Boolean(formikProps.touched.receiptNumber)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.receiptNumber}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="whoPaid">
                    <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.whoMadeThePayment}`}</Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="payerType"
                        data-qc="payerType"
                        value={formikProps.values.payerType}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isInvalid={Boolean(formikProps.errors.payerType) && Boolean(formikProps.touched.payerType)}
                      >
                        <option value={''}></option>
                        <option value='beneficiary' data-qc='beneficiary'>{local.customer}</option>
                        <option value='employee' data-qc='employee'>{local.employee}</option>
                        <option value='family' data-qc='family'>{local.familyMember}</option>
                        <option value='nonFamily' data-qc='nonFamily'>{local.nonFamilyMember}</option>
                        <option value='insurance' data-qc='insurance'>{local.byInsurance}</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.payerType}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  {formikProps.values.payerType === 'beneficiary' && this.props.application.product.beneficiaryType === "group" && <Form.Group as={Col} md={6} controlId="customer">
                    <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.customer}`}</Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="payerId"
                        data-qc="payerId"
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isInvalid={Boolean(formikProps.errors.payerId) && Boolean(formikProps.touched.payerId)}
                      >
                        <option value={''}></option>
                        {this.props.application.group.individualsInGroup.map((member, index) => {
                          return <option key={index} value={member.customer._id}>{member.customer.customerName}</option>
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.payerId}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>}
                  {console.log("Elvalues", formikProps.values, this.state)}
                  {formikProps.values.payerType === 'employee' && <Form.Group as={Col} md={6} controlId="whoPaid">
                    <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.employee}`}</Form.Label>
                    <Col>
                      <AsyncSelect
                        className={formikProps.errors.payerId ? "error" : ""}
                        name="payerId"
                        data-qc="payerId"
                        value={this.state.employees.find(employee => employee._id === formikProps.values.payerId)}
                        onFocus={formikProps.handleBlur}
                        onChange={(employee: any) => formikProps.setFieldValue("payerId", employee._id)}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        loadOptions={(input) => this.getUsersByAction(input, formikProps.values)}
                        cacheOptions
                        defaultOptions
                      />
                      {formikProps.touched.payerId && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#d51b1b' }}>
                        {formikProps.errors.payerId}
                      </div>}
                    </Col>
                  </Form.Group>}
                  {(formikProps.values.payerType === 'family' || formikProps.values.payerType === 'nonFamily') &&
                    <>
                      <Form.Group as={Col} md={6} controlId="whoPaid">
                        <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.name}`}</Form.Label>
                        <Col>
                          <Form.Control
                            name="payerName"
                            data-qc="payerName"
                            value={formikProps.values.payerName.toString()}
                            onBlur={formikProps.handleBlur}
                            onChange={formikProps.handleChange}
                            isInvalid={Boolean(formikProps.errors.payerName) && Boolean(formikProps.touched.payerName)} />
                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.payerName}
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
                            value={formikProps.values.payerNationalId.toString()}
                            onBlur={formikProps.handleBlur}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const re = /^\d*$/;
                              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                formikProps.setFieldValue('payerNationalId', event.currentTarget.value)
                              }
                            }}
                            isInvalid={Boolean(formikProps.errors.payerNationalId) && Boolean(formikProps.touched.payerNationalId)} />
                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.payerNationalId}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                    </>
                  }
                </Form.Group>
                <div className="payments-buttons-container">
                  <Button variant="outline-primary" data-qc="cancel" onClick={() => this.props.changePaymentState(0)}>{local.cancel}</Button>
                  <Button variant="primary" data-qc="submit" type="submit">{local.submit}</Button>
                </div>
              </Form>
            }
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

export default connect(null, addPaymentToProps)(ManualPayment);