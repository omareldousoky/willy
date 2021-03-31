import React from "react"
import { Row, Col } from "react-bootstrap"

import { arrayToPairs,  isGroupField } from "../../../Shared/Services/utils"
import FormField from "./FormField"
import { IFormFieldsProps, IFormField, IGroupField, IField } from "./types"


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

export default FormFields
