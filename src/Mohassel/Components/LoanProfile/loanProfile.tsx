import React, { Component } from 'react';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import InfoBox from '../userInfoBox';
import Payment from '../Payment/payment';
import { englishToArabic } from '../../Services/statusLanguage';
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import { CardNavBar, Tab } from '../HeaderWithCards/headerWithCards'
import UsersList from '../ManageAccounts/usersList';
import { getCookie } from '../../Services/getCookie';

import Logs from './applicationLogs';
import Card from 'react-bootstrap/Card';
import { LoanDetailsTableView } from './applicationsDetails';
import { GuarantorView } from './guarantorDetails'
import { CustomerCardView } from './customerCard';
import Rescheduling from '../Rescheduling/rescheduling';
interface State {
    prevId: string;
    application: any;
    activeTab: string;
    tabsArray: Array<Tab>;
    loading: boolean;
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
            activeTab: 'loanPayments',
            tabsArray: [],
            loading: false,
        };
    }
    componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
    }
    async getAppByID(id) {
        const application = await getApplication(id);
        if (application.status === 'success') {
            const tabsToRender = [
                {
                    header: local.loanInfo,
                    stringKey: 'loanDetails'
                },
                {
                    header: local.guarantorInfo,
                    stringKey: 'loanGuarantors'
                },
                {
                    header: local.logs,
                    stringKey: 'loanLogs'
                }
            ]
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
            if (application.body.status === "paid") tabsToRender.push(customerCardTab)
            if (application.body.status === "issued") tabsToRender.push(...[customerCardTab, paymentTab, reschedulingTab, reschedulingTestTab])
            this.setState({
                application: application.body,
                tabsArray: tabsToRender
            })
        } else {
            Swal.fire('', 'fetch error', 'error')
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
                return <Payment installments={this.state.application.installmentsObject.installments} currency={this.state.application.product.currency} applicationId={this.state.application._id} />
            case 'customerCard':
                return <CustomerCardView application={this.state.application} />
            case 'loanRescheduling':
                return  <Rescheduling application={this.state.application} test={false}/>
            case 'loanReschedulingTest':
                return  <Rescheduling application={this.state.application} test={true}/>
            default:
                return null
        }
    }
    render() {
        return (
            <Container>
                {Object.keys(this.state.application).length > 0 &&
                    <div>
                        <div className="d-flex justify-content-between">
                            <h3>{local.loanDetails}</h3>
                            <div>
                                <span style={{ display: 'flex', padding: 10, borderRadius: 30, backgroundColor: englishToArabic(this.state.application.status).color }}>
                                    <p style={{ margin: 0, color: 'white' }}>{englishToArabic(this.state.application.status).text}</p>
                                </span>
                            </div>
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <InfoBox values={this.state.application.customer} />
                        </div>
                        <Card style={{ marginTop: 15 }}>
                            <CardNavBar
                                header={'here'}
                                array={this.state.tabsArray}
                                active={this.state.activeTab}
                                selectTab={(index: string) => this.setState({ activeTab: index })}
                            />
                            <Loader type="fullscreen" open={this.state.loading} />
                            <div style={{ padding: 20, marginTop: 15 }}>
                                {this.renderContent()}
                            </div>
                        </Card>
                    </div>
                }
            </Container>
        )
    }
}
export default LoanProfile