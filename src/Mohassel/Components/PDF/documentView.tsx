import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { MyDocument } from './document'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

export const View = (props: any) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(props)
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View PDF
      </Button>

      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header>
          <Modal.Title>{props.data.formulaName}`s Test PDF View</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height:500}}>
          <PDFViewer style={{width:'100%',height:'100%'}}>
            <MyDocument pass={props.data} />
          </PDFViewer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};