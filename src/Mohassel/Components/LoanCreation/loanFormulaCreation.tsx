import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { Formula, loanFormula, loanFormulaCreationValidation } from './loanCreationInitialStates';
import { LoanFormulaCreationForm } from './loanFormulaCreationForm';
interface Props {
    title: string;
 };
interface State {
    formula: Formula;
}

class FormulaCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: loanFormula
        }
    }
    submit= (values: Formula): void => {
        const obj = values
        const toSend = {
            name: values.loanCalculationFormulaName,
            interestType: values.interestType,
            installmentType: values.installmentType,
            gracePeriodFees: values.gracePeriodFees,
            // rounding: values.rounding,
            roundDirection: values.roundDirection,
            roundTo: Number(values.roundTo),
            roundWhat: (values.rounding === false)?'noRounding':values.roundWhat,
            equalInstallments: values.equalInstallments
        }
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
