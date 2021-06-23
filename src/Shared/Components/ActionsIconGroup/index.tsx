import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { LtsIcon } from '..'

import { ActionsIconGroupProps } from './types'

export const ActionsIconGroup = ({
  currentId,
  actions,
}: ActionsIconGroupProps) => {
  return (
    <Container className="p-0 m-0">
      <Row lg="5" md="2" sm="1">
        {actions.map(
          (action, index) =>
            action.actionPermission && (
              <Col key={index} className="m-1">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => action.actionOnClick(currentId)}
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
