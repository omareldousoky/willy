import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import Select, { ValueType } from 'react-select'
import { FormikProps } from 'formik'
import * as local from '../../../Shared/Assets/ar.json'
import { ClearanceDataValues } from './clearanceFormIntialState'
import { theme } from '../../../Shared/theme'
import './clearance.scss'

interface PaidLoan {
  Key: number | string
  id: string
}
interface Props {
  paidLoans: PaidLoan[]
  edit: boolean
  customerKey: string
  customerType: string
  cancel: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
}

export const ClearanceCreationForm = (
  props: Props & FormikProps<ClearanceDataValues>
) => {
  const [selectedApplication, setSelectedApplication] = useState<
    PaidLoan | PaidLoan[]
  >(props.paidLoans.filter((loan) => loan.id === props.values.loanId))
  return (
    <Form onSubmit={props.handleSubmit}>
      <Row className="px-2 py-3">
        <Form.Group as={Col} controlId="application">
          <Form.Label className="clearance-label">
            {local.financeCode}
          </Form.Label>
          <Select<PaidLoan>
            name="application"
            data-qc="application"
            styles={theme.selectStyleWithBorder}
            theme={theme.selectTheme}
            value={selectedApplication}
            onChange={(event: ValueType<PaidLoan> | PaidLoan) => {
              if (event) {
                const { id } = event as PaidLoan
                props.setFieldValue('loanId', id)
                setSelectedApplication(event as PaidLoan)
              }
            }}
            options={props.paidLoans}
            getOptionLabel={(option) => option.Key as string}
            getOptionValue={(option) => option.id}
            isDisabled={props.edit}
          />
          {props.errors.loanId && (
            <Form.Label className="error-msg">{props.errors.loanId}</Form.Label>
          )}
        </Form.Group>
        <Form.Group as={Col} controlId="customerKey">
          <Form.Label className="clearance-label">
            {props.customerType === 'company'
              ? local.companyCode
              : local.customerCode}
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
      <Row className="px-2 py-3">
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
              (props.errors.receiptDate && props.touched.receiptDate) as boolean
            }
          />
          <Form.Control.Feedback type="invalid">
            {props.errors.receiptDate}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="px-2 py-3">
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

      <Row className="px-2 py-3">
        <Form.Group as={Col} controlId="clearanceReason">
          <Form.Label className="clearance-label">
            {local.clearanceReason}
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
          <Form.Label className="clearance-label">{local.bankName}</Form.Label>
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
      <Row className="px-2 py-3">
        <Form.Group as={Col} controlId="notes">
          <Form.Label className="clearance-label">{local.comments}</Form.Label>
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
          {local.next}
        </Button>
      </div>
    </Form>
  )
}
