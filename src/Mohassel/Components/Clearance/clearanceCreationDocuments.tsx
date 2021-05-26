import { FormikProps } from 'formik'
import React from 'react'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import { ClearanceDocumentsValues } from './clearanceFormIntialState'
import * as local from '../../../Shared/Assets/ar.json'
import './clearance.scss'
import DocumentPhoto from '../../../Shared/Components/documentPhoto/documentPhoto'

interface Props {
  edit: boolean
  previousStep: () => void
}
const ClearanceCreationDocuments = (
  props: Props & FormikProps<ClearanceDocumentsValues>
) => {
  const handleReceiptPhotoChange = (imageFile) => {
    props.setFieldValue('receiptPhoto', imageFile)
  }
  const handleDocumentPhotoChange = (imageFile) => {
    props.setFieldValue('documentPhoto', imageFile)
  }
  return (
    <Form onSubmit={props.handleSubmit} className="w-100 m-0 p-0">
      <Form.Group controlId="receiptPhoto" className="h-25">
        <Row className="mx-3">
          <Form.Label className="clearance-label">
            {local.clearanceReceiptPhoto}
          </Form.Label>
          {props.errors.receiptPhoto && (
            <Form.Label className="error-msg px-2">
              {props.errors.receiptPhoto}
            </Form.Label>
          )}
        </Row>
        <DocumentPhoto
          data-qc="receiptPhoto"
          name="receiptPhoto"
          photoURL={props.values.receiptPhotoURL || ''}
          edit={props.edit}
          handleImageChange={handleReceiptPhotoChange}
          handleBlur={props.handleBlur}
        />
      </Form.Group>
      <Form.Group controlId="documentPhoto" className="h-25">
        <Row className="mx-3">
          <Form.Label className="clearance-label">
            {local.clearanceDocumentPhoto}
          </Form.Label>
          {props.errors.documentPhoto && (
            <Form.Label className="error-msg px-2">
              {props.errors.documentPhoto}
            </Form.Label>
          )}
        </Row>
        <DocumentPhoto
          data-qc="documentPhoto"
          name="documentPhoto"
          edit={props.edit}
          photoURL={props.values.documentPhotoURL || ''}
          handleImageChange={handleDocumentPhotoChange}
          handleBlur={props.handleBlur}
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button
          className="btn-cancel-prev w-25"
          data-qc="previous"
          onClick={() => {
            props.previousStep()
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
  )
}

export default ClearanceCreationDocuments
