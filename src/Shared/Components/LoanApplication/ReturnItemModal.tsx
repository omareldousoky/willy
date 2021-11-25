import React, { FunctionComponent, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import local from '../../Assets/ar.json'
import { getDateString } from '../../Services/utils'

interface ReturnItemModalProps {
  show: boolean
  hideModal: () => void
  submit: (date) => void
  issueDate: number
}

const ReturnItemModal: FunctionComponent<ReturnItemModalProps> = ({
  show,
  hideModal,
  submit,
  issueDate,
}) => {
  const [truthDate, setTruthDate] = useState('')
  return (
    <>
      <Modal className="print-none" size="lg" show={show} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-mixed-lang">
            {local.returnItem}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group as={Col} controlId="truthDate">
                <Form.Label>{local.truthDate}</Form.Label>
                <Form.Control
                  type="date"
                  name="truthDate"
                  data-qc="truthDate"
                  value={truthDate}
                  onChange={(e) => setTruthDate(e.currentTarget.value)}
                  min={getDateString(issueDate)}
                  max={getDateString(new Date().valueOf())}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="primary"
                onClick={() => submit(truthDate)}
                disabled={!truthDate}
              >
                {local.submit}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ReturnItemModal
