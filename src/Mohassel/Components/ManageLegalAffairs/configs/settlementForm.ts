import local from '../../../../Shared/Assets/ar.json'
import { FormField } from '../Form/types'
import { defaultValidationSchema, phoneNumberValidationSchema } from '../validations'

const settlementForm: FormField[] = [
  {
    name: 'penaltiesPaid',
    type: 'checkbox',
    label: local.thePenalty,
    validation: defaultValidationSchema.required(local.required),
    checkboxLabel: `${local.isPaid} ${local.thePenalty}`,
  },
  {
    name: 'penaltyFees',
    type: 'number',
    label: local.valuePaid,
    validation: defaultValidationSchema.required(local.required),
    readOnly: true,
  },
  {
    name: 'courtFeesPaid',
    type: 'checkbox',
    label: local.courtFees,
    validation: defaultValidationSchema.required(local.required),
    checkboxLabel: `${local.isPaid} ${local.thePenalty}`,
  },
  {
    name: 'courtFees',
    type: 'number',
    label: local.valuePaid,
    validation: defaultValidationSchema.required(local.required),
    readOnly: true,
  },
  {
    name: 'caseNumber',
    type: 'text',
    label: local.legalCaseNumber,
    validation: defaultValidationSchema,
  },
  {
    name: 'caseYear',
    type: 'text',
    label: local.year,
    validation: defaultValidationSchema,
  },
  {
    name: 'court',
    type: 'text',
    label: local.court,
    validation: defaultValidationSchema,
  },
  {
    name: 'courtDetails',
    type: 'text',
    label: local.caseData,
    validation: defaultValidationSchema,
  },
  {
    name: 'lawyerName',
    type: 'text',
    label: `${local.theName} ${local.theLawyer}`,
    validation: defaultValidationSchema.required(local.required),
  },
  {
    name: 'lawyerPhoneNumberOne',
    type: 'text',
    label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 1`,
    validation: phoneNumberValidationSchema.required(local.required),
  },
  {
    name: 'lawyerPhoneNumberTwo',
    type: 'text',
    label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 2`,
    validation: phoneNumberValidationSchema,
  },
  {
    name: 'lawyerPhoneNumberThree',
    type: 'text',
    label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 3`,
    validation: phoneNumberValidationSchema,
  },
  {
    name: 'settlementType',
    type: 'select',
    label: local.reconciliationType,
    validation: defaultValidationSchema.required(local.required),
    options: [
      {
        value: 'privateReconciliation',
        label: local.privateReconciliation,
      },
      {
        value: 'settleByGeneralLawyer',
        label: local.settleByGeneralLawyer,
      },
      {
        value: 'settleByCompanyLawyer',
        label: local.settleByCompanyLawyer,
      },
      {
        value: 'stopLegalAffairs',
        label: local.stopLegalAffairs,
      },
      {
        value: 'waiver',
        label: local.waiver,
      },
    ],
  },
  {
    name: 'settlementStatus',
    type: 'select',
    label: local.status,
    validation: defaultValidationSchema.required(local.required),
    options: [
      {
        value: 'underReview',
        label: local.underReview,
      },
      {
        value: 'reviewed',
        label: local.reviewed,
      },
    ],
  },
  {
    name: 'lawyerCard',
    type: 'photo',
    label: local.lawyerCard,
    validation: defaultValidationSchema,
  },
  {
    name: 'criminalSchedule',
    type: 'photo',
    label: local.criminalSchedule,
    validation: defaultValidationSchema,
  },
  {
    name: 'caseDataAcknowledgment',
    type: 'photo',
    label: local.caseDataAcknowledgment,
    validation: defaultValidationSchema,
  },
  {
    name: 'decreePhotoCopy',
    type: 'photo',
    label: local.decreePhotoCopy,
    validation: defaultValidationSchema,
  },
  {
    name: 'comments',
    type: 'textarea',
    label: local.comments,
    validation: defaultValidationSchema,
  },
]

export default settlementForm