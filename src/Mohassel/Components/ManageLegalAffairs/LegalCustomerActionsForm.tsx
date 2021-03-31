import React, { FunctionComponent } from 'react'

import { Formik, FormikHelpers, FormikProps } from 'formik'
import { Button, Card, Form, } from 'react-bootstrap'
import { useLocation } from 'react-router'

import ability from '../../config/ability'
import Can from '../../config/Can'
import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { useParams } from 'react-router-dom'
import { createValidationSchema, createFormFieldsInitValue } from '../../../Shared/Services/utils'
import {  ILegalActionsForm, LegalCustomerActionsProps } from './types'

import FormFields from './FormFields'
import customerActionsFields from './configs/form'

// TODO:
// - Add permissions

const LegalCustomerActions: FunctionComponent<LegalCustomerActionsProps> = () => {

  const initialValues = createFormFieldsInitValue<ILegalActionsForm>(
    customerActionsFields
  )
  const customerActionsValidationSchema = createValidationSchema(
    customerActionsFields
  )

  const location = useLocation<DefaultedCustomer>()
  const { id: customerId } = useParams<{ id: string }>()
  console.log({ customerId, location, initialValues })

  const handleSubmit = (
    values: ILegalActionsForm,
    formikHelpers: FormikHelpers<ILegalActionsForm>
  ) => {
    console.log({ submit: values })
  }

  return (
    <div className="container">
      <Card className="main-card">
        <Card.Header>{local.legalAffairs}</Card.Header>

        <Card.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={customerActionsValidationSchema}
            validateOnChange
          >
            {(formikProps: FormikProps<ILegalActionsForm>) => {
              const {
                handleSubmit: formikHandleSubmit,
                errors,
                touched,
              } = formikProps
              const isValid = !!Object.keys(errors).length
              const isTouched = !!Object.keys(touched).length

              return (
                <Form onSubmit={formikHandleSubmit}>
                  <FormFields
                    formFields={customerActionsFields}
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
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalCustomerActions
