import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { LeadCreationForm } from './leadCreationForm'
import { createLeadValidation, LeadCreationInitial } from './leadsValidation'
import { createLead } from '../../../Shared/Services/APIs/Leads/createLead'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { doneSuccessfully } from '../../../Shared/localUtils'
import { LeadCore } from '../../../Shared/Models/common'

export const CreateLead: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const submit = async (values) => {
    setLoading(true)
    const leadData: LeadCore = { ...values }
    const res = await createLead(leadData)
    if (res.status === 'success') {
      Swal.fire('', doneSuccessfully('createLead'), 'success')
      history.goBack()
    } else {
      Swal.fire('', getErrorMessage(res.error.error), 'error')
    }
    setLoading(false)
  }
  return (
    <div>
      <Loader type="fullscreen" open={loading} />
      <BackButton title={local.createLead} />
      <Container>
        <Card>
          <Card.Body>
            <Formik
              initialValues={LeadCreationInitial}
              enableReinitialize
              onSubmit={submit}
              validationSchema={createLeadValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => {
                return <LeadCreationForm {...formikProps} />
              }}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
