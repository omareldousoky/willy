import React, { FunctionComponent, useEffect, useState } from 'react'

import { Card } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router'

import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { ICourtSession, ILegalActionsForm } from './types'
import customerActionsFields from './configs/form'
import AppForm from '../../../Shared/Components/Form'
import { updateLegalAffairsCustomers } from '../../Services/APIs/LegalAffairs/defaultingCustomers'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../Shared/Services/utils'

const LegalActionsForm: FunctionComponent = () => {
  const [isSubmiting, setIsSubmiting] = useState(false)

  const location = useLocation<{ customer: DefaultedCustomer }>()
  const customer = location.state.customer

  const history = useHistory()

  const formatCourt = (
    court: ICourtSession | undefined
  ): ICourtSession | undefined => {
    return court?.date
      ? {
          ...court,
          date: new Date(court.date).valueOf(),
        }
      : undefined
  }

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

    setIsSubmiting(true)

    const response = await updateLegalAffairsCustomers(actionReqBody)

    setIsSubmiting(false)

    if (response.status == 'success') {
      history.push('/legal-affairs/legal-actions')
    } else {
      Swal.fire('error', getErrorMessage(response.error.error), 'error')
    }
  }

  return (
    <div className="container">
      <Card className="main-card">
        <Card.Header>{local.legalAffairs}</Card.Header>

        <Card.Body>
          <AppForm
            formFields={customerActionsFields}
            onSubmit={handleSubmit}
            defaultValues={customer}
            options={{
              disabled: !customer._id || isSubmiting,
              renderPairs: true
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalActionsForm
