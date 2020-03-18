import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { loanFormulaTest, loanFormulaTestValidation } from './loanCreationInitialStates';
import { LoanFormulaTestForm } from './loanFormulaTestForm';
interface Props { };
interface State {
    formula: any,
}

class FormulaTest extends Component<Props, State>{
    constructor(props: any) {
        super(props);
        this.state = {
            formula: loanFormulaTest
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
                    initialValues={this.state.formula}
                    onSubmit={this.submit}
                    validationSchema={loanFormulaTestValidation}
                    validateOnBlur
                    validateOnChange
                >
                    {(formikProps) =>
                        <LoanFormulaTestForm {...formikProps} />
                    }
                </Formik>
            </Container>
        )
    }
}
export default FormulaTest;