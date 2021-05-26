import React, { FunctionComponent, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import Swal from 'sweetalert2'

import local from '../../../../Shared/Assets/ar.json'
import AppForm from '../Form'
import { getErrorMessage } from '../../../../Shared/Services/utils'
import {
  deleteSettlementDocument,
  settleLegalCustomer,
} from '../../../Services/APIs/LegalAffairs/defaultingCustomers'

import { LegalSettlementFormProps, SettlementFormValues } from '../types'
import settlementForm from '../configs/settlementForm'
import { mapFieldsToReadOnly, isSettlementReviewed } from '../utils'
import { Loader } from '../../../../Shared/Components/Loader'

const LegalSettlementForm: FunctionComponent<LegalSettlementFormProps> = ({
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

  const customerSettlement = customer.settlement

  const isReviewed = isSettlementReviewed(customerSettlement)

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
        confirmButtonColor: '#7dc356',
      })
      onSubmit()
    } else {
      Swal.fire('error', getErrorMessage(response.error.error), 'error')
    }

    setIsSubmitting(false)
  }

  const handlePhotoChange = async (name: string, value: File | string) => {
    if (value !== '' || !customer.settlement || !customer.settlement[name])
      return

    const response = await deleteSettlementDocument(customer._id, name)

    if (response.status !== 'success') {
      Swal.fire('error', getErrorMessage(response.error), 'error')
    }
  }

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
    <Card className="m-0 border-0">
      <Card.Body className="p-0">
        <Loader type="fullsection" open={isSubmitting} />

        {renderCustomerDetails()}
        <AppForm
          formFields={
            isReviewed ? mapFieldsToReadOnly(settlementForm) : settlementForm
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
          onPhotoChange={handlePhotoChange}
          onCancel={onCancel}
        />
      </Card.Body>
    </Card>
  )
}

export default LegalSettlementForm
