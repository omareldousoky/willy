import React, { FunctionComponent } from 'react'

import { Card } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { boolean } from 'yup'

import local from '../../../Shared/Assets/ar.json'
import AppForm from '../../../Shared/Components/Form'
import { IFormField } from '../../../Shared/Components/Form/types'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { defaultValidationSchema } from '../../../Shared/validations'
import {
  settleLegalCustomer,
} from '../../Services/APIs/LegalAffairs/defaultingCustomers'

export interface ILegalSettlementFormProps {
  settlementFees: {
    penaltyFees: number
    courtFees: number
  }
  customerId: string
  onSubmit: () => void
}

export type SettlementStatus =
  | 'privateReconciliation'
  | 'settleByGeneralLawyer'
  | 'settleByCompanyLawyer'
  | 'stopLegalAffairs'
  | 'waiver'

export interface ISettlementFormValues {
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
  settlement: ISettlementFormValues
}

const LegalSettlementForm: FunctionComponent<ILegalSettlementFormProps> = ({
  settlementFees,
  customerId,
  onSubmit,
}) => {
  const settlementForm: IFormField[] = [
    {
      name: 'penaltiesPaid',
      type: 'checkbox',
      label: `${local.isPaid} ${local.thePenalty}`,
      validation: defaultValidationSchema.required(local.required),
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
      label: `${local.isPaid} ${local.courtFees}`,
      validation: defaultValidationSchema.required(local.required),
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
      label: local.caseNumber,
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
    {
      name: 'comments',
      type: 'text',
      label: local.comments,
      validation: defaultValidationSchema,
    },
  ]

  const defaultValues = {
    penaltiesPaid: false,
    courtFeesPaid: false,
    caseNumber: '',
    caseYear: '',
    court: '',
    courtDetails: '',
    lawyerName: '',
    laywerPhoneNumberOne: '',
    laywerPhoneNumberTwo: '',
    laywerPhoneNumberThree: '',
    settlementType: '',
    settlementStatus: '',
    comments: '',
  }

  const handleSubmit = async (values: ISettlementFormValues) => {
    const settlementReqBody: ISettlementReqBody = {
      settlement: values,
    }

    const response = await settleLegalCustomer(settlementReqBody, customerId)

    if (response.status !== 'success') {
      Swal.fire('error', getErrorMessage(response.error), 'error')
    }

    onSubmit()
  }

  return (
    <div className="form__container">
      <Card className="main-card">
        <Card.Body>
          <AppForm
            formFields={settlementForm}
            onSubmit={handleSubmit}
            defaultValues={{
              ...defaultValues,
              ...settlementFees,
            }}
            options={{
              renderPairs: true,
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalSettlementForm
