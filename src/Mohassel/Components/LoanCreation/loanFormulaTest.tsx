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
import { View } from '../PDF/documentView';
import { DownloadPdf } from '../PDF/documentExport';

interface Props {
    title: string;
};
interface State {
    formula: FormulaTestClass;
    loading: boolean;
    formulas: Array<Formula>;
    result: object;
}
interface Formula {
    name: string;
    _id: string;
}
class FormulaTest extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: loanFormulaTest,
            loading: false,
            formulas: [],
            result: {}
        }
    }
    async UNSAFE_componentWillMount() {
        const formulas = await getFormulas();
        if (formulas.status === 'success') {
            this.setState({
                formulas: formulas.body.data
            })
        } else {
            console.log('err')
        }
    }
    submit = async (values: FormulaTestClass) => {
        this.setState({ loading: true });
        const obj = values;
        const date = new Date(obj.loanStartDate).valueOf();
        obj.loanStartDate = date;
        const formula = this.state.formulas.find( formula =>formula._id === values.calculationFormulaId)
        const formulaName = (formula)?formula.name:''
        const res = await testFormula(obj);
        if (res.status === 'success') {
            this.setState({ loading: false, result: {result:res.body.data, formulaName:formulaName} });
            Swal.fire("success", local.formulaTested).then(() => { console.log(res) })
        } else {
            Swal.fire("error", local.formulaTestError)
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
                                <LoanFormulaTestForm {...formikProps} formulas={this.state.formulas} result={this.state.result} />
                            }
                        </Formik>
                        {/* {Object.keys(this.state.result).length>0 && <View />} */}
                        {Object.keys(this.state.result).length>0 && <DownloadPdf data={this.state.result} />}
                        {Object.keys(this.state.result).length>0 && <View data={this.state.result} />}
                    </Container>
                }
            </div>
        )
    }
}
export default FormulaTest;