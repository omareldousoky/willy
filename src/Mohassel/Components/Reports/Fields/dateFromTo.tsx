import { Field, FieldValidator } from 'formik'
import React, { InputHTMLAttributes } from 'react'

import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

import * as local from '../../../../Shared/Assets/ar.json'
import DateField from '../../Common/FormikFields/dateField'

interface DateFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  id?: string
  error?: string
  validate?: FieldValidator
  isInvalid?: boolean
  touched?: number
}

interface DateFromToFieldProps {
  id: string
  name: string
  from: DateFieldProps
  to: DateFieldProps
  className?: string
  labelWidth?: string
}

export const DateFromToField = (props: DateFromToFieldProps) => {
  const { id, className, name, from, to, labelWidth } = props
  return (
    <Col sm={12} className={className || ''}>
      <InputGroup className="mb-0 flex-column" id={id}>
        <div
          className="dropdown-container"
          style={{ flex: 1, alignItems: 'center' }}
        >
          <p
            className="dropdown-label text-nowrap border-0 align-self-stretch mr-2"
            style={{ width: '15rem' || labelWidth }}
          >
            {name}
          </p>
          <span>{local.from}</span>
          <Field
            onlyField
            {...from}
            fieldClassName="border-0"
            type="date"
            name={from.name}
            id={from.id || from.name}
            value={from.value}
            isInvalid={from.isInvalid}
            component={DateField}
            key={from.id || from.name}
            disabled={from.disabled}
            validate={from.validate}
            min={from.min}
            max={from.max}
          />
          <span className="mr-1">{local.to}</span>
          <Field
            onlyField
            {...to}
            fieldClassName="border-0"
            type="date"
            name={to.name}
            id={to.id || to.name}
            value={to.value}
            isInvalid={to.isInvalid}
            component={DateField}
            key={to.id || to.name}
            disabled={to.disabled}
            validate={to.validate}
            min={to.min || from.value}
            max={to.max}
          />
        </div>
        <span className="text-danger ml-auto mt-2">
          {(from.touched ? from.error : '') || (to.touched ? to.error : '')}
        </span>
      </InputGroup>
    </Col>
  )
}
