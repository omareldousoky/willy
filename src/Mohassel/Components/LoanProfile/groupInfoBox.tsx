import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import * as local from '../../../Shared/Assets/ar.json';
import { getRenderDate } from '../../Services/getRenderDate';
import Row from 'react-bootstrap/Row';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import { Customer } from '../LoanApplication/loanApplicationCreation';
import InfoBox from '../userInfoBox';

interface Props {
    group: any;
    getIscore?: Function;
    iScores?: any;
};

interface State {
    loading: boolean;
    tabsArray: Array<Tab>;
    activeTab: string;
    activeCustomer: Customer;
    group: Array<Customer>;
}
class GroupInfoBox extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            tabsArray: [],
            activeTab: '0',
            activeCustomer: {},
            group: []
        }
    }
    componentDidMount(){
        const group: Customer[] = [];
        this.props.group.individualsInGroup.forEach(member => group.push(member.customer))
        const tabsArray: Tab[] = [];
        group.forEach((member,i)  => tabsArray.push({
            header: member.customerName,
            stringKey: i.toString()
        }))
        this.setState({
            tabsArray,
            group,
            activeCustomer: group[0]
        })
    }
    render() {

        return (
            <div style={{ textAlign: 'right', backgroundColor: '#f7fff2', padding: 15, border: '1px solid #e5e5e5', width: '100%' }}>
                <h5>{local.mainGroupInfo}</h5>
                <CardNavBar
                    header={'here'}
                    array={this.state.tabsArray}
                    active={this.state.activeTab}
                    selectTab={(index: number) => this.setState({ activeCustomer: this.state.group[index], activeTab: index.toString() })}
                />
                <div style={{ padding: 20 }}>
                    <InfoBox noHeader values={this.state.activeCustomer} getIscore={(data)=> this.props.getIscore && this.props.getIscore(data)} iScores={this.props.iScores}/>
                </div>
            </div>
        )
    }
}
export default GroupInfoBox