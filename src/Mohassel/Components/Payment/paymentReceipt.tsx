import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';

const PaymentReceipt = (props: any) => {
  const [alreadyPaid, changeAlreadyPaid] = useState(0);
  function download() {
    const pdf = new jsPDF('p', 'mm', 'letter');
    domtoimage.toPng(document.querySelector("#nodeToRenderAsPDF")).then(dataUrl => {
      const img = new Image();
      img.src = dataUrl;
      pdf.addImage(img, 'PNG', 0, 0, 200, 270);
      pdf.save('test.pdf');
    });
  }
  useEffect(() => {
    let alreadyPaid = 0;
    props.receiptData.installmentsObject.output.forEach(installment => {
      if(installment.status === "paid" || installment.status === "partiallyPaid"){
        alreadyPaid = alreadyPaid + installment.principalPaid;
      }
    })
    changeAlreadyPaid(alreadyPaid)
    download();
  }, []);
 
  return (
      <Modal show={true} dialogClassName="receipt-modal">
        <div id="nodeToRenderAsPDF" className="receipt-container">
          <div className="receipt-header">
            <h5>{local.tasaheelName}</h5>
            <h5>الأقصر-الأقصر</h5>
            <h5>{local.paymentReceipt}</h5>
            <h5>خزينة 1 فرع الأقصر</h5>
          </div>
          <div className="receipt-content">
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.date}</Form.Label>
              <Form.Label column sm={6} className="info">{new Date().toISOString().slice(0, 10)}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.receiptNumber}</Form.Label>
              <Form.Label column sm={6} className="info">{''}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.customerName}</Form.Label>
              <Form.Label column sm={6} className="info">{props.receiptData.customer.customerName}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.principal}</Form.Label>
              <Form.Label column sm={6} className="info">{props.receiptData.principal}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.paidFrom}</Form.Label>
              <Form.Label column sm={6} className="info">{alreadyPaid}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.currentPayment}</Form.Label>
              <Form.Label column sm={6} className="info">{props.payAmount}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.purpose}</Form.Label>
              <Form.Label column sm={6} className="info">{''}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.remaining}</Form.Label>
              <Form.Label column sm={6} className="info">{props.receiptData.principal - alreadyPaid}</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.recipientSignature}</Form.Label>
              <Form.Label column sm={6} className="dots">........................................................</Form.Label>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3} className="title">{local.revisedAndIssued}</Form.Label>
              <Form.Label column sm={6} className="dots">........................................................</Form.Label>
            </Form.Group>
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.closeModal()}>{local.cancel}</Button>
          <Button variant="primary" onClick={() => download()}>{local.download}</Button>
        </Modal.Footer>
      </Modal>
  );
}
export default PaymentReceipt;