import React, { FunctionComponent } from 'react'

import { Row, Col } from 'react-bootstrap'

import { arrayToPairs } from '../../../../Shared/Services/utils'
import FormField from './FormField'
import {
  FormField as FormFieldInterface,
  GroupField,
  Field,
  FormFieldsProps,
  GroupFieldProps,
} from './types'
import { isGroupField } from './utils'

const GroupField: FunctionComponent<GroupFieldProps> = ({
  field,
  formikProps,
  pairs = false,
}) => {
  const groupField = field as GroupField
  const fields = groupField.fields.map((field) => ({
    ...field,
    name: `${groupField.name}.${field.name}`,
  }))

  const fieldProps = {
    formFields: fields,
    formikProps,
  }

  return pairs ? (
    <FormFieldPairs {...fieldProps} />
  ) : (
    <FormFields {...fieldProps} />
  )
}

export const FormFieldPairs: FunctionComponent<FormFieldsProps> = ({
  formFields,
  formikProps,
}) => {
  const formFieldPairs = arrayToPairs<FormFieldInterface | GroupField>(
    formFields
  )

  return (
    <>
      {formFieldPairs.map((fieldPairs) => {
        const isPair = !!fieldPairs[1]

        const renderPairsField = (
          field: FormFieldInterface | GroupField,
          index: number
        ) =>
          isGroupField(field) ? (
            <Col>
              <GroupField
                key={field.name}
                field={field as GroupField}
                formikProps={formikProps}
                pairs
              />
            </Col>
          ) : (
            <Col sm={isPair || index === 1 ? 6 : 12}>
              <FormField field={field as Field} formikProps={formikProps} />
            </Col>
          )

        return (
          <Row key={fieldPairs[0].name}>
            {renderPairsField(fieldPairs[0], 0)}

            {isPair && renderPairsField(fieldPairs[1], 1)}
          </Row>
        )
      })}
    </>
  )
}

const FormFields: FunctionComponent<FormFieldsProps> = ({
  formFields,
  formikProps,
}) => {
  return (
    <>
      {formFields.map((field: FormFieldInterface | GroupField) => {
        if (isGroupField(field)) {
          return (
            <GroupField
              key={field.name}
              field={field as GroupField}
              formikProps={formikProps}
              pairs
            />
          )
        }

        return (
          <Row key={field.name}>
            <Col sm={12}>
              <FormField field={field as Field} formikProps={formikProps} />
            </Col>
          </Row>
        )
      })}
    </>
  )
}

export default FormFields
