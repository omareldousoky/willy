import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const DocumentsUpload = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep } = props;
    return (
        <Form>
            {/* <div
                style={{
                    borderRadius: 15,
                    border: 'dashed grey 2px',
                    backgroundColor: 'rgba(255,255,255,.8)',
                    display: 'flex',
                    width: 300,
                    height: 300,
                    margin: 'auto'
                }}
            >
                <div
                    style={{
                        margin: 'auto',
                        textAlign: 'center',
                        color: 'grey',
                        fontSize: 36
                    }}
                >
                    <div>drop here :)</div>
                </div>
            </div> */}
            
        </Form>
    )
}