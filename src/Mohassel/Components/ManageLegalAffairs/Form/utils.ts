import * as Yup from 'yup'

import { Field, FormField, GroupField } from './types'

export const isGroupField = (formField: FormField | GroupField) =>
  formField?.type === 'group'

export const createValidationSchema = (
  formFields: (FormField | GroupField)[],
  validationSort?: [string, string][]
) => {
  const validationFields = formFields.reduce((acc, formField) => {
    if (isGroupField(formField)) {
      const groupFormField = {
        [formField.name]: createValidationSchema(
          (formField as GroupField).fields,
          validationSort
        ),
      }

      return { ...acc, ...groupFormField }
    }

    const { name, validation } = formField as Field
    return { ...acc, [name]: validation }
  }, {})

  return Yup.object().shape(validationFields, validationSort)
}

export const getNestedByStringKey = (obj: {}, key: string) =>
  key.split('.').reduce((p, c) => (p && p[c]) || undefined, obj)

export const createFormFieldsInitValue = (
  formFields: (FormField | GroupField)[],
  defaultValues: any
) => {
  return formFields.reduce((acc, formField) => {
    const { name, type } = formField

    const isEmptyPhoto =
      !!defaultValues &&
      type === 'photo' &&
      !Object.keys(defaultValues[name]).length

    const initValue =
      defaultValues && !isEmptyPhoto ? defaultValues[name] : undefined

    if (isGroupField(formField)) {
      const fields = createFormFieldsInitValue(
        (formField as GroupField).fields,
        initValue
      )

      return { ...acc, [name]: fields }
    }

    return {
      ...acc,
      [name]: initValue,
    }
  }, {})
}
