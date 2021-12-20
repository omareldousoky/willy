import React, { useState } from 'react'
import { FieldArray, Formik } from 'formik'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { OtpCustomer } from 'Shared/Models/Customer'
// import { orderLocal } from 'Shared/Services/utils'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import local from '../../../Assets/ar.json'

interface OtpCustomersFormModalProps {
  openModal: boolean
  otpCustomers: OtpCustomer[]
  setOpenModal: (data) => void
  save: (data) => void
}
export const OtpCustomersFormModal = (props: OtpCustomersFormModalProps) => {
  const [temp, setTemp] = useState<OtpCustomer[]>(props.otpCustomers)
  return (
    <Modal
      size="lg"
      show={props.openModal}
      onHide={() => props.setOpenModal(false)}
    >
      {/* <Loader type="fullsection" open={loading} /> */}
      <Modal.Header>
        <Modal.Title>
          {local.add}
          {/* {
            orderLocal[
              props.otpCustomers.length > 10
                ? 'default'
                : props.otpCustomers.length
            ]
          } */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ otpCustomers: temp }}
          onSubmit={(va) => props.save(va)}
          validationSchema={Yup.object().shape({
            otpCustomers: Yup.array().of(
              Yup.object().shape({
                nationalId: Yup.string().required(local.required),
                phoneNumber: Yup.string().test().required(local.required),
                name: Yup.string().required(local.required),
              })
            ),
          })}
          validateOnBlur
          validateOnChange
          enableReinitialize
        >
          {(formikProps) => {
            const {
              values,
              handleBlur,
              handleChange,
              handleSubmit,
              errors,
            } = formikProps
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
                                {local.name}
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
                                  (errors.otpCustomers[index] as OtpCustomer)
                                    .name && (
                                    <Form.Control.Feedback
                                      type="invalid"
                                      style={{ display: 'block' }}
                                    >
                                      {
                                        (errors.otpCustomers[
                                          index
                                        ] as OtpCustomer).name
                                      }
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
                                        (errors.otpCustomers[
                                          index
                                        ] as OtpCustomer).phoneNumber
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
                                        (errors.otpCustomers[
                                          index
                                        ] as OtpCustomer).nationalId
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
                            {/* {index !== 0 && ( */}

                            {/* )} */}
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
                  <Button
                    variant="secondary"
                    onClick={() => {
                      props.setOpenModal(false)
                    }}
                  >
                    {local.cancel}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={temp === values.otpCustomers}
                  >
                    {local.submit}
                  </Button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  )
}
