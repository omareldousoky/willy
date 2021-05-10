import React, { FunctionComponent, useState } from 'react'

import { Card } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router'

import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { CourtSession, LegalActionsForm } from './types'
import AppForm from './Form'
import { updateLegalAffairsCustomers } from '../../Services/APIs/LegalAffairs/defaultingCustomers'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../Shared/Services/utils'
import customerActionsFields from './configs/CustomerActionsForm'
import { handleUpdateSuccess } from './utils'

const LegalActionsForm: FunctionComponent = () => {
  const [isSubmiting, setIsSubmiting] = useState(false)

  const location = useLocation<{ customer: DefaultedCustomer }>()
  const customer = location.state.customer

  const history = useHistory()

  const formatCourt = (
    court: CourtSession | undefined
  ): CourtSession | undefined => {
    return court?.date
      ? {
          ...court,
          date: new Date(court.date).valueOf(),
        }
      : undefined
  }

  const formValuesToActionReq = (values: LegalActionsForm) => ({
    ...customer,
    ...values,
    firstCourtSession: formatCourt(values.firstCourtSession),
    oppositionSession: formatCourt(values.oppositionSession),
    oppositionAppealSession: formatCourt(values.oppositionAppealSession),
    misdemeanorAppealSession: formatCourt(values.misdemeanorAppealSession),
  })

  const handleSubmit = async (values: LegalActionsForm) => {
    const actionReqBody: LegalActionsForm &
      DefaultedCustomer = formValuesToActionReq(values)

    setIsSubmiting(true)

    const response = await updateLegalAffairsCustomers(actionReqBody)

    setIsSubmiting(false)

    if (response.status == 'success') {
      handleUpdateSuccess(() => history.push('/legal-affairs/legal-actions'))
    } else {
      Swal.fire('error', getErrorMessage(response.error.error), 'error')
    }
  }

  return (
    <div className="container">
      <Card className="m-0 mb-4">
        <Card.Header>{local.legalAffairs}</Card.Header>

        <Card.Body>
          <AppForm
            formFields={customerActionsFields}
            onSubmit={handleSubmit}
            defaultValues={customer}
            options={{
              disabled: !customer._id || isSubmiting,
              renderPairs: true,
              wideBtns: true,
            }}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default LegalActionsForm
