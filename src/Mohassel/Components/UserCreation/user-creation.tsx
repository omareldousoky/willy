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
import { Values , RolesValues} from './userCreationinterfaces';
import UserRolesAndPermisonsFrom from './userRolesAndPermisonsFrom';
interface Props {
    edit: boolean;
}
interface State {
step: number;
step1: Values;
step2: RolesValues;
}
class UserCreation extends Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step:1,
            step1,
            step2,
        }
    }
    componentDidUpdate(prevProps: Props, _prevState: State ){
        if(prevProps.edit !==this.props.edit){
            this.setState({
                step:1,
                step1, 
            })
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
            <Formik
            enableReinitialize
            initialValues={this.state.step2}
            onSubmit={this.submit}
            validationSchema={userCreationValidationStepTwo}
            validateOnBlur
            validateOnChange
            >
            {(formikProps) =>
            <UserRolesAndPermisonsFrom {...formikProps}/>
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
