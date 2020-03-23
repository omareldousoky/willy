import React, { Component, useState } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { FormulaTestClass, loanFormulaTest, loanFormulaTestValidation } from './loanCreationInitialStates';
import { LoanFormulaTestForm } from './loanFormulaTestForm';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { testFormula } from '../../Services/APIs/LoanFormula/testFormula';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import * as local from '../../../Shared/Assets/ar.json';
interface Props {
    title: string;
};
interface State {
    formula: FormulaTestClass;
    loading: boolean;
    formulas: Array<object>;
}

class FormulaTest extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: loanFormulaTest,
            loading: false,
            formulas: []
        }
    }
    async UNSAFE_componentWillMount() {
        const formulas = await getFormulas();
        if(formulas.status === 'success'){
            this.setState({
                formulas: formulas.body.data
            })
        } else {
            console.log('err')
        }
    }
     submit = async(values: FormulaTestClass) => {
        this.setState({ loading: true });
        const obj = values;
        const date = new Date(obj.loanStartDate).valueOf();
        obj.loanStartDate = date;
        const res = await testFormula(obj);
        console.log(res)
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.formulaCreated).then(() => { console.log(res) })
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
                            enableReinitialize
                            initialValues={this.state.formula}
                            onSubmit={this.submit}
                            validationSchema={loanFormulaTestValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <LoanFormulaTestForm {...formikProps} formulas={this.state.formulas} />
                            }
                        </Formik>
                    </Container>
                }
            </div>
        )
    }
}
export default FormulaTest;