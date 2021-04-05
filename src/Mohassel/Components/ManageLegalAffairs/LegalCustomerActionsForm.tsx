import React, { FunctionComponent, useEffect, useState } from 'react'

import { Card } from 'react-bootstrap'
import { useLocation } from 'react-router'

import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { ICourtSession, ILegalActionsForm } from './types'
import customerActionsFields from './configs/form'
import AppForm from '../../../Shared/Components/Form'
import { updateLegalAffairsCustomers } from '../../Services/APIs/LegalAffairs/defaultingCustomers'

const LegalCustomerActions: FunctionComponent = () => {
  const location = useLocation<{ customer: DefaultedCustomer }>()
  const customer = location.state.customer
  console.log({ customer })

  const formatCourt = (court: ICourtSession): ICourtSession => ({
    ...court,
    date: new Date(court.date).valueOf(),
  })

  const formValuesToActionReq = (values: ILegalActionsForm) => ({
    ...customer,
    ...values,
    firstCourtSession: formatCourt(values.firstCourtSession),
    oppositionSession: formatCourt(values.oppositionSession),
    oppositionAppealSession: formatCourt(values.oppositionAppealSession),
    misdemeanorAppealSession: formatCourt(values.misdemeanorAppealSession),
  })

  const handleSubmit = async (values: ILegalActionsForm) => {
    const actionReqBody: ILegalActionsForm &
      DefaultedCustomer = formValuesToActionReq(values)
    console.log({ submit: actionReqBody })

    const response = await updateLegalAffairsCustomers(actionReqBody)

    console.log({ response })
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
