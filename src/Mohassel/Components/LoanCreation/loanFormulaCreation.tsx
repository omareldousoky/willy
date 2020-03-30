import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { Formula, loanFormula, loanFormulaCreationValidation } from './loanCreationInitialStates';
import { LoanFormulaCreationForm } from './loanFormulaCreationForm';
import { createFormula } from '../../Services/APIs/LoanFormula/createFromula';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import * as local from '../../../Shared/Assets/ar.json';
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
    submit = async(values: Formula) => {
        this.setState({ loading: true });
        const obj = values
        const toSend = {
            name: values.loanCalculationFormulaName,
            interestType: values.interestType,
            installmentType: values.installmentType,
            gracePeriodFees: values.gracePeriodFees,
            // rounding: values.rounding,
            roundDirection: values.roundDirection,
            roundTo: Number(values.roundTo),
            roundWhat: (values.rounding === false) ? 'noRounding' : values.roundWhat,
            equalInstallments: values.equalInstallments
        }
        const res = await createFormula(toSend);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.formulaCreated).then(() => { this.props.history.push("/") })
        } else {
            Swal.fire("error", local.formulaCreationError)
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <div>
                {this.state.loading ? <Spinner animation="border" className="central-loader-fullscreen" /> :
                    <Container>
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
                    </Container>
                }
            </div>
        )
    }
}
export default withRouter(FormulaCreation);
