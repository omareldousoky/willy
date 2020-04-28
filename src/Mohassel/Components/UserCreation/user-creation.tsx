import React, { Component } from 'react'
import { UserDataForm } from './userDataFrom';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import {
    step1,
    userCreationValidationStepOne,
} from './userFromInitialState';
import { Values } from './userCreationinterfaces';
import UserRolesAndPermisonsFrom from './userRolesAndPermisonsFrom';
interface Props {
    edit: boolean;
}
interface State {
step: number;
step1: Values;
userId: string;
}
class UserCreation extends Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step:1,
            step1,
            userId: '',
        }
    }
    componentDidUpdate(prevProps: Props, _prevState: State ){
        if(prevProps.edit !==this.props.edit){
            this.setState({
                step:1,
                userId: '',
                step1, 
            })
        }
    }
    submit = (values: object) => {
    if(this.state.step <2) {
        this.setState({
            step: this.state.step+1,
        })
    }  
    else {
        console.log('Waiting Backend')
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
                        <UserDataForm {...formikProps} />
            }
        </Formik>
        )
    }
    renderStepTwo(): any {
        return(
            <UserRolesAndPermisonsFrom/>
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
