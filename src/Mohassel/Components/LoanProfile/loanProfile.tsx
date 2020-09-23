import React, { Component } from 'react';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import { getPendingActions } from '../../Services/APIs/Loan/getPendingActions';
import { approveManualPayment } from '../../Services/APIs/Loan/approveManualPayment';
import { getBranch } from '../../Services/APIs/Branch/getBranch';
import InfoBox from '../userInfoBox';
import Payment from '../Payment/payment';
import { englishToArabic } from '../../Services/statusLanguage';
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import Logs from './applicationLogs';
import Card from 'react-bootstrap/Card';
import { LoanDetailsTableView } from './applicationsDetails';
import { GuarantorTableView } from './guarantorDetails'
import { CustomerCardView } from './customerCard';
import Rescheduling from '../Rescheduling/rescheduling';
import ability from '../../config/ability';
import CustomerCardPDF from '../pdfTemplates/customerCard/customerCard';
import CashReceiptPDF from '../pdfTemplates/cashReceipt/cashReceipt';
import CustomerCardAttachments from '../pdfTemplates/customerCardAttachments/customerCardAttachments';
import TotalWrittenChecksPDF from '../pdfTemplates/totalWrittenChecks/totalWrittenChecks';
import FollowUpStatementPDF from '../pdfTemplates/followUpStatment/followUpStatement';
import LoanContract from '../pdfTemplates/loanContract/loanContract';
import LoanContractForGroup from '../pdfTemplates/loanContractForGroup/loanContractForGroup';
import EarlyPaymentReceipt from '../pdfTemplates/earlyPaymentReceipt/earlyPaymentReceipt';
import { withRouter } from 'react-router-dom';
import GroupInfoBox from './groupInfoBox';
import Can from '../../config/Can';
import EarlyPaymentPDF from '../pdfTemplates/earlyPayment/earlyPayment';
import { PendingActions } from '../../Services/interfaces';
import { timeToDateyyymmdd, iscoreDate } from '../../Services/utils';
import { payment } from '../../redux/payment/actions';
import { connect } from 'react-redux';
import { cancelApplication } from '../../Services/APIs/loanApplication/stateHandler';
import { rejectManualPayment } from '../../Services/APIs/Loan/rejectManualPayment';
import store from '../../redux/store';
import UploadDocuments from './uploadDocuments';
import { getIscore, getIscoreCached } from '../../Services/APIs/iScore/iScore';
import { writeOffLoan } from '../../Services/APIs/Loan/writeOffLoan';
import { doubtLoan } from '../../Services/APIs/Loan/doubtLoan';
import PaymentReceipt from '../pdfTemplates/paymentReceipt/paymentReceipt';
import RandomPaymentReceipt from '../pdfTemplates/randomPaymentReceipt/randomPaymentReceipt';
import { calculatePenalties } from '../../Services/APIs/Payment/calculatePenalties';
import ManualRandomPaymentsActions from './manualRandomPaymentsActions';
import { getManualOtherPayments } from '../../Services/APIs/Payment/getManualOtherPayments';
import { rejectManualOtherPayment } from '../../Services/APIs/Payment/rejectManualOtherPayment';
import { approveManualOtherPayment } from '../../Services/APIs/Payment/approveManualOtherPayment';
import { numTo2Decimal } from '../CIB/textFiles';

interface EarlyPayment {
    remainingPrincipal?: number;
    requiredAmount?: number;
    earlyPaymentFees?: number;
}
interface State {
    prevId: string;
    application: any;
    activeTab: string;
    tabsArray: Array<Tab>;
    loading: boolean;
    print: string;
    earlyPaymentData: EarlyPayment;
    pendingActions: PendingActions;
    manualPaymentEditId: string;
    branchDetails: any;
    receiptData: any;
    iscores: any;
    penalty: number;
    randomPendingActions: Array<any>;
}

interface Props {
    history: any;
    location: any;
    changePaymentState: (data) => void;
}

