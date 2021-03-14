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
  review: boolean
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
              isDisabled={props.edit || props.review}
            />
            {props.errors.loanId && (
              <Form.Label className="errorMsg">
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
              disabled={props.review}
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
              disabled={props.review}
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
              disabled={
                !!(props.values.manualReceipt || props.review) as boolean
              }
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
              disabled={
                !!(props.values.transactionKey || props.review) as boolean
              }
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
              disabled={props.review}
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
              disabled={props.review}
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
              disabled={props.review}
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
                <Form.Label className="errorMsg">
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
              handleChange={props.handleChange}
            />
          </Col>
          <Col>
            <Row className="row-nowrap">
              {' '}
              <Form.Label className="clearance-label">
                {local.clearanceDocumentPhoto}{' '}
              </Form.Label>
              {props.errors.documentPhoto && (
                <Form.Label className="errorMsg">
                  {props.errors.documentPhoto}
                </Form.Label>
              )}
            </Row>
            <DocumentPhoto
              data-qc="documentPhoto"
              name="documentPhoto"
              edit={props.edit}
              view={props.review}
              photoObject={{
                photoURL: props.values.documentPhotoURL || '',
                photoFile: props.values.documentPhoto,
              }}
              handleImageChange={handleDocumentPhotoChange}
              handleBlur={props.handleBlur}
              handleChange={props.handleChange}
            />
          </Col>
        </Row>
        {props.review ? (
          <>
            {status === 'underReview' && (
              <Form.Group as={Row}>
                <Col>
                  <Button
                    className="btn-reject btn-danger"
                    style={{
                      width:
                        !props.penalty || props.penalty <= 0 ? '60%' : '30%',
                    }}
                    type="submit"
                    onClick={() => {
                      props.setFieldValue('status', 'rejected')
                    }}
                  >
                    {local.rejected}
                  </Button>
                </Col>

                {(!props.penalty || props.penalty <= 0) && (
                  <Col>
                    <Button
                      type="submit"
                      className="btn-submit-next"
                      onClick={() => {
                        props.setFieldValue('status', 'approved')
                      }}
                      style={{ float: 'left', width: '60%' }}
                    >
                      {local.approved}
                    </Button>
                  </Col>
                )}
              </Form.Group>
            )}
            {status === 'rejected' && (
              <Form.Group as={Row}>
                <Col>
                  <Button
                    className="btn-warning"
                    style={{ width: '30%' }}
                    type="submit"
                    onClick={() => {
                      props.setFieldValue('status', 'underReview')
                    }}
                  >
                    {local.undoReviewClearance}
                  </Button>
                </Col>
              </Form.Group>
            )}
          </>
        ) : (
          <Form.Group as={Row}>
            <Col>
              <Button
                variant="secondary"
                style={{ width: '60%' }}
                onClick={() => {
                  props.cancel()
                }}
              >
                {local.cancel}
              </Button>
            </Col>
            <Col>
              <Button
                className="btn-submit-next"
                style={{ float: 'left', width: '60%' }}
                type="submit"
                data-qc="next"
              >
                {props.edit ? local.editClearance : local.registerClearance}
              </Button>
            </Col>
          </Form.Group>
        )}
      </Form>
    </div>
  )
}
