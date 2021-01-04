import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import { getFormula } from '../../Services/APIs/LoanFormula/getFormula';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Table from 'react-bootstrap/Table';
import BackButton from '../BackButton/back-button';
import { interestType, installmentType, roundDirection, roundWhat, getErrorMessage } from "../../../Shared/Services/utils";

interface State {
    formula: any;
    loading: boolean;
}

interface Props {
    history: any;
    location: any;
}

class FormulaView extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            formula: {},
            loading: false,
        };
    }
    componentDidMount() {
        const id = this.props.history.location.state.id;
        this.getFomula(id)
    }
    async getFomula(id: string) {
        this.setState({ loading: true });
        const formula = await getFormula(id);
        if (formula.status === 'success') {
            this.setState({
                formula: formula.body.data,
                loading: false
            })
        } else {
            Swal.fire('error', getErrorMessage(formula.error.error), 'error');
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <>
                <BackButton title={local.calculationFormulaId} />
                <Container>
                    <Loader type="fullscreen" open={this.state.loading} />
                    {Object.keys(this.state.formula).length > 0 && <div>
                        <Table striped bordered style={{ textAlign: 'right' }}>
                            <tbody>
                                <tr>
                                    <td>{local.loanCalculationFormulaName}</td>
                                    <td>{this.state.formula.name}</td>
                                </tr>
                                <tr>
                                    <td>{local.interestType}</td>
                                    <td>{interestType(this.state.formula.interestType)}</td>
                                </tr>
                                <tr>
                                    <td>{local.installmentType}</td>
                                    <td>{installmentType(this.state.formula.installmentType)}</td>
                                </tr>
                                <tr>
                                    <td>{local.gracePeriodFees}</td>
                                    <td>{(this.state.formula.gracePeriodFees ? local.yes : local.no)}</td>
                                </tr>
                                <tr>
                                    <td>{local.rounding}</td>
                                    <td>{(this.state.formula.roundWhat === 'noRounding' ? local.no : local.yes)}</td>
                                </tr>
                                {this.state.formula.roundWhat !== 'noRounding' &&
                                    <>
                                        <tr>
                                            <td>{local.roundDirection}</td>
                                            <td>{roundDirection(this.state.formula.roundDirection)}</td>
                                        </tr>
                                        <tr>
                                            <td>{local.roundTo}</td>
                                            <td>{this.state.formula.roundTo}</td>
                                        </tr>
                                        <tr>
                                            <td>{local.roundWhat}</td>
                                            <td>{roundWhat(this.state.formula.roundWhat)}</td>
                                        </tr>
                                        <tr>
                                            <td>{local.equalInstallmentsTrue}</td>
                                            <td>{(this.state.formula.equalInstallments ? local.yes : local.no)}</td>
                                        </tr>
                                        <tr>
                                            <td>{local.roundLastInstallment}</td>
                                            <td>{(this.state.formula.roundLastInstallment ? local.yes : local.no)}</td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </Table>
                    </div>}
                </Container>
            </>
        )
    }
}
export default withRouter(FormulaView)