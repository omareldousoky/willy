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
import { timeToDateyyymmdd, getErrorMessage } from "../../../Shared/Services/utils";
import { payment } from "../../../Shared/redux/payment/actions";
import { Employee } from "./payment";
import { manualPaymentValidation } from "./paymentValidation";
import * as local from "../../../Shared/Assets/ar.json";
import "./styles.scss";
import { PendingActions } from "../../../Shared/Services/interfaces";
import { Installment } from "./payInstallment";
import Swal from "sweetalert2";
import Can from "../../config/Can";
import { theme } from "../../../theme";

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
  paymentType: string;
}
interface Member {
  customer: {
    customerName: string;
    _id: string;
  };
}
interface Application {
  installmentsObject: InstallmentsObject;
  product: {
    beneficiaryType: string;
    type: string;
  };
  group: {
    individualsInGroup: Array<Member>;
  };
}
interface InstallmentsObject {
  totalInstallments: TotalInstallments;
  installments: Array<Installment>;
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
  randomPendingActions: Array<PendingActions>;
  formikProps: any;
  retainState: (data) => void;
  bankPayment?: boolean;
}
class ManualPayment extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payAmount: this.props.payAmount,
      truthDate: this.props.truthDate,
      randomPaymentType: "",
      dueDate: timeToDateyyymmdd(-1),
      receiptNumber: this.props.receiptNumber,
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      employees: [],
    };
  }

  getRandomPaymentTypes = () => {
    const randomPaymentTypes = [
      { label: local.reissuingFees, value: 'reissuingFees' },
      { label: local.legalFees, value: 'legalFees' },
      { label: local.clearanceFees, value: 'clearanceFees' },
      { label: local.toktokStamp, value: 'toktokStamp' },
      { label: local.tricycleStamp, value: 'tricycleStamp' },
    ]
    const smeRandomPaymentTypes = randomPaymentTypes.filter(
      (option) => !['toktokStamp', 'tricycleStamp'].includes(option.value)
    )
    return this.props.application.product.type === 'sme'
      ? smeRandomPaymentTypes
      : randomPaymentTypes
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
      this.setState({ employees: res.body.data, payerType: 'employee' }, () => this.props.retainState(values));
      this.props.setPayerType('employee');
      return res.body.data;
    } else {
      this.setState({ employees: [] }, () => Swal.fire("Error !",getErrorMessage(res.error.error),'error'));
      return [];
    }
  }
  render() {
    return (
              <Form onSubmit={this.props.formikProps.handleSubmit}>
                {this.props.paymentType === "random" ? (
                  <Form.Group as={Row}>
                    <Form.Group as={Col} controlId="randomPaymentType">
                      <Form.Label style={{ paddingRight: 0 }} column>{`${local.randomPaymentToBePaid}`}</Form.Label>
                        <Form.Control
                          as="select"
                          name="randomPaymentType"
                          data-qc="randomPaymentType"
                          value={this.props.formikProps.values.randomPaymentType}
                          onChange={this.props.formikProps.handleChange}
                          onBlur={this.props.formikProps.handleBlur}
                          isInvalid={Boolean(this.props.formikProps.errors.randomPaymentType) && Boolean(this.props.formikProps.touched.randomPaymentType)}
                        >
                          <option value=""></option>
                          {this.getRandomPaymentTypes().map(
                            (randomPaymentType: SelectObject) => {
                              return (<option key={randomPaymentType.value} value={randomPaymentType.value}>{randomPaymentType.label}</option>);
                            }
                          )}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {this.props.formikProps.errors.randomPaymentType}
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                ) : null}
                <Form.Group as={Row}>
                  <Form.Group as={Col} controlId="truthDate">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.truthDate}`}</Form.Label>
                      <Form.Control
                        type="date"
                        name="truthDate"
                        data-qc="truthDate"
                        min="2021-02-01"
                        value={this.props.formikProps.values.truthDate}
                        onBlur={this.props.formikProps.handleBlur}
                        onChange={this.props.formikProps.handleChange}
                        isInvalid={Boolean(this.props.formikProps.errors.truthDate) && Boolean(this.props.formikProps.touched.truthDate)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.truthDate}
                      </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="dueDate">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.dueDate}`}</Form.Label>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        data-qc="dueDate"
                        value={this.props.formikProps.values.dueDate}
                        disabled
                        isInvalid={Boolean(this.props.formikProps.errors.dueDate) && Boolean(this.props.formikProps.touched.dueDate)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.dueDate}
                      </Form.Control.Feedback>
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Group as={Col} md={6} controlId="payAmount">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.amountCollectedFromCustomer}`}</Form.Label>
                      <Form.Control
                        type="number"
                        name="payAmount"
                        data-qc="payAmount"
                        value={this.props.formikProps.values.payAmount?.toString()}
                        onBlur={this.props.formikProps.handleBlur}
                        onChange={this.props.formikProps.handleChange}
                        isInvalid={Boolean(this.props.formikProps.errors.payAmount) && Boolean(this.props.formikProps.touched.payAmount)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.payAmount}
                      </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="receiptNumber">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.receiptNumber}`}</Form.Label>
                      <Form.Control
                        name="receiptNumber"
                        data-qc="receiptNumber"
                        value={this.props.formikProps.values.receiptNumber}
                        onBlur={this.props.formikProps.handleBlur}
                        onChange={this.props.formikProps.handleChange}
                        isInvalid={Boolean(this.props.formikProps.errors.receiptNumber) && Boolean(this.props.formikProps.touched.receiptNumber)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.receiptNumber}
                      </Form.Control.Feedback>
                  </Form.Group>
                  {this.props.paymentType === "normal"  && <Form.Group as={Col} md={6} controlId="installmentNumber">
                    <Form.Label column className="pr-0">{`${local.installmentToBePaid}`}</Form.Label>
                      <Form.Control
                        as="select"
                        name="installmentNumber"
                        data-qc="installmentNumber"
                        value={this.props.formikProps.values.installmentNumber}
                        onChange={event => {
                          const installment = this.props.application.installmentsObject.installments.find(installment => installment.id ===Number(event.currentTarget.value))
                          this.props.formikProps.setFieldValue("installmentNumber", event.currentTarget.value);
                          this.props.formikProps.setFieldValue(
                            "requiredAmount",
                            (installment ? (installment.installmentResponse - installment?.totalPaid) : 0)
                          );
                          this.props.formikProps.setFieldValue(
                            "payAmount",
                            (installment ? (installment.installmentResponse - installment?.totalPaid) : 0)
                          );
                        }}
                      >
                        <option value={-1}></option>
                        {this.props.application.installmentsObject.installments.map(installment => {
                          if (
                            installment.status !== "paid" &&
                            installment.status !== "rescheduled"
                          )
                            return <option key={installment.id} value={installment.id}>{installment.id}</option>
                        })}
                      </Form.Control>
                  </Form.Group>}
                  {this.props.bankPayment && <>
                  <Form.Group as={Col} md={6} controlId="bankOfPayment">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.bankName}`}</Form.Label>
                      <Form.Control
                        name="bankOfPayment"
                        data-qc="bankOfPayment"
                        value={this.props.formikProps.values.bankOfPayment}
                        onBlur={this.props.formikProps.handleBlur}
                        onChange={this.props.formikProps.handleChange}
                        isInvalid={Boolean(this.props.formikProps.errors.bankOfPayment) && Boolean(this.props.formikProps.touched.bankOfPayment)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.bankOfPayment}
                      </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="bankOfPaymentBranch">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.bankBranch}`}</Form.Label>
                      <Form.Control
                        name="bankOfPaymentBranch"
                        data-qc="bankOfPaymentBranch"
                        value={this.props.formikProps.values.bankOfPaymentBranch}
                        onBlur={this.props.formikProps.handleBlur}
                        onChange={this.props.formikProps.handleChange}
                        isInvalid={Boolean(this.props.formikProps.errors.bankOfPaymentBranch) && Boolean(this.props.formikProps.touched.bankOfPaymentBranch)}
                      >
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.bankOfPaymentBranch}
                      </Form.Control.Feedback>
                  </Form.Group>
                  </>}
                  {!this.props.bankPayment && <Form.Group as={Col} md={6} controlId="whoPaid">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.whoMadeThePayment}`}</Form.Label>
                      <Form.Control
                        as="select"
                        name="payerType"
                        data-qc="payerType"
                        value={this.props.formikProps.values.payerType}
                        onChange={this.props.formikProps.handleChange}
                        onBlur={this.props.formikProps.handleBlur}
                        isInvalid={Boolean(this.props.formikProps.errors.payerType) && Boolean(this.props.formikProps.touched.payerType)}
                      >
                        <option value={''}></option>
                        <Can I="payInstallment" an="application">
                          <option value='beneficiary' data-qc='beneficiary'>{local.customer}</option>
                          <option value='employee' data-qc='employee'>{local.employee}</option>
                          <option value='family' data-qc='family'>{local.familyMember}</option>
                          <option value='nonFamily' data-qc='nonFamily'>{local.nonFamilyMember}</option>
                        </Can>
                        {this.props.paymentType === "normal" && <Can I="payByInsurance" an="application">
                          <option value='insurance' data-qc='insurance'>{local.byInsurance}</option>
                        </Can>}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.payerType}
                      </Form.Control.Feedback>
                  </Form.Group>}
                  {this.props.formikProps.values.payerType === 'beneficiary' && this.props.application.product.beneficiaryType === "group" && <Form.Group as={Col} md={6} controlId="customer">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.customer}`}</Form.Label>
                      <Form.Control
                        as="select"
                        name="payerId"
                        data-qc="payerId"
                        value={this.props.formikProps.values.payerId}
                        onChange={this.props.formikProps.handleChange}
                        onBlur={this.props.formikProps.handleBlur}
                        isInvalid={Boolean(this.props.formikProps.errors.payerId) && Boolean(this.props.formikProps.touched.payerId)}
                      >
                        <option value={''}></option>
                        {this.props.application.group.individualsInGroup.map((member, index) => {
                          return <option key={index} value={member.customer._id}>{member.customer.customerName}</option>
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {this.props.formikProps.errors.payerId}
                      </Form.Control.Feedback>
                  </Form.Group>}
                  {this.props.formikProps.values.payerType === 'employee' && <Form.Group as={Col} md={6} controlId="whoPaid">
                    <Form.Label style={{ paddingRight: 0 }} column>{`${local.employee}`}</Form.Label>
                      <AsyncSelect
                        className={this.props.formikProps.errors.payerId ? "error" : ""}
                        name="payerId"
                        data-qc="payerId"
												styles={theme.selectStyleWithBorder}
												theme={theme.selectTheme}
                        value={this.state.employees.find(employee => employee._id === this.props.formikProps.values.payerId)}
                        onFocus={this.props.formikProps.handleBlur}
                        onChange={(employee: any) => this.props.formikProps.setFieldValue("payerId", employee._id)}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        loadOptions={(input) => this.getUsersByAction(input, this.props.formikProps.values)}
                        cacheOptions
                        defaultOptions
                      />
                      {this.props.formikProps.touched.payerId && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#d51b1b' }}>
                        {this.props.formikProps.errors.payerId}
                      </div>}
                  </Form.Group>}
                  {(this.props.formikProps.values.payerType === 'family' || this.props.formikProps.values.payerType === 'nonFamily') &&
                    <>
                      <Form.Group as={Col} md={6} controlId="whoPaid">
                        <Form.Label style={{ paddingRight: 0 }} column>{`${local.name}`}</Form.Label>
                          <Form.Control
                            name="payerName"
                            data-qc="payerName"
                            value={this.props.formikProps.values.payerName?.toString()}
                            onBlur={this.props.formikProps.handleBlur}
                            onChange={this.props.formikProps.handleChange}
                            isInvalid={Boolean(this.props.formikProps.errors.payerName) && Boolean(this.props.formikProps.touched.payerName)} />
                          <Form.Control.Feedback type="invalid">
                            {this.props.formikProps.errors.payerName}
                          </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md={6} controlId="whoPaid">
                        <Form.Label style={{ paddingRight: 0 }} column>{`${local.nationalId}`}</Form.Label>
                          <Form.Control
                            type="text"
                            name="payerNationalId"
                            data-qc="payerNationalId"
                            maxLength={14}
                            value={this.props.formikProps.values.payerNationalId?.toString()}
                            onBlur={this.props.formikProps.handleBlur}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const re = /^\d*$/;
                              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                this.props.formikProps.setFieldValue('payerNationalId', event.currentTarget.value)
                              }
                            }}
                            isInvalid={Boolean(this.props.formikProps.errors.payerNationalId) && Boolean(this.props.formikProps.touched.payerNationalId)} />
                          <Form.Control.Feedback type="invalid">
                            {this.props.formikProps.errors.payerNationalId}
                          </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  }
                </Form.Group>
                <div className="payments-buttons-container">
                  <Button variant="secondary" data-qc="cancel" onClick={() => this.props.changePaymentState(0)}>{local.cancel}</Button>
                  <Button variant="primary" data-qc="submit" type="submit">{local.submit}</Button>
                </div>
              </Form>
    );
  }
}

const addPaymentToProps = dispatch => {
  return {
    changePaymentState: data => dispatch(payment(data))
  };
};

export default connect(null, addPaymentToProps)(ManualPayment);