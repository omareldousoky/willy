import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { loanFormula, loanFormulaCreationValidation } from './loanCreationInitialStates';
import { LoanFormulaCreationForm } from './loanFormulaCreationForm';
interface Props {
    title: string;
 };
interface State {
    formula: {};
}

class FormulaCreation extends Component<Props, State>{
    constructor(props: any) {
        super(props);
        this.state = {
            formula: loanFormula
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
                    validationSchema={loanFormulaCreationValidation}
                    validateOnBlur
                    validateOnChange
                >
                    {(formikProps) =>
                        <LoanFormulaCreationForm {...formikProps} />
                    }
                </Formik>
            </Container>
        )
    }
}
export default FormulaCreation;
