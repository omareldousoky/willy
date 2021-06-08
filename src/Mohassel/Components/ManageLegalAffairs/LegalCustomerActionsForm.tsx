import React, { FunctionComponent, useState } from 'react'

import Card from 'react-bootstrap/Card'
import { useHistory, useLocation } from 'react-router-dom'

import Swal from 'sweetalert2'
import local from '../../../Shared/Assets/ar.json'
import { DefaultedCustomer } from './defaultingCustomersList'
import {
  CourtSession,
  LegalActionsForm as LegalActionsFormType,
  SettledCustomer,
} from './types'
import AppForm from './Form'
import { updateLegalAffairsCustomers } from '../../Services/APIs/LegalAffairs/defaultingCustomers'
import { getErrorMessage } from '../../../Shared/Services/utils'
import customerActionsFields from './configs/CustomerActionsForm'
import {
  mapFieldsToReadOnly,
  handleUpdateSuccess,
  isSettlementReviewed,
} from './utils'
import { Loader } from '../../../Shared/Components/Loader'

const LegalActionsForm: FunctionComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const location = useLocation<{ customer: SettledCustomer }>()
  const { customer } = location.state

  const history = useHistory()

  const isReviewed = isSettlementReviewed(customer.settlement)

  const formatCourt = (court: CourtSession | undefined): CourtSession | {} => {
    if (!court) return {}

    const courtFields = Object.keys(court)
    const emptyCourtFields = courtFields.filter(
      (courtField) => !court[courtField]
    )

    if (courtFields.length === emptyCourtFields.length) return {}

    return court.date
      ? {
          ...court,
          date: new Date(court.date).valueOf(),
        }
      : court
  }

  const formValuesToActionReq = (values: LegalActionsFormType) => {
    const finalVerdictDate = values.finalVerdictDate
      ? new Date(values.finalVerdictDate).valueOf()
      : values.finalVerdictDate

    return {
      ...customer,
      ...values,
      finalVerdictDate,
      firstCourtSession: formatCourt(values.firstCourtSession),
      oppositionSession: formatCourt(values.oppositionSession),
      oppositionAppealSession: formatCourt(values.oppositionAppealSession),
      misdemeanorAppealSession: formatCourt(values.misdemeanorAppealSession),
    }
  }

  const handleSubmit = async (values: LegalActionsFormType) => {
    const actionReqBody: LegalActionsFormType &
      DefaultedCustomer = formValuesToActionReq(values)

    setIsSubmitting(true)

    const response = await updateLegalAffairsCustomers(actionReqBody)

    setIsSubmitting(false)

    if (response.status === 'success') {
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
          <Loader type="fullsection" open={isSubmitting} />

          <AppForm
            formFields={
              isReviewed
                ? mapFieldsToReadOnly(customerActionsFields)
                : customerActionsFields
            }
            onSubmit={handleSubmit}
            defaultValues={customer}
            options={{
              disabled: !customer._id || isSubmitting || isReviewed,
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
