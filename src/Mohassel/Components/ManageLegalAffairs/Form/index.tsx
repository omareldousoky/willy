import React, { createContext, FunctionComponent } from 'react'

import { Form, Formik, FormikProps } from 'formik'
import Button from 'react-bootstrap/Button'

import './style.scss'

import FormFields, { FormFieldPairs } from './FormFields'
import { AppFormProps } from './types'
import local from '../../../../Shared/Assets/ar.json'
import { createFormFieldsInitValue, createValidationSchema } from './utils'

interface FormContext {
  defaultValues: {}
  onPhotoChange?: (name: string, value: string | File) => void
}

export const AppFormContext = createContext<FormContext>({
  defaultValues: {},
})

// TODO: change the naming
const AppForm: FunctionComponent<AppFormProps> = ({
  formFields,
  onSubmit,
  onCancel,
  onChange,
  onPhotoChange,
  defaultValues,
  options = {},
}) => {
  const initialValues = createFormFieldsInitValue(formFields, defaultValues)
  const validationSchema = createValidationSchema(
    formFields,
    options.validationSort
  )

  const {
    disabled = false,
    renderPairs = false,
    submitBtnText = local.submit,
    wideBtns = false,
    footer,
  } = options

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange
    >
      {(formikProps: FormikProps<any>) => {
        const { handleSubmit: formikHandleSubmit, dirty } = formikProps

        return (
          <Form onSubmit={formikHandleSubmit} onChange={onChange}>
            <AppFormContext.Provider
              value={{
                defaultValues,
                onPhotoChange,
              }}
            >
              {renderPairs ? (
                <FormFieldPairs
                  formFields={formFields}
                  formikProps={formikProps}
                />
              ) : (
                <FormFields formFields={formFields} formikProps={formikProps} />
              )}
            </AppFormContext.Provider>

            {footer}

            <div className="d-flex flex-row-reverse justify-content-between mt-3 mb-2">
              <Button
                type="submit"
                data-qc="submit"
                variant="primary"
                disabled={disabled || !dirty}
                className={wideBtns ? 'wide-btn' : ''}
              >
                {submitBtnText}
              </Button>
              {onCancel && (
                <Button
                  variant="outline-primary"
                  onClick={onCancel}
                  className={wideBtns ? 'wide-btn' : ''}
                >
                  {local.cancel}
                </Button>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AppForm
