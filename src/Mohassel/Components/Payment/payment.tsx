import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
// import Swal from 'sweetalert2';
import { Formik } from 'formik';
import DynamicTable from '../DynamicTable/dynamicTable';
import PaymentReceipt from './paymentReceipt';
import { Loader } from '../../../Shared/Components/Loader';
import { paymentValidation } from './paymentValidation';
import { calculateEarlyPayment } from '../../Services/APIs/Payment/calculateEarlyPayment';
import { earlyPayment } from '../../Services/APIs/Payment/earlyPayment';
import { payFutureInstallment } from '../../Services/APIs/Payment/payFutureInstallment';
import { payInstallment } from '../../Services/APIs/Payment/payInstallment';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';

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
interface Props {
  installments: Array<Installment>;
  currency: string;
  applicationId: string;
}
interface State {
  receiptModal: boolean;
  receiptData: any;
  payAmount: number;
  truthDate: string;
  loading: boolean;
  loadingFullScreen: boolean;
  remainingPrincipal: number;
  earlyPaymentFees: number;
  requiredAmount: number;
  paymentState: number;
  installmentNumber: number;
}

class Payment extends Component<Props, State>{
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      receiptModal: false,
      receiptData: {},
      payAmount: 0,
      truthDate: new Date().toISOString().slice(0, 10),
      loading: false,
      loadingFullScreen: false,
      remainingPrincipal: 0,
      earlyPaymentFees: 0,
      requiredAmount: 0,
      paymentState: 0,
      installmentNumber: -1
    }
    this.mappers = [
      {
        title: local.installmentNumber,
        key: "id",
        render: data => data.id
      },
      {
        title: local.principalInstallment,
        key: "principalInstallment",
        render: data => data.principalInstallment
      },
      {
        title: local.feesInstallment,
        key: "feesInstallment",
        render: data => data.feesInstallment
      },
      {
        title: local.installmentResponse,
        key: "installmentResponse",
        render: data => data.installmentResponse
      },
      {
        title: local.feesPaid,
        key: "feesPaid",
        render: data => data.feesPaid
      },
      {
        title: local.principalPaid,
        key: "principalPaid",
        render: data => data.principalPaid
      },
      {
        title: local.totalPaid,
        key: "totalPaid",
        render: data => data.totalPaid
      },
      {
        title: local.dateOfPayment,
        key: "dateOfPayment",
        render: data => new Date(data.dateOfPayment).toISOString().slice(0, 10)
      },
      {
        title: local.installmentStatus,
        key: "installmentStatus",
        render: data => this.getStatus(data)
      },
    ]
  }
  getStatus(data) {
    // const todaysDate = new Date("2020-06-30").valueOf();
    const todaysDate = new Date().valueOf();
    switch (data.status) {
      case 'unpaid':
        if (data.dateOfPayment < todaysDate)
          return <div className="status-chip late">{local.late}</div>
        else
          return <div className="status-chip unpaid">{local.unpaid}</div>
      case 'rescheduled':
        return <div className="status-chip rescheduled">{local.rescheduled}</div>
      case 'partiallyPaid':
        return <div className="status-chip partially-paid">{local.partiallyPaid}</div>
      case 'cancelled':
        return <div className="status-chip cancelled">{local.cancelled}</div>
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      default: return null;
    }
  }
  getRequiredAmount() {
    // const todaysDate = new Date("2020-06-30").valueOf();
    const todaysDate = new Date().valueOf();
    let total = 0;
    this.props.installments.forEach(installment => {
      if (todaysDate >= installment.dateOfPayment) {
        if (installment.status !== "paid")
          total = total + installment.installmentResponse - installment.totalPaid;
      } else return total;
    })
    return total;
  }
  handleSubmit = async (values) => {
    this.setState({ loadingFullScreen: true })
    if (this.state.paymentState === 1) {
      if (Number(values.installmentNumber) === -1) {
        const res = await payInstallment(this.props.applicationId, values.payAmount, new Date(values.truthDate).valueOf());
        if (res.status === 'success') {
          this.setState({ loadingFullScreen: false, receiptModal: true, receiptData: res.body, payAmount: values.payAmount });
          // Swal.fire("", "payment done", "success")
        } else {
          this.setState({ loadingFullScreen: false });
        }
      } else {
        const res = await payFutureInstallment(this.props.applicationId, values.payAmount, new Date(values.truthDate).valueOf(), Number(values.installmentNumber));
        if (res.status === 'success') {
          this.setState({ loadingFullScreen: false, receiptModal: true, receiptData: res.body, payAmount: values.payAmount });
          // Swal.fire("", "payment done", "success")
        } else {
          this.setState({ loadingFullScreen: false });
        }
      }
    } else {
      const res = await earlyPayment(this.props.applicationId, values.payAmount);
      this.setState({ payAmount: res.body.requiredAmount })
      if (res.status === 'success') {
        this.setState({ loadingFullScreen: false, receiptModal: true, receiptData: res.body, payAmount: values.payAmount });
        // Swal.fire("", "early payment done", "success")
      } else {
        this.setState({ loadingFullScreen: false });
      }
    }
  }
  async handleClickEarlyPayment() {
    this.setState({ paymentState: 2, loading: true })
    const res = await calculateEarlyPayment(this.props.applicationId);
    if (res.status === 'success') {
      this.setState({
        loading: false,
        remainingPrincipal: res.body.remainingPrincipal,
        earlyPaymentFees: res.body.earlyPaymentFees,
        requiredAmount: res.body.requiredAmount,
      });
    } else {
      this.setState({ loading: false });
    }
  }
  getInstallmentsRemaining() {
    const installmentsRemaining: Array<Number> = [];
    this.props.installments.forEach(installment => {
      if(installment.status !== 'paid')
        installmentsRemaining.push(installment.id);
    })
    return installmentsRemaining.toString();
  }
  renderPaymentMethods() {
    switch (this.state.paymentState) {
      case 0: return (
        <Card className="payment-menu">
          <div className="payment-info">
            <h6 >{local.requiredAmount}</h6>
            <h6>{this.getRequiredAmount()}</h6>
            <h6>{local.forInstallments}</h6>
            <h6>{this.getRequiredAmount()}</h6>
            <h6>{local.dateOfPayment}</h6>
            <h6>{this.getRequiredAmount()}</h6>
          </div>
          <div className="verticalLine"></div>
          <div className="payment-icons-container">
            <div className="payment-icon">
              <img alt="pay-installment" src={require('../../Assets/payInstallment.svg')} />
              <Button onClick={() => this.setState({ paymentState: 1 })} variant="primary">{local.payInstallment}</Button>
            </div>
            <div className="payment-icon">
              <img alt="early-payment" src={require('../../Assets/earlyPayment.svg')} />
              <Button onClick={() => this.handleClickEarlyPayment()} variant="primary">{local.earlyPayment}</Button>
            </div>
          </div>
        </Card>
      )
      case 1:
        return (
          <Card className="payment-menu">
            <div className="payment-info" style={{ textAlign: 'center' }}>
              <img alt="early-payment" src={require('../../Assets/payInstallment.svg')} />
              <h6 style={{ cursor: 'pointer' }} onClick={() => this.setState({ paymentState: 0 })}> <span className="fa fa-long-arrow-alt-right"> {local.payInstallment}</span></h6>
            </div>
            <div className="verticalLine"></div>
            <div style={{ width: '100%', padding: 20 }}>
              <Formik
                enableReinitialize
                initialValues={{ ...this.state }}
                onSubmit={this.handleSubmit}
                validationSchema={paymentValidation}
                validateOnBlur
                validateOnChange
              >
                {(formikProps) =>
                  <Form onSubmit={formikProps.handleSubmit}>
                    <Form.Group as={Row}>
                      <Form.Group as={Col} controlId="installmentNumber">
                        <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.installmentToBePaid}`}</Form.Label>
                        <Col>
                          <Form.Control as="select"
                            name="installmentNumber"
                            data-qc="installmentNumber"
                            onChange={formikProps.handleChange}
                          >
                            <option value={-1}></option>
                            {this.props.installments.map(installment => {
                              if (installment.status !== "partiallyPaid" && installment.status !== "paid")
                                return (<option key={installment.id} value={installment.id}>{installment.id}</option>)
                            })}
                          </Form.Control>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Col} controlId="requiredAmount">
                        <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.requiredAmount}`}</Form.Label>
                        <Col>
                          <Form.Control
                            type="number"
                            name="requiredAmount"
                            value={this.getRequiredAmount()}
                            disabled
                          >
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Group as={Col} controlId="payAmount">
                        <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.amountCollectedFromCustomer}`}</Form.Label>
                        <Col>
                          <Form.Control
                            type="number"
                            name="payAmount"
                            data-qc="payAmount"
                            value={formikProps.values.payAmount.toString()}
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
                    </Form.Group>
                    <div className="payments-buttons-container">
                      <Button variant="outline-primary" data-qc="cancel" onClick={() => this.setState({ paymentState: 0 })}>{local.cancel}</Button>
                      <Button variant="primary" data-qc="submit" type="submit">{local.submit}</Button>
                    </div>
                  </Form>
                }
              </Formik>
            </div>
          </Card>
        )
      case 2: return (
        <Card className="payment-menu">
          <Loader type="fullsection" open={this.state.loading} />
          <div className="payment-info" style={{ textAlign: 'center' }}>
            <img alt="early-payment" src={require('../../Assets/earlyPayment.svg')} />
            <h6 style={{ cursor: 'pointer' }} onClick={() => this.setState({ paymentState: 0 })}> <span className="fa fa-long-arrow-alt-right"> {local.earlyPayment}</span></h6>
          </div>
          <div className="verticalLine"></div>
          <div style={{ width: '100%', padding: 20 }}>
            <Formik
              enableReinitialize
              initialValues={{ ...this.state }}
              onSubmit={this.handleSubmit}
              validationSchema={paymentValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <Form.Group as={Row}>
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
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Group as={Col} controlId="earlyPaymentFees">
                      <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.earlyPaymentFees}`}</Form.Label>
                      <Col>
                        <Form.Control
                          name="earlyPaymentFees"
                          value={this.state.earlyPaymentFees}
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
                          value={this.state.requiredAmount}
                          disabled
                        >
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Group as={Col} controlId="payAmount">
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
                  </Form.Group>
                  <div className="payments-buttons-container">
                    <Button variant="outline-primary" data-qc="cancel" onClick={() => this.setState({ paymentState: 0 })}>{local.cancel}</Button>
                    <Button variant="primary" data-qc="submit" type="submit">{local.submit}</Button>
                  </div>
                </Form>
              }
            </Formik>
          </div>
        </Card>
      )
      default: return null;
    }
  }
  render() {
    return (
      <>
        <Loader type={"fullscreen"} open={this.state.loadingFullScreen} />
        <DynamicTable totalCount={0} pagination={false} data={this.props.installments} mappers={this.mappers} />
        {this.renderPaymentMethods()}
        {this.state.receiptModal && <PaymentReceipt receiptData={this.state.receiptData} closeModal={() => window.location.reload()} payAmount={this.state.payAmount} truthDate={this.state.truthDate} />}
      </>
    );
  }
}

export default Payment;