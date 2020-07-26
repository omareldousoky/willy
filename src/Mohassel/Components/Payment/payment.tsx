import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import { earlyPaymentValidation, manualPaymentValidation } from './paymentValidation';
import { timeToDateyyymmdd } from '../../Services/utils';
import { PendingActions } from '../../Services/interfaces';
import { payment } from '../../redux/payment/actions';
import { connect } from 'react-redux';
import PayInstallment from "./payInstallment";
import Can from '../../config/Can';
import { calculateEarlyPayment, earlyPayment, editManualPayment, manualPayment, payFutureInstallment, payInstallment, otherPayment } from "../../Services/APIs/Payment";
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';
import { calculatePenalties } from '../../Services/APIs/Payment/calculatePenalties';
import { payPenalties } from '../../Services/APIs/Payment/payPenalties';
import { cancelPenalties } from '../../Services/APIs/Payment/cancelPenalties';
import { getBranches } from '../../Services/APIs/Branch/getBranches';


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
interface PenaltiesActionLogObject {
  action: string;
  id: string;
  reference: PenaltiesActionLogObjectReference;
  trace: PenaltiesActionLogObjectTrace;
  type: string;
}
interface PenaltiesActionLogObjectReference {
  branchId: string;
  customerId: string;
}
interface PenaltiesActionLogObjectTrace{
  at: number;
  by: string;
}
interface Props {
  installments: Array<Installment>;
  currency: string;
  applicationId: string;
  application: any;
  paymentState: number;
  pendingActions: PendingActions;
  changePaymentState: (data) => void;
  setReceiptData: (data) => void;
  print: (data) => void;
  refreshPayment: () => void;
  setEarlyPaymentData: (data) => void;
  manualPaymentEditId: string;
  paymentType: string;
}
interface State {
  receiptData: any;
  payAmount: number;
  receiptNumber: string;
  truthDate: string;
  dueDate: string;
  loading: boolean;
  loadingFullScreen: boolean;
  remainingPrincipal: number;
  earlyPaymentFees: number;
  requiredAmount: number;
  installmentNumber: number;
  penalty: number;
  penaltyAction: string;
  byInsurance: boolean;
  branches: Array<any>;
  // randomPaymentsActionLogs: Array<any>;
  // penaltiesActionLogs: Array<any>;
}