class LoanProfile extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            prevId: '',
            application: {},
            activeTab: 'loanDetails',
            tabsArray: [],
            loading: false,
            print: '',
            earlyPaymentData: {},
            pendingActions: {},
            manualPaymentEditId: '',
            branchDetails: {},
            receiptData: {},
            iscores: [],
            penalty:  0,
            randomPendingActions: []
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getManualOtherPayments(appId) {
        this.setState({loading: true})
        const res = await getManualOtherPayments(appId);
        if(res.status === "success"){
            this.setState({
                randomPendingActions: res.body.pendingActions? res.body.pendingActions: [],
                loading: false
            })
        } else {
            this.setState({loading: false})
        }
    }
    
    async getAppByID(id) {
        this.setState({ loading: true, activeTab: 'loanDetails', manualPaymentEditId: '' });
        const application = await getApplication(id);
        this.getBranchData(application.body.branchId);
        if(application.body.status === 'paid' || application.body.status === "pending" || application.body.status === "issued") this.getManualOtherPayments(id);
        if (application.status === "success") {
            if (store.getState().auth.clientPermissions === {}) {
                store.subscribe(() => {
                    this.setTabsToRender(application)
                })
            } else this.setTabsToRender(application)
            if (ability.can('viewIscore', 'customer')) this.getCachediScores(application.body)
        } else {
            Swal.fire('', 'fetch error', 'error')
            this.setState({ loading: false })
        }
    }
    async getCachediScores(application) {
        const ids: string[] = []
        if (application.product.beneficiaryType === 'group') {
            application.group.individualsInGroup.forEach(member => ids.push(member.customer.nationalId))
        } else {
            if (application.guarantors.length > 0) {
                application.guarantors.forEach(guar => ids.push(guar.nationalId))
            }
            ids.push(application.customer.nationalId)
        }
        const obj: { nationalIds: string[]; date?: Date } = {
            nationalIds: ids
        }
        if (["approved", "created", "issued", "rejected", "paid", "pending", "canceled"].includes(this.state.application.status)) {
            obj.date = (this.state.application.status === 'approved') ? this.state.application.approvalDate :
                (this.state.application.status === 'created') ? this.state.application.creationDate :
                    (['issued', 'pending'].includes(this.state.application.status)) ? this.state.application.issueDate :
                        (this.state.application.status === 'rejected') ? this.state.application.rejectionDate :
                            (['paid', 'canceled'].includes(this.state.application.status)) ? this.state.application.updated.at : 0
            // paid & canceled => updated.at, pending,issued =>issuedDate
        }
        this.setState({ loading: true });
        const iScores = await getIscoreCached(obj);
        if (iScores.status === "success") {
            this.setState({ iscores: iScores.body.data, loading: false })
        } else {
            Swal.fire('', 'fetch error', 'error')
            this.setState({ loading: false })
        }
    }
    setTabsToRender(application) {
        const tabsToRender = [
            {
                header: local.loanInfo,
                stringKey: 'loanDetails'
            },
            {
                header: local.documents,
                stringKey: 'documents'
            }
        ]
        const guarantorsTab = {
            header: local.guarantorInfo,
            stringKey: 'loanGuarantors'
        };
        const customerCardTab = {
            header: local.customerCard,
            stringKey: 'customerCard'
        };
        const paymentTab = {
            header: local.payments,
            stringKey: 'loanPayments',
            permission: ['payInstallment', 'payEarly'],
            permissionKey: 'application'
        };
        const reschedulingTab = {
            header: local.rescheduling,
            stringKey: 'loanRescheduling',
            permission: ['pushInstallment', 'traditionRescheduling', 'freeRescheduling'],
            permissionKey: 'application'
        };
        const financialTransactionsTab = {
            header: local.financialTransactions,
            stringKey: 'financialTransactions',
            permission: 'payInstallment',
            permissionKey: 'application'
        };
        const penaltiesTab = {
            header: local.penalties,
            stringKey: 'penalties',
            permission: ['payInstallment', 'rollback'],
            permissionKey: 'application'
        };
        const logsTab = {
            header: local.logs,
            stringKey: 'loanLogs',
            permission: 'viewActionLogs',
            permissionKey: 'user'
        }
        if (application.body.product.beneficiaryType === 'individual') tabsToRender.push(guarantorsTab)
        if (application.body.status === "paid") tabsToRender.push(customerCardTab)
        if (application.body.status === "issued" || application.body.status === "pending") {
            tabsToRender.push(customerCardTab)
            tabsToRender.push(reschedulingTab)
            tabsToRender.push(paymentTab)
        }
        if (application.body.status === "issued" || application.body.status === "paid") {
            tabsToRender.push(financialTransactionsTab)
            tabsToRender.push(penaltiesTab)
        }

        if (application.body.status === "pending") {
            this.setState({ activeTab: 'loanDetails' })
            this.getPendingActions();
        }
        tabsToRender.push(logsTab)
        this.setState({
            application: application.body,
            tabsArray: tabsToRender,
            loading: false
        })
    }
    async getPendingActions() {
        this.setState({ loading: true })
        const res = await getPendingActions(this.props.history.location.state.id);
        if (res.status === "success") {
            this.setState({ loading: false, pendingActions: res.body })
        }
        else this.setState({ loading: false })
    }
    async getBranchData(branchId: string) {
        const res = await getBranch(branchId);
        if (res.status === 'success') {
            this.setState({ branchDetails: res.body.data })
        } else console.log('error getting branch details')
    }
    async calculatePenalties() {
        this.setState({ loading: true });
        const res = await calculatePenalties({
            id: this.state.application._id,
            truthDate: new Date().getTime()
        });
        if (res.body) {
            this.setState({ penalty: res.body.penalty, loading: false });
        } else this.setState({ loading: false });
    }
    renderContent() {
        switch (this.state.activeTab) {
            case 'loanDetails':
                return <LoanDetailsTableView application={this.state.application} />
            case 'loanGuarantors':
                return <GuarantorTableView guarantors={this.state.application.guarantors} getIscore={(data) => this.getIscore(data)} iScores={this.state.iscores} status={this.state.application.status} />
            case 'loanLogs':
                return <Logs id={this.props.history.location.state.id} />
            case 'loanPayments':
                return <Payment print={(data) => this.setState({ print: data.print, earlyPaymentData: { ...this.state.earlyPaymentData, ...data } }, () => window.print())}
                    setReceiptData={(data) => this.setState({ receiptData: data })}
                    setEarlyPaymentData={(data) => this.setState({ earlyPaymentData: data })}
                    application={this.state.application} installments={this.state.application.installmentsObject.installments}
                    currency={this.state.application.product.currency} applicationId={this.state.application._id} pendingActions={this.state.pendingActions}
                    manualPaymentEditId={this.state.manualPaymentEditId} refreshPayment={() => this.getAppByID(this.state.application._id)} 
                    paymentType={"normal"} randomPendingActions={this.state.randomPendingActions}/>
            case 'customerCard':
                return <CustomerCardView application={this.state.application} penalty={this.state.penalty} print={() => this.setState({ print: 'customerCard' }, () => window.print())} />
            case 'loanRescheduling':
                return <Rescheduling application={this.state.application} test={false} />
            case 'loanReschedulingTest':
                return <Rescheduling application={this.state.application} test={true} />
            case 'documents':
                return <UploadDocuments application={this.state.application} />
            case 'financialTransactions':
                return <Payment print={(data) => this.setState({ print: data.print, earlyPaymentData: { ...this.state.earlyPaymentData, ...data } }, () => window.print())}
                setReceiptData={(data)=> this.setState({receiptData: data})}
                setEarlyPaymentData={(data) => this.setState({ earlyPaymentData: data })}
                application={this.state.application} installments={this.state.application.installmentsObject.installments}
                currency={this.state.application.product.currency} applicationId={this.state.application._id} pendingActions={this.state.pendingActions}
                manualPaymentEditId={this.state.manualPaymentEditId} refreshPayment={() => this.getAppByID(this.state.application._id)} 
                paymentType={"random"} randomPendingActions={this.state.randomPendingActions} />
            case 'penalties':
                return <Payment print={(data) => this.setState({ print: data.print, earlyPaymentData: { ...this.state.earlyPaymentData, ...data } }, () => window.print())}
                setReceiptData={(data)=> this.setState({receiptData: data})}
                setEarlyPaymentData={(data) => this.setState({ earlyPaymentData: data })}
                application={this.state.application} installments={this.state.application.installmentsObject.installments}
                currency={this.state.application.product.currency} applicationId={this.state.application._id} pendingActions={this.state.pendingActions}
                manualPaymentEditId={this.state.manualPaymentEditId} refreshPayment={() => this.getAppByID(this.state.application._id)} 
                paymentType={"penalties"} randomPendingActions={this.state.randomPendingActions} />
            default:
                return null
        }
    }
    async rejectManualPayment(randomPendingActionId: string) {
        this.setState({ loading: true });
        if(randomPendingActionId !== "") {
            const res = await rejectManualOtherPayment(randomPendingActionId);
            if (res.status === "success") {
                this.setState({ loading: false, randomPendingActions: this.state.randomPendingActions.filter(el => el._id !== randomPendingActionId) })
                Swal.fire('', local.rejectManualPaymentSuccess, 'success').then(() => this.getManualOtherPayments(this.props.history.location.state.id));
            } else this.setState({ loading: false })
        } else{
            const res = await rejectManualPayment(this.props.history.location.state.id);
            if (res.status === "success") {
                this.setState({ loading: false, pendingActions: {} })
                Swal.fire('', local.rejectManualPaymentSuccess, 'success').then(() => this.getAppByID(this.props.history.location.state.id));
            } else this.setState({ loading: false })
        }
    }
    async approveManualPayment(randomPendingActionId: string) {
        let receiptNumber = 0;
        let truthDate = 0;
        let actualDate = 0;
        let transactionAmount =  0;
        if(randomPendingActionId !== ""){
            const pendingAction = this.state.randomPendingActions.find(el => el._id === randomPendingActionId)
            receiptNumber = pendingAction.receiptNumber;
            truthDate = pendingAction.transactions[0].truthDate;
            actualDate = pendingAction.transactions[0].actualDate;
            transactionAmount =  pendingAction.transactions[0].transactionAmount
        } else {
            receiptNumber = Number(this.state.pendingActions.receiptNumber);
            truthDate = this.state.pendingActions.transactions ? this.state.pendingActions.transactions[0].truthDate : 0;
            actualDate = this.state.pendingActions.transactions ? this.state.pendingActions.transactions[0].actualDate : 0;
            transactionAmount =  this.state.pendingActions.transactions ? Number(this.state.pendingActions.transactions[0].transactionAmount) : 0;
        }
        const table = document.createElement("table");
        table.className = "swal-table";
        table.innerHTML = `<thead><tr><th>${local.receiptNumber}</th><th>${local.truthDate}</th><th>${local.dueDate}</th><th>${local.amount}</th>
                            </thead>
                            <tbody><tr><td>${receiptNumber}</td>
                            <td>${timeToDateyyymmdd(truthDate)}</td>
                            <td>${timeToDateyyymmdd(actualDate)}</td>
                            <td>${transactionAmount}</td></tr></tbody>`
        Swal.fire({
            width: 700,
            title: local.installmentPaymentConfirmation,
            html: table,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: local.confirmPayment,
            cancelButtonText: local.cancel,
            confirmButtonColor: '#7dc356',
            cancelButtonColor: '#d33',
        }).then(async (isConfirm) => {
            if (isConfirm.value) {
                this.setState({ loading: true });
                const res = randomPendingActionId !== "" ? await approveManualOtherPayment(randomPendingActionId) : await approveManualPayment(this.props.history.location.state.id);
                if (res.status === "success") {
                    this.setState({ loading: false })
                    Swal.fire('', local.manualPaymentApproveSuccess, 'success').then(() => this.getAppByID(this.props.history.location.state.id));
                } else {
                    this.setState({ loading: false })
                    Swal.fire('', 'حدث خطا', 'error');
                }
            }
        })
    }
    editManualPayment(randomPendingActionId: string) {
        this.props.changePaymentState(3);
        window.scrollTo(0, document.body.scrollHeight);
        if(randomPendingActionId !== ""){
            const pendingAction = this.state.randomPendingActions.find(el => el._id === randomPendingActionId)
            const tab = pendingAction.transactions[0].action === "penalty"? 'penalties': 'financialTransactions';
            this.setState({ activeTab: tab, manualPaymentEditId: pendingAction._id  });
        } else{
            this.setState({ activeTab: 'loanPayments', manualPaymentEditId: this.state.pendingActions._id ? this.state.pendingActions?._id : '' });
        }
    }
    async getIscore(data) {
        this.setState({ loading: true });
        const obj = {
            requestNumber: '148',
            reportId: '3004',
            product: '023',
            loanAccountNumber: `${data.key}`,
            number: '1703943',
            date: '02/12/2014',
            amount: `${this.state.application.principal}`,
            lastName: `${data.customerName}`,
            idSource: '003',
            idValue: `${data.nationalId}`,
            gender: (data.gender === 'male') ? '001' : '002',
            dateOfBirth: iscoreDate(data.birthDate)
        }
        const iScore = await getIscore(obj);
        if (iScore.status === 'success') {
            this.getCachediScores(this.state.application)
            this.setState({ loading: false })
        } else {
            Swal.fire('', local.noIScore, 'error')
            this.setState({ loading: false })
        }
    }
    cancelApplication() {
        Swal.fire({
            title: local.areYouSure,
            text: `${local.applicationWillBeCancelled}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.cancelApplication,
            cancelButtonText: local.cancel

        }).then(async (result) => {
            if (result.value) {
                this.setState({ loading: true });
                const res = await cancelApplication(this.props.history.location.state.id);
                if (res.status === "success") {
                    this.setState({ loading: false })
                    Swal.fire('', local.applicationCancelSuccess, 'success').then(() => window.location.reload());
                } else {
                    this.setState({ loading: false })
                    Swal.fire('', local.applicationCancelError, 'error');
                }
            }
        })
    }
    async writeOffApplication() {
        const { value: text } = await Swal.fire({
            title: local.writeOffReason,
            input: 'text',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.writeOffLoan,
            cancelButtonText: local.cancel,
            inputValidator: (value) => {
                if (!value) {
                    return local.required
                } else return ''
            }
        })
        if (text) {

            Swal.fire({
                title: local.areYouSure,
                text: `${local.loanWillBeWrittenOff}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: local.writeOffLoan,
                cancelButtonText: local.cancel
            }).then(async (result) => {
                if (result.value) {
                    this.setState({ loading: true });
                    const res = await writeOffLoan(this.props.history.location.state.id, { writeOffReason: text });
                    if (res.status === "success") {
                        this.setState({ loading: false })
                        Swal.fire('', local.loanWriteOffSuccess, 'success').then(() => window.location.reload());
                    } else {
                        this.setState({ loading: false })
                        Swal.fire('', local.loanWriteOffError, 'error');
                    }
                }
            })
        }
    }
    async doubtApplication() {
        const { value: text } = await Swal.fire({
            title: local.doubtReason,
            input: 'text',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.doubtLoan,
            cancelButtonText: local.cancel,
            inputValidator: (value) => {
                if (!value) {
                    return local.required
                } else return ''
            }
        })
        if (text) {

            Swal.fire({
                title: local.areYouSure,
                text: `${local.loanWillBeDoubted}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: local.doubtLoan,
                cancelButtonText: local.cancel
            }).then(async (result) => {
                if (result.value) {
                    this.setState({ loading: true });
                    const res = await doubtLoan(this.props.history.location.state.id, { doubtReason: text });
                    if (res.status === "success") {
                        this.setState({ loading: false })
                        Swal.fire('', local.loanDoubtSuccess, 'success').then(() => window.location.reload());
                    } else {
                        this.setState({ loading: false })
                        Swal.fire('', local.loanDoubtError, 'error');
                    }
                }
            })
        }
    }
    getSumOfPendingActions() {
        let sum = 0;
        this.state.pendingActions.transactions?.forEach((transaction) => {
            sum = sum + transaction.transactionAmount
        })
        return numTo2Decimal(sum);
    }
    render() {
        return (
            <Container>
                <Loader type="fullscreen" open={this.state.loading} />
                {Object.keys(this.state.application).length > 0 &&
                    <div className="print-none">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-start" style={{ width: '35%' }}>
                                <h3>{local.loanDetails}</h3>
                                <span style={{ display: 'flex', padding: 10, marginRight: 10, borderRadius: 30, border: `1px solid ${englishToArabic(this.state.application.status).color}` }}>
                                    <p style={{ margin: 0, color: `${englishToArabic(this.state.application.status).color}` }}>{englishToArabic(this.state.application.status).text}</p>
                                </span>
                                {this.state.application.writeOff && <span style={{ display: 'flex', padding: 10, marginRight: 10, borderRadius: 30, border: `1px solid red` }}>
                                    <p style={{ margin: 0, fontSize: 11, color: 'red' }}>{local.writtenOffLoan}</p>
                                </span>}
                                {this.state.application.isDoubtful && !this.state.application.writeOff && <span style={{ display: 'flex', padding: 10, marginRight: 10, borderRadius: 30, border: `1px solid red` }}>
                                    <p style={{ margin: 0, fontSize: 11, color: 'red' }}>{local.doubtedLoan}</p>
                                </span>}
                            </div>
                            <div className="d-flex justify-content-end" style={{ width: '65%' }}>
                                {this.state.application.status === 'issued' && this.state.application.group.individualsInGroup && this.state.application.group.individualsInGroup.length > 1 && !this.state.application.writeOff && <Can I='splitFromGroup' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/remove-member', { id: this.props.history.location.state.id })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.memberSeperation}</span></Can>}
                                {this.state.application.status === "created" && <span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => { this.setState({ print: 'all' }, () => window.print()) }}> <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>}
                                {this.state.application.status === 'underReview' && <Can I='assignProductToCustomer' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/edit-loan-application', { id: this.props.history.location.state.id, action: 'edit' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.editLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <Can I='reviewLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'review' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.reviewLoan}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='rollback' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'unreview' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.undoLoanReview}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='rejectLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'reject' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rejectLoan}</span></Can>}
                                {this.state.application.status === 'created' && <Can I='issueLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'issue' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.issueLoan}</span></Can>}
                                {this.state.application.status === 'approved' && <Can I='createLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'create' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.createLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <Can I='cancelApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.cancelApplication()}> <span className="fa fa-remove" style={{ margin: "0px 0px 0px 5px" }}></span>{local.cancel}</span></Can>}
                                {this.state.application.status !== 'canceled' && (ability.can('rollback', 'application') || ability.can('rollbackPayment', 'application')) && <span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-roll-back', { id: this.props.history.location.state.id })}> <span className="fa fa-undo" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rollBackAction}</span>}
                                {this.state.application.status === 'issued' && this.state.application.isDoubtful && !this.state.application.writeOff && <Can I='writeOff' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.writeOffApplication()}> <span className="fa fa-remove" style={{ margin: "0px 0px 0px 5px" }}></span>{local.writeOffLoan}</span></Can>}
                                {this.state.application.status === 'issued' && !this.state.application.isDoubtful && !this.state.application.writeOff && <Can I='setDoubtfulLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.doubtApplication()}> <img alt="doubt" src={require('../../Assets/minus.svg')} style={{ height: 20, marginLeft: 5 }} />{local.doubtLoan}</span></Can>}


                            </div>
                        </div>
                        {this.state.application.status === "pending" ?
                            <div className="warning-container">
                                <img alt="warning" src={require('../../Assets/warning-yellow-circle.svg')} style={{ marginLeft: 20 }} />
                                <h6>{local.manualPaymentNeedsInspection}</h6>
                                <div className="info">
                                    <span className="text-muted">{local.truthDate}</span>
                                    <span>{this.state.pendingActions.transactions ? timeToDateyyymmdd(this.state.pendingActions?.transactions[0].truthDate) : ''}</span>
                                </div>
                                <div className="info">
                                    <span className="text-muted">{local.dueDate}</span>
                                    <span>{this.state.pendingActions.transactions ? timeToDateyyymmdd(this.state.pendingActions.transactions[0].actualDate) : ''}</span>
                                </div>
                                <div className="info">
                                    <span className="text-muted">{local.amount}</span>
                                    <span>{this.getSumOfPendingActions()}</span>
                                </div>
                                <div className="info">
                                    <span className="text-muted">{local.receiptNumber}</span>
                                    <span>{this.state.pendingActions?.receiptNumber}</span>
                                </div>
                                <div className="status-chip pending">{local.pending}</div>
                                <Can I='payInstallment' a='application'>
                                    <div style={{ color: '#000', cursor: 'pointer' }} data-qc="editManualPayment" onClick={() => this.editManualPayment('')}><span className="fa fa-pencil" style={{ marginLeft: 5 }}></span>{local.edit}</div>
                                </Can>
                                <Can I='payInstallment' a='application'>
                                    <div className="cancel" data-qc="rejectManualPayment" onClick={() => { this.rejectManualPayment('') }}>{local.cancel}</div>
                                </Can>
                                <Can I='approvePendingAction' a='application'>
                                    <div className="submit" data-qc="approveManualPayment" onClick={() => { this.approveManualPayment('') }}>{local.submit}</div>
                                </Can>
                            </div>
                        : null}
                    {this.state.randomPendingActions.length > 0 && <ManualRandomPaymentsActions
                        pendingActions={this.state.randomPendingActions}
                        rejectManualPayment={(randomPaymentId: string) => this.rejectManualPayment(randomPaymentId)}
                        approveManualPayment={(randomPaymentId: string) => this.approveManualPayment(randomPaymentId)}
                        editManualPayment={(randomPaymentId: string) => this.editManualPayment(randomPaymentId)}
                    />}
                        <div style={{ marginTop: 15 }}>
                            {this.state.application.product.beneficiaryType === 'individual' ? <InfoBox values={this.state.application.customer} getIscore={(data) => this.getIscore(data)} iScores={this.state.iscores} status={this.state.application.status} /> :
                                <GroupInfoBox group={this.state.application.group} getIscore={(data) => this.getIscore(data)} iScores={this.state.iscores} status={this.state.application.status} />
                            }
                        </div>
                        <Card style={{ marginTop: 15 }}>
                            <CardNavBar
                                header={'here'}
                                array={this.state.tabsArray}
                                active={this.state.activeTab}
                                selectTab={(index: string) => this.setState({ activeTab: index, manualPaymentEditId: '' },()=> {
                                    if(index === 'customerCard') this.calculatePenalties();
                                    this.props.changePaymentState(0)})}
                            />
                            <div style={{ padding: 20, marginTop: 15 }}>
                                {this.renderContent()}
                            </div>
                        </Card>
                    </div>
                }
                {this.state.print === 'all' &&
                    <>
                        <CashReceiptPDF data={this.state.application} />
                        <CustomerCardPDF data={this.state.application} penalty={this.state.penalty} branchDetails={this.state.branchDetails} />
                        <CustomerCardAttachments data={this.state.application} branchDetails={this.state.branchDetails} />
                        <TotalWrittenChecksPDF data={this.state.application} />
                        <FollowUpStatementPDF data={this.state.application} branchDetails={this.state.branchDetails} />
                        {this.state.application.product.beneficiaryType === "individual" ?
                            <LoanContract data={this.state.application} branchDetails={this.state.branchDetails} />
                            : <LoanContractForGroup data={this.state.application} branchDetails={this.state.branchDetails} />
                        }
                    </>}
                {this.state.print === 'customerCard' && <CustomerCardPDF data={this.state.application} penalty={this.state.penalty} branchDetails={this.state.branchDetails} />}
                {this.state.print === 'earlyPayment' && <EarlyPaymentPDF data={this.state.application} earlyPaymentData={this.state.earlyPaymentData} branchDetails={this.state.branchDetails} />}
                {this.state.print === 'payment' && <PaymentReceipt receiptData={this.state.receiptData} data={this.state.application} />}
                {this.state.print === 'payEarly' && <EarlyPaymentReceipt receiptData={this.state.receiptData} branchDetails={this.state.branchDetails} earlyPaymentData={this.state.earlyPaymentData} data={this.state.application} />}
                {(this.state.print === 'randomPayment' || this.state.print === 'penalty') ? <RandomPaymentReceipt receiptData={this.state.receiptData} data={this.state.application} /> : null}
            </Container>
        )
    }
}
const addPaymentToProps = dispatch => {
    return {
        changePaymentState: data => dispatch(payment(data)),
    };
};
export default connect(null, addPaymentToProps)(withRouter(LoanProfile));