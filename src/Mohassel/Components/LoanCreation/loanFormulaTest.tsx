import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { loanFormulaTest, loanFormulaTestValidation } from './loanCreationInitialStates';
import { LoanFormulaTestForm } from './loanFormulaTestForm';
interface Props { 
    title: string;
};
interface State {
    formula: any;
}

class FormulaTest extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: loanFormulaTest
        }
    }
    submit= (values: object): void => {
        const obj = values
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