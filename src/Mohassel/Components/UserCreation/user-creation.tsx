import React, { Component } from 'react'
import { UserDataForm } from './userDataFrom';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
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
    } from './userCreationinterfaces';
import UserRolesAndPermisonsFrom from './userRolesAndPermisonsFrom';
interface Props {
    edit: boolean;
    history: Array<string>;
}
interface State {
step: number;
step1: Values;
step2: RolesBranchesValues;
}
class UserCreation extends Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step:2,
            step1:step1,
            step2:step2,
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
        const user ={...userObj.userInfo, branches:userObj.branches,roles:userObj.roles};
        user.hiringDate = new Date(user.hiringDate).valueOf();
        console.log('created user : ',user);
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
       const labeledBranches = this.state.step2.userBranches;
       const labeledRoles = this.state.step2.userRoles;
       const branches: string[]|undefined = labeledBranches?.map(
           (branch)=>{
                return branch.value;
           }
       );
       console.log("branches : ",branches);
       const roles: string[] = labeledRoles.map(
           (role) => {
               return role.value;
           }
       );
       const userObj: User =  {
           userInfo: {...this.state.step1},
           roles,
           branches,
       }
       console.log("userObj",userObj);
       this.createUser(userObj);
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
            <div>
                {this.props.edit ? 'Edit User' : 'Create User'}
               {this.renderSteps()}

            </div>
        );
    }
}

export default withRouter(UserCreation);
