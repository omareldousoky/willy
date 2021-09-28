import React from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import BackButton from '../../../Shared/Components/BackButton/back-button'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { LeadCreationForm } from './leadCreationForm'

export const CreateLead: React.FC = () => {
  return (
    <div>
      <Loader type="fullscreen" open={false} />
      <BackButton title={local.createLead} />
      <Container>
        <Card>
          <Card.Body>
            <LeadCreationForm />
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
