import React from 'react'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { FieldArray } from 'formik'

import * as local from '../../../Shared/Assets/ar.json'
import { getBirthdateFromNationalId } from '../../../Shared/Services/nationalIdValidation'
import { getDateString } from '../../../Shared/Services/utils'

export const GuarantorDetailsForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    setFieldValue,
    touched,
  } = props
  return (
    <Form onSubmit={handleSubmit} style={{ padding: '1rem 2rem' }}>
      <div style={{ width: '100%', margin: '20px 0' }}>
        <h5>{local.guarantorInfo}</h5>
        <FieldArray
          name="guarantors"
          render={(arrayHelpers) => (
            <div>
              {values.guarantors.length > 0 &&
                values.guarantors.map((customer, index) => (
                  <div key={index} className="d-flex my-4">
                    <Col sm={11}>
                      <Form.Group as={Row} controlId="name">
                        <Form.Label column sm={4}>
                          {local.name}
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Control
                            type="text"
                            name={`guarantors[${index}].name`}
                            data-qc="name"
                            value={values.guarantors[index].name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={
                              (errors.guarantors &&
                                errors.guarantors[index] &&
                                errors.guarantors[index].name &&
                                touched.guarantors &&
                                touched.guarantors[index] &&
                                touched.guarantors[index].name) as boolean
                            }
                          />
                          {errors.guarantors &&
                            errors.guarantors[index] &&
                            errors.guarantors[index].name &&
                            touched.guarantors &&
                            touched.guarantors[index] &&
                            touched.guarantors[index].name && (
                              <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block' }}
                              >
                                {errors.guarantors[index].name}
                              </Form.Control.Feedback>
                            )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="address">
                        <Form.Label column sm={4}>
                          {local.address}
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Control
                            type="text"
                            name={`guarantors.${index}.address`}
                            data-qc="address"
                            value={values.guarantors[index].address}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            isInvalid={
                              (errors.guarantors &&
                                errors.guarantors[index] &&
                                errors.guarantors[index].address &&
                                touched.guarantors &&
                                touched.guarantors[index] &&
                                touched.guarantors[index].address) as boolean
                            }
                          />
                          {errors.guarantors &&
                            errors.guarantors[index] &&
                            errors.guarantors[index].address &&
                            touched.guarantors &&
                            touched.guarantors[index] &&
                            touched.guarantors[index].address && (
                              <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block' }}
                              >
                                {errors.guarantors[index].address}
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
                            type="number"
                            name={`guarantors.${index}.nationalId`}
                            data-qc="nationalId"
                            value={values.guarantors[index].nationalId}
                            onBlur={handleBlur}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const re = /^\d*$/
                              const { value } = event.currentTarget
                              if (
                                event.currentTarget.value === '' ||
                                re.test(event.currentTarget.value)
                              ) {
                                setFieldValue(
                                  `guarantors.${index}.nationalId`,
                                  value
                                )
                              }
                              if (value.length === 14) {
                                setFieldValue(
                                  `guarantors.${index}.birthDate`,
                                  getBirthdateFromNationalId(value)
                                )
                              }
                            }}
                            isInvalid={
                              (errors.guarantors &&
                                errors.guarantors[index] &&
                                errors.guarantors[index].nationalId &&
                                touched.guarantors &&
                                touched.guarantors[index] &&
                                touched.guarantors[index].nationalId) as boolean
                            }
                          />
                          {errors.guarantors &&
                            errors.guarantors[index] &&
                            errors.guarantors[index].nationalId &&
                            touched.guarantors &&
                            touched.guarantors[index] &&
                            touched.guarantors[index].nationalId && (
                              <Form.Control.Feedback
                                type="invalid"
                                style={{ display: 'block' }}
                              >
                                {errors.guarantors[index].nationalId}
                              </Form.Control.Feedback>
                            )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="birthDate">
                        <Form.Label column sm={4}>
                          {local.birthDate}
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Control
                            type="text"
                            name={`guarantors.${index}.birthDate`}
                            data-qc="birthDate"
                            value={
                              typeof values.guarantors[index].birthDate ===
                              'string'
                                ? values.guarantors[index].birthDate
                                : getDateString(
                                    values.guarantors[index].birthDate
                                  )
                            }
                            disabled
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col sm={1}>
                      <Button
                        type="button"
                        className="mb-2"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        -
                      </Button>
                    </Col>
                  </div>
                ))}
              {values.guarantors.length < 2 && (
                <Button
                  type="button"
                  className="mx-2"
                  onClick={() =>
                    arrayHelpers.push({
                      name: '',
                      address: '',
                      nationalId: '',
                      birthDate: '',
                    })
                  }
                >
                  +
                </Button>
              )}
              <Button variant="primary" onClick={handleSubmit}>
                {local.submit}
              </Button>
            </div>
          )}
        />
      </div>
    </Form>
  )
}
