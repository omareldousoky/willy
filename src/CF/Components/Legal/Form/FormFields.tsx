import React, { FunctionComponent } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { arrayToPairs } from '../../../../Shared/Services/utils'
import FormField from './FormField'
import {
  FormField as FormFieldInterface,
  GroupField as GroupFieldInterface,
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
  const groupField = field as GroupFieldInterface
  const fields = groupField.fields.map((groupFieldItem) => ({
    ...groupFieldItem,
    name: `${groupField.name}.${groupFieldItem.name}`,
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
  const formFieldPairs = arrayToPairs<FormFieldInterface | GroupFieldInterface>(
    formFields
  )

  return (
    <>
      {formFieldPairs.map((fieldPairs) => {
        const isPair = !!fieldPairs[1]

        const renderPairsField = (
          field: FormFieldInterface | GroupFieldInterface,
          index: number
        ) =>
          isGroupField(field) ? (
            <Col>
              <GroupField
                key={field.name}
                field={field as GroupFieldInterface}
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
      {formFields.map((field: FormFieldInterface | GroupFieldInterface) => {
        if (isGroupField(field)) {
          return (
            <GroupField
              key={field.name}
              field={field as GroupFieldInterface}
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
