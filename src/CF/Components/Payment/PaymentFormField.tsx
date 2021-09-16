import React from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { FormControlProps } from 'react-bootstrap/FormControl'

interface PaymentFormFieldProps extends FormControlProps {
  name: string
  displayName: string
  controlId?: string
  disable?: boolean
  error?: string
}

export const PaymentFormField = ({
  name,
  displayName,
  controlId,
  type,
  error,
  ...restProps
}: PaymentFormFieldProps) => {
  return (
    <Form.Group as={Col} md={6} controlId={controlId || name}>
      <Form.Label className="pr-0" column>
        {displayName}
      </Form.Label>
      <Form.Control
        type={type || 'text'}
        name={name}
        data-qc={name}
        {...restProps}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  )
}
