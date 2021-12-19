import React from 'react'
import Modal from 'react-bootstrap/esm/Modal'
import local from 'Shared/Assets/ar.json'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Form from 'react-bootstrap/esm/Form'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/esm/Button'
import { REJECTION_REASONS } from './utils'

export const RejectLeadModal = ({
  rejectLeadModal,
  setRejectLeadModal,
  changeMainState,
  selectedLeadNumber,
  setSelectedLeadNumber,
}) => {
  const rejectLead = (values: {
    rejectionReason: string
    rejectionDetails: string
  }) => {
    changeMainState(
      selectedLeadNumber,
      'rejected',
      values.rejectionReason,
      values.rejectionDetails
    )
    setSelectedLeadNumber('')
  }
  return (
    <Modal
      size="lg"
      show={rejectLeadModal}
      onHide={() => setRejectLeadModal(false)}
    >
      <Modal.Header>
        <Modal.Title className="m-auto">{local.rejectApplication}</Modal.Title>
        <button
          type="button"
          className="mr-0 pr-0 close"
          onClick={() => setRejectLeadModal(false)}
        >
          <span aria-hidden="true">x</span>
          <span className="sr-only">Close</span>
        </button>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          initialValues={{ rejectionReason: '', rejectionDetails: '' }}
          onSubmit={rejectLead}
          validationSchema={Yup.object().shape({
            rejectionReason: Yup.string().required(local.required),
          })}
          validateOnBlur
          validateOnChange
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <Col>
                <Form.Group controlId="rejectionReason">
                  <Form.Label column sm={4}>
                    {local.rejectionReason}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="rejectionReason"
                    data-qc="rejectionReason"
                    value={formikProps.values.rejectionReason}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isInvalid={
                      Boolean(formikProps.errors.rejectionReason) &&
                      Boolean(formikProps.touched.rejectionReason)
                    }
                  >
                    <option value="" disabled />
                    {REJECTION_REASONS.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.rejectionReason}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="rejectionDetails">
                  <Form.Label className="customer-form-label">
                    {local.rejectionDetails}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="rejectionDetails"
                    data-qc="rejectionDetails"
                    onChange={formikProps.handleChange}
                    maxLength={200}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button
                  type="submit"
                  className="mt-4 w-100"
                  disabled={false}
                  variant="primary"
                >
                  {local.submit}
                </Button>
              </Col>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}
