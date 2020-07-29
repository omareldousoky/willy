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
import { timeToDateyyymmdd } from '../../Services/utils';
import { payment } from '../../redux/payment/actions';
import { connect } from 'react-redux';
import { cancelApplication } from '../../Services/APIs/loanApplication/stateHandler';
import { rejectManualPayment } from '../../Services/APIs/Loan/rejectManualPayment';
import store from '../../redux/store';
import UploadDocuments from './uploadDocuments';
import CollectionStatement from '../pdfTemplates/CollectionStatement/CollectionStatement';
import ClientGuaranteedLoans from '../pdfTemplates/ClientGuaranteedLoans/ClientGuaranteedLoans';
import { getIscore } from '../../Services/APIs/iScore/iScore';
import { writeOffLoan } from '../../Services/APIs/Loan/writeOffLoan';
import PaymentReceipt from '../pdfTemplates/paymentReceipt/paymentReceipt';
import RandomPaymentReceipt from '../pdfTemplates/randomPaymentReceipt/randomPaymentReceipt';

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
            receiptData: {}
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getAppByID(id) {
        this.setState({ loading: true, activeTab: 'loanDetails' });
        const application = await getApplication(id);
        this.getBranchData(application.body.branchId);
        if (application.status === "success") {
            if (store.getState().auth.clientPermissions === {}) {
                store.subscribe(() => {
                    this.setTabsToRender(application)
                })
            } else this.setTabsToRender(application)
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
            stringKey: 'loanPayments'
        };
        const reschedulingTab = {
            header: local.rescheduling,
            stringKey: 'loanRescheduling'
        };
        const reschedulingTestTab = {
            header: local.reschedulingTest,
            stringKey: 'loanReschedulingTest'
        };
        if (application.body.product.beneficiaryType === 'individual') tabsToRender.push(guarantorsTab)
        if (application.body.status === "paid") tabsToRender.push(customerCardTab)
        if (application.body.status === "issued" || application.body.status === "pending") {
            tabsToRender.push(customerCardTab)
            if (ability.can('payInstallment', 'application') || ability.can('payEarly', 'application')) tabsToRender.push(paymentTab)
            if (ability.can('pushInstallment', 'application') && !this.state.application.writeOff) tabsToRender.push(reschedulingTab)
            // if (ability.can('pushInstallment', 'application')) tabsToRender.push(reschedulingTestTab)
        }
       
        const financialTransactionsTab = {
            header: local.financialTransactions,
            stringKey: 'financialTransactions'
        };
        const penaltiesTab = {
            header: local.penalties,
            stringKey: 'penalties'
        };
        if (application.body.status === "issued" || application.body.status === "paid") {
            if (ability.can('payInstallment', 'application'))  tabsToRender.push(financialTransactionsTab)
            if (ability.can('payInstallment', 'application') || ability.can('rollback', 'application'))  tabsToRender.push(penaltiesTab)
        }
      
        if (application.body.status === "pending") {
            this.setState({ activeTab: 'loanDetails' })
            this.getPendingActions();
        }
        if(ability.can('viewActionLogs', 'user')) tabsToRender.push({header: local.logs,stringKey: 'loanLogs'})
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
    renderContent() {
        switch (this.state.activeTab) {
            case 'loanDetails':
                return <LoanDetailsTableView application={this.state.application} />
            case 'loanGuarantors':
                return <GuarantorTableView guarantors={this.state.application.guarantors} />
            case 'loanLogs':
                return <Logs id={this.props.history.location.state.id} />
            case 'loanPayments':
                return <Payment print={(data) => this.setState({ print: data.print, earlyPaymentData: { ...this.state.earlyPaymentData, ...data } }, () => window.print())}
                    setReceiptData={(data)=> this.setState({receiptData: data})}
                    setEarlyPaymentData={(data) => this.setState({ earlyPaymentData: data })}
                    application={this.state.application} installments={this.state.application.installmentsObject.installments}
                    currency={this.state.application.product.currency} applicationId={this.state.application._id} pendingActions={this.state.pendingActions}
                    manualPaymentEditId={this.state.manualPaymentEditId} refreshPayment={() => this.getAppByID(this.state.application._id)} 
                    paymentType={"normal"} />
            case 'customerCard':
                return <CustomerCardView application={this.state.application} print={() => this.setState({ print: 'customerCard' }, () => window.print())} />
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
                paymentType={"random"} />
            case 'penalties':
                return <Payment print={(data) => this.setState({ print: data.print, earlyPaymentData: { ...this.state.earlyPaymentData, ...data } }, () => window.print())}
                setReceiptData={(data)=> this.setState({receiptData: data})}
                setEarlyPaymentData={(data) => this.setState({ earlyPaymentData: data })}
                application={this.state.application} installments={this.state.application.installmentsObject.installments}
                currency={this.state.application.product.currency} applicationId={this.state.application._id} pendingActions={this.state.pendingActions}
                manualPaymentEditId={this.state.manualPaymentEditId} refreshPayment={() => this.getAppByID(this.state.application._id)} 
                paymentType={"penalties"} />
            default:
                return null
        }
    }
    async rejectManualPayment() {
        this.setState({ loading: true });
        const res = await rejectManualPayment(this.props.history.location.state.id);
        if (res.status === "success") {
            this.setState({ loading: false, pendingActions: {} })
            Swal.fire('', local.rejectManualPaymentSuccess, 'success').then(() => this.getAppByID(this.props.history.location.state.id));
        } else this.setState({ loading: false })
    }
    async approveManualPayment() {
        const table = document.createElement("table");
        table.className = "swal-table";
        table.innerHTML = `<thead><tr><th>${local.receiptNumber}</th><th>${local.truthDate}</th><th>${local.dueDate}</th><th>${local.amount}</th>
                            </thead>
                            <tbody><tr><td>${this.state.pendingActions.receiptNumber}</td>
                            <td>${this.state.pendingActions.transactions ? timeToDateyyymmdd(this.state.pendingActions.transactions[0].truthDate) : ''}</td>
                            <td>${this.state.pendingActions.transactions ? timeToDateyyymmdd(this.state.pendingActions.transactions[0].actualDate) : ''}</td>
                            <td>${this.state.pendingActions.transactions ? this.state.pendingActions.transactions[0].transactionAmount : ''}</td></tr></tbody>`
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
                const res = await approveManualPayment(this.props.history.location.state.id);
                if (res.status === "success") {
                    this.setState({ loading: false })
                    Swal.fire('', local.manualPaymentApproveSuccess, 'success').then(() => this.getAppByID(this.props.history.location.state.id));
                } else this.setState({ loading: false })
            }
        })
    }
    editManualPayment() {
        this.props.changePaymentState(3);
        window.scrollTo(0, document.body.scrollHeight);
        this.setState({ activeTab: 'loanPayments', manualPaymentEditId: this.state.pendingActions._id ? this.state.pendingActions?._id : '' });
    }
    async getIscore(data) {
        this.setState({ loading: true });
        const obj = {
            requestNumber: '002',
            reportId: '002',
            product: `${this.state.application.product.code}`,
            loanAccountNumber: `${data.key}`,
            number: '003',
            date: '003',
            amount: `${this.state.application.principal}`,
            lastName: `${data.customerName}`,
            idSource: '003',
            idValue: `${data.nationalId}`,
            gender: (data.gender === 'male') ? '001' : '002',
            dateOfBirth: `${data.birthDate}`
        }
        const iScore = await getIscore(obj);
        if (iScore.status === 'success') {
            this.downloadFile(iScore.body.url)
            this.setState({ loading: false })
        } else {
            Swal.fire('', 'fetch error', 'error')
            this.setState({ loading: false })
        }
    }
    downloadFile(fileURL) {
        const link = document.createElement('a');
        link.href = fileURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
    getSumOfPendingActions() {
        let sum = 0;
        this.state.pendingActions.transactions?.forEach((transaction) => {
            sum = sum + transaction.transactionAmount
        })
        return sum;
    }
    render() {
        return (
            <Container>
                <Loader type="fullscreen" open={this.state.loading} />
                {Object.keys(this.state.application).length > 0 &&
                    <div className="print-none">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-start" style={{ width: '30%' }}>
                                <h3>{local.loanDetails}</h3>
                                <span style={{ display: 'flex', padding: 10, marginRight: 10, borderRadius: 30, border: `1px solid ${englishToArabic(this.state.application.status).color}` }}>
                                    <p style={{ margin: 0, color: `${englishToArabic(this.state.application.status).color}` }}>{englishToArabic(this.state.application.status).text}</p>
                                </span>
                                {this.state.application.writeOff && <span style={{ display: 'flex', padding: 10, marginRight: 10, borderRadius: 30, border: `1px solid red` }}>
                                    <p style={{ margin: 0, color: 'red' }}>{local.writtenOffLoan}</p>
                                </span>}
                            </div>
                            <div className="d-flex justify-content-end" style={{ width: '70%' }}>
                                {this.state.application.status === 'issued' && this.state.application.group.individualsInGroup && this.state.application.group.individualsInGroup.length > 1 && <Can I='splitFromGroup' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/remove-member', { id: this.props.history.location.state.id })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.memberSeperation}</span></Can>}
                                {this.state.application.status === "created" && <span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => { this.setState({ print: 'all' }, () => window.print()) }}> <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>}
                                {this.state.application.status === 'underReview' && <Can I='assignProductToCustomer' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/edit-loan-application', { id: this.props.history.location.state.id, action: 'edit' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.editLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <Can I='reviewLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'review' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.reviewLoan}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='rollback' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'unreview' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.undoLoanReview}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='rejectLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'reject' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rejectLoan}</span></Can>}
                                {this.state.application.status === 'created' && <Can I='issueLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'issue' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.issueLoan}</span></Can>}
                                {this.state.application.status === 'approved' && <Can I='createLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'create' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.createLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <Can I='cancelApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.cancelApplication()}> <span className="fa fa-remove" style={{ margin: "0px 0px 0px 5px" }}></span>{local.cancel}</span></Can>}
                                {this.state.application.status !== 'canceled' && (ability.can('rollback', 'application') || ability.can('rollbackPayment', 'application')) && <span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-roll-back', { id: this.props.history.location.state.id })}> <span className="fa fa-undo" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rollBackAction}</span> }
                                {this.state.application.status === 'issued' && !this.state.application.writeOff && <Can I='writeOff' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.writeOffApplication()}> <span className="fa fa-remove" style={{ margin: "0px 0px 0px 5px" }}></span>{local.writeOffLoan}</span></Can>}

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
                                    <div style={{ color: '#000', cursor: 'pointer' }} data-qc="editManualPayment" onClick={() => this.editManualPayment()}><span className="fa fa-pencil" style={{ marginLeft: 5 }}></span>{local.edit}</div>
                                </Can>
                                <Can I='payInstallment' a='application'>
                                    <div className="cancel" data-qc="rejectManualPayment" onClick={() => { this.rejectManualPayment() }}>{local.cancel}</div>
                                </Can>
                                <Can I='approvePendingAction' a='application'>
                                    <div className="submit" data-qc="approveManualPayment" onClick={() => { this.approveManualPayment() }}>{local.submit}</div>
                                </Can>
                            </div>
                            : null}
                        <div style={{ marginTop: 15 }}>
                            {this.state.application.product.beneficiaryType === 'individual' ? <InfoBox values={this.state.application.customer} getIscore={(data) => this.getIscore(data)} /> :
                                <GroupInfoBox group={this.state.application.group} getIscore={(data) => this.getIscore(data)} />
                            }
                        </div>
                        <Card style={{ marginTop: 15 }}>
                            <CardNavBar
                                header={'here'}
                                array={this.state.tabsArray}
                                active={this.state.activeTab}
                                selectTab={(index: string) => this.setState({ activeTab: index },()=> this.props.changePaymentState(0))}
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
                        <ClientGuaranteedLoans />
                        <CollectionStatement />
                        <CustomerCardPDF data={this.state.application} loanOfficer={this.state.loanOfficer} branchDetails={this.state.branchDetails}/>
                        <CustomerCardPDF data={this.state.application} branchDetails={this.state.branchDetails} />
                        <CustomerCardAttachments data={this.state.application} branchDetails={this.state.branchDetails} />
                        <TotalWrittenChecksPDF data={this.state.application} />
                        <FollowUpStatementPDF data={this.state.application} branchDetails={this.state.branchDetails} />
                        {this.state.application.product.beneficiaryType === "individual" ?
                            <LoanContract data={this.state.application} branchDetails={this.state.branchDetails} />
                            : <LoanContractForGroup data={this.state.application} branchDetails={this.state.branchDetails} />
                        }
                    </>}
                {this.state.print === 'customerCard' && <CustomerCardPDF data={this.state.application} branchDetails={this.state.branchDetails} />}
                {this.state.print === 'earlyPayment' && <EarlyPaymentPDF data={this.state.application} earlyPaymentData={this.state.earlyPaymentData} branchDetails={this.state.branchDetails} />}
                {this.state.print === 'payment' && <PaymentReceipt receiptData={this.state.receiptData} data={this.state.application}/>}
                {this.state.print === 'payEarly' && <EarlyPaymentReceipt receiptData={this.state.receiptData} branchDetails={this.state.branchDetails} earlyPaymentData={this.state.earlyPaymentData} data={this.state.application}/>}
                {(this.state.print === 'randomPayment' || this.state.print === 'penalty')? <RandomPaymentReceipt receiptData={this.state.receiptData} data={this.state.application}/> : null}                
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