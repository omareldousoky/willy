import React, { Component } from 'react'
import { UserDataForm } from './userDataFrom';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Wizard from '../wizard/Wizard';
import { Loader } from '../../../Shared/Components/Loader';
import {
    step1,
    step2,
    userCreationValidationStepOne,
    userCreationValidationStepTwo,
} from './userFromInitialState';
import {
        Values, 
        User,
        RolesBranchesValues,
        UserInfo,
    } from './userCreationinterfaces';
import UserRolesAndPermisonsFrom from './userRolesAndPermisonsFrom';
import './userCreation.scss';
import {getUserRolesAndBranches} from '../../Services/APIs/User-Creation/getUserRolesAndBranches'
import {createUser} from '../../Services/APIs/User-Creation/createUser';
interface Props {
    edit: boolean;
    history: Array<string>;
}
interface State {
step: number;
step1: Values;
loading: boolean;
step2: RolesBranchesValues;
branchesLabeled: Array<object>;
rolesLabeled: Array<object>;
}
class UserCreation extends Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step:1,
            loading:false,
            step1:step1,
            step2:step2,
            branchesLabeled:[],
            rolesLabeled: [],
        }
    }
  async  componentDidMount(){
      this.setState({loading:true})
    const RolesAndBranches=  await getUserRolesAndBranches();
    const labeldRoles: Array<object>=[];
    const labeldBranches: Array<object>=[];
    if(RolesAndBranches[0].status = 'success'){
         RolesAndBranches[0].body.roles.forEach(role=>{
                  labeldRoles.push({
                      label: role.roleName ,
                      hasBranch: role.hasBranch,
                      value: role._id ,
                  })  
         })
         this.setState({
             loading:false,
              rolesLabeled: labeldRoles,
         })
    } else {
        Swal.fire('', local.searchError, 'error');
        this.setState({
            loading:false,
        })
    }
    if(RolesAndBranches[1].status = 'success'){
        RolesAndBranches[1].body.data.data.forEach(branch => {
            labeldBranches.push({ value: branch._id, label: branch.name })
        })
        this.setState({
            branchesLabeled: labeldBranches,
        })
    } else {
        Swal.fire('', local.searchError, 'error');
    }

    }
    componentDidUpdate(prevProps: Props, _prevState: State ){
        if(prevProps.edit !==this.props.edit){
            this.setState({
                step:1,
                step1, 
                step2,
            })
        }
    }
 
    cancel(): void {
        this.setState({
            step:1,
            step1, 
            step2,
        })
        this.props.history.push("/");
    }
    previousStep(values, step: number): void {
        this.setState({
          step: step - 1,
          [`step${step}`]: values,
        } as State);
      }
  async createUser(userObj: User){
        const user ={...userObj.userInfo,
            branches:userObj.branches,roles:userObj.roles
        };
        user.birthDate = new Date(user.birthDate).valueOf();
        user.hiringDate = new Date(user.hiringDate).valueOf();
        user.nationalIdIssueDate = new Date(user.nationalIdIssueDate).valueOf();
       const res=  await createUser (user);
       if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("success",local.userCreated ).then(()=>{
            this.props.history.push("/");
        });
      } else {
        Swal.fire("error",local.userCreationError)
        this.setState({ loading: false });
      }
    }
    submit = (values: object) => {
    if(this.state.step <2) {
        this.setState({
            [`step${this.state.step}`]: values, 
            step: this.state.step+1,
        }as any)
    }  
    else {
       this.setState({step2: values} as any)
       const labeledBranches = this.state.step2.branches;
       const labeledRoles = this.state.step2.roles;
       const branches: string[]|undefined = labeledBranches?.map(
           (branch)=>{
                return branch.value;
           }
       );

       const roles: string[] = labeledRoles.map(
           (role) => {
               return role.value;
           }
       );
       const userObj: User =  {
           userInfo:this.getUserInfo(),
           roles,
           branches,
       }
       this.createUser(userObj);
     } 
    }
     getUserInfo(): UserInfo{
         const user = this.state.step1;
         return  {
            name: user.name,
            username: user.username,
            nationalId: user.nationalId,
            gender: user.gender,
            birthDate: user.birthDate,
            nationalIdIssueDate: user.nationalIdIssueDate,
            hrCode: user.hrCode,
            mobilePhoneNumber: user.mobilePhoneNumber,
            hiringDate: user.hiringDate,
            password: user.password,
            faxNumber: "",
            emailAddress: "",

         }
     }
    renderStepOne(): any{
     return(
       <Formik
        enableReinitialize
        initialValues={this.state.step1}
        onSubmit={this.submit}
        validationSchema = {userCreationValidationStepOne}
        validateOnBlur
        validateOnChange
        >
             {(formikProps) =>
                        <UserDataForm {...formikProps} cancle={()=>this.cancel()} />
            }
        </Formik>
        )
    }
    renderStepTwo(): any {
        return(
            <Formik
            enableReinitialize
            initialValues={this.state.step2}
            onSubmit={this.submit}
            validationSchema={userCreationValidationStepTwo}
            validateOnBlur
            validateOnChange
            >
            {(formikProps) =>
            <UserRolesAndPermisonsFrom 
            {...formikProps} 
          userRolesOptions ={this.state.rolesLabeled}
          userBranchesOptions={this.state.branchesLabeled}
            previousStep={(valuesOfStep2)=> this.previousStep(valuesOfStep2,2)}
            />
    }
            </Formik>
        );
    }
    renderSteps(){
        switch(this.state.step) {
            case 1:
                return this.renderStepOne();
            case 2: 
                return this.renderStepTwo();    
            default: return null;    
        }
    }
    render() {
        return (
            <>
           <Loader type="fullscreen" open={this.state.loading} />
            <div style={{display:"flex",flexDirection:"row"}} >
                <div className="stepper-container-vertical">
                    <Wizard 
                    direction ="vertical"
                    currentStepNumber = {this.state.step-1}
                    stepColor="#7dc356"
                    steps = {[local.userBasicData,local.userRoles]}
                    />
                </div>
                
                
               {this.renderSteps()}
            </div>
            </>
        );
    }
}

export default withRouter(UserCreation);
