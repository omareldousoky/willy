import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { LoanProduct,LoanProductValidation } from './loanProductStates';
import { LoanProductCreationForm } from './loanProductCreationForm';
interface Props { };
interface State {
    product: object
}

class LoanProductCreation extends Component<Props, State>{
    constructor(props: any) {
        super(props);
        this.state = {
            product:LoanProduct
        }
    }
    submit= (values: object): void => {
        let obj = values
        console.log('Hereeee',obj)
    }
    render() {
        return (
            <Container>
                <Formik
                    enableReinitialize
                    initialValues={this.state.product}
                    onSubmit={this.submit}
                    validationSchema={LoanProductValidation}
                    validateOnBlur
                    validateOnChange
                >
                    {(formikProps) =>
                        <LoanProductCreationForm {...formikProps} />
                    }
                </Formik>
            </Container>
        )
    }
}
export default LoanProductCreation;