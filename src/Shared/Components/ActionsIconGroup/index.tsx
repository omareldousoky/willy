import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { LtsIcon } from '..'

import { ActionsIconGroupProps } from './types'

export const ActionsIconGroup = ({
  currentCustomerId,
  actions,
}: ActionsIconGroupProps) => {
  return (
    <Container>
      <Row lg="4" md="2" sm="1">
        {actions.map(
          (action, index) =>
            action.actionPermission && (
              <Col key={index} className="m-2">
                <Button
                  size="sm"
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
