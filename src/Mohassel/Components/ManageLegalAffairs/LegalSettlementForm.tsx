import React, { FunctionComponent } from 'react'

import { Card } from 'react-bootstrap'

import local from '../../../Shared/Assets/ar.json'
import AppForm from '../../../Shared/Components/Form'
import { IFormField } from '../../../Shared/Components/Form/types'
import { defaultValidationSchema } from '../../../Shared/validations'

export interface ILegalSettlementForm {
  date: number
}

const LegalSettlementForm: FunctionComponent = () => {
  const settlementForm: IFormField[] = [
    {
      name: 'date',
      type: 'date',
      label: local.createdAt,
      validation: defaultValidationSchema,
    },
    {
      name: 'penalty',
      type: 'group',
      fields: [
        {
          name: 'paid',
          type: 'checkbox',
          label: `${local.isPaid} ${local.thePenalty}`,
          validation: defaultValidationSchema,
        },
        {
          name: 'value',
          type: 'number',
          label: local.valuePaid,
          validation: defaultValidationSchema,
        },
      ],
    },
    {
      name: 'courtFees',
      type: 'group',
      fields: [
        {
          name: 'paid',
          type: 'checkbox',
          label: `${local.isPaid} ${local.courtFees}`,
          validation: defaultValidationSchema,
        },
        {
          name: 'value',
          type: 'number',
          label: local.valuePaid,
          validation: defaultValidationSchema,
        },
      ],
    },
    {
      name: 'court',
      type: 'text',
      label: local.court,
      validation: defaultValidationSchema,
    },
    {
      name: 'caseData',
      type: 'text',
      label: local.caseData,
      validation: defaultValidationSchema,
    },
    {
      name: 'theLawyer',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: `${local.theName} ${local.theLawyer}`,
          validation: defaultValidationSchema,
        },
        {
          name: 'number',
          type: 'group',
          fields: [
            {
              name: '1',
              type: 'text',
              label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 1`,
              validation: defaultValidationSchema,
            },
            {
              name: '2',
              type: 'text',
              label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 2`,
              validation: defaultValidationSchema,
            },
            {
              name: '3',
              type: 'text',
              label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 3`,
              validation: defaultValidationSchema,
            },
          ],
        },
      ],
    },
    {
      name: 'settlement',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: local.reconciliationType,
          validation: defaultValidationSchema,
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
          name: 'status',
          type: 'select',
          label: local.status,
          validation: defaultValidationSchema,
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
      ],
    },
    {
      name: 'comments',
      type: 'text',
      label: local.comments,
      validation: defaultValidationSchema,
    },
  ]

  const handleSubmit = (values: ILegalSettlementForm) => {
    console.log({ values })
  }

  return (
    <div className="form__container">
      <Card className="main-card">
        <Card.Header>{local.legalSettlement}</Card.Header>

        <Card.Body>
          <AppForm formFields={settlementForm} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalSettlementForm
