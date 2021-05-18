import React, { FunctionComponent, useState } from 'react'

import { Card } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router'

import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import { CourtSession, LegalActionsForm, SettledCustomer } from './types'
import AppForm from './Form'
import { updateLegalAffairsCustomers } from '../../Services/APIs/LegalAffairs/defaultingCustomers'
import Swal from 'sweetalert2'
import { getErrorMessage } from '../../../Shared/Services/utils'
import customerActionsFields from './configs/CustomerActionsForm'
import {
  mapFieldsToReadOnly,
  handleUpdateSuccess,
  isSettlementReviewed,
} from './utils'

const LegalActionsForm: FunctionComponent = () => {
  const [isSubmiting, setIsSubmiting] = useState(false)

  const location = useLocation<{ customer: SettledCustomer }>()
  const customer = location.state.customer

  const history = useHistory()

  const isReviewed = isSettlementReviewed(customer.settlement)

  const formatCourt = (
    court: CourtSession | undefined
  ): CourtSession | undefined => {
    if (!court) return undefined

    const courtFields = Object.keys(court)
    const emptyCourtFields = courtFields.filter(
      (courtField) => court[courtField] === undefined
    )

    if (courtFields.length === emptyCourtFields.length) return undefined

    return court.date
      ? {
          ...court,
          date: new Date(court.date).valueOf(),
        }
      : court
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
            formFields={
              isSubmiting || isReviewed
                ? mapFieldsToReadOnly(customerActionsFields)
                : customerActionsFields
            }
            onSubmit={handleSubmit}
            defaultValues={customer}
            options={{
              disabled: !customer._id || isSubmiting || isReviewed,
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
