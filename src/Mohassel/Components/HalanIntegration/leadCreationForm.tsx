import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import * as local from '../../../Shared/Assets/ar.json'

export const LeadCreationForm: React.FC = () => {
  return (
    <Form className="mx-3">
      <Row>
        <Form.Group controlId="customerName" as={Col}>
          <Form.Label className="data-label">{local.leadName}</Form.Label>
          <Form.Control
            type="text"
            name="customerName"
            data-qc="customerName"
          />
        </Form.Group>
        <Form.Group controlId="customerNationalId" as={Col}>
          <Form.Label className="data-label">{local.nationalId}</Form.Label>
          <Form.Control
            type="text"
            name="customerNationalId"
            data-qc="customerNationalId"
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="phoneNumber" as={Col}>
          <Form.Label className="data-label">{local.phoneNumber}</Form.Label>
          <Form.Control type="text" name="phoneNumber" data-qc="phoneNumber" />
        </Form.Group>
        <Form.Group controlId="loanAmount" as={Col}>
          <Form.Label className="data-label">{local.principal}</Form.Label>
          <Form.Control type="number" name="loanAmount" data-qc="loanAmount" />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="businessStreet" as={Col}>
          <Form.Label className="data-label">
            {local.businessAddress}
          </Form.Label>
          <Form.Control
            type="text"
            name="businessStreet"
            data-qc="businessStreet"
          />
        </Form.Group>
      </Row>
      <Row>GOV , City</Row>
      <Row>AREA</Row>
      <Row>BUSINESS SECTOR</Row>
    </Form>
  )
}
