import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import { connect } from 'react-redux';
import * as local from '../../../Shared/Assets/ar.json'
import BranchDetailsView from './branchDetailsView';
import BackButton from '../BackButton/back-button';
import {getBranchById} from '../../../Shared/redux/branch/actions';
import { BranchBasicsView } from './branchDetailsInterfaces';
import UsersList from '../ManageAccounts/usersList';
import CustomersList from '../CustomerCreation/customersList';
import TrackLoanApplications from '../TrackLoanApplications/trackLoanApplications';
import LoanList from '../LoanList/loanList';
import { getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import ability from '../../config/ability';
import Managers from '../managerHierarchy/managers';
import { timeToArabicDate } from '../../../Shared/Services/utils';
import SupervisionLevels from '../managerHierarchy/supervisionLevels';
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
    data: BranchBasicsView;
    _id: string;
    productsLoading: boolean;
    tabsArray: Array<Tab>;
    activeTab: string;
}

 class BranchDetails extends Component<Props ,State> {

    constructor (props: Props) {
        super(props);
        this.state = {
            _id: '',
            activeTab: 'branchDetails',
            tabsArray: [],
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
        const tabsToRender = [{
            header: local.basicInfo,
            stringKey: 'branchDetails',
        },
    ];
    if(ability.can('getUser','user')) {
      tabsToRender.push({
          header: local.users,
          stringKey: 'users',
      })
    }
    if(ability.can('getCustomer','customer')) {
        tabsToRender.push({
            header: local.customers,
            stringKey: 'customers',
        })
    }
    if(ability.can('getLoanApplication','application')) {
        tabsToRender.push({
            header: local.loanApplication,
            stringKey: 'loanApplication',
        })
    }
    if(ability.can('getIssuedLoan','application')) {
        tabsToRender.push({
            header: local.issueLoan,
            stringKey: 'issuedLoan',
        })
    }
    if(ability.can("getBranchHierarchy","branch")) {
        tabsToRender.push({
            header: local.managers,
            stringKey: 'managers'
        })
    }
    if(true){
        tabsToRender.push({
            header: local.levelsOfSupervision,
            stringKey: 'levelsOfSupervision'
        })
    }

      this.setState({
          tabsArray: tabsToRender
      },
      () => this.getBranch())
        
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
        switch(this.state.activeTab){
            case 'branchDetails':
                return(<BranchDetailsView data = {this.state.data} />);
             case 'users': return (<Can I='getUser' a='user'><UsersList {...{branchId: this.state._id , withHeader: false}}/></Can>)
             case 'customers':   return (<Can I='getCustomer' a='customer'><CustomersList {...{branchId: this.state._id}}/></Can>)
             case 'loanApplication': return (<Can I='getLoanApplication' a='application'><TrackLoanApplications {...{branchId: this.state._id}}/></Can>)
             case 'issuedLoan': return (<Can I='getIssuedLoan' a='application'> <LoanList {...{branchId: this.state._id, fromBranch: true}}/></Can>)
             case 'managers' : return (<Can I = "getBranchHierarchy" a="branch"> <Managers 
                 branchId ={this.state._id}
                 branchCode={this.state.data.branchCode} 
                 name ={this.state.data.name}
                 createdAt = { this.state.data.created?.at ? timeToArabicDate(this.state.data.created.at , true) : ''}
                 status ={this.state.data.status}

                 /></Can>)
             case 'levelsOfSupervision'  : return (
                 <SupervisionLevels
                 branchId ={this.state._id}
                 branchCode={this.state.data.branchCode} 
                 name ={this.state.data.name}
                 createdAt = { this.state.data.created?.at ? timeToArabicDate(this.state.data.created.at , true) : ''}
                 status ={this.state.data.status}
                  />
             ) 
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
              <CardNavBar 
              header = {'here'}
              array ={this.state.tabsArray}
              active = {this.state.activeTab}
              selectTab={(index: string) => this.setState({ activeTab: index })}
              />
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
