import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { Formula, loanFormula, loanFormulaCreationValidation } from './loanCreationInitialStates';
import { LoanFormulaCreationForm } from './loanFormulaCreationForm';
import { createFormula } from '../../Services/APIs/LoanFormula/createFromula';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import BackButton from '../BackButton/back-button';
import Card from 'react-bootstrap/Card';
interface Props {
    title: string;
    history: Array<string>;
};
interface State {
    formula: Formula;
    loading: boolean;
}

class FormulaCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: loanFormula,
            loading: false
        }
    }
    submit = async (values: Formula) => {
        this.setState({ loading: true });
        const toSend = {
            name: values.loanCalculationFormulaName,
            interestType: values.interestType,
            installmentType: values.installmentType,
            gracePeriodFees: values.gracePeriodFees,
            // rounding: values.rounding,
            roundDirection: values.roundDirection,
            roundTo: Number(values.roundTo),
            roundWhat: (values.rounding === false) ? 'noRounding' : values.roundWhat,
            equalInstallments: values.equalInstallments,
            roundLastInstallment: values.roundLastInstallment
        }
        const res = await createFormula(toSend);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.formulaCreated).then(() => { this.props.history.push("/manage-loans/calculation-formulas") })
        } else {
            Swal.fire("error", local.formulaCreationError, 'error')
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <>
                <BackButton title={local.createCalculationMethod} />
                <Container>
                    <Loader open={this.state.loading} type="fullscreen" />
                    <Card style={{ padding: 20 }}>
                        <Formik
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
                    </Card>
                </Container>
            </>
        )
    }
}
export default withRouter(FormulaCreation);
