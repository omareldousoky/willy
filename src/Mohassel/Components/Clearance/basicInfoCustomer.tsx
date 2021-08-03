import React from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import * as local from '../../../Shared/Assets/ar.json'
import './clearance.scss'
import { LtsIcon } from '../../../Shared/Components'

interface Props {
  branchName: string
  customerKey: string
  customerName: string
  customerType: string
}
export default function CustomerBasicsCard(props: Props) {
  return (
    <div className="customer-basics-card">
      <div className="row-nowrap">
        <span className="basic-info">
          <LtsIcon name="user" />
          <Form.Label className="ml-3">{local.basicInfo}</Form.Label>
        </span>
      </div>
      <div className="customer-basics-container">
        <Col className="ml-5">
          <Row>
            <Form.Label className="basic-info-label">
              {props.customerType === 'company'
                ? local.companyName
                : local.customerName}
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">
              {props.customerName}
            </Form.Label>
          </Row>
        </Col>
        <Col>
          <Row>
            <Form.Label className="basic-info-label">
              {props.customerType === 'company'
                ? local.companyCode
                : local.customerCode}
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">
              {props.customerKey}
            </Form.Label>
          </Row>
        </Col>
        <Col>
          <Row>
            <Form.Label className="basic-info-label">
              {local.oneBranch}
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">
              {props.branchName}
            </Form.Label>
          </Row>
        </Col>
      </div>
    </div>
  )
}
