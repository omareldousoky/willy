import * as Yup from 'yup'

import { IField, IFormField } from "../types"
import local from '../../../../Shared/Assets/ar.json'


// TODO: Remove defaultValidationSchema then add the Schema for each field
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

export default customerActionsFields

