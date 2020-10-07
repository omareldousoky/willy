import React, { Component } from 'react';
import * as local from '../../../Shared/Assets/ar.json';
import { timeToDateyyymmdd } from '../../Services/utils';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import Can from '../../config/Can';
import ActionLogs from './actionLogs';
import TransactionLogs from './transactionLogs';

interface Props {
    id: string;
}
interface State {
    id: string;
    activeTab: string;
    tabsArray: Array<Tab>;
}
class Logs extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            id: '',
            activeTab: 'actionLogs',
            tabsArray: [{
                header: local.actionLogs,
                stringKey: 'actionLogs',
                permission: 'viewActionLogs',
                permissionKey: 'user'
            },{
                header: local.transactionLogs,
                stringKey: 'transactionLogs',
                permission: 'viewActionLogs',
                permissionKey: 'user'
            }]
        }
    }
    handleOptionChange = (changeEvent) => {
        this.setState({
            activeTab: changeEvent.target.value
        });
    }
    renderContent() {
        switch (this.state.activeTab) {
            case "actionLogs":
                return <Can I={'viewActionLogs'} a={'user'}><ActionLogs id={this.props.id} /></Can>
            case "transactionLogs":
                return <Can I={'viewActionLogs'} a={'user'}><TransactionLogs id={this.props.id} /></Can>
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
export default Logs;