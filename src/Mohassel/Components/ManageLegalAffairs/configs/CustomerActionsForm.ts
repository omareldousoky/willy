import local from '../../../../Shared/Assets/ar.json'
import { Field, FormField } from '../../../../Shared/Components/Form/types'
import { defaultValidationSchema } from '../../../../Shared/validations'

const createCourtFields = (courtLabel: string): Field[] => [
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
    validation: defaultValidationSchema,
  },
]

const customerActionsFields: FormField[] = [
  {
    name: 'statusNumber',
    type: 'text',
    label: local.statusNumber,
    validation: defaultValidationSchema,
  },
  {
    name: 'caseNumber',
    type: 'text',
    label: local.caseNumber,
    validation: defaultValidationSchema,
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
