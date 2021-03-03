import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import domtoimage from 'dom-to-image'
import jsPDF from 'jspdf'
import * as local from '../../../Shared/Assets/ar.json'
import './styles.scss'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'

const PaymentReceipt = (props: any) => {
  function download() {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF('p', 'mm', 'letter')
    domtoimage
      .toPng(document.querySelector('#nodeToRenderAsPDF'))
      .then((dataUrl) => {
        const img = new Image()
        img.src = dataUrl
        pdf.addImage(img, 'PNG', 0, 0, 200, 270)
        pdf.save('test.pdf')
      })
  }
  useEffect(() => {
    download()
  }, [])

  return (
    <>
      <Modal show dialogClassName="receipt-modal">
        <div id="nodeToRenderAsPDF">
          {props.receiptData.map((receiptData, index) => {
            return (
              <div key={index} className="receipt-container">
                <div className="receipt-header">
                  <h5>{local.tasaheelName}</h5>
                  <h5>{local.paymentReceipt}</h5>
                </div>
                <div className="receipt-content">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.date}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {timeToDateyyymmdd(receiptData.date)}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.receiptNumber}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {receiptData.receiptNumber}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.customerName}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {receiptData.customerName}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.installmentType}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {receiptData.installmentAmount}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.paidFrom}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {receiptData.previouslyPaid}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.currentPayment}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {receiptData.paidNow}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.purpose}
                    </Form.Label>
                    <Form.Label column sm={6} className="info" />
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.remaining}
                    </Form.Label>
                    <Form.Label column sm={6} className="info">
                      {receiptData.remaining}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.recipientSignature}
                    </Form.Label>
                    <Form.Label column sm={6} className="dots">
                      ........................................................
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} className="title">
                      {local.revisedAndIssued}
                    </Form.Label>
                    <Form.Label column sm={6} className="dots">
                      ........................................................
                    </Form.Label>
                  </Form.Group>
                </div>
              </div>
            )
          })}
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.closeModal()}>
            {local.cancel}
          </Button>
          <Button variant="primary" onClick={() => download()}>
            {local.download}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default PaymentReceipt
