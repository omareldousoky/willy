import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Map from './map';
import * as local from '../../../Shared/Assets/ar.json';

export const StepTwoForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep } = props;
    const [businessAddressLatLong, setLocation] = useState({ lat: 0, long: 0 });
    const [mapState, openCloseMap] = useState(false);
    return (
        <Form onSubmit={handleSubmit}>
            <Map show={mapState}
                handleClose={() => openCloseMap(false)}
                save={(businessAddressLatLong: { lat: number, long: number }) => { setLocation(businessAddressLatLong); setFieldValue('businessAddressLatLong', businessAddressLatLong); openCloseMap(false) }}
                location={businessAddressLatLong}
                header={local.customerWorkAddressLocationTitle}
            />
            <Form.Group as={Row} controlId="businessName">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessName}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessName"
                        data-qc="businessName"
                        value={values.businessName}
                        onChange={handleChange}
                        isInvalid={errors.businessName && touched.businessName}
                        onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessName}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessAddress">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessAddress}</Form.Label>
                <Col sm={5}>
                    <Form.Control
                        type="text"
                        name="businessAddress"
                        data-qc="businessAddress"
                        value={values.businessAddress}
                        onChange={handleChange}
                        isInvalid={errors.businessAddress && touched.businessAddress}
                        onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessAddress}
                    </Form.Control.Feedback>
                </Col>
                <Col sm={1}>
                    <Button onClick={() => openCloseMap(true)}>setLcation</Button>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="governorate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.governorate}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="governorate"
                        data-qc="governorate"
                        value={values.governorate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.governorate && touched.governorate}
                    >
                        <option value="" disabled></option>
                        <option value="cairo">cairo</option>
                        <option value="alex">alex</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="district">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.district}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="district"
                        data-qc="district"
                        value={values.district}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.district && touched.district}
                    >
                        <option value="" disabled></option>
                        <option value="nasrCity">Nasr City</option>
                        <option value="zamalek">Zamalek</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="village">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.village}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="village"
                        data-qc="village"
                        value={values.village}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.village && touched.village}

                    >
                        <option value="" disabled></option>
                        <option value="village1">village1</option>
                        <option value="village2">village2</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="ruralUrban">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.ruralUrban}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="ruralUrban"
                        data-qc="ruralUrban"
                        value={values.ruralUrban}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.ruralUrban && touched.ruralUrban}
                    >
                        <option value="" disabled></option>
                        <option value="rural">{local.rural}</option>
                        <option value="urban">{local.urban}</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessPostalCode">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessPostalCode}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessPostalCode"
                        data-qc="businessPostalCode"
                        value={values.businessPostalCode}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
                            }
                        }}
                        maxLength={5}
                        isInvalid={errors.businessPostalCode && touched.businessPostalCode}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessPostalCode}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessPhoneNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessPhoneNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessPhoneNumber"
                        data-qc="businessPhoneNumber"
                        value={values.businessPhoneNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
                            }
                        }}
                        maxLength={10}
                        isInvalid={errors.businessPhoneNumber && touched.businessPhoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessPhoneNumber}
                    </Form.Control.Feedback>
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
                    >
                        <option value="" disabled></option>
                        <option value="businessSpeciality1">businessSpeciality1</option>
                        <option value="businessSpeciality2">businessSpeciality2</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessLicenseNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessLicenseNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessLicenseNumber"
                        data-qc="businessLicenseNumber"
                        value={values.businessLicenseNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.businessLicenseNumber && touched.businessLicenseNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessLicenseNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessLicenseIssuePlace">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessLicenseIssuePlace}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessLicenseIssuePlace"
                        data-qc="businessLicenseIssuePlace"
                        value={values.businessLicenseIssuePlace}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.businessLicenseIssuePlace && touched.businessLicenseIssuePlace}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessLicenseIssuePlace}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessLicenseIssueDate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessLicenseIssueDate}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="date"
                        name="businessLicenseIssueDate"
                        data-qc="businessLicenseIssueDate"
                        value={values.businessLicenseIssueDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.businessLicenseIssueDate && touched.businessLicenseIssueDate}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="commercialRegisterNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.commercialRegisterNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="commercialRegisterNumber"
                        data-qc="commercialRegisterNumber"
                        value={values.commercialRegisterNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.commercialRegisterNumber && touched.commercialRegisterNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.commercialRegisterNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="industryRegisterNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.industryRegisterNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="industryRegisterNumber"
                        data-qc="industryRegisterNumber"
                        value={values.industryRegisterNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.industryRegisterNumber && touched.industryRegisterNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.industryRegisterNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="taxCardNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.taxCardNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="taxCardNumber"
                        data-qc="taxCardNumber"
                        value={values.taxCardNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.taxCardNumber && touched.taxCardNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.taxCardNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Button style={{ float: 'right' }} onClick={previousStep} data-qc="previous">{local.previous}</Button>
            <Button type="submit" data-qc="next">{local.next}</Button>
        </Form>
    )
}