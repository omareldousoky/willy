import React, { FunctionComponent } from 'react'

import { Formik, FormikHelpers, FormikProps } from 'formik'
import * as Yup from 'yup'
import { Button, Card, Col, Form, FormControlProps, Row } from 'react-bootstrap'
import { useLocation } from 'react-router'

import ability from '../../config/ability'
import Can from '../../config/Can'
import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { useParams } from 'react-router-dom'

// TODO:
// - Add permissions
// - extract interfaces and types to new files

// Start TODO: Extract to helpers/utils shared file
interface IField {
  name: string
  type: 'text' | 'date'
  label: string
  validation: Yup.Schema<any>
}
interface IGroupField {
  name: string
  type: 'group'
  fields: IField[]
}
type IFormField = IGroupField | IField

const isGroupField = (formField: IFormField) => formField?.type === 'group'

const createValidationSchema = (formFields: IFormField[]) => {
  const validationFields = formFields.reduce((acc, formField) => {
    if (isGroupField(formField)) {
      const groupFormField = {
        [formField.name]: createValidationSchema(
          (formField as IGroupField).fields
        ),
      }

      return { ...acc, ...groupFormField }
    }

    const { name, validation } = formField as IField
    return { ...acc, [name]: validation }
  }, {})

  return Yup.object().shape(validationFields)
}

const arrayToPairs = <T extends unknown>(array: any[]): T[][] =>
  array.reduce(
    (result, value, index, sourceArray) =>
      index % 2 === 0
        ? [...result, sourceArray.slice(index, index + 2)]
        : result,
    []
  )

const getNestedByStringKey = (obj: {}, key: string) =>
  key.split('.').reduce((p, c) => (p && p[c]) || undefined, obj)

const createFormFieldsInitValue = <T extends {}>(
  formFields: IFormField[]
): T => {
  return formFields.reduce((acc, formField) => {
    const { name } = formField

    if (isGroupField(formField)) {
      const fields = createFormFieldsInitValue(
        (formField as IGroupField).fields
      )

      return { ...acc, [name]: fields }
    }

    return { ...acc, [name]: undefined }
  }, {} as T)
}
// End TODO

type LegalCustomerActionsProps = {}

interface ICortSession {
  date: string
  decision: string
  confinementNumber: string
}

interface ILegalActionsForm {
  statusNumber: string
  caseNumber: string
  court: string
  statementOfClaim: string

  firstCourtSession: ICortSession
  oppositionSession: ICortSession
}

// TODO: Remove defaultValidationSchema then add the validation Schema for each field
const defaultValidationSchema = Yup.string()
  .trim()
  .max(100, local.maxLength100)
  .required(local.required)

const numbersAsStringRegEx = /^\d+$/
const numbersAsStringSchema = defaultValidationSchema.matches(
  numbersAsStringRegEx,
  'The field should have digits only'
)

// TODO: Add localization labels an validations
const createCourtFields = (courtPrefix: string): IField[] => [
  {
    name: 'date',
    type: 'date',
    label: `${courtPrefix} Date`,
    validation: defaultValidationSchema,
  },
  {
    name: 'decision',
    type: 'text',
    label: `${courtPrefix} Decision`,
    validation: defaultValidationSchema,
  },
  {
    name: 'confinementNumber',
    type: 'text',
    label: `${courtPrefix} Confinement Number`,
    validation: numbersAsStringSchema,
  },
]

const customerActionsFields: IFormField[] = [
  {
    name: 'statusNumber',
    type: 'text',
    label: 'Status Number',
    validation: numbersAsStringSchema,
  },
  {
    name: 'caseNumber',
    type: 'text',
    label: 'Case Number',
    validation: numbersAsStringSchema,
  },
  {
    name: 'court',
    type: 'text',
    label: 'Court',
    validation: defaultValidationSchema,
  },
  {
    name: 'statementOfClaim',
    type: 'text',
    label: 'Statement Of Claim',
    validation: defaultValidationSchema,
  },
  {
    name: 'firstCourtSession',
    type: 'group',
    fields: createCourtFields('First Court Session'),
  },
  {
    name: 'misdemeanorAppealSession',
    type: 'group',
    fields: createCourtFields('Misdemeanor Appeal Session'),
  },
  {
    name: 'oppositionAppealSession',
    type: 'group',
    fields: createCourtFields('Opposition Appeal Session'),
  },
  {
    name: 'oppositionSession',
    type: 'group',
    fields: createCourtFields('Opposition Session'),
  },

  {
    name: 'misdemeanorAppealNumber',
    type: 'text',
    label: 'Statement Of Claim',
    validation: defaultValidationSchema,
  },
  {
    name: 'caseStatus',
    type: 'text',
    label: 'Case Status',
    validation: defaultValidationSchema,
  },
  {
    name: 'caseStatusSummary',
    type: 'text',
    label: 'Case Status Summary',
    validation: defaultValidationSchema,
  },
]


interface IFormFieldsProps {
  formFields: IFormField[]
  formikProps: FormikProps<any>
}

const FormField = ({
  field,
  formikProps: { values, handleChange, handleBlur, touched, errors },
}: {
  field: IField
  formikProps: FormikProps<any>
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

const FormFields = ({ formFields, formikProps }: IFormFieldsProps) => {
  const formFieldPairs = arrayToPairs<IFormField>(formFields)

  return (
    <>
      {formFieldPairs.map((fieldPairs: IFormField[]) => {
        const groupFields = fieldPairs.filter((field) =>
          isGroupField(field)
        ) as IGroupField[]

        if (groupFields.length) {
          return (
            <>
              {groupFields.map((groupField) => {
                const fields = groupField.fields.map((field) => ({
                  ...field,
                  name: `${groupField.name}.${field.name}`,
                }))

                return (
                  <FormFields
                    key={groupField.name}
                    formFields={fields}
                    formikProps={formikProps}
                  />
                )
              })}
            </>
          )
        }

        const isPair = !!fieldPairs[1]
        return (
          <Row key={fieldPairs[0].name}>
            <Col sm={isPair ? 6 : 12}>
              <FormField
                field={fieldPairs[0] as IField}
                formikProps={formikProps}
              />
            </Col>

            {isPair && (
              <Col sm={6}>
                <FormField
                  field={fieldPairs[1] as IField}
                  formikProps={formikProps}
                />
              </Col>
            )}
          </Row>
        )
      })}
    </>
  )
}

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
