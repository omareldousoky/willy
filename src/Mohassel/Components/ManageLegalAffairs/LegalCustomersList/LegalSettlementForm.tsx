import React, { FunctionComponent, useState } from 'react'

import { Card, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'

import local from '../../../../Shared/Assets/ar.json'
import AppForm from '../../../../Shared/Components/Form'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import { settleLegalCustomer } from '../../../Services/APIs/LegalAffairs/defaultingCustomers'
import colorVariables from '../../../../Shared/Assets/scss/app.scss'
import {
  ILegalSettlementFormProps,
  SettlementFormValues,
  SettlementStatusEnum,
} from '../types'
import settlementForm from '../configs/settlementForm'

const LegalSettlementForm: FunctionComponent<ILegalSettlementFormProps> = ({
  settlementInfo,
  onSubmit,
  onCancel,
  customer,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  const isReviewed =
    customerSettlement?.settlementStatus === SettlementStatusEnum.Reviewed

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
    <div>
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
