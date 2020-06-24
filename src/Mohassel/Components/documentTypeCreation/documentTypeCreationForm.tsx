import React from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
const DocumentTypeCreationForm = (props: any) => {
    return (
       <Form onSubmit = {props.handleSubmit}>
           <Form.Group>
           <Form.Label>{local.documentName}</Form.Label>
           <Form.Control 
           type="text"
           onChange = {props.handleChange}
           onBlur = {props.handleBlur}
           />
           </Form.Group>
           <Row></Row>
           <Row></Row>
           <Row></Row>
       </Form>
    )
}

export default DocumentTypeCreationForm;
