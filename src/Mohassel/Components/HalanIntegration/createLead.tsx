import React, { useState, useEffect } from 'react'
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
import { getMaxPrinciples } from '../../../Shared/Services/APIs/config'

export const CreateLead: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [maxLimit, setMaxLimit] = useState(0)
  const submit = async (values: LeadCore) => {
    setLoading(true)
    const res = await createLead(values)
    if (res.status === 'success') {
      setLoading(false)
      Swal.fire({
        text: doneSuccessfully('createLead'),
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => history.goBack())
    } else {
      setLoading(false)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(res.error.error),
        icon: 'error',
      })
    }
  }

  const getGlobalPrinciple = async () => {
    setLoading(true)
    const res = await getMaxPrinciples()
    if (res.status === 'success') {
      setMaxLimit(res.body.maxIndividualPrincipal)
    } else {
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: res.error.error,
        icon: 'error',
      })
    }
    setLoading(false)
  }
  useEffect(() => {
    getGlobalPrinciple()
  }, [])
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
              validationSchema={createLeadValidation(maxLimit)}
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
