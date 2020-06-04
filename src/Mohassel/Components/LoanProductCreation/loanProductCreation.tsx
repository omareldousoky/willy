import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { LoanProductValidation } from './loanProductStates';
import { LoanProductCreationForm } from './loanProductCreationForm';
import { createProduct } from '../../Services/APIs/loanProduct/createProduct';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
    title: string;
    history: Array<string>;

};
interface State {
    product: object;
    loading: boolean;
    formulas: Array<object>;
}

class LoanProductCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            product: {
                productName: '',
                beneficiaryType: 'individual',
                calculationFormulaId: '',
                loanNature: 'cash',
                currency: 'egp',
                periodLength: 1,
                periodType: 'days',
                noOfInstallments: 1,
                lateDays: 0,
                gracePeriod: 0,
                interest: 0,
                interestPeriod: 'yearly',
                allowInterestAdjustment: false,
                inAdvanceFees: 0,
                inAdvanceFrom: 'principal',
                inAdvanceType: 'uncut',
                stamps: 0,
                allowStampsAdjustment: true,
                representativeFees: 0,
                allowRepresentativeFeesAdjustment: true,
                adminFees: 0,
                allowAdminFeesAdjustment: true,
                earlyPaymentFees: 0,
                maxNoOfRestructuring: 0,
                minPrincipal: 0,
                maxPrincipal: 0,
                minInstallment: 0,
                maxInstallment: 0,
                applicationFee: 0,
                allowApplicationFeeAdjustment: false,
                spreadApplicationFee: false,
                individualApplicationFee: 0,
                applicationFeePercent: 0,
                applicationFeeType: 'principal',
                applicationFeePercentPerPerson: 0,
                applicationFeePercentPerPersonType: 'principal',
                loanImpactPrincipal: true,
                mustEnterGuarantor: true,
                noOfGuarantors:2,
                guarantorGuaranteesMultiple: true,
                deductionFee: 0,
                allocatedDebtForGoodLoans: 0,
                aging: [{ from: 0, to: 1, fee: 0 }, { from: 0, to: 1, fee: 0 }, { from: 0, to: 1, fee: 0 }, { from: 0, to: 1, fee: 0 }, { from: 0, to: 1, fee: 0 }, { from: 0, to: 1, fee: 0 }, { from: 0, to: 1, fee: 0 }],
                mergeUndoubtedLoans: false,
                mergeUndoubtedLoansFees: 0,
                mergeDoubtedLoans: false,
                mergeDoubtedLoansFees: 0,
                pushPayment: 0,
                pushDays: [0, 0, 0, 0, 0, 0, 0],
                pushHolidays: 'previous',
                enabled: true,
                viceFieldManagerAndDate: true,
                reviewerChiefAndDate: true,
                branchManagerAndDate: true,
            },
            loading: false,
            formulas: []
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
    submit = async (values: any) => {
        this.setState({ loading: true });
        const obj = {...values}
        if(obj.mustEnterGuarantor === false){
            obj.noOfGuarantors = 0;
        }
        const res = await createProduct(obj);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.loanProductCreated).then(() => { this.props.history.push("/") })
        } else {
            Swal.fire("error", local.loanProductCreationError, 'error')
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <Container>
                <Loader open={this.state.loading} type="fullscreen" />
                <Formik
                    initialValues={this.state.product}
                    onSubmit={this.submit}
                    validationSchema={LoanProductValidation}
                    validateOnBlur
                    validateOnChange
                >
                    {(formikProps) =>
                        <LoanProductCreationForm {...formikProps} formulas={this.state.formulas} />
                    }
                </Formik>
            </Container>
        )
    }
}
export default withRouter(LoanProductCreation);