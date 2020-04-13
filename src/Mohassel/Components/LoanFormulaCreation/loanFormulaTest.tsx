import React, { Component, useState } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { FormulaTestClass, loanFormulaTestValidation } from './loanCreationInitialStates';
import { LoanFormulaTestForm } from './loanFormulaTestForm';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { testFormula } from '../../Services/APIs/LoanFormula/testFormula';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
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
const date = new Date();
class FormulaTest extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: {
                calculationFormulaId: '',
                principal: 1,
                pushPayment: 0,
                noOfInstallments: 1,
                gracePeriod: 0,
                periodLength: 1,
                periodType: 'months',
                interest: 0,
                interestPeriod: 'yearly',
                adminFees: 0,
                loanStartDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0],
                pushHolidays: 'next',
                inAdvanceFees: 0,
                inAdvanceFrom: 'principal',
                inAdvanceType: 'cut'
            },
            loading: false,
            formulas: [],
            result: {}
        }
    }
    async UNSAFE_componentWillMount() {
        this.setState({ loading: true });
        const formulas = await getFormulas();
        if (formulas.status === 'success') {
            this.setState({
                formulas: formulas.body.data,
                loading: false
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    submit = async (values: FormulaTestClass) => {
        this.setState({ loading: true });
        const obj = {...values};
        const date = new Date(obj.loanStartDate).valueOf();
        obj.loanStartDate = date;
        const formula = this.state.formulas.find(formula => formula._id === values.calculationFormulaId)
        const formulaName = (formula) ? formula.name : ''
        const res = await testFormula(obj);
        if (res.status === 'success') {
            this.setState({ loading: false, result: { result: res.body.data, formulaName: formulaName } });
            Swal.fire("success", local.formulaTested)
        } else {
            Swal.fire("error", local.formulaTestError, 'error')
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <Container>
                <Loader open={this.state.loading} type="fullscreen" />
                <Formik
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
                {Object.keys(this.state.result).length > 0 && <DownloadPdf data={this.state.result} />}
                {Object.keys(this.state.result).length > 0 && <View data={this.state.result} />}
            </Container>
        )
    }
}
export default FormulaTest;