import React, { useRef } from 'react'
import { FieldProps } from 'formik'

import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import * as local from '../../../Assets/ar.json'
import { LtsIcon } from '../..'

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
const DateField = (props: DateFieldProps & FieldProps<string>) => {
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

export default DateField
