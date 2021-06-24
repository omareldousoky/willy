import React from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import local from '../../../Shared/Assets/ar.json'

import { CalendarEvent } from './types'
import { formatWrapper } from './utils'

export const EventDetails = ({ event }: { event: CalendarEvent }) => {
  const {
    sessionDate,
    sessionType,
    customerName,
    caseNumber,
    court,
    caseStatus,
    caseStatusSummary,
    decision,
    customerKey,
    loanKey,
  } = event
  return (
    <Card className="border-0">
      <Card.Body className="p-2">
        <Card.Title
          style={{ color: '#2a3390' }}
          className="font-weight-bolder py-2"
        >
          {customerName}
        </Card.Title>
        <p className="mb-2  text-primary font-weight-bold">
          {`${formatWrapper(new Date(sessionDate), ' LLLL d EEEE')} - ${
            local[sessionType]
          } `}
        </p>
        <Container className="py-2">
          <Row>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.customerCode}
              </p>
              <p className="mt-0">{customerKey}</p>
            </Col>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.loanCode}
              </p>
              <p>{loanKey}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.caseNumber}
              </p>
              <p className="mt-0">{caseNumber}</p>
            </Col>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.court}
              </p>
              <p>{court}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.caseNumber}
              </p>
              <p className="mt-0">{caseNumber}</p>
            </Col>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.court}
              </p>
              <p>{court}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.courtSessionDate}
              </p>
              <p>{formatWrapper(new Date(sessionDate), 'dd/LL/yyy')}</p>
            </Col>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.theDecision}
              </p>
              <p>{decision}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.caseStatus}
              </p>
              <p>{caseStatus}</p>
            </Col>
            <Col>
              <p className="text-secondary font-weight-bold mb-0">
                {local.caseStatusSummary}
              </p>
              <p>{caseStatusSummary}</p>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}
