import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

import { LtsIcon } from '..'

import { ActionsIconGroupProps } from './types'

export const ActionsIconGroup = ({
  currentCustomerId,
  actions,
}: ActionsIconGroupProps) => {
  return (
    <Container>
      <Row lg="4">
        {actions.map(
          (action, index) =>
            action.actionPermission && (
              <Col key={index}>
                <Button
                  variant="outline-primary"
                  onClick={() => action.actionOnClick(currentCustomerId)}
                >
                  <LtsIcon
                    name={action.actionIcon}
                    tooltipText={action.actionTitle}
                  />
                </Button>
              </Col>
            )
        )}
      </Row>
    </Container>
  )
}
