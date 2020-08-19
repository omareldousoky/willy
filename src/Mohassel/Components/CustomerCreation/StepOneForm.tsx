import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../Shared/Components/Loader';
import {checkIssueDate} from '../../Services/utils';
import { getBirthdateFromNationalId, getGenderFromNationalId } from '../../Services/nationalIdValidation';
import Map from '../Map/map';
import * as local from '../../../Shared/Assets/ar.json';
import { checkNationalIdDuplicates } from '../../Services/APIs/Customer-Creation/checkNationalIdDup';
import Can from '../../config/Can';
export const StepOneForm = (props: any) => {
  const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setFieldError } = props;
  const [mapState, openCloseMap] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Form onSubmit={handleSubmit}>
      {mapState && <Map show={mapState}
        handleClose={() => openCloseMap(false)}
        save={(customerAddressLatLong: { lat: number; lng: number }) => { setFieldValue('customerAddressLatLongNumber', customerAddressLatLong); openCloseMap(false) }}
        location={props.values.customerAddressLatLongNumber}
        header={local.customerHomeAddressLocationTitle}
      />}
      <Row>
        <Col sm={12}>
          <Form.Group controlId="customerName">
            <Form.Label className="customer-form-label" column>{`${local.name}*`}</Form.Label>
            <Can I="updateNationalId" a="customer" passThrough>
              {allowed => <Form.Control
                type="text"
                name="customerName"
                data-qc="customerName"
                value={values.customerName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={errors.customerName && touched.customerName}
                disabled={(!allowed)}
              />}
            </Can>
            <Form.Control.Feedback type="invalid">
              {errors.customerName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={5}>
          <Form.Group controlId="nationalId">
            <Form.Label className="customer-form-label">{`${local.nationalId}*`}</Form.Label>
            <Can I="updateNationalId" a="customer" passThrough>
              {allowed => <Form.Control
                type="text"
                name="nationalId"
                data-qc="nationalId"
                value={values.nationalId}
                onBlur={handleBlur}
                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                disabled={(!allowed)}
              />}
            </Can>
            <Form.Control.Feedback type="invalid">
              {errors.nationalId}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={1} style={{ marginTop: 35 }}>
          <Loader type="inline" open={loading} />
        </Col>
        <Col sm={3}>
          <Form.Group controlId="birthDate">
            <Form.Label className="customer-form-label">{`${local.birthDate}*`}</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              data-qc="birthDate"
              value={values.birthDate}
              disabled
            />
          </Form.Group>
        </Col>
        <Col sm={3}>
          <Form.Group controlId="gender">
            <Form.Label className="customer-form-label">{`${local.gender}*`}</Form.Label>
            <Form.Control as="select"
              type="select"
              name="gender"
              data-qc="gender"
              value={values.gender}
              disabled
            >
              <option value="" disabled></option>
              <option value="male">{local.male}</option>
              <option value="female">{local.female}</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={5}>
          <Form.Group controlId="nationalIdIssueDate">
            <Form.Label className="customer-form-label">{`${local.nationalIdIssueDate}*`}</Form.Label>
            <Can I="updateNationalId" a="customer" passThrough>
              {allowed => <Form.Control
              type="date"
              name="nationalIdIssueDate"
              data-qc="nationalIdIssueDate"
              value={values.nationalIdIssueDate}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={errors.nationalIdIssueDate && touched.nationalIdIssueDate}
              disabled={(!allowed)}
            />}
            </Can>
            <Form.Control.Feedback type="invalid" style={checkIssueDate(values.nationalIdIssueDate) !==""? {display: 'block'}: {}}>
              {errors.nationalIdIssueDate || checkIssueDate(values.nationalIdIssueDate)}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="customerHomeAddress">
            <Form.Label className="customer-form-label">{`${local.customerHomeAddress}*`}</Form.Label>
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
            <Col sm={3}>
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="customerHomeAddressLocation">
            <Form.Label className="customer-form-label">{local.customerHomeAddressLocationTitle}</Form.Label>
            <Form.Control
              type="text"
              name="customerHomeAddressLocation"
              data-qc="customerHomeAddressLocation"
              style={{ cursor: 'pointer', color: '#7dc356', textDecoration: 'underline' }}
              value = {values.customerAddressLatLongNumber?.lat !== 0 && values.customerAddressLatLongNumber?.lng !== 0 ? local.addressChosen : local.chooseCustomerAddress}
              // value={values.customerHomeAddressLocationTitle}
              onClick={() => openCloseMap(true)}
            />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="homePostalCode">
            <Form.Label className="customer-form-label">{local.homePostalCode}</Form.Label>
            <Form.Control
              type="text"
              name="homePostalCode"
              data-qc="homePostalCode"
              value={values.homePostalCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group controlId="homePhoneNumber">
            <Form.Label className="customer-form-label">{local.homePhoneNumber}</Form.Label>
            <Form.Control
              type="text"
              name="homePhoneNumber"
              data-qc="homePhoneNumber"
              value={values.homePhoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="faxNumber">
            <Form.Label className="customer-form-label">{local.faxNumber}</Form.Label>
            <Can I="updateNationalId" a="customer" passThrough>
              {allowed =><Form.Control
              type="text"
              name="faxNumber"
              data-qc="faxNumber"
              value={values.faxNumber}
              onBlur={handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^\d*$/;
                if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                  setFieldValue('faxNumber', event.currentTarget.value)
                }
              }}
              maxLength={11}
              minLength={10}
              isInvalid={errors.faxNumber && touched.faxNumber}
              disabled={(!allowed)}
            />}
            </Can>
            <Form.Control.Feedback type="invalid">
              {errors.faxNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="mobilePhoneNumber">
        <Form.Label className="customer-form-label">{local.mobilePhoneNumber}</Form.Label>
        <Form.Control
          type="text"
          name="mobilePhoneNumber"
          data-qc="mobilePhoneNumber"
          value={values.mobilePhoneNumber}
          onBlur={handleBlur}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
      </Form.Group>

      <Form.Group controlId="emailAddress">
        <Form.Label className="customer-form-label">{local.emailAddress}</Form.Label>
        <Can I="updateNationalId" a="customer" passThrough>
          {allowed =><Form.Control
          type="text"
          name="emailAddress"
          data-qc="emailAddress"
          value={values.emailAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={errors.emailAddress && touched.emailAddress}
          disabled={(!allowed)}
          />}
        </Can>
        <Form.Control.Feedback type="invalid">
          {errors.emailAddress}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="customerWebsite">
        <Form.Label className="customer-form-label">{local.customerWebsite}</Form.Label>
        <Can I="updateNationalId" a="customer" passThrough>
          {allowed => <Form.Control
          type="text"
          name="customerWebsite"
          data-qc="customerWebsite"
          value={values.customerWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={errors.customerWebsite && touched.customerWebsite}
          disabled={(!allowed)}
        />}
        </Can>
        <Form.Control.Feedback type="invalid">
          {errors.customerWebsite}
        </Form.Control.Feedback>
      </Form.Group>
      <Button style={{ float: 'right' }} disabled>{local.previous}</Button>
      <Button type="submit" data-qc="next">{local.next}</Button>
    </Form>
  )
}