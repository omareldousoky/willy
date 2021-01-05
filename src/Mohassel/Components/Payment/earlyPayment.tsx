import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { searchUserByAction } from '../../Services/APIs/UserByAction/searchUserByAction';
import { Installment } from './payInstallment';
import { payment } from '../../../Shared/redux/payment/actions';
import { Employee } from './payment';
import * as local from '../../../Shared/Assets/ar.json';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';

interface Member {
  customer: {
    customerName: string;
    _id: string;
  };
}
interface Props {
  loading: boolean;
  remainingPrincipal: number;
  earlyPaymentFees: number;
  requiredAmount: number;
  installments: Array<Installment>;
  application: {
    installmentsObject: {
      totalInstallments: {
        installmentSum: number;
      };
    };
    product: {
      beneficiaryType: string;
    };
    group: {
      individualsInGroup: Array<Member>;
    };
  };
  changePaymentState: (data) => void;
  setPayerType: (data) => void;
  formikProps: any;
}
interface State {
  employees: Array<Employee>;
}

class EarlyPayment extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
    }
  }
  getInstallmentsRemaining() {
    const installmentsRemaining: Array<number> = [];
    this.props.installments.forEach(installment => {
      if (installment.status !== 'paid')
        installmentsRemaining.push(installment.id);
    })
    return installmentsRemaining.toString();
  }
  getUsersByAction = async (input: string) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey: 'halan.com/application',
      action: 'acceptPayment',
      name: input
    }
    const res = await searchUserByAction(obj);
    if (res.status === 'success') {
      this.setState({ employees: res.body.data });
      this.props.setPayerType('employee');
      return res.body.data;
    } else {
      this.setState({ employees: [] }, () =>Swal.fire("Error !",getErrorMessage(res.error.error),'error'));
      return [];
    }
  }
  render() {
    return (

      <Form onSubmit={this.props.formikProps.handleSubmit}>
        <Form.Group as={Row} style={{ marginTop: 45 }}>
          <Form.Group as={Col} controlId="installmentsRemaining">
            <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.installmentsRemaining}`}</Form.Label>
            <Col>
              <Form.Control
                name="installmentsRemaining"
                value={this.getInstallmentsRemaining()}
                disabled
              >
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Col} controlId="installmentsRemaining">
            <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.remainingPrincipal}`}</Form.Label>
            <Col>
              <Form.Control
                name="installmentsRemaining"
                value={this.props.remainingPrincipal}
                disabled
              >
              </Form.Control>
            </Col>
          </Form.Group>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Group as={Col} controlId="earlyPaymentFees">
            <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.earlyPaymentFees}`}</Form.Label>
            <Col>
              <Form.Control
                name="earlyPaymentFees"
                value={this.props.earlyPaymentFees}
                disabled
              >
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Col} controlId="requiredAmount">
            <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.requiredAmount}`}</Form.Label>
            <Col>
              <Form.Control
                type="number"
                name="requiredAmount"
                value={this.props.requiredAmount}
                disabled
              >
              </Form.Control>
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
                value={this.props.formikProps.values.payAmount?.toString()}
                onBlur={this.props.formikProps.handleBlur}
                onChange={this.props.formikProps.handleChange}
                isInvalid={Boolean(this.props.formikProps.errors.payAmount) && Boolean(this.props.formikProps.touched.payAmount)}
              >
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {this.props.formikProps.errors.payAmount}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="truthDate">
            <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.truthDate}`}</Form.Label>
            <Col>
              <Form.Control
                type="date"
                name="truthDate"
                data-qc="truthDate"
                value={this.props.formikProps.values.truthDate}
                onBlur={this.props.formikProps.handleBlur}
                onChange={this.props.formikProps.handleChange}
                isInvalid={Boolean(this.props.formikProps.errors.truthDate) && Boolean(this.props.formikProps.touched.truthDate)}
              >
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {this.props.formikProps.errors.truthDate}
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
                value={this.props.formikProps.values.payerType}
                onChange={this.props.formikProps.handleChange}
                onBlur={this.props.formikProps.handleBlur}
                isInvalid={Boolean(this.props.formikProps.errors.payerType) && Boolean(this.props.formikProps.touched.payerType)}
              >
                <option value={''}></option>
                <option value='beneficiary' data-qc='beneficiary'>{local.customer}</option>
                <option value='employee' data-qc='employee'>{local.employee}</option>
                <option value='family' data-qc='family'>{local.familyMember}</option>
                <option value='nonFamily' data-qc='nonFamily'>{local.nonFamilyMember}</option>
                <option value='insurance' data-qc='insurance'>{local.byInsurance}</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {this.props.formikProps.errors.payerType}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          {this.props.formikProps.values.payerType === 'beneficiary' && this.props.application.product.beneficiaryType === "group" && <Form.Group as={Col} md={6} controlId="customer">
            <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.customer}`}</Form.Label>
            <Col>
              <Form.Control
                as="select"
                name="payerId"
                data-qc="payerId"
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
            </Col>
          </Form.Group>}
          {this.props.formikProps.values.payerType === 'employee' && <Form.Group as={Col} md={6} controlId="whoPaid">
            <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.employee}`}</Form.Label>
            <Col>
              <AsyncSelect
                className={this.props.formikProps.errors.payerId ? "error" : ""}
                name="payerId"
                data-qc="payerId"
                value={this.state.employees.find(employee => employee._id === this.props.formikProps.values.payerId)}
                onBlur={this.props.formikProps.handleBlur}
                onChange={(employee: any) => this.props.formikProps.setFieldValue("payerId", employee._id)}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                loadOptions={this.getUsersByAction}
                cacheOptions defaultOptions
              />
              {this.props.formikProps.touched.payerId && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#d51b1b' }}>
                {this.props.formikProps.errors.payerId}
              </div>}
            </Col>
          </Form.Group>}
          {(this.props.formikProps.values.payerType === 'family' || this.props.formikProps.values.payerType === 'nonFamily') &&
            <>
              <Form.Group as={Col} md={6} controlId="whoPaid">
                <Form.Label style={{ textAlign: "right", paddingRight: 0 }} column>{`${local.name}`}</Form.Label>
                <Col>
                  <Form.Control
                    name="payerName"
                    data-qc="payerName"
                    value={this.props.formikProps.values.payerName.toString()}
                    onBlur={this.props.formikProps.handleBlur}
                    onChange={this.props.formikProps.handleChange}
                    isInvalid={Boolean(this.props.formikProps.errors.payerName) && Boolean(this.props.formikProps.touched.payerName)} />
                  <Form.Control.Feedback type="invalid">
                    {this.props.formikProps.errors.payerName}
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
                    value={this.props.formikProps.values.payerNationalId.toString()}
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
    )
  }
}
const addPaymentToProps = dispatch => {
  return {
    changePaymentState: data => dispatch(payment(data)),
  };
};

export default connect(null, addPaymentToProps)(EarlyPayment);