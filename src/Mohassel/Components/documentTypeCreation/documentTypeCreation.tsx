import React, { Component } from 'react'
import { Formik } from 'formik'
import Container from 'react-bootstrap/Container'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import DocumentTypeCreationForm from './documentTypeCreationForm'
import { DocumentType } from '../../../Shared/Services/interfaces'
import {
  documentType,
  documentTypeCreationValidation,
  documentTypeEditValidation,
} from './documnetTypeinitialState'
import { createDocumentsType } from '../../Services/APIs/encodingFiles/createDocumentType'
import { editDocumentsType } from '../../Services/APIs/encodingFiles/editDocumentType'
import * as local from '../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../Shared/Services/utils'

interface Props {
  history: any
  edit: boolean
}
interface State {
  documentType: DocumentType
  loading: boolean
}
class DocumentTypeCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      documentType,
      loading: false,
    }
  }

  getDocumentType() {
    const documentTypeFromH: DocumentType = this.props.history.location.state
      .documentType
    this.setState({ documentType: documentTypeFromH })
  }

  componentDidMount() {
    if (this.props.edit) {
      this.getDocumentType()
    }
  }

  async updateDocument(values) {
    const res = await editDocumentsType(values)
    this.setState({ loading: false })
    if (res.status === 'success') {
      Swal.fire('success', local.documentTypeEditSuccessMessage)
      this.props.history.goBack()
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  async createDocument(values) {
    const res = await createDocumentsType(values)
    this.setState({ loading: false })
    if (res.status === 'success') {
      Swal.fire('success', local.documentTypeCreationSuccessMessage)
      this.props.history.goBack()
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  submit = (values) => {
    this.setState({
      documentType: values,
      loading: true,
    })
    if (this.props.edit) {
      this.updateDocument(values)
    } else {
      this.createDocument(values)
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
