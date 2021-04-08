import React, { FunctionComponent } from 'react'

import { Form, FormControlProps } from 'react-bootstrap'
import { Schema } from 'yup'

import { getNestedByStringKey } from '../../Services/utils'
import { FormFieldProps } from './types'

const FormField: FunctionComponent<FormFieldProps> = ({
  field,
  formikProps: { values, handleChange, handleBlur, touched, errors },
}) => {
  const fieldErrors = getNestedByStringKey(errors, field.name)
  const isToucehd = !!getNestedByStringKey(touched, field.name)

  const fieldValue = getNestedByStringKey(
    values,
    field.name
  ) as FormControlProps['value']

  const isRequired = (validationSchema: Schema<any>) =>
    !!validationSchema
      .describe()
      .tests.find((test: any) => test.name === 'required')

  const label = `${field.label}${isRequired(field.validation) ? ' *' : ''}`


  const renderFormField = () => {
    switch (field.type) {
      case 'checkbox':
        return <Form.Check type="checkbox" label={label} />

      case 'select':
        return (
          <Form.Control
            as="select"
            name={field.name}
            value={fieldValue}
            data-qc={field.name}
            isInvalid={!!fieldErrors && isToucehd}
            onChange={handleChange}
            onBlur={handleBlur}
            className="dropdown-select"
            defaultValue=""
          >
            <option disabled value=""></option>
            {field.options.map(({ label, value }) => (
              <option key={value} value={value} data-qc={value}>
                {label}
              </option>
            ))}
          </Form.Control>
        )

      default:
        return (
          <Form.Control
            type={field.type}
            name={field.name}
            value={fieldValue}
            data-qc={field.name}
            isInvalid={!!fieldErrors && isToucehd}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )
    }
  }

  return (
    <Form.Group controlId={field.name}>
      <Form.Label column title={label}>
        {label}
      </Form.Label>

      {renderFormField()}

      <Form.Control.Feedback type="invalid">
        {getNestedByStringKey(errors, field.name)}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default FormField
