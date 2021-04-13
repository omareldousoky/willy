import React, { FunctionComponent } from 'react'
import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import * as local from '../../../Shared/Assets/ar.json'
import './managerHierarchy.scss'
import { BranchBasicsCardProps } from './types'

export const BranchBasicsCard: FunctionComponent<BranchBasicsCardProps> = ({
  name,
  createdAt,
  branchCode,
  status,
}) => {
  return (
    <div className="branch-basics-card">
      <div className="row-nowrap">
        <span className="basic-info">
          <img alt="basic-info" src={require('../../Assets/basicInfo.svg')} />
          <Form.Label>{local.basicInfo}</Form.Label>
        </span>
      </div>
      <div className="branch-basics-container">
        <Col>
          <Row>
            <Form.Label className="basic-info-label">
              {local.oneBranch}
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">{name}</Form.Label>
          </Row>
        </Col>
        <Col>
          <Row>
            <Form.Label className="basic-info-label">
              {local.branchCode}
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">{branchCode}</Form.Label>
          </Row>
        </Col>
        <Col>
          <Row>
            <Form.Label className="basic-info-label">
              {local.creationDate}
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">{createdAt}</Form.Label>
          </Row>
        </Col>
        <Col>
          <Row>
            <Form.Label className="basic-info-label">{local.status}</Form.Label>
          </Row>
          <Row>
            <Form.Label className="basic-info-data">
              {status === 'active' ? local.activeBranch : local.inActiveBranch}
            </Form.Label>
          </Row>
        </Col>
      </div>
    </div>
  )
}