class Payment extends Component<Props, State>{
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    const normalTableMappers = [
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
        render: data => timeToDateyyymmdd(data.dateOfPayment)
      },
      {
        title: local.installmentStatus,
        key: "installmentStatus",
        render: data => this.getStatus(data)
      }
    ];
    this.state = {
      receiptData: {},
      payAmount: 0,
      receiptNumber: '',
      truthDate: timeToDateyyymmdd(0),
      dueDate: timeToDateyyymmdd(0),
      loading: false,
      loadingFullScreen: false,
      remainingPrincipal: 0,
      earlyPaymentFees: 0,
      requiredAmount: 0,
      installmentNumber: -1,
      penalty: -1,
      penaltyAction: '',
      byInsurance: false,
      branches:[],
    }
       this.mappers = normalTableMappers;
  }
  componentDidMount() {
    if(this.props.paymentType==='penalties' || this.props.paymentType==='random') this.getBranches()
    if(this.props.paymentType==='penalties' &&  this.state.penalty === -1){
      this.calculatePenalties()
    }
    if(Object.keys(this.props.pendingActions).length) {
      this.setState({
        payAmount:this.props.pendingActions.transactions? this.props.pendingActions.transactions[0].transactionAmount: 0,
        receiptNumber: this.props.pendingActions.receiptNumber? this.props.pendingActions.receiptNumber: '',
        truthDate: this.props.pendingActions.transactions? timeToDateyyymmdd(this.props.pendingActions.transactions[0].truthDate):timeToDateyyymmdd(0),
      })
    }
  }

  async getBranches(){
    const res = await getBranches()
    if(res.body){
      this.setState({branches:res.body.data.data })
    }
  }

  componentDidUpdate(prevProps, prevState) {
        if (
          prevProps.paymentType !== this.props.paymentType &&
          this.props.paymentType === "penalties" &&
          this.state.penalty === -1
        ) {
          this.calculatePenalties();
        }
  }
  
  
  getStatus(data) {
    const todaysDate = new Date().setHours(0, 0, 0, 0).valueOf();
    switch (data.status) {
      case 'unpaid':
        if (new Date(data.dateOfPayment).setHours(23, 59, 59, 59) < todaysDate)
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
      case 'pending':
        return <div className="status-chip pending">{local.pending}</div>
      default: return null;
    }
  }
  getRequiredAmount() {
    // const todaysDate = new Date("2020-06-30").valueOf();
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
  handleSubmit = async (values) => {
    this.setState({ loadingFullScreen: true })
    if (this.props.paymentState === 1) {
      if (this.props.paymentType === "normal") {
        if (Number(values.installmentNumber) === -1) {
          const res = await payInstallment(
            this.props.applicationId,
            values.payAmount,
            new Date(values.truthDate).valueOf(), 
            values.byInsurance
          );
          if (res.status === "success") {
            this.props.setReceiptData(res.body);
          this.props.print({print: 'payment'});
          this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
          } else {
            this.setState({ loadingFullScreen: false });
          }
        } else {
          const res = await payFutureInstallment(
            this.props.applicationId,
            values.payAmount,
            new Date(values.truthDate).valueOf(),
            Number(values.installmentNumber), 
            values.byInsurance
          );
          if (res.status === "success") {
            this.props.setReceiptData(res.body);
            this.props.print({print: 'payment'});
            this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
          } else {
            this.setState({ loadingFullScreen: false });
          }
        }
      } else if(this.props.paymentType === "random") {
        const data = {
          payAmount: values.payAmount,
          truthDate: new Date(values.truthDate).valueOf(),
          type: values.randomPaymentType
        };
        const res = await otherPayment({ id: this.props.applicationId, data });
        if (res.status === "success") {
          const resBody = res.body;
          resBody[0].type = "randomPayment";
          resBody[0].randomPaymentType = values.randomPaymentType;
          this.props.setReceiptData(resBody);
          this.props.print({print: 'randomPayment'});
          this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
        } else {
          this.setState({ loadingFullScreen: false });
        }
      }
      else if(this.props.paymentType === "penalties") {
        if(this.state.penaltyAction==='pay'){
          const data = {
            payAmount: values.payAmount,
            truthDate: new Date(values.truthDate).valueOf()
          };
          const res = await payPenalties({ id: this.props.applicationId, data });
          if (res.status === "success") {
            const resBody = res.body;
            resBody[0].type = "penalty";
             this.props.setReceiptData(resBody);
             this.props.print({ print: "penalty" });
             this.setState({ loadingFullScreen: false }, () =>
               this.props.refreshPayment()
             );
             this.calculatePenalties();
          } else {
            this.setState({ loadingFullScreen: false });
          }
        }
        else if(this.state.penaltyAction==='cancel'){
          const data = {
            cancelAmount: values.payAmount
          };
          const res = await cancelPenalties({ id: this.props.applicationId, data });
          if (res.status === "success") {
            this.setState({  loadingFullScreen: false });
            Swal.fire("", local.penaltyCancelledSuccessfully, "success")
            this.calculatePenalties()
          } else {
            this.setState({ loadingFullScreen: false });
          }
        }
      }
    } else if (this.props.paymentState === 2) {
      const res = await earlyPayment(
        this.props.applicationId,
        values.payAmount
      );
      this.setState({ payAmount: res.body.requiredAmount });
      if (res.status === "success") {
        this.props.setReceiptData(res.body);
        this.props.print({print: 'payEarly'});
        this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
      } else {
        this.setState({ loadingFullScreen: false });
      }
    } else {
      if (this.props.manualPaymentEditId === "") {
        const res = await manualPayment(
          this.props.applicationId,
          values.payAmount,
          values.receiptNumber,
          new Date(values.truthDate).valueOf(), 
          values.byInsurance
        );
        if (res.status === "success") {
          this.setState({ loadingFullScreen: false });
          Swal.fire("", local.manualPaymentSuccess, "success").then(() => this.props.refreshPayment())
        } else {
          this.setState({ loadingFullScreen: false });
        }
      } else {
        const res = await editManualPayment(
          this.props.applicationId,
          values.payAmount,
          values.receiptNumber,
          new Date(values.truthDate).valueOf(),
          values.byInsurance
        );
        if (res.status === "success") {
          this.setState({ loadingFullScreen: false });
          Swal.fire("", local.editManualPaymentSuccess, "success").then(() => this.props.refreshPayment())
        } else {
          this.setState({ loadingFullScreen: false });
        }
      }
    }
    this.props.changePaymentState(0);
  }
  async handleClickEarlyPayment() {
    this.props.changePaymentState(2)
    this.setState({ loading: true })
    const res = await calculateEarlyPayment(this.props.applicationId);
    if (res.status === 'success') {
      this.props.setEarlyPaymentData({remainingPrincipal: res.body.remainingPrincipal, earlyPaymentFees: res.body.earlyPaymentFees, requiredAmount: res.body.requiredAmount })
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
    const installmentsRemaining: Array<number> = [];
    this.props.installments.forEach(installment => {
      if (installment.status !== 'paid')
        installmentsRemaining.push(installment.id);
    })
    return installmentsRemaining.toString();
  }
  componentWillUnmount() {
    this.props.changePaymentState(0)
  }
  renderPaymentMethods() {
    switch (this.props.paymentState) {
      case 0: return (
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
                      <h6>{this.state.penalty}</h6>
                    </div>
                  ) : null}
                  <div className="verticalLine"></div>
                  <div className="payment-icons-container">
                    <Can I="payInstallment" a="application">
                      <div className="payment-icon">
                        <img
                          alt={
                            this.props.paymentType === "penalties"
                              ? "pay-penalty"
                              : "pay-installment"
                          }
                          src={require("../../Assets/payInstallment.svg")}
                        />
                        <Button
                          disabled={this.props.application.status === "pending"}
                          onClick={() => {
                            if (this.props.paymentType === "penalties") {
                              this.setState({ penaltyAction: "pay" });
                              this.props.changePaymentState(1);
                            } else this.props.changePaymentState(1);
                          }}
                          variant="primary"
                        >
                          {this.props.paymentType === "penalties"
                            ? local.payPenalty
                            : local.payInstallment}
                        </Button>
                      </div>
                    </Can>
                  { this.props.paymentType === "penalties"? <Can I="rollback" a="application">
                      <div className="payment-icon">
                        <img
                          alt="cancel-penalty"
                          src={require("../../Assets/payInstallment.svg")}
                        />
                        <Button
                          disabled={this.props.application.status === "pending"}
                          onClick={() => {
                              this.setState({ penaltyAction: "cancel" });
                              this.props.changePaymentState(1);
                          }}
                          variant="primary"
                        >
                          {local.cancelPenalty}
                        </Button>
                      </div>
                    </Can>:null}
                    {this.props.paymentType === "normal" ? (
                      <Can I="payEarly" a="application">
                        <div className="payment-icon">
                          <img
                            alt="early-payment"
                            src={require("../../Assets/earlyPayment.svg")}
                          />
                          <Button
                            disabled={
                              this.props.application.status === "pending"
                            }
                            onClick={() => this.handleClickEarlyPayment()}
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
                          <img
                            alt="pay-installment"
                            src={require("../../Assets/payInstallment.svg")}
                          />
                          <Button
                            disabled={
                              this.props.application.status === "pending"
                            }
                            onClick={() => this.props.changePaymentState(3)}
                            variant="primary"
                          >
                            {local.manualPayment}
                          </Button>
                        </div>
                      </Can>
                    ) : null}
                  </div>
                </Card>
              );
      case 1:
        return <PayInstallment
        installments={this.props.installments}
        application={this.props.application}
        handleSubmit={this.handleSubmit}
        payAmount={this.state.payAmount}
        truthDate={this.state.truthDate}
        paymentType={this.props.paymentType}
        penaltyAction={this.state.penaltyAction}
        byInsurance={this.state.byInsurance}
        />
      case 2: return (
        <Card className="payment-menu">
          <Loader type="fullsection" open={this.state.loading} />
          <div className="payment-info" style={{ textAlign: 'center' }}>
            <img alt="early-payment" src={require('../../Assets/earlyPayment.svg')} />
            <h6 style={{ cursor: 'pointer' }} onClick={() => this.props.changePaymentState(0)}> <span className="fa fa-long-arrow-alt-right"> {local.earlyPayment}</span></h6>
          </div>
          <div className="verticalLine"></div>
          <div style={{ width: '100%', padding: 20 }}>
            <span style={{ cursor: 'pointer', float: 'left', background: '#E5E5E5', padding: 10, borderRadius: 15 }}
              onClick={() => this.props.print({ print: 'earlyPayment', remainingPrincipal: this.state.remainingPrincipal, earlyPaymentFees: this.state.earlyPaymentFees, requiredAmount: this.state.requiredAmount, })}>
              <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>
            <Formik
              enableReinitialize
              initialValues={{ ...this.state, max: this.props.application.installmentsObject.totalInstallments.installmentSum }}
              onSubmit={this.handleSubmit}
              validationSchema={earlyPaymentValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <Form.Group as={Row} style={{marginTop: 45}}>
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
                          value={this.state.remainingPrincipal}
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
                    <Button variant="outline-primary" data-qc="cancel" onClick={() => this.props.changePaymentState(0)}>{local.cancel}</Button>
                    <Button variant="primary" data-qc="submit" type="submit">{local.submit}</Button>
                  </div>
                </Form>
              }
            </Formik>
          </div>
        </Card>
      )
      case 3: return (
        <Card className="payment-menu">
          <div className="payment-info" style={{ textAlign: 'center' }}>
            <img alt="early-payment" src={require('../../Assets/payInstallment.svg')} />
            <h6 style={{ cursor: 'pointer' }} onClick={() => this.props.changePaymentState(0)}> <span className="fa fa-long-arrow-alt-right"> {local.manualPayment}</span></h6>
          </div>
          <div className="verticalLine"></div>
          <div style={{ width: '100%', padding: 20 }}>
            <Formik
              enableReinitialize
              initialValues={{ ...this.state, max: this.props.application.installmentsObject.totalInstallments.installmentSum }}
              onSubmit={this.handleSubmit}
              validationSchema={manualPaymentValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
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
                    <Form.Group as={Col} controlId="receiptNumber">
                      <Form.Label style={{ textAlign: 'right', paddingRight: 0 }} column>{`${local.receiptNumber}`}</Form.Label>
                      <Col>
                        <Form.Control
                          name="receiptNumber"
                          data-qc="receiptNumber"
                          value={formikProps.values.receiptNumber}
                          onBlur={formikProps.handleBlur}
                          onChange={(e) => {
                            const re = /^\d*$/;
                            if (e.currentTarget.value === '' || re.test(e.currentTarget.value)) {
                              formikProps.setFieldValue('receiptNumber', e.currentTarget.value)
                            }
                          }}
                          isInvalid={Boolean(formikProps.errors.receiptNumber) && Boolean(formikProps.touched.receiptNumber)}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.receiptNumber}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Form.Group>
                  <div style={{ display: 'flex' }}>
                    <Form.Label style={{ textAlign: 'right', paddingRight: 0 }}>{`${local.byInsurance}`}</Form.Label>
                    <Form.Check
                      name="byInsurance"
                      id="byInsurance"
                      data-qc="byInsurance"
                      type='checkbox'
                      checked={formikProps.values.byInsurance}
                      onChange={formikProps.handleChange}
                    />
                  </div>
                  <div className="payments-buttons-container">
                    <Button variant="outline-primary" data-qc="cancel" onClick={() => this.props.changePaymentState(0)}>{local.cancel}</Button>
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
  async calculatePenalties() {
    this.setState({ loadingFullScreen: true });
    const res = await calculatePenalties({
      id: this.props.applicationId,
      truthDate: new Date().getTime()
    });
    if (res.body) {
      this.setState({ penalty: res.body.penalty, loadingFullScreen: false });
    } else this.setState({ loadingFullScreen: false });
  }
  getValueFromLocalizationFileByKey = (key)=>{
    if(key==='collectionCommission') return local.collectionCommission
    else if(key==="payReissuingFees") return local.reissuingFees
    else if(key==="payLegalFees") return local.legalFees
    else if(key==="payClearanceFees") return local.clearanceFees
    else if(key==='payToktokStamp') return local.toktokStamp
    else if(key==='payTricycleStamp') return local.tricycleStamp
    else if(key==='payPenalties') return local.payPenalty
    else if(key==='cancelPenalties') return local.cancelPenalty
    else if(key==="payRandomPayment") return local.financialTransactions
 }
  render() {
    return (
      <>
        <Loader type={"fullscreen"} open={this.state.loadingFullScreen} />
        {this.props.paymentType === "normal" ? (
          <DynamicTable
            totalCount={0}
            pagination={false}
            data={this.props.installments.sort((a, b) => {
              return a.id - b.id;
            })}
            mappers={this.mappers}
          />
        ) : null}
        {this.renderPaymentMethods()}
      </>
    );
  }
}
const addPaymentToProps = dispatch => {
  return {
    changePaymentState: data => dispatch(payment(data)),
  };
};
const mapStateToProps = state => {
  return {
    paymentState: state.payment,
  };
};
export default connect(mapStateToProps, addPaymentToProps)(Payment);