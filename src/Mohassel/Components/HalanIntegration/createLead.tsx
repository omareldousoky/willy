import React from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import { Formik } from 'formik'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { LeadCreationForm } from './leadCreationForm'
import { createLeadValidation, LeadCreationInitial } from './leadsValidation'

export const CreateLead: React.FC = () => {
  return (
    <div>
      <Loader type="fullscreen" open={false} />
      <BackButton title={local.createLead} />
      <Container>
        <Card>
          <Card.Body>
            <Formik
              initialValues={LeadCreationInitial}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values)
              }}
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
