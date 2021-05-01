import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import Select from 'react-select'
import * as local from '../../../Shared/Assets/ar.json'
import {
  ClearanceValues,
  ClearanceErrors,
  ClearanceTouched,
} from './clearanceFormIntialState'
import DocumentPhoto from '../../../Shared/Components/documentPhoto/documentPhoto'
import { theme } from '../../../Shared/theme'
import './clearance.scss'

interface Props {
  values: ClearanceValues
  errors: ClearanceErrors
  touched: ClearanceTouched
  paidLoans: any[]
  edit: boolean
  customerKey: string
  penalty: number
  handleChange: (
    eventOrPath: string | React.ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void)
  handleBlur: (eventOrString: any) => void | ((e: any) => void)
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
  cancel: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => any
}

export const CreateClearanceForm = (props: Props) => {
  const [selectedApplication, setApplication] = useState(
    props.paidLoans.filter((loan) => loan.id === props.values.loanId)
  )
  const { status } = props.values
  const handleReceiptPhotoChange = (imageFile) => {
    props.setFieldValue('receiptPhoto', imageFile)
  }
  const handleDocumentPhotoChange = (imageFile) => {
    props.setFieldValue('documentPhoto', imageFile)
  }
  return (
    <div style={{ padding: '2rem 30px' }}>
      <Form className="clearance-form" onSubmit={props.handleSubmit}>
        <Row className="clearance-row">
          <Form.Group as={Col} controlId="application">
            <Form.Label className="clearance-label">
              {local.financeCode}
            </Form.Label>
            <Select
              name="application"
              data-qc="application"
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              value={selectedApplication}
              onChange={(event) => {
                props.setFieldValue('loanId', event.id)
                setApplication(event)
              }}
              options={props.paidLoans}
              getOptionLabel={(option) => option.Key}
              getOptionValue={(option) => option.id}
              isDisabled={props.edit}
            />
            {props.errors.loanId && (
              <Form.Label className="error-msg">
                {props.errors.loanId}
              </Form.Label>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="customerKey">
            <Form.Label className="clearance-label">
              {local.customerCode}
            </Form.Label>
            <Form.Control
              type="text"
              name="customerKey"
              data-qc="customerKey"
              value={props.customerKey}
              disabled
            />
          </Form.Group>
        </Row>
        <Row className="clearance-row">
          <Form.Group as={Col} controlId="registrationDate">
            <Form.Label className="clearance-label">
              {local.registrationDate}
            </Form.Label>
            <Form.Control
              type="date"
              name="registrationDate"
              data-qc="registrationDate"
              value={props.values.registrationDate as string}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.registrationDate &&
                  props.touched.registrationDate) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.registrationDate}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="receiptDate">
            <Form.Label className="clearance-label">
              {local.receiptDate}
            </Form.Label>
            <Form.Control
              type="date"
              name="receiptDate"
              data-qc="receiptDate"
              value={props.values.receiptDate as string}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.receiptDate &&
                  props.touched.receiptDate) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.receiptDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="clearance-row">
          <Form.Group as={Col} controlId="transactionKey">
            <Form.Label className="clearance-label">
              {local.transactionKey}
            </Form.Label>
            <Form.Control
              type="text"
              name="transactionKey"
              data-qc="transactionKey"
              value={props.values.transactionKey}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.transactionKey &&
                  props.touched.transactionKey) as boolean
              }
              disabled={!!props.values.manualReceipt as boolean}
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.transactionKey}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="manualReceipt">
            <Form.Label className="clearance-label">
              {local.manualReceipt}
            </Form.Label>
            <Form.Control
              type="text"
              name="manualReceipt"
              data-qc="manualReceipt"
              value={props.values.manualReceipt}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.manualReceipt &&
                  props.touched.manualReceipt) as boolean
              }
              disabled={!!props.values.transactionKey as boolean}
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.manualReceipt}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="clearance-row">
          <Form.Group as={Col} controlId="clearanceReason">
            <Form.Label className="clearance-label">
              {local.clearanceReason}{' '}
            </Form.Label>
            <Form.Control
              type="text"
              name="clearanceReason"
              data-qc="clearanceReason"
              value={props.values.clearanceReason}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.clearanceReason &&
                  props.touched.clearanceReason) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.clearanceReason}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="bankName">
            <Form.Label className="clearance-label">
              {local.bankName}
            </Form.Label>
            <Form.Control
              type="text"
              name="bankName"
              data-qc="bankName"
              value={props.values.bankName}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.bankName && props.touched.bankName) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.bankName}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="clearance-row">
          <Form.Group as={Col} controlId="notes">
            <Form.Label className="clearance-label">
              {local.comments}
            </Form.Label>
            <Form.Control
              type="text"
              name="notes"
              data-qc="notes"
              value={props.values.notes}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={(props.errors.notes && props.touched.notes) as boolean}
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.notes}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="clearance-row">
          <Col>
            <Row>
              <Form.Label className="clearance-label">
                {local.clearanceReceiptPhoto}
              </Form.Label>
              {props.errors.receiptPhoto && (
                <Form.Label className="error-msg">
                  {props.errors.receiptPhoto}
                </Form.Label>
              )}
            </Row>
            <DocumentPhoto
              data-qc="receiptPhoto"
              name="receiptPhoto"
              photoObject={{
                photoURL: props.values.receiptPhotoURL || '',
                photoFile: props.values.receiptPhoto,
              }}
              edit={props.edit}
              view={props.review}
              handleImageChange={handleReceiptPhotoChange}
              handleBlur={props.handleBlur}
            />
          </Col>
          <Col>
            <Row className="row-nowrap">
              {' '}
              <Form.Label className="clearance-label">
                {local.clearanceDocumentPhoto}{' '}
              </Form.Label>
              {props.errors.documentPhoto && (
                <Form.Label className="error-msg">
                  {props.errors.documentPhoto}
                </Form.Label>
              )}
            </Row>
            <DocumentPhoto
              data-qc="documentPhoto"
              name="documentPhoto"
              edit={props.edit}
              photoObject={{
                photoURL: props.values.documentPhotoURL || '',
                photoFile: props.values.documentPhoto,
              }}
              handleImageChange={handleDocumentPhotoChange}
              handleBlur={props.handleBlur}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            variant="secondary"
            className="w-25"
            onClick={() => {
              props.cancel()
            }}
          >
            {local.cancel}
          </Button>
          <Button className="w-25" type="submit" data-qc="submit">
            {props.edit ? local.editClearance : local.registerClearance}
          </Button>
        </div>
      </Form>
    </div>
  )
}
