import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { getBirthdateFromNationalId, getGenderFromNationalId } from '../../Services/nationalIdValidation';
import Map from './map';
import * as local from '../../../Shared/Assets/ar.json';
import { checkNationalIdDuplicates } from '../../Services/APIs/Customer-Creation/checkNationalIdDup';

export const StepOneForm = (props: any) => {
  const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setFieldError } = props;
  const [customerAddressLatLong, setLocation] = useState({ lat: 0, long: 0 });
  const [mapState, openCloseMap] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Form onSubmit={handleSubmit}>
      {mapState && <Map show={mapState}
        handleClose={() => openCloseMap(false)}
        save={(customerAddressLatLong: { lat: number; long: number }) => { setLocation(customerAddressLatLong); setFieldValue('customerAddressLatLong', customerAddressLatLong); openCloseMap(false) }}
        location={customerAddressLatLong}
        header={local.customerHomeAddressLocationTitle}
      />}
      <Form.Group as={Row} controlId="customerName">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.name}*`}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="customerName"
            data-qc="customerName"
            value={values.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={errors.customerName && touched.customerName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.customerName}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nationalId">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.nationalId}*`}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="nationalId"
            data-qc="nationalId"
            value={values.nationalId}
            onBlur={handleBlur}
            onChange={async (event: React.FormEvent<HTMLInputElement>) => {
              const re = /^\d*$/;
              const { name, value } = event.currentTarget;
              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                setFieldValue('nationalId', value)
              }
              if (value.length === 14) {
                setLoading(true);
                const res = await checkNationalIdDuplicates(value);
                if (res.status === 'success') {
                  setLoading(false);
                  setFieldValue('nationalIdChecker', res.body.Exists);
                  setFieldValue('birthDate', getBirthdateFromNationalId(value));
                  setFieldValue('gender', getGenderFromNationalId(value));
                } else setLoading(false);
              }
            }}
            isInvalid={errors.nationalId && touched.nationalId}
            maxLength={14}
          />
          <Form.Control.Feedback type="invalid">
            {errors.nationalId}
          </Form.Control.Feedback>
        </Col>
        <Col sm={1}>
          {loading ? <Spinner animation="border" /> : null}
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="birthDate">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.birthDate}*`}</Form.Label>
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
          <Form.Control.Feedback type="invalid">
            {errors.birthDate}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="gender">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.gender}*`}</Form.Label>
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
          <Form.Control.Feedback type="invalid">
            {errors.gender}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nationalIdIssueDate">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.nationalIdIssueDate}*`}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="date"
            name="nationalIdIssueDate"
            data-qc="nationalIdIssueDate"
            value={values.nationalIdIssueDate}
            onBlur={handleBlur}
            onChange={handleChange}
            isInvalid={errors.nationalIdIssueDate && touched.nationalIdIssueDate}
          />
          <Form.Control.Feedback type="invalid">
            {errors.nationalIdIssueDate}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="customerHomeAddress">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.customerHomeAddress}*`}</Form.Label>
        <Col sm={5}>
          <Form.Control
            type="text"
            name="customerHomeAddress"
            data-qc="customerHomeAddress"
            value={values.customerHomeAddress}
            onChange={handleChange}
            isInvalid={errors.customerHomeAddress && touched.customerHomeAddress}
          />
          <Form.Control.Feedback type="invalid">
            {errors.customerHomeAddress}
          </Form.Control.Feedback>
        </Col>
        <Col sm={3}>
          <Button onClick={() => openCloseMap(true)}>{local.customerHomeAddressLocationTitle}</Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="homePostalCode">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.homePostalCode}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="homePostalCode"
            data-qc="homePostalCode"
            value={values.homePostalCode}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const re = /^\d*$/;
              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                setFieldValue('homePostalCode', event.currentTarget.value)
              }
            }}
            maxLength={5}
            onBlur={handleBlur}
            isInvalid={errors.homePostalCode && touched.homePostalCode}
          />
          <Form.Control.Feedback type="invalid">
            {errors.homePostalCode}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="homePhoneNumber">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.homePhoneNumber}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="homePhoneNumber"
            data-qc="homePhoneNumber"
            value={values.homePhoneNumber}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const re = /^\d*$/;
              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                setFieldValue('homePhoneNumber', event.currentTarget.value)
              }
            }}
            onBlur={handleBlur}
            maxLength={10}
            isInvalid={errors.homePhoneNumber && touched.homePhoneNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.homePhoneNumber}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="mobilePhoneNumber">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.mobilePhoneNumber}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="mobilePhoneNumber"
            data-qc="mobilePhoneNumber"
            value={values.mobilePhoneNumber}
            onBlur={handleBlur}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const re = /^\d*$/;
              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                setFieldValue('mobilePhoneNumber', event.currentTarget.value)
              }
            }}
            maxLength={11}
            isInvalid={errors.mobilePhoneNumber && touched.mobilePhoneNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.mobilePhoneNumber}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="faxNumber">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.faxNumber}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="faxNumber"
            data-qc="faxNumber"
            value={values.faxNumber}
            onBlur={handleBlur}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const re = /^\d*$/;
              if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                setFieldValue('faxNumber', event.currentTarget.value)
              }
            }}
            maxLength={11}
            minLength={10}
            isInvalid={errors.faxNumber && touched.faxNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.faxNumber}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="emailAddress">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.emailAddress}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="emailAddress"
            data-qc="emailAddress"
            value={values.emailAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={errors.emailAddress && touched.emailAddress}
          />
          <Form.Control.Feedback type="invalid">
            {errors.emailAddress}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="customerWebsite">
        <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.customerWebsite}</Form.Label>
        <Col sm={6}>
          <Form.Control
            type="text"
            name="customerWebsite"
            data-qc="customerWebsite"
            value={values.customerWebsite}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={errors.customerWebsite && touched.customerWebsite}
          />
          <Form.Control.Feedback type="invalid">
            {errors.customerWebsite}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Button style={{ float: 'right' }} disabled>{local.previous}</Button>
      <Button type="submit" data-qc="next">{local.next}</Button>
    </Form>
  )
}