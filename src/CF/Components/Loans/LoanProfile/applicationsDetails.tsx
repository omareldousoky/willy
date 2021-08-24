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
  extractGMTDate,
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
            <td>{extractGMTDate(application.issueDate)}</td>
          </tr>
        )}
      </tbody>
    </Table>
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
