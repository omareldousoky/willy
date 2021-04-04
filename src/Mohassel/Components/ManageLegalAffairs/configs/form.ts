import * as Yup from 'yup'
import local from '../../../../Shared/Assets/ar.json'
import { IField } from '../../../../Shared/Components/Form/types'


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

// TODO: Add validations
const createCourtFields = (courtLabel: string): IField[] => [
  {
    name: 'date',
    type: 'date',
    label: `${local.createdAt} ${courtLabel}`,
    validation: defaultValidationSchema,
  },
  {
    name: 'decision',
    type: 'text',
    label: `${local.theDecision} - ${courtLabel}`,
    validation: defaultValidationSchema,
  },
  {
    name: 'confinementNumber',
    type: 'text',
    label: `${local.confinementNumber} - ${courtLabel}`,
    validation: numbersAsStringSchema,
  },
]

const customerActionsFields: IFormField[] = [
  {
    name: 'statusNumber',
    type: 'text',
    label: local.statusNumber,
    validation: numbersAsStringSchema,
  },
  {
    name: 'caseNumber',
    type: 'text',
    label: local.caseNumber,
    validation: numbersAsStringSchema,
  },
  {
    name: 'court',
    type: 'text',
    label: local.court,
    validation: defaultValidationSchema,
  },
  {
    name: 'statementOfClaim',
    type: 'text',
    label: local.statementOfClaim,
    validation: defaultValidationSchema,
  },
  {
    name: 'firstCourtSession',
    type: 'group',
    fields: createCourtFields(local.firstCourtSession),
  },
  {
    name: 'oppositionSession',
    type: 'group',
    fields: createCourtFields(local.oppositionSession),
  },
  {
    name: 'oppositionAppealSession',
    type: 'group',
    fields: createCourtFields(local.oppositionAppealSession),
  },
  {
    name: 'misdemeanorAppealSession',
    type: 'group',
    fields: createCourtFields(local.misdemeanorAppealSession),
  },
  {
    name: 'misdemeanorAppealNumber',
    type: 'text',
    label: local.misdemeanorAppealNumber,
    validation: defaultValidationSchema,
  },
  {
    name: 'caseStatus',
    type: 'text',
    label: local.caseStatus,
    validation: defaultValidationSchema,
  },
  {
    name: 'caseStatusSummary',
    type: 'text',
    label: local.caseStatusSummary,
    validation: defaultValidationSchema,
  },
]

export default customerActionsFields

