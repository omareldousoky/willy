import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import * as local from '../../../Shared/Assets/ar.json';
import { Application } from '../LoanApplication/loanApplicationStates';
import { getRenderDate } from '../../Services/getRenderDate';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { englishToArabic } from '../../Services/statusLanguage';
import { GuarantorTableView } from './guarantorDetails';
import { getLoanOfficer } from './../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { beneficiaryType, currency, interestPeriod, periodType, timeToArabicDate } from "../../../Shared/Services/utils";

interface Props {
    application: any;
    getGeoArea?: Function;
}
interface LoanDetailsProps {
    application: any;
}

//this is used in the application details tab from loanProfile
export const LoanDetailsTableView = (props: LoanDetailsProps) => {
    const [loanUse, changeUse] = useState('')

    async function getLoanUsages() {
        const res = await getLoanUsage();
        if (res.status === "success") {
            const uses = res.body.usages
            const value = uses.find(use => use.id === props.application.usage).name
            changeUse(value)
        } else {
            console.log('Err')
            return ''
        }
    }
    useEffect(() => {
        const id = (props.application.product.beneficiaryType === 'group') ? props.application.group.individualsInGroup.find(member => member.type === 'leader').customer.representative : props.application.customer.representative
        getLoanUsages()
    }, [])
    return (
        <Table striped bordered style={{ textAlign: 'right' }}>
            <tbody>
                <tr>
                    <td>{local.customerType}</td>
                    <td>{beneficiaryType(props.application.product.beneficiaryType)}</td>
                </tr>
                <tr>
                    <td>{local.currency}</td>
                    <td>{currency(props.application.product.currency)}</td>
                </tr>
                <tr>
                    <td>{local.productName}</td>
                    <td>{props.application.product.productName}</td>
                </tr>
                <tr>
                    <td>{local.calculationFormulaId}</td>
                    <td>{props.application.product.calculationFormula.name}</td>
                </tr>
                <tr>
                    <td>{local.interest}</td>
                    <td>{props.application.product.interest + ' ' + interestPeriod(props.application.product.interestPeriod)}</td>
                </tr>
                <tr>
                    <td>{local.inAdvanceFees}</td>
                    <td>{props.application.product.inAdvanceFees}</td>
                </tr>
                <tr>
                    <td>{local.periodLengthEvery}</td>
                    <td>{props.application.product.periodLength + ' ' + periodType(props.application.product.periodType)}</td>
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
                {props.application.product.beneficiaryType === 'individual' ? <tr>
                    <td>{local.principal}</td>
                    <td>{props.application.principal}</td>
                </tr> : props.application.group.individualsInGroup.map((member) =>
                    <tr key={member.customer._id}>
                        <td>{local.principal} {member.customer.customerName}</td>
                        <td>{member.amount}</td>
                    </tr>)}
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
                    <td>{local.usage}</td>
                    <td>{loanUse}</td>
                </tr>
                <tr>
                    <td>{local.representative}</td>
                    <td>{(props.application.product.beneficiaryType === 'group') ? props.application.group.individualsInGroup.find(member => member.type === 'leader').customer.representativeName : props.application.customer.representativeName}</td>
                </tr>
                <tr>
                    <td>{local.enquiror}</td>
                    <td>{props.application.enquirerName}</td>
                </tr>
                <tr>
                    <td>{local.visitationDate}</td>
                    <td>{timeToArabicDate(props.application.visitationDate, false)}</td>
                </tr>
                {props.application.branchManagerName.length > 0 && <tr>
                    <td>{local.branchManager}</td>
                    <td>{props.application.branchManagerName}</td>
                </tr>}
                {props.application.managerVisitDate > 0 && <tr>
                    <td>{local.branchManagerVisitation}</td>
                    <td>{timeToArabicDate(props.application.managerVisitDate, false)}</td>
                </tr>}
                <tr>
                    <td>{local.entryDate}</td>
                    <td>{timeToArabicDate(props.application.entryDate, false)}</td>
                </tr>
                {props.application.reviewedDate > 0 && <tr>
                    <td>{local.reviewDate}</td>
                    <td>{timeToArabicDate(props.application.reviewedDate, false)}</td>
                </tr>}
                {props.application.undoReviewDate > 0 && <tr>
                    <td>{local.unreviewDate}</td>
                    <td>{timeToArabicDate(props.application.undoReviewDate, false)}</td>
                </tr>}
                {props.application.rejectionDate > 0 && <tr>
                    <td>{local.decisionDate}</td>
                    <td>{timeToArabicDate(props.application.rejectionDate, false)}</td>
                </tr>}
                {props.application.approvalDate > 0 && <tr>
                    <td>{local.loanApprovalDate}</td>
                    <td>{timeToArabicDate(props.application.approvalDate, false)}</td>
                </tr>}
                {props.application.creationDate > 0 && <tr>
                    <td>{local.loanCreationDate}</td>
                    <td>{timeToArabicDate(props.application.creationDate, false)}</td>
                </tr>}
                {props.application.issueDate > 0 && <tr>
                    <td>{local.loanIssuanceDate}</td>
                    <td>{timeToArabicDate(props.application.issueDate, false)}</td>
                </tr>}
            </tbody>
        </Table>
    )
}
//this is used in rescheduling
export const LoanDetailsBoxView = (props: Props) => {
    const [loanUse, changeUse] = useState('')

    async function getLoanUsages() {
        const res = await getLoanUsage();
        if (res.status === "success") {
            const uses = res.body.usages
            const value = uses.find(use => use.id === props.application.usage).name
            changeUse(value)
        } else {
            console.log('Err')
            return ''
        }
    }
    useEffect(() => {
        const id = (props.application.product.beneficiaryType === 'group') ? props.application.group.individualsInGroup.find(member => member.type === 'leader').customer.representative : props.application.customer.representative
        getLoanUsages()

    }, [])
    return (
        <Form>
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.productName}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.productName}</Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.currency}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{currency(props.application.product.currency)} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.calculationFormulaId}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.calculationFormula.name} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.interest}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.interest + ' ' + interestPeriod(props.application.product.interestPeriod)} </Form.Label>
                    </Row>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.inAdvanceFees}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.inAdvanceFees} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.periodLengthEvery}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.periodLength + ' ' + periodType(props.application.product.periodType)} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.gracePeriod}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.gracePeriod} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.pushPayment}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.pushPayment} </Form.Label>
                    </Row>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.noOfInstallments}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.noOfInstallments} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.principal}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.principal} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.applicationFee}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.applicationFee} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.adminFees}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.product.adminFees} </Form.Label>
                    </Row>
                </Form.Group>
            </Form.Row >
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.entryDate}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{getRenderDate(props.application.entryDate)} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.usage}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{loanUse} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.representative}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{(props.application.product.beneficiaryType === 'group') ?
                            props.application.group.individualsInGroup.find(member => member.type === 'leader').customer.representativeName
                            : props.application.customer.representativeName}</Form.Label>
                    </Row>
                </Form.Group>
                 <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.enquiror}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{props.application.enquirerName} </Form.Label>
                    </Row>
                </Form.Group> 
            </Form.Row>
        </Form >
    )
}
// this is used in the customer Card/status
export const CustomerLoanDetailsBoxView = (props: Props) => {
    const [officer, changeOfficerName] = useState('')
    async function getOfficerName(id) {
        const res = await getLoanOfficer(id);
        if (res.status === "success") {
            const name = res.body.name
            changeOfficerName(name)
        } else {
            console.log('Err')
            return ''
        }
    }
    useEffect(() => {
        getOfficerName(props.application.customer.representative);
    }, [])
    return (
        <div>
            <h6>{local.currentLoanInfo}</h6>
            <Form style={{ margin: '20px 0' }}>
                <Form.Row>
                    <Form.Group as={Col} md='3'>
                        <Row>
                            <Form.Label >{local.loanCode}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label >{props.application.applicationKey}</Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.loanStartDate}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{getRenderDate(props.application.issueDate)} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.principal}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{props.application.principal} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.noOfInstallments}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{props.application.product.noOfInstallments} </Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.loanStatus}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{englishToArabic(props.application.status).text}</Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.representative}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{officer}</Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                {props.application.guarantors && props.application.guarantors.length > 0 && props.application.product.beneficiaryType === 'individual' && <Form.Row>
                    <GuarantorTableView guarantors={props.application.guarantors} getGeoArea={(area) => props.getGeoArea && props.getGeoArea(area)} application={props.application}/>
                </Form.Row>}
            </Form>
        </div>
    )
}