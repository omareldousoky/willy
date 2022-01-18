import React, { FunctionComponent } from 'react'

import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import * as local from '../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../Shared/Components'
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
          <LtsIcon name="branches" color="#7dc255" />
          <Form.Label className="ml-2">{local.basicInfo}</Form.Label>
        </span>
      </div>
      <div className="branch-basics-container">
        <Col className="d-flex flex-column">
          <Form.Label className="basic-info-label">
            {local.oneBranch}
          </Form.Label>
          <Form.Label className="basic-info-data">{name}</Form.Label>
        </Col>
        <Col className="d-flex flex-column">
          <Form.Label className="basic-info-label">
            {local.branchCode}
          </Form.Label>
          <Form.Label className="basic-info-data">{branchCode}</Form.Label>
        </Col>
        <Col className="d-flex flex-column">
          <Form.Label className="basic-info-label">
            {local.creationDate}
          </Form.Label>
          <Form.Label className="basic-info-data">{createdAt}</Form.Label>
        </Col>
        <Col className="d-flex flex-column">
          <Form.Label className="basic-info-label">{local.status}</Form.Label>
          <Form.Label className="basic-info-data">
            {status === 'active' ? local.activeBranch : local.inActiveBranch}
          </Form.Label>
        </Col>
      </div>
    </div>
  )
}
