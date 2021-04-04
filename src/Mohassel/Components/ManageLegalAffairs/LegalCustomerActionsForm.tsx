import React, { FunctionComponent } from 'react'

import {  Card } from 'react-bootstrap'
import { useLocation } from 'react-router'

import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { useParams } from 'react-router-dom'
import {
  ILegalActionsForm as ILegalActionsFormFields,
} from './types'
import customerActionsFields from './configs/form'
import AppForm from '../../../Shared/Components/Form'

// TODO:
// - Add permissions

const LegalCustomerActions: FunctionComponent = () => {
  const location = useLocation<DefaultedCustomer>()
  const { id: customerId } = useParams<{ id: string }>()
  console.log({ customerId, location })

  const handleSubmit = (values: ILegalActionsFormFields) => {
    console.log({ submit: values })
  }

  return (
    <div className="container">
      <Card className="main-card">
        <Card.Header>{local.legalAffairs}</Card.Header>

        <Card.Body>
          <AppForm formFields={customerActionsFields} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalCustomerActions
