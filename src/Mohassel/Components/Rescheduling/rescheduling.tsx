import React, { Component } from 'react';
import * as local from '../../../Shared/Assets/ar.json';
import PostponeInstallments from './postponeInstallments';
import { timeToDateyyymmdd } from '../../Services/utils';
import TraditionalLoanRescheduling from './traditionalLoanRescheduling';
import FreeRescheduling from './freeRescheduling';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import Can from '../../config/Can';
import PostponeHalfInstallment from './postponeHalfInstallment';

interface Props {
    test: boolean;
    application: any;
}
interface State {
    id: string;
    activeTab: string;
    tabsArray: Array<Tab>;
}
class Rescheduling extends Component<Props, State>{
    mappers: { title: string; key: string; render: (data: any) => any }[]
    constructor(props: Props) {
        super(props);
        this.state = {
            id: '',
            activeTab: '',
            tabsArray: [{
                header: local.postponeInstallments,
                stringKey: 'postponeInstallment',
                permission: 'pushInstallment',
                permissionKey: 'application'
            },{
                header: local.postponeHalfInstallment,
                stringKey: 'postponeHalfInstallment',
                permission: 'pushInstallment',
                permissionKey: 'application'
            },
            {
                header: local.traditionalRescheduling,
                stringKey: 'traditionalRescheduling',
                permission: 'traditionRescheduling',
                permissionKey: 'application'
            },
            {
                header: local.freeRescheduling,
                stringKey: 'freeRescheduling',
                permission: 'freeRescheduling',
                permissionKey: 'application'
            }]
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
                render: data => timeToDateyyymmdd(data.dateOfPayment)
            },
            {
                title: local.loanStatus,
                key: "loanStatus",
                render: data => data.status
            },
        ]
    }
    handleOptionChange = (changeEvent) => {
        this.setState({
            activeTab: changeEvent.target.value
        });
    }
    renderContent() {
        switch (this.state.activeTab) {
            case "postponeInstallment":
                return <Can I={'pushInstallment'} a={'application'}><PostponeInstallments application={this.props.application} test={this.props.test} /></Can>
                case "postponeHalfInstallment":
                return <Can I={'pushInstallment'} a={'application'}><PostponeHalfInstallment application={this.props.application} test={this.props.test} /></Can>
            case "traditionalRescheduling":
                return <Can I={'traditionRescheduling'} a={'application'}><TraditionalLoanRescheduling application={this.props.application} test={this.props.test} /></Can>
            case "freeRescheduling":
                return <Can I={'freeRescheduling'} a={'application'}><FreeRescheduling application={this.props.application} test={this.props.test} /></Can>
            default:
                return null
        }
    }
    render() {
        return (
            <>
                 <CardNavBar
                                header={'here'}
                                array={this.state.tabsArray}
                                active={this.state.activeTab}
                                selectTab={(index: string) => this.setState({ activeTab: index })}
                            />
                            <div style={{ padding: 20, marginTop: 15 }}>
                                {this.renderContent()}
                            </div>
            </>
        )
    }
}
export default Rescheduling;