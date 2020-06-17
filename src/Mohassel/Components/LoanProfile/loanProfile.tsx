import React, { Component } from 'react';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
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
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import GroupInfoBox from './groupInfoBox';
import Can from '../../config/Can';
interface State {
    prevId: string;
    application: any;
    activeTab: string;
    tabsArray: Array<Tab>;
    loading: boolean;
    print: boolean;
}

interface Props {
    history: any;
    location: any;
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
            print: false,
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
            if (application.body.status === "issued") {
                tabsToRender.push(customerCardTab)
                if (ability.can('payInstallment', 'application') || ability.can('payEarly', 'application')) tabsToRender.push(paymentTab)
                if (ability.can('pushInstallment', 'application')) tabsToRender.push(reschedulingTab)
                if (ability.can('pushInstallment', 'application')) tabsToRender.push(reschedulingTestTab)
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

    renderContent() {
        switch (this.state.activeTab) {
            case 'loanDetails':
                return <LoanDetailsTableView application={this.state.application} />
            case 'loanGuarantors':
                return <GuarantorView guarantors={this.state.application.guarantors} />
            case 'loanLogs':
                return <Logs id={this.props.history.location.state.id} />
            case 'loanPayments':
                return <Payment application={this.state.application} installments={this.state.application.installmentsObject.installments} currency={this.state.application.product.currency} applicationId={this.state.application._id} refreshPayment={() => this.getAppByID(this.state.application._id)} />
            case 'customerCard':
                return <CustomerCardView application={this.state.application} />
            case 'loanRescheduling':
                return <Rescheduling application={this.state.application} test={false} />
            case 'loanReschedulingTest':
                return <Rescheduling application={this.state.application} test={true} />
            default:
                return null
        }
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
                            <div className="d-flex justify-content-end" style={{ width: '50%' }}>
                                <span style={{ cursor: 'not-allowed',  padding: 10 }}> <span className="fa fa-file-pdf-o" style={{ margin: "0px 0px 0px 5px" }}></span>iScorePDF</span>
                                {this.state.application.status === ("created" || "approved") && <span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => { this.setState({ print: true }, () => window.print()) }}> <span className="fa fa-download" style={{ margin: "0px 0px 0px 5px" }}></span> {local.downloadPDF}</span>}
                                {this.state.application.status === 'underReview' && <Can I='assignProductToCustomer' a='application'><span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => this.props.history.push('/track-loan-applications/edit-loan-application', { id: this.props.history.location.state.id, action: 'edit' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.editLoan}</span></Can>}
                                {this.state.application.status === 'underReview' && <Can I='reviewLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'review' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.reviewLoan}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='reviewLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'unreview' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.undoLoanReview}</span></Can>}
                                {this.state.application.status === 'reviewed' && <Can I='rejectLoanApplication' a='application'><span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => this.props.history.push('/track-loan-applications/loan-status-change', { id: this.props.history.location.state.id, action: 'reject' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.rejectLoan}</span></Can>}
                                {this.state.application.status === 'created' && <Can I='issueLoan' a='application'><span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'issue' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.issueLoan}</span></Can>}
                                {this.state.application.status === 'approved' && <Can I='createLoan' a='application'><span style={{ cursor: 'pointer', borderRight:'1px solid #e5e5e5', padding:10 }} onClick={() => this.props.history.push('/track-loan-applications/create-loan', { id: this.props.history.location.state.id, type: 'create' })}> <span className="fa fa-pencil" style={{ margin: "0px 0px 0px 5px" }}></span>{local.createLoan}</span></Can>}
                            </div>
                        </div>
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
                {this.state.print &&
                    <>
                        <CashReceiptPDF data={this.state.application} />
                        <CustomerCardPDF data={this.state.application} />
                        <CustomerCardAttachments data={this.state.application} />
                        <TotalWrittenChecksPDF data={this.state.application} />
                        <FollowUpStatementPDF data={this.state.application} />
                        <LoanContract data={this.state.application} />
                    </>}
            </Container>
        )
    }
}
export default withRouter(LoanProfile);