import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Swal from 'sweetalert2'
import local from '../../../../Shared/Assets/ar.json'
import { getLoanOfficer } from '../../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import {
  beneficiaryType,
  currency,
  getErrorMessage,
  interestPeriod,
  periodType,
  getRenderDate,
  statusLocale,
  getFormattedLocalDate,
} from '../../../../Shared/Services/utils'

interface Props {
  application: any
  getGeoArea?: Function
}

interface LoanDetailsProps {
  application: any
  branchName?: string
}

// this is used in the application details tab from loanProfile
export const LoanDetailsTableView = ({
  application,
  branchName,
}: LoanDetailsProps) => {
  return (
    <Table striped bordered style={{ textAlign: 'right' }}>
      <tbody>
        <tr>
          <td>{local.oneBranch}</td>
          <td>{branchName || '-'}</td>
        </tr>
        <tr>
          <td>{local.customerType}</td>
          <td>
            {beneficiaryType(application.product.beneficiaryType)} -
            {application.product.type || ''}
          </td>
        </tr>
        <tr>
          <td>{local.vendor}</td>
          <td>{application.vendorName || local.na}</td>
        </tr>
        <tr>
          <td>{local.cfBrand}</td>
          <td>{application.brandName || local.na}</td>
        </tr>
        <tr>
          <td>{local.cfCategory}</td>
          <td>{application.categoryName || local.na}</td>
        </tr>
        <tr>
          <td>{local.cfSubcategory}</td>
          <td>{application.subCategoryName || local.na}</td>
        </tr>
        <tr>
          <td>{local.transactionKey}</td>
          <td>{application.itemTransactionId}</td>
        </tr>
        <tr>
          <td>{local.contractType}</td>
          <td>{local[application.product.contractType]}</td>
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
          <td>
            {application.product.interest +
              ' ' +
              interestPeriod(application.product.interestPeriod)}
          </td>
        </tr>
        <tr>
          <td>{local.inAdvanceFees}</td>
          <td>{application.product.inAdvanceFees}</td>
        </tr>
        <tr>
          <td>{local.periodLengthEvery}</td>
          <td>
            {application.product.periodLength +
              ' ' +
              periodType(application.product.periodType)}
          </td>
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
        {application.product.beneficiaryType === 'individual' ? (
          <tr>
            <td>{local.principal}</td>
            <td>{application.principal}</td>
          </tr>
        ) : (
          application.group.individualsInGroup.map((member) => (
            <tr key={member.customer._id}>
              <td>
                {local.principal} {member.customer.customerName}
              </td>
              <td>{member.amount}</td>
            </tr>
          ))
        )}
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
          <td>{local.representative}</td>
          <td>
            {application.product.beneficiaryType === 'group'
              ? application.group.individualsInGroup.find(
                  (member) => member.type === 'leader'
                ).customer.representativeName
              : application.customer.representativeName}
          </td>
        </tr>
        {application.branchManagerName.length > 0 && (
          <tr>
            <td>{local.branchManager}</td>
            <td>{application.branchManagerName}</td>
          </tr>
        )}
        {application.issueDate > 0 && (
          <tr>
            <td>{local.loanIssuanceDate}</td>
            <td>{getFormattedLocalDate(application.issueDate)}</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}
// this is used in rescheduling
export const LoanDetailsBoxView = ({ application }: Props) => {
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.productName}
          </Form.Label>
          <Form.Label>{application.product.productName}</Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>{local.currency}</Form.Label>
          <Form.Label>{currency(application.product.currency)} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.calculationFormulaId}
          </Form.Label>
          <Form.Label>{application.product.calculationFormula.name}</Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>{local.interest}</Form.Label>
          <Form.Label>
            {application.product.interest +
              ' ' +
              interestPeriod(application.product.interestPeriod)}
          </Form.Label>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.inAdvanceFees}
          </Form.Label>
          <Form.Label>{application.product.inAdvanceFees} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.periodLengthEvery}
          </Form.Label>
          <Form.Label>
            {application.product.periodLength +
              ' ' +
              periodType(application.product.periodType)}
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.gracePeriod}
          </Form.Label>
          <Form.Label>{application.product.gracePeriod} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.pushPayment}
          </Form.Label>
          <Form.Label>{application.product.pushPayment} </Form.Label>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.noOfInstallments}
          </Form.Label>
          <Form.Label>{application.product.noOfInstallments} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.principal}
          </Form.Label>
          <Form.Label>{application.principal} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.applicationFee}
          </Form.Label>
          <Form.Label>{application.product.applicationFee} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.adminFees}
          </Form.Label>
          <Form.Label>{application.product.adminFees} </Form.Label>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.entryDate}
          </Form.Label>
          <Form.Label>{getRenderDate(application.entryDate)} </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {local.representative}
          </Form.Label>
          <Form.Label>
            {application.product.beneficiaryType === 'group'
              ? application.group.individualsInGroup.find(
                  (member) => member.type === 'leader'
                ).customer.representativeName
              : application.customer.representativeName}
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" className="d-flex flex-column">
          <Form.Label style={{ color: '#6e6e6e' }}>
            {application.product.type === 'sme'
              ? local.researcher
              : local.enquiror}
          </Form.Label>
          <Form.Label>
            {application.product.type === 'sme'
              ? application.researcherName
              : application.enquirerName}
          </Form.Label>
        </Form.Group>
      </Form.Row>
    </Form>
  )
}
// this is used in the customer Card/status
export const CustomerLoanDetailsBoxView = ({ application }: Props) => {
  const [officer, changeOfficerName] = useState('')
  async function getOfficerName(id) {
    const res = await getLoanOfficer(id)
    if (res.status === 'success') {
      const { name } = res.body
      changeOfficerName(name)
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      return ''
    }
  }

  useEffect(() => {
    application.customer.representative &&
      getOfficerName(application.customer.representative)
  }, [])
  return (
    <div>
      <h6>{local.currentLoanInfo}</h6>
      <Form style={{ margin: '20px 0' }}>
        <Form.Row className="col">
          <Form.Group as={Col} md="3" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.loanCode}
            </Form.Label>
            <Form.Label>{application.applicationKey}</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="3" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.loanStartDate}
            </Form.Label>
            <Form.Label>{getRenderDate(application.issueDate)} </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="3" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.principal}
            </Form.Label>
            <Form.Label>{application.principal} </Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="3" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.noOfInstallments}
            </Form.Label>
            <Form.Label>{application.product.noOfInstallments} </Form.Label>
          </Form.Group>
        </Form.Row>
        <Form.Row className="col">
          <Form.Group as={Col} md="3" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.loanStatus}
            </Form.Label>
            <Form.Label>{statusLocale[application.status].text}</Form.Label>
          </Form.Group>
          <Form.Group as={Col} md="3" className="d-flex flex-column">
            <Form.Label style={{ color: '#6e6e6e' }}>
              {local.representative}
            </Form.Label>
            <Form.Label>{officer}</Form.Label>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  )
}
