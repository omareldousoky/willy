import React, { FunctionComponent, useState } from 'react'

import { Card, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'

import local from '../../../../Shared/Assets/ar.json'
import AppForm from '../../../../Shared/Components/Form'
import { IFormField } from '../../../../Shared/Components/Form/types'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { defaultValidationSchema } from '../../../../Shared/validations'
import { settleLegalCustomer } from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import colorVariables from '../../../../Shared/Assets/scss/app.scss'
import { SettledCustomer } from '.'

export type SettlementStatus =
  | 'privateReconciliation'
  | 'settleByGeneralLawyer'
  | 'settleByCompanyLawyer'
  | 'stopLegalAffairs'
  | 'waiver'

export interface SettlementFormValues {
  penaltiesPaid: boolean
  penaltyFees: number
  courtFeesPaid: boolean
  courtFees: number
  caseNumber: string
  caseYear: string
  court: string
  courtDetails: string
  lawyerName: string
  lawyerPhoneNumberOne: string
  lawyerPhoneNumberTwo: string
  lawyerPhoneNumberThree: string
  settlementType: SettlementStatus
  settlementStatus: 'reviewed' | 'underReview'
  comments: string
}

export interface ISettlementReqBody {
  settlement: SettlementFormValues
}
export interface ILegalSettlementFormProps {
  settlementInfo: {
    penaltyFees: number
    courtFees: number
  }
  customer: SettledCustomer
  onSubmit: () => void
  onCancel: () => void
}

const LegalSettlementForm: FunctionComponent<ILegalSettlementFormProps> = ({
  settlementInfo,
  onSubmit,
  onCancel,
  customer,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const settlementForm: IFormField[] = [
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
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'lawyerPhoneNumberTwo',
      type: 'text',
      label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 2`,
      validation: defaultValidationSchema,
    },
    {
      name: 'lawyerPhoneNumberThree',
      type: 'text',
      label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 3`,
      validation: defaultValidationSchema,
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

  const customerPreviewFields = [
    {
      name: 'customerName',
      label: local.name,
    },
    {
      name: 'customerKey',
      label: local.customerId,
    },
    {
      name: 'nationalId',
      label: local.nationalId,
    },
  ]

  const defaultValues = {
    customerDetails: {
      customerName: customer.customerName,
      customerKey: customer.customerKey,
      nationalId: customer.nationalId,
    },
    penaltiesPaid: false,
    courtFeesPaid: false,
  }

  const handleSubmit = async (values: SettlementFormValues) => {
    const formData = new FormData()
    const formFields = Object.keys(values)

    formFields.forEach((fieldKey) => {
      if (values[fieldKey] !== undefined) {
        formData.append(fieldKey, values[fieldKey])
      }
    })

    setIsSubmitting(true)

    const response = await settleLegalCustomer(formData, customer._id)

    if (response.status === 'success') {
      Swal.fire({
        title: local.settlementSuccess,
        icon: 'success',
        confirmButtonText: local.end,
        confirmButtonColor: colorVariables.green,
      })
    } else {
      Swal.fire('error', getErrorMessage(response.error), 'error')
    }

    setIsSubmitting(true)
    onSubmit()
  }

  const customerSettlement = customer.settlement
  const isReviewed = customerSettlement?.settlementStatus === 'reviewed'

  const renderCustomerDetails = () => (
    <div className="row">
      {customerPreviewFields.map(
        (field: { name: string; label: string }, index: number) => (
          <Form.Group
            className={index === 0 ? 'col-sm-12' : 'col-sm-6'}
            controlId={field.name}
            key={field.name}
          >
            <Form.Label column title={field.label}>
              {field.label}
            </Form.Label>
            <Form.Control
              type="text"
              value={customer[field.name]}
              readOnly
              disabled
            />
          </Form.Group>
        )
      )}
    </div>
  )
  return (
    <div className="form__container">
      <Card className="main-card hide-card-styles">
        <Card.Body>
          {renderCustomerDetails()}
          <AppForm
            formFields={
              isReviewed || isSubmitting
                ? settlementForm.map((field) => ({ ...field, readOnly: true }))
                : settlementForm
            }
            onSubmit={handleSubmit}
            defaultValues={{
              ...defaultValues,
              ...settlementInfo,
              ...customerSettlement,
            }}
            options={{
              renderPairs: true,
              wideBtns: true,
              disabled: isReviewed || isSubmitting,
            }}
            onCancel={onCancel}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalSettlementForm
