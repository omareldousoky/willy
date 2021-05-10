import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useRef,
} from 'react'

import { Form, FormControlProps } from 'react-bootstrap'
import { Schema } from 'yup'

import { getDateString } from '../../../../Shared/Services/utils'
import { FormFieldProps } from './types'
import DocumentPhoto from '../../../../Shared/Components/documentPhoto/documentPhoto'
import { AppFormContext } from '.'
import { getNestedByStringKey } from './utils'

const FormField: FunctionComponent<FormFieldProps> = ({
  field,
  formikProps: {
    values,
    setFieldValue,
    handleChange,
    handleBlur,
    touched,
    errors,
  },
}) => {
  const { defaultValues } = useContext(AppFormContext)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldErrors = getNestedByStringKey(errors, field.name)
  const isToucehd = !!getNestedByStringKey(touched, field.name)

  const fieldValue = getNestedByStringKey(
    values,
    field.name
  ) as FormControlProps['value']

  const isRequired = (validationSchema: Schema<any>) =>
    !!validationSchema &&
    !!validationSchema
      .describe()
      .tests.find((test: any) => test.name === 'required')

  const label = `${field.label}${isRequired(field.validation) ? ' *' : ''}`

  const inputFieldProps = {
    name: field.name,
    value: fieldValue,
    readOnly: field.readOnly ?? false,
    disabled: field.disabled ?? field.readOnly ?? false,
    'data-qc': field.name,
    isInvalid: !!fieldErrors && isToucehd,
    onChange: handleChange,
    onBlur: handleBlur,
  }

  const renderFormField = () => {
    switch (field.type) {
      case 'checkbox':
        return (
          <Form.Check
            {...inputFieldProps}
            disabled={inputFieldProps.readOnly}
            type="checkbox"
            label={field.checkboxLabel}
            defaultChecked={!!inputFieldProps.value}
          />
        )

      case 'select':
        return (
          <Form.Control
            {...inputFieldProps}
            as="select"
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

      case 'textarea':
        return <Form.Control {...inputFieldProps} as="textarea" rows={3} />

      case 'photo':
        return (
          <DocumentPhoto
            name={inputFieldProps.name}
            handleImageChange={(imageFile) => {
              setFieldValue(inputFieldProps.name, imageFile)
            }}
            handleBlur={inputFieldProps.onBlur}
            view={inputFieldProps.disabled}
            edit={!inputFieldProps.disabled}
            photoObject={{
              photoURL: defaultValues[field.name + 'URL'] ?? '',
              photoFile: '',
            }}
          />
        )

      case 'file':
        return (
          <Form.File
            name={inputFieldProps.name}
            id={inputFieldProps.name}
            type="file"
            accept={field.accepts}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFieldValue(inputFieldProps.name, e.currentTarget.files)
            }
            onClick={() => {
              if (fileInputRef.current === null) return
              fileInputRef.current.value = ''
            }}
            ref={fileInputRef}
          />
        )

      default:
        return (
          <Form.Control
            {...inputFieldProps}
            type={field.type}
            value={
              field.type === 'date' && inputFieldProps.value
                ? getDateString(inputFieldProps.value)
                : inputFieldProps.value
            }
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
