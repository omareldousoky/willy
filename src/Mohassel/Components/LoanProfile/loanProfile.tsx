import React, { Component } from 'react';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import InfoBox from '../userInfoBox';
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
import { DetailsTableView } from './applicationsDetails';
import { GuarantorView } from './guarantorDetails'
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
            activeTab: 'loanDetails',
            tabsArray: [
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
                },
                // {
                //     header: local.customerCard,
                //     stringKey: 'customerCard'
                // },
                {
                    header: local.payments,
                    stringKey: 'loanPayments'
                },
                // {
                //     header: local.rescheduling,
                //     stringKey: 'loanRescheduling'
                // }, 
                // {
                //     header: local.reschedulingTest,
                //     stringKey: 'loanReschedulingTest'
                // }
            ],
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
            this.setState({
                application: application.body
            })
        } else {
            Swal.fire('', 'fetch error', 'error')
        }
    }

    renderContent() {
        switch (this.state.activeTab) {
            case 'loanDetails':
                return <DetailsTableView application={this.state.application} />
            case 'loanGuarantors':
                return <GuarantorView guarantors={this.state.application.guarantors} />
            case 'loanLogs':
                return <Logs id={this.props.history.location.state.id} />
            case 'loanPayments':
                // return <Payment installments={this.state.application.installmentsObject.installments} currency={this.state.application.product.currency} applicationId={this.state.application._id}/>
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