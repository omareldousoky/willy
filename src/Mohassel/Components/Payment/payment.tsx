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
  paymentModal: boolean;
  receiptModal: boolean;
  receiptData: any;
  payAmount: number;
  truthDate: string;
  modalType: number;
  loading: boolean;
  loadingFullScreen: boolean;
  remainingPrincipal: number;
  earlyPaymentFees: number;
  requiredAmount: number;
  paymentState: number;
}

class Payment extends Component<Props, State>{
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentModal: false,
      receiptModal: false,
      receiptData: {},
      payAmount: 0,
      truthDate: new Date().toISOString().slice(0, 10),
      modalType: 0,
      loading: false,
      loadingFullScreen: false,
      remainingPrincipal: 0,
      earlyPaymentFees: 0,
      requiredAmount: 0,
      paymentState: 1,
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
    this.setState({ paymentModal: false, loadingFullScreen: true })
    if (this.state.modalType === 1) {
      const res = await payInstallment(this.props.applicationId, values.payAmount, new Date(values.truthDate).valueOf());
      if (res.status === 'success') {
        this.setState({ loadingFullScreen: false, receiptModal: true, receiptData: res.body, payAmount: values.payAmount });
        // Swal.fire("", "payment done", "success")
      } else {
        this.setState({ loadingFullScreen: false });
      }
    } else {
      const res = await earlyPayment(this.props.applicationId, this.state.requiredAmount);
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
    this.setState({ paymentModal: true, modalType: 2, loading: true })
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
  renderModal() {
    return (
      <Modal show={this.state.paymentModal} onHide={() => this.setState({ paymentModal: false })} >
        {
          this.state.modalType === 1 ?
            <Formik
              enableReinitialize
              initialValues={{ ...this.state, requiredAmount: this.getRequiredAmount() }}
              onSubmit={this.handleSubmit}
              validationSchema={paymentValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title>{local.enterPayment}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group as={Row} controlId="payAmount">
                      <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.amount}`}</Form.Label>
                      <Col sm={6}>
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
                    <Form.Group as={Row} controlId="truthDate">
                      <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.truthDate}`}</Form.Label>
                      <Col sm={6}>
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
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" data-qc="cancel" onClick={() => this.setState({ paymentModal: false })}>{local.cancel}</Button>
                    <Button type="submit" variant="primary" data-qc="submit">{local.submit}</Button>
                  </Modal.Footer>
                </Form>
              }
            </Formik>
            :
            <>
              <Modal.Header>
                <Modal.Title>{local.earlyPayment}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Loader type={"fullsection"} open={this.state.loading} />
                <Form.Group as={Row} controlId="remainingPrincipal">
                  <Form.Label style={{ textAlign: 'right' }} column sm={6}>{`${local.remainingPrincipal}`}</Form.Label>
                  <Col sm={3}>
                    <Form.Label>{this.state.remainingPrincipal}</Form.Label>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="earlyPaymentFees">
                  <Form.Label style={{ textAlign: 'right' }} column sm={6}>{`${local.earlyPaymentFees}`}</Form.Label>
                  <Col sm={3}>
                    <Form.Label>{this.state.earlyPaymentFees}</Form.Label>
                  </Col>
                </Form.Group>
                <hr />
                <Form.Group as={Row} controlId="requiredAmount">
                  <Form.Label style={{ textAlign: 'right' }} column sm={6}>{`${local.requiredAmount}`}</Form.Label>
                  <Col sm={3}>
                    <Form.Label style={{ fontSize: 30 }}>{this.state.requiredAmount}</Form.Label>
                  </Col>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" data-qc="cancel" onClick={() => this.setState({ paymentModal: false })}>{local.cancel}</Button>
                <Button variant="primary" data-qc="submit" onClick={this.handleSubmit}>{local.submit}</Button>
              </Modal.Footer>
            </>
        }
      </Modal >
    )
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
              <Button onClick={() => this.setState({ paymentState: 2 })} variant="primary">{local.earlyPayment}</Button>
            </div>
          </div>
        </Card>
      )
      case 1: return (
        <Card className="payment-menu">
          <div className="payment-info" style={{ textAlign: 'center' }}>
            <img alt="early-payment" src={require('../../Assets/payInstallment.svg')} />
            <h6 style={{ cursor: 'pointer' }} onClick={() => this.setState({ paymentState: 0 })}> <span className="fa fa-long-arrow-alt-right"> {local.payInstallment}</span></h6>
          </div>
          <div className="verticalLine"></div>
          <div style={{width: '100%', padding: 20}}>
            <Formik
              enableReinitialize
              initialValues={{ ...this.state, requiredAmount: this.getRequiredAmount() }}
              onSubmit={this.handleSubmit}
              validationSchema={paymentValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <Form.Group as={Row}>
                    <Form.Group as={Col} controlId="payAmount">
                      <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.installmentsToBePaid}`}</Form.Label>
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
                    <Form.Group as={Col} controlId="payAmount">
                      <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.requiredAmount}`}</Form.Label>
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
                    <Form.Group as={Col} controlId="payAmount">
                      <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.truthDate}`}</Form.Label>
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
                  </Form.Group>
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
        {/* <div className="payment-amount-container">
          <h5>{local.requiredAmount}</h5>
          <h2>{this.getRequiredAmount()}{(this.props.currency).toUpperCase()}</h2>
        </div>
        <div className="payment-buttons-container">
          <Button variant="outline-primary" onClick={() => this.handleClickEarlyPayment()}>{local.earlyPayment}</Button>
          <Button variant="outline-primary" onClick={() => this.setState({ paymentModal: true, modalType: 1 })}>{local.payInstallment}</Button>
        </div> */}
        {this.renderPaymentMethods()}
        {this.state.paymentModal && this.renderModal()}
        {this.state.receiptModal && <PaymentReceipt receiptData={this.state.receiptData} closeModal={() => window.location.reload()} payAmount={this.state.payAmount} truthDate={this.state.truthDate} />}
      </>
    );
  }
}

export default Payment;