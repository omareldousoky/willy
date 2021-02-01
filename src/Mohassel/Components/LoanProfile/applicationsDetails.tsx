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
import { beneficiaryType, currency, getErrorMessage, interestPeriod, periodType, timeToArabicDate } from "../../../Shared/Services/utils";
import Swal from 'sweetalert2';

interface Props {
    application: any;
    getGeoArea?: Function;
}

interface LoanDetailsProps {
    application: any;
	branchName?: string;
}

//this is used in the application details tab from loanProfile
export const LoanDetailsTableView = ({ application, branchName }: LoanDetailsProps) => {
    const [loanUse, changeUse] = useState('')

    async function getLoanUsages() {
        const res = await getLoanUsage();
        if (res.status === "success") {
            const uses = res.body.usages
            const value = uses.find(use => use.id === application.usage).name
            changeUse(value)
        } else {
            Swal.fire("Error !",getErrorMessage(res.error.error),'error');
            return ''
        }
    }

    useEffect(() => {
        const id = (application.product.beneficiaryType === 'group') ? application.group.individualsInGroup.find(member => member.type === 'leader').customer.representative : application.customer.representative
        getLoanUsages()
    }, [])
    return (
        <Table striped bordered style={{ textAlign: 'right' }}>
            <tbody>
				<tr>
                    <td>{local.oneBranch}</td>
                    <td>{branchName || "-"}</td>
                </tr>
                <tr>
                    <td>{local.customerType}</td>
                    <td>{beneficiaryType(application.product.beneficiaryType)}</td>
                </tr>
                <tr>
                    <td>{local.currency}</td>
                    <td>{currency(application.product.currency)}</td>
                </tr>
                <tr>
                    <td>{local.productName}</td>
                    <td>{application.product.productName}</td>
                </tr>
                <tr>
                    <td>{local.calculationFormulaId}</td>
                    <td>{application.product.calculationFormula.name}</td>
                </tr>
                <tr>
                    <td>{local.interest}</td>
                    <td>{application.product.interest + ' ' + interestPeriod(application.product.interestPeriod)}</td>
                </tr>
                <tr>
                    <td>{local.inAdvanceFees}</td>
                    <td>{application.product.inAdvanceFees}</td>
                </tr>
                <tr>
                    <td>{local.periodLengthEvery}</td>
                    <td>{application.product.periodLength + ' ' + periodType(application.product.periodType)}</td>
                </tr>
                <tr>
                    <td>{local.gracePeriod}</td>
                    <td>{application.product.gracePeriod}</td>
                </tr>
                <tr>
                    <td>{local.pushPayment}</td>
                    <td>{application.product.pushPayment}</td>
                </tr>
                <tr>
                    <td>{local.noOfInstallments}</td>
                    <td>{application.product.noOfInstallments}</td>
                </tr>
                {application.product.beneficiaryType === 'individual' ? <tr>
                    <td>{local.principal}</td>
                    <td>{application.principal}</td>
                </tr> : application.group.individualsInGroup.map((member) =>
                    <tr key={member.customer._id}>
                        <td>{local.principal} {member.customer.customerName}</td>
                        <td>{member.amount}</td>
                    </tr>)}
                <tr>
                    <td>{local.applicationFee}</td>
                    <td>{application.product.applicationFee}</td>
                </tr>
                <tr>
                    <td>{local.individualApplicationFee}</td>
                    <td>{application.product.individualApplicationFee}</td>
                </tr>
                <tr>
                    <td>{local.applicationFeePercent}</td>
                    <td>{application.product.applicationFeePercent}</td>
                </tr>
                <tr>
                    <td>{local.applicationFeePercentPerPerson}</td>
                    <td>{application.product.applicationFeePercentPerPerson}</td>
                </tr>
                <tr>
                    <td>{local.stamps}</td>
                    <td>{application.product.stamps}</td>
                </tr>
                <tr>
                    <td>{local.adminFees}</td>
                    <td>{application.product.adminFees}</td>
                </tr>
                <tr>
                    <td>{local.usage}</td>
                    <td>{loanUse}</td>
                </tr>
                <tr>
                    <td>{local.representative}</td>
                    <td>{(application.product.beneficiaryType === 'group') ? application.group.individualsInGroup.find(member => member.type === 'leader').customer.representativeName : application.customer.representativeName}</td>
                </tr>
                <tr>
                    <td>{local.enquiror}</td>
                    <td>{application.enquirerName}</td>
                </tr>
                <tr>
                    <td>{local.visitationDate}</td>
                    <td>{timeToArabicDate(application.visitationDate, false)}</td>
                </tr>
                {application.branchManagerName.length > 0 && <tr>
                    <td>{local.branchManager}</td>
                    <td>{application.branchManagerName}</td>
                </tr>}
                {application.managerVisitDate > 0 && <tr>
                    <td>{local.branchManagerVisitation}</td>
                    <td>{timeToArabicDate(application.managerVisitDate, false)}</td>
                </tr>}
                <tr>
                    <td>{local.entryDate}</td>
                    <td>{timeToArabicDate(application.entryDate, false)}</td>
                </tr>
                {application.reviewedDate > 0 && <tr>
                    <td>{local.reviewDate}</td>
                    <td>{timeToArabicDate(application.reviewedDate, false)}</td>
                </tr>}
                {application.secondReviewDate > 0 && <tr>
                    <td>{local.secondReviewDate}</td>
                    <td>{timeToArabicDate(application.secondReviewDate, false)}</td>
                </tr>}
                {application.thirdReviewDate > 0 && <tr>
                    <td>{local.thirdReviewDate}</td>
                    <td>{timeToArabicDate(application.thirdReviewDate, false)}</td>
                </tr>}
                {application.undoReviewDate > 0 && <tr>
                    <td>{local.unreviewDate}</td>
                    <td>{timeToArabicDate(application.undoReviewDate, false)}</td>
                </tr>}
                {application.rejectionDate > 0 && <tr>
                    <td>{local.decisionDate}</td>
                    <td>{timeToArabicDate(application.rejectionDate, false)}</td>
                </tr>}
                {application.approvalDate > 0 && <tr>
                    <td>{local.loanApprovalDate}</td>
                    <td>{timeToArabicDate(application.approvalDate, false)}</td>
                </tr>}
                {application.creationDate > 0 && <tr>
                    <td>{local.loanCreationDate}</td>
                    <td>{timeToArabicDate(application.creationDate, false)}</td>
                </tr>}
                {application.issueDate > 0 && <tr>
                    <td>{local.loanIssuanceDate}</td>
                    <td>{timeToArabicDate(application.issueDate, false)}</td>
                </tr>}
            </tbody>
        </Table>
    )
}
//this is used in rescheduling
export const LoanDetailsBoxView = ({ application }: Props) => {
    const [loanUse, changeUse] = useState('')

    async function getLoanUsages() {
        const res = await getLoanUsage();
        if (res.status === "success") {
            const uses = res.body.usages
            const value = uses.find(use => use.id === application.usage).name
            changeUse(value)
        } else {
            Swal.fire("Error !",getErrorMessage(res.error.error),'error');
            return ''
        }
    }
    useEffect(() => {
        const id = (application.product.beneficiaryType === 'group') ? application.group.individualsInGroup.find(member => member.type === 'leader').customer.representative : application.customer.representative
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
                        <Form.Label>{application.product.productName}</Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.currency}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{currency(application.product.currency)} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.calculationFormulaId}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.calculationFormula.name} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.interest}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.interest + ' ' + interestPeriod(application.product.interestPeriod)} </Form.Label>
                    </Row>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.inAdvanceFees}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.inAdvanceFees} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.periodLengthEvery}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.periodLength + ' ' + periodType(application.product.periodType)} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.gracePeriod}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.gracePeriod} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.pushPayment}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.pushPayment} </Form.Label>
                    </Row>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.noOfInstallments}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.noOfInstallments} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.principal}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.principal} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.applicationFee}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.applicationFee} </Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.adminFees}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.product.adminFees} </Form.Label>
                    </Row>
                </Form.Group>
            </Form.Row >
            <Form.Row>
                <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.entryDate}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{getRenderDate(application.entryDate)} </Form.Label>
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
                        <Form.Label>{(application.product.beneficiaryType === 'group') ?
                            application.group.individualsInGroup.find(member => member.type === 'leader').customer.representativeName
                            : application.customer.representativeName}</Form.Label>
                    </Row>
                </Form.Group>
                 <Form.Group as={Col} md="3">
                    <Row>
                        <Form.Label style={{ color: '#6e6e6e' }}>{local.enquiror}</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{application.enquirerName} </Form.Label>
                    </Row>
                </Form.Group> 
            </Form.Row>
        </Form >
    )
}
// this is used in the customer Card/status
export const CustomerLoanDetailsBoxView = ({ application, getGeoArea }: Props) => {
    const [officer, changeOfficerName] = useState('')
    async function getOfficerName(id) {
        const res = await getLoanOfficer(id);
        if (res.status === "success") {
            const name = res.body.name
            changeOfficerName(name)
        } else {
            Swal.fire("Error !",getErrorMessage(res.error.error),'error');
            return ''
        }
    }
    useEffect(() => {
        getOfficerName(application.customer.representative);
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
                            <Form.Label >{application.applicationKey}</Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.loanStartDate}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{getRenderDate(application.issueDate)} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.principal}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{application.principal} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.noOfInstallments}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{application.product.noOfInstallments} </Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.loanStatus}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{englishToArabic(application.status).text}</Form.Label>
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
                    <Form.Group as={Col} md="3">
                        <Row>
                            <Form.Label>{local.customerBalance}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{props.application.installmentsObject.totalInstallments.installmentSum - 
                            (props?.application?.installmentsObject?.installments.reduce((accumulator, current) =>  accumulator +  current.totalPaid , 0))}</Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                {application.guarantors && application.guarantors.length > 0 && application.product.beneficiaryType === 'individual' && <Form.Row>
                    <GuarantorTableView guarantors={application.guarantors} getGeoArea={(area) => getGeoArea && getGeoArea(area)} application={application}/>
                </Form.Row>}
            </Form>
        </div>
    )
}