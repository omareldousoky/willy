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
import { getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
import { Loader } from '../../../Shared/Components/Loader';
interface Props {
    history: any;
    getBranchById: typeof getBranchById;
    loading: boolean;
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
        eventKey:3,
        title: local.customers,
    },
    {
        eventKey: 4,
        title:local.loanApplications,
    },
    {
        eventKey: 5,
        title: local.issuedLoans, 
    }

]

interface State {
    step: number;
    data: BranchBasicsView;
    _id: string;
    productsLoading: boolean;
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
                products: [],
                licenseDate:0,
                licenseNumber:'',
                bankAccount:'',
                bankAddress:'',
                bankName:'',
                costCenter:'',
            },
            productsLoading: false,
        }
    }

    async getBranch() {
        const _id = this.props.history.location.state.details;
        const products = await this.getProductsByBranch(_id);
        await this.props.getBranchById(_id);
        if(this.props.branch.status === "success") {
            this.setState({
                data: {...this.props.branch.body.data, products},
                _id,
            })
        }
    }

    componentDidMount() {
        this.getBranch();
    }
    async getProductsByBranch(_id: string) {
        this.setState({productsLoading: true})
        const branchsProducts = await getProductsByBranch(_id);
         if (branchsProducts.status === 'success') {

                const products = branchsProducts.body.data.productIds ? branchsProducts.body.data.productIds.map((product => product.productName)) : [];
                this.setState({productsLoading: false});
                return products;
               
        }
         else {
            this.setState({productsLoading: false});
             return [];
         }
       
    }
    renderTabs() {
        switch(this.state.step){
            case 1:
                return(<BranchDetailsView data = {this.state.data} />);
             case 2: return ( <UsersList {...{branchId: this.state._id , withHeader: false} }
                 />)
             case 3:   return (<CustomersList {...{branchId: this.state._id}} />)
             case 4: return (<TrackLoanApplications {...{branchId: this.state._id}} />)
             case 5: return (<LoanList {...{branchId: this.state._id, fromBranch: true}}/>)
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
            <Loader type="fullscreen" open={this.props.loading || this.state.productsLoading}  />
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
