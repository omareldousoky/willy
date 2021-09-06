import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Swal from 'sweetalert2'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

import { Formik } from 'formik'
import DocumentTypeCreationForm from './documentTypeCreationForm'

import { DocumentType } from '../../../Shared/Services/interfaces'
import {
  documentType,
  documentTypeCreationValidation,
  documentTypeEditValidation,
} from './documnetTypeinitialState'

import * as local from '../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../Shared/Services/utils'
import {
  createDocumentsType,
  editDocumentsType,
} from '../../../Shared/Services/APIs/encodingFiles/documentType'

interface Props
  extends RouteComponentProps<{}, {}, { documentType: DocumentType }> {
  edit: boolean
}
interface State {
  documentType: DocumentType
}
class DocumentTypeCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      documentType,
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.getDocumentType()
    }
  }

  getDocumentType() {
    const documentTypeFromH: DocumentType = this.props.location.state
      .documentType
    this.setState({ documentType: documentTypeFromH })
  }

  submit = (values) => {
    values.name = values.name.trim()
    this.setState({
      documentType: values,
    })
    if (this.props.edit) {
      this.updateDocument(values)
    } else {
      this.createDocument(values)
    }
  }

  async createDocument(values) {
    const res = await createDocumentsType(values)
    if (res.status === 'success') {
      Swal.fire('success', local.documentTypeCreationSuccessMessage)
      this.props.history.goBack()
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  async updateDocument(values) {
    const res = await editDocumentsType(values)
    if (res.status === 'success') {
      Swal.fire('success', local.documentTypeEditSuccessMessage)
      this.props.history.goBack()
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  cancel() {
    this.setState({
      documentType,
    })
    this.props.history.goBack()
  }

  render() {
    return (
      <div>
        <Container>
          <Card>
            <Card.Body>
              <Formik
                enableReinitialize
                initialValues={this.state.documentType}
                validationSchema={
                  this.props.edit
                    ? documentTypeEditValidation
                    : documentTypeCreationValidation
                }
                onSubmit={this.submit}
                validateOnChange
                validateOnBlur
              >
                {(formikProps) => (
                  <DocumentTypeCreationForm
                    {...formikProps}
                    edit={this.props.edit}
                    cancel={() => this.cancel()}
                  />
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Container>
      </div>
    )
  }
}

export default withRouter(DocumentTypeCreation)
