import React, { useRef, InputHTMLAttributes } from 'react'
import { Field, FieldProps, FieldValidator } from 'formik'

import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import * as local from '../../../Assets/ar.json'
import { LtsIcon } from '../../LtsIcon'

interface DateFieldProps {
  key: string
  id: string
  smSize?: number
  className?: string
  onlyField?: boolean
  fieldClassName?: string
  label?: string
  isClearable?: boolean
  onClear?: () => void
}

interface DateFieldFromToProps extends InputHTMLAttributes<HTMLInputElement> {
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
  from: DateFieldFromToProps
  to: DateFieldFromToProps
  cols?: number
  className?: string
  labelWidth?: string
}

export const DateField = (props: DateFieldProps & FieldProps<string>) => {
  const {
    field,
    form,
    key,
    id,
    smSize,
    className,
    fieldClassName,
    onlyField = false,
    label,
    isClearable,
    onClear,
    ...restProps
  } = props
  const { touched, errors } = form
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {!onlyField && (
        <Col
          sm={smSize || 12}
          className={`d-flex flex-column ${className || ''}`}
        >
          <InputGroup key={key}>
            <InputGroup.Prepend>
              <InputGroup.Text id={`${id || field.name}Text`}>
                {label || local.date}
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={inputRef}
              type="date"
              {...field}
              {...restProps}
              id={id || field.name}
              className="mr-0"
            />
            {isClearable && (
              <InputGroup.Append>
                <InputGroup.Text
                  onClick={() => {
                    if (inputRef?.current !== null && inputRef.current.value) {
                      inputRef.current.value = ''
                    }
                    if (onClear) onClear()
                  }}
                >
                  <LtsIcon name="close" />
                </InputGroup.Text>
              </InputGroup.Append>
            )}
          </InputGroup>
          {touched[field.name] && errors[field.name] && (
            <small className="text-danger ml-auto mb-2">
              {errors[field.name]}
            </small>
          )}
        </Col>
      )}
      {onlyField && (
        <FormControl
          type="date"
          {...field}
          {...restProps}
          id={id || field.name}
          className={`mr-0 ${fieldClassName || ''}`}
        />
      )}
    </>
  )
}

export const DateFromToField = (props: DateFromToFieldProps) => {
  const { id, className, name, from, cols, to, labelWidth } = props
  return (
    <Col sm={cols || 12} className={className || ''}>
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
            min={from.min || undefined}
            max={from.max || undefined}
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
            max={to.max || undefined}
          />
        </div>
        <span className="text-danger ml-auto mt-2">
          {(from.touched ? from.error : '') || (to.touched ? to.error : '')}
        </span>
      </InputGroup>
    </Col>
  )
}
