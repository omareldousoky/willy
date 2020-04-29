import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import DynamicTable from '../DynamicTable/dynamicTable';
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
  dateOfPayment: number;
  status: string;
}
interface Props {
  installments: Array<Installment>;
  currency: string;
  applicationId: string;
}
interface State {
  showModal: boolean;
  payAmount: number;
  modalType: number;
  loading: boolean;
  loadingFullScreen: boolean;
  remainingPrincipal: number;
  earlyPaymentFees: number;
  requiredAmount: number;
}

class Payment extends Component<Props, State>{
  mappers: { title: string; key: string; render: (data: any) => any; }[];
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      payAmount: 0,
      modalType: 0,
      loading: false,
      loadingFullScreen: false,
      remainingPrincipal: 0,
      earlyPaymentFees: 0,
      requiredAmount: 0,
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
        title: local.dateOfPayment,
        key: "dateOfPayment",
        render: data => new Date(data.dateOfPayment).toISOString().slice(0, 10)
      },
      {
        title: local.loanStatus,
        key: "loanStatus",
        render: data => data.status
      },
    ]
  }
  getRequiredAmount() {
    const todaysDate = new Date("2020-06-30").valueOf();
    // const todaysDate = new Date().valueOf();
    let total = 0;
    this.props.installments.forEach(installment => {
      if (todaysDate >= installment.dateOfPayment) {
        if (installment.status !== "paid")
          total = total + installment.installmentResponse;
      } else return total;
    })
    return total;
  }
  handleSubmit = async (values) => {
    this.setState({ showModal: false, loadingFullScreen: true })
    if (this.state.modalType === 1) {
      const res = await payInstallment(this.props.applicationId, this.state.payAmount);
      if (res.status === 'success') {
        this.setState({ loadingFullScreen: false });
        Swal.fire("", "payment done", "success")
      } else {
        this.setState({ loadingFullScreen: false });
      }
    } else {
      const res = await earlyPayment(this.props.applicationId);
      if (res.status === 'success') {
        this.setState({ loadingFullScreen: false });
        Swal.fire("", "early payment done", "success")
      } else {
        this.setState({ loadingFullScreen: false });
      }
    }
  }
  async handleClickEarlyPayment() {
    this.setState({ showModal: true, modalType: 2, loading: true })
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
      <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} >
        {
          this.state.modalType === 1 ?
            <Formik
              initialValues={{ payAmount: '' }}
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
                    <Form.Control
                      type="number"
                      name="payAmount"
                      data-qc="payAmount"
                      value={formikProps.values.payAmount}
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      isInvalid={Boolean(formikProps.errors.payAmount) && Boolean(formikProps.touched.payAmount)}
                    >
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.payAmount}
                    </Form.Control.Feedback>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" data-qc="cancel" onClick={() => this.setState({ showModal: false })}>{local.cancel}</Button>
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
                <Button variant="secondary" data-qc="cancel" onClick={() => this.setState({ showModal: false })}>{local.cancel}</Button>
                <Button variant="primary" data-qc="submit" onClick={this.handleSubmit}>{local.submit}</Button>
              </Modal.Footer>
            </>
        }
      </Modal >
    )
  }
  render() {
    return (
      <>
        <Loader type={"fullscreen"} open={this.state.loadingFullScreen} />
        <DynamicTable pagination={false} data={this.props.installments} mappers={this.mappers} changeNumber={() => console.log("")} />
        <div className="payment-amount-container">
          <h5>{local.requiredAmount}</h5>
          <h2>{this.getRequiredAmount()}{(this.props.currency).toUpperCase()}</h2>
        </div>
        <div className="payment-buttons">
          <Button variant="outline-primary" onClick={() => this.handleClickEarlyPayment()}>{local.earlyPayment}</Button>
          <Button variant="outline-primary" onClick={() => this.setState({ showModal: true, modalType: 1 })}>{local.payInstallment}</Button>
        </div>
        {this.state.showModal && this.renderModal()}
      </>
    );
  }
}

export default Payment;