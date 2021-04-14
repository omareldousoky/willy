import React, { FunctionComponent } from 'react'

import { Form, Formik, FormikProps } from 'formik'
import { Button } from 'react-bootstrap'

import './style.scss'
import {
  createFormFieldsInitValue,
  createValidationSchema,
} from '../../Services/utils'
import FormFields, { FormFieldPairs } from './FormFields'
import { AppFormProps } from './types'
import local from '../../../Shared/Assets/ar.json'

// TODO: change naming
const AppForm: FunctionComponent<AppFormProps> = ({
  formFields,
  onSubmit,
  defaultValues,
  options: { disabled = false, renderPairs = false },
}) => {
  const initialValues = createFormFieldsInitValue(formFields, defaultValues)
  const validationSchema = createValidationSchema(formFields)

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange
    >
      {(formikProps: FormikProps<any>) => {
        const { handleSubmit: formikHandleSubmit, errors, dirty } = formikProps
        const isValid = !Object.keys(errors).length

        return (
          <Form onSubmit={formikHandleSubmit}>
            {renderPairs ? (
              <FormFieldPairs
                formFields={formFields}
                formikProps={formikProps}
              />
            ) : (
              <FormFields formFields={formFields} formikProps={formikProps} />
            )}

            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                data-qc="submit"
                disabled={disabled || !dirty || !isValid}
              >
                {local.submit}
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AppForm
