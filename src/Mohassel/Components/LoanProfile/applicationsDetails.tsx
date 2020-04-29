import React from 'react';
import Table from 'react-bootstrap/Table';
import * as local from '../../../Shared/Assets/ar.json';
import { Application } from '../LoanApplication/loanApplicationStates';
import { getRenderDate } from '../../Services/getRenderDate';

interface Props {
    application: any;
}

export const DetailsTableView = (props: Props) => {
    return (
        <Table striped bordered style={{ textAlign: 'right' }}>
                <tbody>
                    <tr>
                        <td>نوع القرض</td>
                        <td>{props.application.product.currency}</td>
                    </tr>
                    <tr>
                        <td>{local.currency}</td>
                        <td>{props.application.product.currency}</td>
                    </tr>
                    <tr>
                        <td>{local.calculationFormulaId}</td>
                        <td>{props.application.product.calculationFormula.name}</td>
                    </tr>
                    <tr>
                        <td>{local.interest}</td>
                        <td>{props.application.product.interest + ' ' + props.application.product.interestPeriod}</td>
                    </tr>
                    <tr>
                        <td>{local.inAdvanceFees}</td>
                        <td>{props.application.product.inAdvanceFees}</td>
                    </tr>
                    <tr>
                        <td>{local.periodLengthEvery}</td>
                        <td>{props.application.product.periodLength + ' ' + props.application.product.periodType}</td>
                    </tr>
                    <tr>
                        <td>{local.gracePeriod}</td>
                        <td>{props.application.product.gracePeriod}</td>
                    </tr>
                    <tr>
                        <td>{local.pushPayment}</td>
                        <td>{props.application.product.pushPayment}</td>
                    </tr>
                    <tr>
                        <td>{local.noOfInstallments}</td>
                        <td>{props.application.product.noOfInstallments}</td>
                    </tr>
                    <tr>
                        <td>{local.principal}</td>
                        <td>{props.application.principal}</td>
                    </tr>
                    <tr>
                        <td>{local.applicationFee}</td>
                        <td>{props.application.product.applicationFee}</td>
                    </tr>
                    <tr>
                        <td>{local.individualApplicationFee}</td>
                        <td>{props.application.product.individualApplicationFee}</td>
                    </tr>
                    <tr>
                        <td>{local.applicationFeePercent}</td>
                        <td>{props.application.product.applicationFeePercent}</td>
                    </tr>
                    <tr>
                        <td>{local.applicationFeePercentPerPerson}</td>
                        <td>{props.application.product.applicationFeePercentPerPerson}</td>
                    </tr>
                    <tr>
                        <td>{local.stamps}</td>
                        <td>{props.application.product.stamps}</td>
                    </tr>
                    <tr>
                        <td>{local.adminFees}</td>
                        <td>{props.application.product.adminFees}</td>
                    </tr>
                    <tr>
                        <td>{local.entryDate}</td>
                        <td>{getRenderDate(props.application.entryDate)}</td>
                    </tr>
                    <tr>
                        <td>{local.usage}</td>
                        <td>{props.application.usage}</td>
                    </tr>
                    <tr>
                        <td>{local.representative}</td>
                        <td>{props.application.representativeId}</td>
                    </tr>
                    <tr>
                        <td>{local.enquiror}</td>
                        <td>{props.application.enquirorId}</td>
                    </tr>
                    <tr>
                        <td>{local.visitationDate}</td>
                        <td>{getRenderDate(props.application.visitationDate)}</td>
                    </tr>
                </tbody>
            </Table>
    )
}