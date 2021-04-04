import React, { FunctionComponent } from "react"

import { Form, Formik, FormikProps } from "formik"
import { Button } from "react-bootstrap"

import { createFormFieldsInitValue, createValidationSchema } from "../../Services/utils"
import { FormFieldPairs } from "./FormFields"
import { AppFormProps } from "./types"
import local from '../../../Shared/Assets/ar.json'


const AppForm: FunctionComponent<AppFormProps> = ({ formFields, onSubmit }) => {
  const initialValues = createFormFieldsInitValue(formFields)
  const validationSchema = createValidationSchema(formFields)

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange
    >
      {(formikProps: FormikProps<any>) => {
        const {
          handleSubmit: formikHandleSubmit,
          errors,
          touched,
        } = formikProps
        const isValid = !!Object.keys(errors).length
        const isTouched = !!Object.keys(touched).length

        return (
          <Form onSubmit={formikHandleSubmit}>
            <FormFieldPairs
              formFields={formFields}
              formikProps={formikProps}
            />

            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                data-qc="submit"
                disabled={!isTouched || (isTouched && isValid)}
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