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
import { GuarantorView } from './guarantorDetails'
import { CustomerCardView } from './customerCard';
import Rescheduling from '../Rescheduling/rescheduling';
import ability from '../../config/ability';
import CustomerCardPDF from '../pdfTemplates/customerCard/customerCard';
import CashReceiptPDF from '../pdfTemplates/cashReceipt/cashReceipt';
import CustomerCardAttachments from '../pdfTemplates/customerCardAttachments/customerCardAttachments';
import TotalWrittenChecksPDF from '../pdfTemplates/totalWrittenChecks/totalWrittenChecks';
import FollowUpStatementPDF from '../pdfTemplates/followUpStatment/followUpStatement';
import LoanContract from '../pdfTemplates/loanContract/loanContract';
import { withRouter } from 'react-router-dom';
import GroupInfoBox from './groupInfoBox';
import Can from '../../config/Can';
import EarlyPaymentPDF from '../pdfTemplates/earlyPayment/earlyPayment';
import { PendingActions } from '../../Services/interfaces';
import { timeToDateyyymmdd } from '../../Services/utils';
import { payment } from '../../redux/payment/actions';
import { connect } from 'react-redux';
import { cancelApplication } from '../../Services/APIs/loanApplication/stateHandler';

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
    loanOfficer: string;
    branchDetails: any;
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
            loanOfficer: '',
            branchDetails: {}
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getAppByID(id) {
        this.setState({ loading: true });
        const application = await getApplication(id);
        if (application.status === 'success') {
            this.getBranchData(application.body.branchId);
            const tabsToRender = [
                {
                    header: local.loanInfo,
                    stringKey: 'loanDetails'
                },
                {
                    header: local.logs,
                    stringKey: 'loanLogs'
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
                if (ability.can('pushInstallment', 'application')) tabsToRender.push(reschedulingTab)
                if (ability.can('pushInstallment', 'application')) tabsToRender.push(reschedulingTestTab)
            }
            if (application.body.status === "pending") {
                this.setState({ activeTab: 'loanDetails' })
                this.getPendingActions();
            }
            this.setState({
                application: application.body,
                tabsArray: tabsToRender,
                loading: false
            })
        } else {
            Swal.fire('', 'fetch error', 'error')
            this.setState({ loading: false })
        }
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
                return <LoanDetailsTableView application={this.state.application} setLoanOfficer={(name) => this.setState({ loanOfficer: name })} />
            case 'loanGuarantors':
                return <GuarantorView guarantors={this.state.application.guarantors} />
            case 'loanLogs':
                return <Logs id={this.props.history.location.state.id} />
            case 'loanPayments':
                return <Payment print={(data) => this.setState({ print: 'earlyPayment', earlyPaymentData: { ...data } }, () => window.print())}
                    application={this.state.application} installments={this.state.application.installmentsObject.installments}
                    currency={this.state.application.product.currency} applicationId={this.state.application._id}
                    manualPaymentEditId={this.state.manualPaymentEditId} refreshPayment={() => this.getAppByID(this.state.application._id)} />
            case 'customerCard':
                return <CustomerCardView application={this.state.application} print={() => this.setState({ print: 'customerCard' }, () => window.print())} />
            case 'loanRescheduling':
                return <Rescheduling application={this.state.application} test={false} />
            case 'loanReschedulingTest':
                return <Rescheduling application={this.state.application} test={true} />
            default:
                return null
        }
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
    cancelApplication() {
        Swal.fire({
            title: local.areYouSure,
            text: `${local.applicationWillBeCancelled}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.cancelApplication
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
    render() {
        return (
            <Container>
                <Loader type="fullscreen" open={this.state.loading} />
                {Object.keys(this.state.application).length > 0 &&
                    <div className="print-none">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-between" style={{ width: '25%' }}>
                                <h3>{local.loanDetails}</h3>
                                <span style={{ display: 'flex', padding: 10, borderRadius: 30, border: `1px solid ${englishToArabic(this.state.application.status).color}` }}>
                                    <p style={{ margin: 0, color: `${englishToArabic(this.state.application.status).color}` }}>{englishToArabic(this.state.application.status).text}</p>
                                </span>
                            </div>
                            <div className="d-flex justify-content-end" style={{ width: '75%' }}>
                                <span style={{ cursor: 'not-allowed', padding: 10 }}> <span className="fa fa-file-pdf-o" style={{ margin: "0px 0px 0px 5px" }}></span>iScorePDF</span>
                                {this.state.application.status === 'issued' && this.state.application.group.individualsInGroup && this.state.application.group.individualsInGroup.length > 1 && <Can I='splitFromGroup' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/remove-member', { id: this.props.history.location.state.id })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.memberSeperation}</span></Can>}
                                {(this.state.application.status === "created" || this.state.application.status === "issued" || this.state.application.status === "pending") && <span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => { this.setState({ print: 'all' }, () => window.print()) }}> <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>}
                                {this.state.application.status === 'underReview' && <Can I='assignProductToCustomer' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/edit-loan-application', { id: this.props.history.location.state.id, action: 'edit' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.editLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <Can I='reviewLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'review' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.reviewLoan}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='reviewLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'unreview' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.undoLoanReview}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='rejectLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'reject' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rejectLoan}</span></Can>}
                                {this.state.application.status === 'created' && <Can I='issueLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'issue' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.issueLoan}</span></Can>}
                                {this.state.application.status === 'approved' && <Can I='createLoan' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'create' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.createLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.cancelApplication()}> <span className="fa fa-remove" style={{ margin: "0px 0px 0px 5px" }}></span>{local.cancel}</span>}
                                {this.state.application.status !== 'canceled' && <Can I='rollback' a='application'><span style={{ cursor: 'pointer', borderRight: '1px solid #e5e5e5', padding: 10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-roll-back', { id: this.props.history.location.state.id })}> <span className="fa fa-undo" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rollBackAction}</span></Can>}

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
                                    <span>{this.state.pendingActions.transactions ? this.state.pendingActions?.transactions[0].transactionAmount : ''}</span>
                                </div>
                                <div className="info">
                                    <span className="text-muted">{local.receiptNumber}</span>
                                    <span>{this.state.pendingActions?.receiptNumber}</span>
                                </div>
                                <div className="status-chip pending">{local.pending}</div>
                                <Can I='payInstallment' a='application'>
                                    <div style={{ color: '#000', cursor: 'pointer' }} onClick={() => this.editManualPayment()}><span className="fa fa-pencil" style={{ marginLeft: 5 }}></span>{local.edit}</div>
                                </Can>
                                <Can I='approveManualPayment' a='application'>
                                    <div className="submit" onClick={() => { this.approveManualPayment() }}>{local.submit}</div>
                                </Can>

                            </div>
                            : null}
                        <div style={{ marginTop: 15 }}>
                            {this.state.application.product.beneficiaryType === 'individual' ? <InfoBox values={this.state.application.customer} /> :
                                <GroupInfoBox group={this.state.application.group} />
                            }
                        </div>
                        <Card style={{ marginTop: 15 }}>
                            <CardNavBar
                                header={'here'}
                                array={this.state.tabsArray}
                                active={this.state.activeTab}
                                selectTab={(index: string) => this.setState({ activeTab: index })}
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
                        <CustomerCardPDF data={this.state.application} loanOfficer={this.state.loanOfficer} />
                        <CustomerCardAttachments data={this.state.application} branchDetails={this.state.branchDetails} />
                        <TotalWrittenChecksPDF data={this.state.application} />
                        <FollowUpStatementPDF data={this.state.application} branchDetails={this.state.branchDetails} />
                        <LoanContract data={this.state.application} branchDetails={this.state.branchDetails} />
                    </>}
                {this.state.print === 'customerCard' && <CustomerCardPDF data={this.state.application} />}
                {this.state.print === 'earlyPayment' && <EarlyPaymentPDF data={this.state.application} earlyPaymentData={this.state.earlyPaymentData} loanOfficer={this.state.loanOfficer} branchDetails={this.state.branchDetails} />}
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