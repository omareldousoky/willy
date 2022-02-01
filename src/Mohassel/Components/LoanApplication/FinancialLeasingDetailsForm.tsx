import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import { InfoBox } from 'Shared/Components/InfoBox'
import {
  getCompanyInfo,
  getCustomerInfo,
} from 'Shared/Services/formatCustomersInfo'
import * as local from 'Shared/Assets/ar.json'
import Button from 'react-bootstrap/esm/Button'

export const FinancialLeasingDetailsForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
  } = props
  const categories = ['مال مادي', 'معنوي', 'حق انتفاع']
  const itemTypes = [
    'عقارات',
    'أراضي',
    'معدات ثقيلة',
    'خطوط انتاج',
    'سيارات نقل',
    'آلات و معدات',
    'سيارات ملاكي',
    'بواخر',
    'أجهزة مكتبية',
    'طائرات',
    'أخرى',
  ]

  return (
    <>
      <Form style={{ width: '90%', padding: 20 }} onSubmit={handleSubmit}>
        <fieldset
          disabled={
            !(values.state === 'edit' || values.state === 'under_review')
          }
        >
          {props.customer && Object.keys(props.customer).includes('_id') && (
            <InfoBox
              info={
                props.customer.customerType === 'company'
                  ? [getCompanyInfo({ company: props.customer })]
                  : [getCustomerInfo({ customerDetails: props.customer })]
              }
            />
          )}
          {values.financialLeasing && (
            <>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="vendorName">
                    <Form.Label>{local.vendorName}</Form.Label>
                    <Form.Control
                      type="text"
                      name="vendorName"
                      data-qc="vendorName"
                      value={values.vendorName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.vendorName && touched.vendorName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.vendorName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="itemDescription">
                    <Form.Label>{local.itemDescription}</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="text"
                      name="itemDescription"
                      data-qc="itemDescription"
                      value={values.itemDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.itemDescription && touched.itemDescription
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.itemDescription}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="categoryName">
                    <Form.Label>{local.categoryName}</Form.Label>
                    <Form.Control
                      as="select"
                      name="categoryName"
                      data-qc="categoryName"
                      value={values.categoryName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.categoryName && touched.categoryName}
                    >
                      <option value="" disabled />
                      {categories.map((category, i) => (
                        <option value={category} key={i}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.categoryName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="itemType">
                    <Form.Label>{local.itemType}</Form.Label>
                    <Form.Control
                      as="select"
                      name="itemType"
                      data-qc="itemType"
                      value={values.itemType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={errors.itemType && touched.itemType}
                    >
                      <option value="" disabled />
                      {itemTypes.map((itemType, i) => (
                        <option value={itemType} key={i}>
                          {itemType}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.itemType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Form.Group controlId="itemSerialNumber">
                    <Form.Label>{local.itemSerialNumber}</Form.Label>
                    <Form.Control
                      type="text"
                      name="itemSerialNumber"
                      data-qc="itemSerialNumber"
                      value={values.itemSerialNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        errors.itemSerialNumber && touched.itemSerialNumber
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.itemSerialNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </fieldset>
        <div className="d-flex justify-content-between py-4">
          <Button
            className="btn-cancel-prev w-25"
            onClick={() => {
              props.step('backward')
            }}
          >
            {local.previous}
          </Button>
          <Button
            variant="primary"
            className="w-25"
            type="submit"
            data-qc="submit"
          >
            {local.submit}
          </Button>
        </div>
      </Form>
    </>
  )
}
