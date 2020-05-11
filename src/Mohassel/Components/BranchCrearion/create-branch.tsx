import React, { Component } from 'react'
import { Formik } from 'formik'
import { BasicValues, step1, Branch } from './branchCreationInterfaces';
import StepOneForm from './stepOneForm';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import BackButton from '../BackButton/back-button';
import * as local from '../../../Shared/Assets/ar.json'
import { createBranch } from '../../Services/APIs/Branch/createBranch';
import Swal from 'sweetalert2';
interface State {
    step: number;
    step1: BasicValues;
    loading: boolean;
}
interface Props {
 history: any;
}
 class CreateBranch extends Component <Props,State> {
   constructor(props){
       super(props);
       this.state = {
           step:1,
           step1,
           loading: false,
       }
   }

    submit= (values) =>{
       if(this.state.step ===1){
           this.createbranch(this.state.step1)
       }
    }
    cancel(){
        this.setState({
            step:1,
            step1,
        });
        this.props.history.goBack();

    }
    prepareBranch = (values: BasicValues) => {
            const branch: Branch = {
                longitude: values.branchAddressLatLong?.lng,
                latitude: values.branchAddressLatLong?.lat,
                name: values.name,
                governorate: values.governorate,
                status: values.status,
                phoneNumber: values.phoneNumber,
                faxNumber: values.faxNumber,
                address: values.address,
                postalCode: values.postalCode,
            }
            return branch;
    }
    async createbranch(values) {
        const branch = this.prepareBranch(values);
        this.setState({loading:true});
         const res = await createBranch(branch);
         if(res.status === 'success'){
             this.setState({loading: false})
             Swal.fire('success',local.branchCreated)
         } else {
             Swal.fire("error",local.branchCreationError);
             this.setState({loading:false});
         }
    }

    render() {
        return (
            <div>
                <BackButton title={local.newBranch}/>
                <Container>
                <Card>
                    <Card.Body>
                <Formik 
                 enableReinitialize
                 initialValues={this.state.step1}
                 onSubmit={this.submit}
                 validateOnChange
                >
                    {(formikProps)=>
                        <StepOneForm  {...formikProps} cancel ={()=>this.cancel()}/>
                    }
                </Formik>
                </Card.Body>
                </Card>
             </Container>
            </div>
        )
    }
}

export default withRouter(CreateBranch);
