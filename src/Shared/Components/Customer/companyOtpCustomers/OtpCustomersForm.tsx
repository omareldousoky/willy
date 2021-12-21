import { FieldArray } from 'formik'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { OtpCustomer } from '../../../Models/Customer'
import * as local from '../../../Assets/ar.json'
import { orderLocal } from '../../../Services/utils'

export const OtpCustomersForm = (props) => {
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    cancel,
  } = props

  return (
    <Form onSubmit={handleSubmit}>
      <FieldArray
        name="otpCustomers"
        render={(arrayHelpers) => (
          <div>
            {values.otpCustomers.length > 0 &&
              values.otpCustomers.map((customer, index) => (
                <div key={index}>
                  <Form.Group as={Row} controlId="name">
                    <Form.Label column sm={4}>
                      {local.name} {orderLocal[index]}
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        name={`otpCustomers[${index}].name`}
                        data-qc="name"
                        value={values.otpCustomers[index].name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {errors.otpCustomers &&
                        errors.otpCustomers[index] &&
                        (errors.otpCustomers[index] as OtpCustomer).name && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {(errors.otpCustomers[index] as OtpCustomer).name}
                          </Form.Control.Feedback>
                        )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="phoneNumber">
                    <Form.Label column sm={4}>
                      {local.phoneNumber}
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        name={`otpCustomers.${index}.phoneNumber`}
                        data-qc="phoneNumber"
                        value={values.otpCustomers[index].phoneNumber}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        max={11}
                      />
                      {errors.otpCustomers &&
                        errors.otpCustomers[index] &&
                        (errors.otpCustomers[index] as OtpCustomer)
                          .phoneNumber && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {
                              (errors.otpCustomers[index] as OtpCustomer)
                                .phoneNumber
                            }
                          </Form.Control.Feedback>
                        )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="nationalId">
                    <Form.Label column sm={4}>
                      {local.nationalId}
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        name={`otpCustomers.${index}.nationalId`}
                        data-qc="nationalId"
                        value={values.otpCustomers[index].nationalId}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        max={14}
                      />
                      {errors.otpCustomers &&
                        errors.otpCustomers[index] &&
                        (errors.otpCustomers[index] as OtpCustomer)
                          .nationalId && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {
                              (errors.otpCustomers[index] as OtpCustomer)
                                .nationalId
                            }
                          </Form.Control.Feedback>
                        )}
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        className="mb-2"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        -
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              ))}
            <Button
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  name: '',
                  phoneNumber: '',
                  nationalId: '',
                })
              }
            >
              +
            </Button>
          </div>
        )}
      />
      <div className="my-4 d-flex justify-content-around">
        <Button variant="secondary" onClick={cancel}>
          {local.cancel}
        </Button>
        <Button variant="primary" type="submit">
          {local.submit}
        </Button>
      </div>
    </Form>
  )
}
