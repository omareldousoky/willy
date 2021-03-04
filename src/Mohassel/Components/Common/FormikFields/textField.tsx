import React from 'react'
import { FieldProps } from 'formik'
import { Col, FormControl, InputGroup } from 'react-bootstrap'

interface TextFieldProps {
  key: string
  id: string
  displayName?: string
  type?: 'number'
  smSize?: number
  className?: string
  onlyField?: boolean
  fieldClassName?: string
}

const TextField = (props: TextFieldProps & FieldProps<string>) => {
  const {
    field,
    form,
    key,
    id,
    smSize,
    className,
    fieldClassName,
    displayName,
    type,
    onlyField = false,
    ...restProps
  } = props
  const { touched, errors } = form

  return (
    <>
      {!onlyField && (
        <Col
          sm={smSize || 12}
          className={`d-flex flex-column ${className || ''}`}
        >
          <InputGroup key={key}>
            {displayName && (
              <InputGroup.Append>
                <InputGroup.Text id={`${id || field.name}Text`}>
                  {displayName}
                </InputGroup.Text>
              </InputGroup.Append>
            )}
            <FormControl
              type={type || 'text'}
              {...field}
              {...restProps}
              id={id || field.name}
              className="mr-0"
            />
          </InputGroup>
          {touched[field.name] && errors[field.name] && (
            <small className="text-danger ml-auto mb-2">
              {errors[field.name]}
            </small>
          )}
        </Col>
      )}
      {onlyField && (
        <>
          <FormControl
            type={type || 'text'}
            {...field}
            {...restProps}
            id={id || field.name}
            className={`mr-0 ${fieldClassName || ''}`}
          />
          {touched[field.name] && errors[field.name] && (
            <small className="text-danger ml-auto mb-2">
              {errors[field.name]}
            </small>
          )}
        </>
      )}
    </>
  )
}

export default TextField
