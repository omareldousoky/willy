import React from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { LtsIcon } from "../../../Shared/Components";

import { ActionsIconGroupProps } from "./types";

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
              <Col>
                <Button
                  key={index}
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
  );
};
