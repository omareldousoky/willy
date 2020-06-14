import React, { Component } from 'react'
import { Formik } from 'formik'
import { BasicValues } from './branchCreationInterfaces';
import StepOneForm from './stepOneForm';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import {step1,branchCreationValidationStepOne} from './branchCreationInitialState';
import { Loader } from '../../../Shared/Components/Loader';
import BackButton from '../BackButton/back-button';
import * as local from '../../../Shared/Assets/ar.json'
import { connect } from 'react-redux';
import {createNewBranch, editBranchById , getBranchById} from '../../redux/branch/actions';
import Swal from 'sweetalert2';
import { Branch } from '../../Services/interfaces';
interface State {
    step: number;
    step1: BasicValues;
}
interface Props {
 history: any;
 loading: boolean;
 createNewBranch: typeof createNewBranch;
 getBranchById: typeof getBranchById;
 editBranchById: typeof editBranchById;
 branch: any;
 edit: boolean;
}
 class CreateBranch extends Component <Props,State> {
   constructor(props){
       super(props);
       this.state = {
           step:1,
           step1,
       }
   }

  async componentDidMount() {
       if(this.props.edit) {
             this.getBranch();
       }
   }

    submit= (values) =>{
        this.setState({
            step1:values
        })
       if(this.props.edit) {
          this.editBranch(this.state.step1)

       } else {
        
        this.createBranch(this.state.step1)
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
                licenseNumber: values.licenseNumber,
                licenseDate: values.licenseDate,
                postalCode: values.postalCode,
            }
            return branch;
    }
   async  createBranch (values) {
        const branch = this.prepareBranch(values);
       await this.props.createNewBranch(branch)
        if(this.props.branch.status==="success") {
           Swal.fire('success',local.branchCreated).then(()=>
                 this.props.history.goBack());
        } else {
            
            Swal.fire("error",local.branchCreationError);
        }
    }
    async editBranch (values) {
         const _id = this.props.history.location.state.details;
        const branch = this.prepareBranch(values);
        await this.props.editBranchById(values,_id);
        if(this.props.branch.status === "success") {
            Swal.fire('success', local.branchUpdated);
            this.props.history.goBack();
        } else {
            Swal.fire("error", local.branchUpdateError);
        }
    }
    async getBranch(){
        const _id = this.props.history.location.state.details;
        await this.props.getBranchById(_id);
        if(this.props.branch.status === "success") {
            this.setState({
                step1: this.props.branch.body.data,
            })
        }

    }

    render() {
        return (
            <div>
                <Loader type ="fullscreen" open={this.props.loading}/>
                <BackButton title={this.props.edit ? local.editBranch : local.newBranch}/>
                <Container>
                <Card>
                    <Card.Body>
                <Formik 
                 enableReinitialize
                 initialValues={this.state.step1}
                 validationSchema={branchCreationValidationStepOne}
                 onSubmit={this.submit}
                 validateOnChange
                 validateOnBlur
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

const addCreateBranchToProps = dispatch =>{
    return {
        createNewBranch: branch => dispatch(createNewBranch(branch)),
        getBranchById:  (_id) => dispatch(getBranchById(_id)),
        editBranchById: (branch ,_id) => dispatch(editBranchById(branch, _id)),
    };
}
const mapStateToProps = (state) => {
 return {
    branch : state.branch,
    loading: state.loading,

 }
}

export default connect(mapStateToProps, addCreateBranchToProps) (withRouter(CreateBranch));
