import React, { FunctionComponent } from 'react'

import { Row, Col } from 'react-bootstrap'

import { arrayToPairs, isGroupField } from '../../../Shared/Services/utils'
import FormField from './FormField'
import {
  IFormField,
  IGroupField,
  IField,
  FormFieldsProps,
  GroupFieldProps,
} from './types'

const GroupField: FunctionComponent<GroupFieldProps> = ({
  field,
  formikProps,
  pairs = false,
}) => {
  const groupField = field as IGroupField
  const fields = groupField.fields.map((field) => ({
    ...field,
    name: `${groupField.name}.${field.name}`,
  }))

  return pairs ? (
    <FormFieldPairs formFields={fields} formikProps={formikProps} />
  ) : (
    <FormFields formFields={fields} formikProps={formikProps} />
  )
}

export const FormFieldPairs: FunctionComponent<FormFieldsProps> = ({
  formFields,
  formikProps,
}) => {
  const formFieldPairs = arrayToPairs<IFormField>(formFields)

  return (
    <>
      {formFieldPairs.map((fieldPairs: IFormField[]) => {
        const isPair = !!fieldPairs[1]

        const renderPairsField = (field: IFormField, index: number) =>
          isGroupField(field) ? (
            <Col>
              <GroupField
                key={field.name}
                field={field as IGroupField}
                formikProps={formikProps}
                pairs
              />
            </Col>
          ) : (
            <Col sm={isPair || index === 1 ? 6 : 12}>
              <FormField field={field as IField} formikProps={formikProps} />
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
      {formFields.map((field: IFormField) => {
        if (isGroupField(field)) {
          return (
            <GroupField
              key={field.name}
              field={field as IGroupField}
              formikProps={formikProps}
              pairs
            />
          )
        }

        return (
          <Row key={field.name}>
            <Col sm={12}>
              <FormField field={field as IField} formikProps={formikProps} />
            </Col>
          </Row>
        )
      })}
    </>
  )
}

export default FormFields
