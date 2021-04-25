import React, { FunctionComponent } from 'react'

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
  laywerPhoneNumberOne: string
  laywerPhoneNumberTwo: string
  laywerPhoneNumberThree: string
  settlementType: SettlementStatus
  settlementStatus: 'reviewed' | 'underReview'
  comments: string
}

export interface ISettlementReqBody {
  settlement: SettlementFormValues
}
export interface ILegalSettlementFormProps {
  settlementFees: {
    penaltyFees: number
    courtFees: number
  }
  customer: SettledCustomer
  onSubmit: () => void
}

const LegalSettlementForm: FunctionComponent<ILegalSettlementFormProps> = ({
  settlementFees,
  onSubmit,
  customer,
}) => {
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
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'caseYear',
      type: 'text',
      label: local.year,
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'court',
      type: 'text',
      label: local.court,
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'courtDetails',
      type: 'text',
      label: local.caseData,
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'lawyerName',
      type: 'text',
      label: `${local.theName} ${local.theLawyer}`,
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'laywerPhoneNumberOne',
      type: 'text',
      label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 1`,
      validation: defaultValidationSchema.required(local.required),
    },
    {
      name: 'laywerPhoneNumberTwo',
      type: 'text',
      label: `${local.number} ${local.phoneNumber} ${local.theLawyer} 2`,
      validation: defaultValidationSchema,
    },
    {
      name: 'laywerPhoneNumberThree',
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
    // TODO: change field keys
    {
      name: 'file1',
      type: 'photo',
      label: `file 1`,
      validation: defaultValidationSchema,
    },
    // TODO: change field keys
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
    const settlementReqBody: ISettlementReqBody = {
      settlement: values,
    }

    const response = await settleLegalCustomer(settlementReqBody, customer._id)

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
              isReviewed
                ? settlementForm.map((field) => ({ ...field, readOnly: true }))
                : settlementForm
            }
            onSubmit={handleSubmit}
            defaultValues={{
              ...defaultValues,
              ...settlementFees,
              ...customerSettlement,
            }}
            options={{
              renderPairs: true,
              wideBtns: true,
              disabled: isReviewed,
            }}
            onCancel={onSubmit}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalSettlementForm
