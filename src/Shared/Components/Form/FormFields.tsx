import React, { FunctionComponent } from 'react'

import { Row, Col } from 'react-bootstrap'

import { arrayToPairs, isGroupField } from '../../../Shared/Services/utils'
import FormField from './FormField'
import { IFormField, IGroupField, IField, FormFieldsProps, GroupFieldProps } from './types'


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
        const groupFields = fieldPairs.filter((field) =>
          isGroupField(field)
        ) as IGroupField[]

        if (groupFields.length) {
          return (
            <div key={fieldPairs[0].name}>
              {groupFields.map((groupField: IGroupField) => {
                return (
                  <GroupField
                    key={groupField.name}
                    field={groupField}
                    formikProps={formikProps}
                    pairs
                  />
                )
              })}
            </div>
          )
        }

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
