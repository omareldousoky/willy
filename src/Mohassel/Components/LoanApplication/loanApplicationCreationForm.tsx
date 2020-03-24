import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanApplicationCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
           </Form>
    )
}