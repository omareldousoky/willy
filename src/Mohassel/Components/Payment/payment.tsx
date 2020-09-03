import React, { Component } from 'react';
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
import { calculateEarlyPayment, earlyPayment, editManualPayment, manualPayment, payFutureInstallment, payInstallment, otherPayment } from "../../Services/APIs/Payment";
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';
import { calculatePenalties } from '../../Services/APIs/Payment/calculatePenalties';
import { payPenalties } from '../../Services/APIs/Payment/payPenalties';
import { cancelPenalties } from '../../Services/APIs/Payment/cancelPenalties';
import { searchUserByAction } from '../../Services/APIs/UserByAction/searchUserByAction';
import PaymentIcons from './paymentIcons';
import EarlyPayment from './earlyPayment';
import ManualPayment from './manualPayment';
import { randomManualPayment } from '../../Services/APIs/Payment/randomManualPayment';

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
export interface Employee {
  _id: string;
  username: string;
  name: string;
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
  payerType: string;
  payerNationalId: string;
  payerName: string;
  payerId: string;
  employees: Array<Employee>;
  randomType: string;
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
      payerType: '',
      payerNationalId: '',
      payerName: '',
      payerId: '',
      employees: [],
      randomType: 'normal',
    }
       this.mappers = normalTableMappers;
  }
  componentDidMount() {
    if(this.props.paymentType==='penalties' &&  this.state.penalty === -1){
      this.calculatePenalties()
    }
    if(Object.keys(this.props.pendingActions).length) {
      this.setState({
        payAmount:this.props.pendingActions.transactions? this.props.pendingActions.transactions[0].transactionAmount: 0,
        payerType: this.props.pendingActions.payerType? this.props.pendingActions.payerType: '',
        payerNationalId: this.props.pendingActions.payerNationalId? this.props.pendingActions.payerNationalId: '',
        payerName: this.props.pendingActions.payerName? this.props.pendingActions.payerName: '',
        payerId: this.props.pendingActions.payerId && Number(this.props.pendingActions.payerId)? this.props.pendingActions.payerId: '',
        receiptNumber: this.props.pendingActions.receiptNumber? this.props.pendingActions.receiptNumber: '',
        truthDate: this.props.pendingActions.transactions? timeToDateyyymmdd(this.props.pendingActions.transactions[0].truthDate):timeToDateyyymmdd(0),
      })
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
  
  getUsersByAction = async (input: string) => {
    const obj = {
      size: 100,
      from: 0,
      serviceKey:'halan.com/application',
      action:'acceptPayment',
      name: input
    }
    const res = await searchUserByAction(obj);
    if(res.status === 'success') {
      this.setState({ employees: res.body.data, payerType: 'employee' });
      return res.body.data;
    } else { 
      this.setState({ employees: [] });
      return [];
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
  handleSubmit = async (values) => {
    console.log(values);
    this.setState({ loadingFullScreen: true })
    if (this.props.paymentState === 1) {
      if (this.props.paymentType === "normal") {
        if (Number(values.installmentNumber) === -1) {
          const obj = {
            id: this.props.applicationId,
            payAmount: values.payAmount,
            truthDate: new Date(values.truthDate).valueOf(), 
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
          }
          const res = await payInstallment(obj);
          if (res.status === "success") {
            this.props.setReceiptData(res.body);
          this.props.print({print: 'payment'});
          this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
          } else {
            this.setState({ loadingFullScreen: false });
          }
        } else {
          const obj = {
            id: this.props.applicationId,
            payAmount: values.payAmount,
            truthDate: new Date(values.truthDate).valueOf(), 
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
            installmentNumber: Number(values.installmentNumber)
          }
          const res = await payFutureInstallment(obj);
          if (res.status === "success") {
            this.props.setReceiptData(res.body);
            this.props.print({print: 'payment'});
            this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
          } else {
            this.setState({ loadingFullScreen: false });
          }
        }
      } else if(this.props.paymentType === "random") {
        if(this.state.randomType === "manual") {
          const data = {
            payAmount: values.payAmount,
            truthDate: new Date(values.truthDate).valueOf(),
            type: values.randomPaymentType,
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
          }

        } else {
          const data = {
            payAmount: values.payAmount,
            truthDate: new Date(values.truthDate).valueOf(),
            type: values.randomPaymentType,
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
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
      }
      else if(this.props.paymentType === "penalties") {
        if(this.state.penaltyAction==='pay'){
          const data = {
            payAmount: values.payAmount,
            truthDate: new Date(values.truthDate).valueOf(),
            payerType: values.payerType,
            payerId: values.payerId,
            payerName: values.payerName,
            payerNationalId: values.payerNationalId.toString(),
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
      const obj = {
        id: this.props.applicationId,
        payAmount: values.payAmount,
        payerType: values.payerType,
        payerId: values.payerId,
        payerName: values.payerName,
        payerNationalId: values.payerNationalId.toString(),
      }
      const res = await earlyPayment(obj);
      this.setState({ payAmount: res.body.requiredAmount });
      if (res.status === "success") {
        this.props.setReceiptData(res.body);
        this.props.print({print: 'payEarly'});
        this.setState({ loadingFullScreen: false }, () => this.props.refreshPayment());
      } else {
        this.setState({ loadingFullScreen: false });
      }
    } else {
      if (this.props.paymentType === "normal") {
      if (this.props.manualPaymentEditId === "") {
        const obj = {
          id: this.props.applicationId,
          receiptNumber: values.receiptNumber,
          truthDate: new Date(values.truthDate).valueOf(), 
          payAmount: values.payAmount,
          payerType: values.payerType,
          payerId: values.payerId,
          payerName: values.payerName,
          payerNationalId: values.payerNationalId.toString(),
        }
        const res = await manualPayment(obj);
        if (res.status === "success") {
          this.setState({ loadingFullScreen: false });
          Swal.fire("", local.manualPaymentSuccess, "success").then(() => this.props.refreshPayment())
        } else {
          this.setState({ loadingFullScreen: false });
        }
      } else {
        const obj = {
          id: this.props.applicationId,
          payAmount: values.payAmount,
          receiptNumber: values.receiptNumber,
          truthDate: new Date(values.truthDate).valueOf(),
          payerType: values.payerType,
          payerId: values.payerId,
          payerName: values.payerName,
          payerNationalId: values.payerNationalId.toString(),
        }
        const res = await editManualPayment(obj);
        if (res.status === "success") {
          this.setState({ loadingFullScreen: false });
          Swal.fire("", local.editManualPaymentSuccess, "success").then(() => this.props.refreshPayment())
        } else {
          this.setState({ loadingFullScreen: false });
        }
      }
      } else {
        const obj = {
          id: this.props.applicationId,
          receiptNumber: values.receiptNumber,
          truthDate: new Date(values.truthDate).valueOf(),
          payAmount: values.payAmount,
          payerType: values.payerType,
          payerId: values.payerId,
          payerName: values.payerName,
          payerNationalId: values.payerNationalId.toString(),
          type: this.props.paymentType === "random" ? values.randomPaymentType : 'penalty',
        }
        const res = await randomManualPayment(obj);
        if (res.status === "success") {
          this.setState({ loadingFullScreen: false });
          Swal.fire("", local.manualPaymentSuccess, "success").then(() => this.props.refreshPayment())
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
  componentWillUnmount() {
    this.props.changePaymentState(0)
  }
  renderPaymentMethods() {
    switch (this.props.paymentState) {
      case 0: return (
        <PaymentIcons
          paymentType={this.props.paymentType}
          penalty={this.state.penalty}
          application={this.props.application}
          installments={this.props.installments}
          handleClickEarlyPayment={() => this.handleClickEarlyPayment()}
        />
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
                <EarlyPayment
                  loading={this.state.loading}
                  application={this.props.application}
                  formikProps={formikProps}
                  installments={this.props.installments}
                  remainingPrincipal={this.state.remainingPrincipal}
                  earlyPaymentFees={this.state.earlyPaymentFees}
                  requiredAmount={this.state.requiredAmount}
                  setPayerType={(payerType: string) => this.setState({ payerType: payerType })}
                />
              }
            </Formik>
          </div>
        </Card>
      )
      case 3: return (
        <ManualPayment 
          payAmount={this.state.payAmount}
          truthDate={this.state.truthDate}
          paymentType={this.props.paymentType}
          receiptNumber={this.state.receiptNumber}
          setPayerType={(payerType: string) => this.setState({ payerType: payerType })}
          application={this.props.application}
          handleSubmit={this.handleSubmit}
        />
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