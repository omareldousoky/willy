import React, { Component } from 'react'
import { UserDataForm } from './userDataFrom';
import { Formik } from 'formik';
import {
    step1,
    userCreationValidationStepOne,
} from './userFromInitialState';
import { Values } from './userCreationinterfaces';
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
                [`step${this.state.step}`]: values,
                step: this.state.step + 1,
            } as any);
        } else {
            console.log('Waiting for APIs');
        }
    }
    renderStepOne(): JSX.Element {
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
    renderSteps(){
        switch(this.state.step) {
            case 1:
                return this.renderStepOne();
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

export default UserCreation
