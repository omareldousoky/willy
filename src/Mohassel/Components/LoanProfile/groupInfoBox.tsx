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

};
interface Member {
    customer: Customer;
    type: string;
}
interface State {
    loading: boolean;
    tabsArray: Array<Tab>;
    activeTab: string;
    activeCustomer: Member;
    group: Array<Member>;
}
class GroupInfoBox extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            tabsArray: [],
            activeTab: '0',
            activeCustomer: {
                customer: {},
                type: '' 
            },
            group: []
        }
    }
    componentDidMount(){
        const group: Member[] = [];
        this.props.group.individualsInGroup.forEach(member => group.push({ customer: member.customer, type: member.type}))
        const tabsArray: Tab[] = [];
        group.forEach((member,i)  => tabsArray.push({
            header: member.customer.customerName,
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
                    <InfoBox noHeader values={this.state.activeCustomer.customer} getIscore={(data)=> this.props.getIscore && this.props.getIscore(data)} leader={(this.state.activeCustomer.type === 'leader') ? true : false } />
                </div>
            </div>
        )
    }
}
export default GroupInfoBox