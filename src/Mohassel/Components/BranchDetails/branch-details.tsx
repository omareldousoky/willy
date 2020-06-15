import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { connect } from 'react-redux';
import * as local from '../../../Shared/Assets/ar.json'
import BranchDetailsView from './branchDetailsView';
import BackButton from '../BackButton/back-button';
import {getBranchById} from '../../redux/branch/actions';
import { BranchBasicsView } from './branchDetailsInterfaces';
import UsersList from '../ManageAccounts/usersList';
import CustomersList from '../CustomerCreation/customersList';
import TrackLoanApplications from '../TrackLoanApplications/trackLoanApplications';
import LoanList from '../LoanList/loanList';
interface Props {
    history: any;
    getBranchById: typeof getBranchById;
    step: number;
    branch: any;
}

const tabs = [
    {
        eventKey: 1,
        title: local.basicInfo,
    },
    {
        eventKey: 2,
        title: local.users,
    },
    {
        eventKey: 3,
        title: local.lonasTypes,
    },
    {
        eventKey:4,
        title: local.customers,
    },
    {
        eventKey: 5,
        title:local.loanApplications,
    },
    {
        eventKey: 6,
        title: local.issuedLoans, 
    }

]

interface State {
    step: number;
    data: BranchBasicsView;
    _id: string;
}

 class BranchDetails extends Component<Props ,State> {

    constructor (props: Props) {
        super(props);
        this.state = {
            step: 1,
            _id: '',
            data: {
                _id: '',
                created: {at: 0, by: ''},
                updated: {at:  0, by: ''},
                name:'',
                address:'',
                longitude:0,
                latitude:0,
                phoneNumber:'',
                faxNumber:'',
                branchCode:0,
                governorate:'',
                status:'',
            },
        }
    }

    async getBranch() {
        const _id = this.props.history.location.state.details;
        await this.props.getBranchById(_id);
        if(this.props.branch.status === "success") {
            this.setState({
                data: this.props.branch.body.data,
                _id,
            })
        }
    }

    componentDidMount() {
        this.getBranch();
    }
    renderTabs() {
        switch(this.state.step){
            case 1:
                return(<BranchDetailsView data = {this.state.data} />);
             case 2: return ( <UsersList {...{branchId: this.state._id , withHeader: false} }
                 />)
             case 4:   return (<CustomersList {...{branchId: this.state._id}} />)
             case 5: return (<TrackLoanApplications {...{branchId: this.state._id}} />)
             case 6: return (<LoanList {...{branchId: this.state._id}}/>)
             default: return null;   
        }
    }
    renderEditIcon() {
        const _id = this.props.history.location.state.details;
        return(
            <div className={'rowContainer'}>
            <span className={'fa icon'}>
            <div
                className={'iconConatiner fa icon'}
                onClick={() => { this.props.history.push({pathname:"/manage-accounts/branches/edit-branch",state: { details: _id }}) }}
            >
                <img className={'iconImage'} alt={"edit"} src={require('../../Assets/editIcon.svg')} />
                {local.edit}</div>
             </span>
        </div>
        );
    }
    render() {
        return (
            <>
            <div className={'rowContainer'}>
                <BackButton title={local.branchDetails} />
                {this.renderEditIcon()}
            </div>
            <Card  className={'card'}>
            <Tabs activeKey={this.state.step}  id="branch-tabs-details" style={{ margin: 0 }} onSelect={(key: string) => this.setState({ step: Number(key) })} >
                 {
                     tabs.map((tab , index) =>  {
                         return(
                            <Tab  tabClassName={'tab'} key ={index} eventKey = {tab.eventKey
                            } title = {tab.title}> </Tab>
                         );
                         
                     } )
                 }
            </Tabs>
            <Card.Body>
                {this.renderTabs()}
            </Card.Body>
            </Card>
            </>
        )
    }
}
const addGetBranchToProps = dispatch =>{
    return {
        getBranchById:  (_id) => dispatch(getBranchById(_id)),
    };
}
const mapStateToProps = (state) => {
    return {
       branch : state.branch,
       loading: state.loading,
   
    }
   }
   
export default  connect(mapStateToProps, addGetBranchToProps) (withRouter(BranchDetails));
