import React, { FunctionComponent } from "react"

import { Form, FormControlProps } from "react-bootstrap"

import { getNestedByStringKey } from "../../Services/utils"
import { FormFieldProps } from "./types"


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

  return (
    <Form.Group controlId={field.name}>
      <Form.Label column>{`${field.label}*`}</Form.Label>
      <Form.Control
        type={field.type}
        name={field.name}
        data-qc={field.name}
        value={fieldValue}
        isInvalid={!!fieldErrors && isToucehd}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Form.Control.Feedback type="invalid">
        {getNestedByStringKey(errors, field.name)}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default FormField
