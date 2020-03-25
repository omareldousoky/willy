import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

export const LoanApplicationCreationForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ border: '1px solid black', width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.mainInfo}</p>
                <div>
                    <Form.Group as={Row} controlId="customerName">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.name}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="customerName"
                                data-qc="customerName"
                                value={values.customerName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.customerName && touched.customerName}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="customerCode">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.customerCode}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="customerCode"
                                data-qc="customerCode"
                                value={values.customerCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={errors.customerCode && touched.customerCode}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="nationalId">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.nationalId}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="nationalId"
                                data-qc="nationalId"
                                value={values.nationalId}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.nationalId && touched.nationalId}
                                maxLength={14}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="birthDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.birthDate}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                data-qc="birthDate"
                                value={values.birthDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.birthDate && touched.birthDate}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="gender">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.gender}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="gender"
                                data-qc="gender"
                                value={values.gender}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.gender && touched.gender}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="male">{local.male}</option>
                                <option value="female">{local.female}</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="nationalIdIssueDate">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.nationalIdIssueDate}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="date"
                                name="nationalIdIssueDate"
                                data-qc="nationalIdIssueDate"
                                value={values.nationalIdIssueDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.nationalIdIssueDate && touched.nationalIdIssueDate}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="businessSector">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessSector}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="businessSector"
                                data-qc="businessSector"
                                value={values.businessSector}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessSector && touched.businessSector}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="businessSector1">businessSector1</option>
                                <option value="businessSector2">businessSector2</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="businessActivity">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessActivity}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="businessActivity"
                                data-qc="businessActivity"
                                value={values.businessActivity}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessActivity && touched.businessActivity}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="businessActivity1">businessActivity1</option>
                                <option value="businessActivity2">businessActivity2</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="businessSpeciality">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessSpeciality}</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select"
                                type="select"
                                name="businessSpeciality"
                                data-qc="businessSpeciality"
                                value={values.businessSpeciality}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessSpeciality && touched.businessSpeciality}
                                disabled
                            >
                                <option value="" disabled></option>
                                <option value="businessSpeciality1">businessSpeciality1</option>
                                <option value="businessSpeciality2">businessSpeciality2</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="permanentEmployeeCount">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.permanentEmployeeCount}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="permanentEmployeeCount"
                                data-qc="permanentEmployeeCount"
                                value={values.permanentEmployeeCount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.permanentEmployeeCount && touched.permanentEmployeeCount}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="partTimeEmployeeCount">
                        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.partTimeEmployeeCount}</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="partTimeEmployeeCount"
                                data-qc="partTimeEmployeeCount"
                                value={values.partTimeEmployeeCount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.partTimeEmployeeCount && touched.partTimeEmployeeCount}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                </div>
            </div>
            <div style={{ border: '1px solid black', width: '100%' }}>
                <p style={{ textAlign: 'right' }}>{local.loanInfo}</p>
                <div>
                    
                </div>
            </div>
            <Button type="button" style={{ margin: 10 }} onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}