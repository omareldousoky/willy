import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CustomerBasicsCard from './basicInfoCustomer'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { CreateClearanceForm } from './createClearanceForm';
import { Card } from 'react-bootstrap';
import { Formik } from 'formik';
import { clearanceCreationValidation, clearanceData, ClearanceValues } from './clearanceFormIntialState';
import * as local from '../../../Shared/Assets/ar.json';
import { getCustomersBalances } from '../../Services/APIs/Customer-Creation/customerLoans';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { getApplicationsKeys } from '../../Services/APIs/clearance/getApplicagionsKey';
import { createClearance } from '../../Services/APIs/clearance/createClearance';
import { getClearance } from '../../Services/APIs/clearance/getClearance';
import { updateClearance } from '../../Services/APIs/clearance/updateClearance';
import { Loader } from '../../../Shared/Components/Loader';
interface Props {
    history: any;
    location: {
        state: {
            id: string;
            clearance?: {
                id: string;  
            };
        };
    };
    edit: boolean;
    review: boolean;
}
interface State {
    customer: {
        key: string;
        branchName: string;
        customerName: string;
    };
    loading: boolean;
    step: number;
    step1: ClearanceValues;
    paidLoans: {
        Key: number;
       id: string;
    }[];
}
class CreateClearance extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            customer: {
                key: '',
                branchName: '',
                customerName: '',
            },
            step: 1,
            step1: clearanceData,
            paidLoans:[],
            loading: false,
        }
    }
    
    
    componentDidMount() {
        this.setState({loading: true});
        if(this.props.edit || this.props.review){
            this.getClearanceById();
        }
        else { 
        this.getCustomer(this.props.location.state.id);
        this.getCustomerPaidLoans(this.props.location.state.id);
        }
        this.setState({loading: false});
    }
    async getClearanceById(){
        if(this.props.location.state.clearance?.id ){
        const res = await getClearance(this.props.location.state.clearance?.id);
            if(res.status==='success'){
                this.setState({
                    step1: res.body.data,
                    customer: {
                        key: res.body.data.customerKey,
                        customerName: res.body.data.customerName,
                        branchName: res.body.data.branchName
                    }
                })
                this.getCustomerPaidLoans(res.body.data.customerId);
            }
        }
    }
    async getCustomerPaidLoans(id: string){
        const res=  await getCustomersBalances( {ids: [id]})
        if(res.status==='success'){
            const paidLoansIds: string[] = res.body.data[0].paidLoans;
            if(paidLoansIds){
                const paidLoans = await getApplicationsKeys({ids:paidLoansIds});
                if(paidLoans.status=='success'){
                        this.setState({paidLoans: paidLoans.body.data});
                } else {
                    Swal.fire('Error !', getErrorMessage(paidLoans.error.error),'error');
                }
            }

        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
    }

    async getCustomer(id: string) {
        const res = await getCustomerByID(id);
        if (res.status === 'success') {
            this.setState({
                customer: {
                    key: res.body.key,
                    branchName: res.body.branchName,
                    customerName: res.body.customerName
                }
            })
        }
        else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
    }
    cancel(){
        this.setState({
            step:1,
            step1: clearanceData,
        });
        this.props.history.goBack();

    }
    submit =  async(values) =>{
        if(this.props.edit){

        }
        this.createNewClearance(values);
    }
    prepareClearance = (values: ClearanceValues) => {
        const clearance =  values;
        if (!clearance.customerId) {
            clearance.customerId = this.props.location.state.id;
        }
        if(clearance.transactionKey){
            clearance.transactionKey = Number(clearance.transactionKey);
        }
        clearance.receiptDate = new Date(clearance.receiptDate).valueOf();
        clearance.registrationDate = new Date(clearance.registrationDate).valueOf();
        return clearance;

    }
   async createNewClearance (values) {
       const clearance = this.prepareClearance(values);
       const res = await createClearance(clearance);
       if(res.status==='success'){
           Swal.fire('Success', '' , 'success').then(()=>
           this.props.history.goBack());
       } else {
           Swal.fire('Error !', getErrorMessage(res.error.error),'error');
       }
   }
   async editClearance (values){
       const clearance = this.prepareClearance(values);
       if(this.props.location.state.clearance?.id){
       const res = await updateClearance(this.props.location.state.clearance?.id,clearance);
       if(res.status=='success') {
           Swal.fire('Success','','success');
        }  else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
       }
   }
    render() {
        return (
            <Card>
                <Card.Title>
                    <CustomerBasicsCard
                        customerKey={this.state.customer.key}
                        branchName={this.state.customer.branchName}
                        customerName={this.state.customer.customerName}
                    />
                </Card.Title>
                <Loader  open = {this.state.loading} type={"fullscreen"} />
                {this.state.paidLoans.length >0 ?
                <Card.Body>
                    <Formik
                        enableReinitialize
                        initialValues={this.state.step1}
                        validationSchema={clearanceCreationValidation}
                        onSubmit={this.submit}
                        validateOnChange
                        validateOnBlur
                    >
                        {(formikProps) =>
                            <CreateClearanceForm   {...formikProps} cancel={() => this.cancel()}
                             edit={this.props.edit}
                             review= {this.props.review} 
                             customerKey={this.state.customer.key}
                             paidLoans = {this.state.paidLoans}
                             />
                        }
                    </Formik>
                </Card.Body>
                :  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <img alt='no-data-found' src={require('../../../Shared/Assets/no-results-found.svg')} />
                <h4>{local.noLoansForClearance}</h4>
              </div>
    }
            </Card>
        )
    }
}

export default withRouter(CreateClearance);
