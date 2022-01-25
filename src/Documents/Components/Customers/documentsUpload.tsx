import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import DocumentUploader from '../../../Shared/Components/documentUploader/documentUploader'
import { Loader } from '../../../Shared/Components/Loader'
import { DocumentType } from '../../../Shared/Services/interfaces'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
} from '../../../Shared/redux/document/actions'
import { Image } from '../../../Shared/redux/document/types'
import { downloadAsZip, getErrorMessage } from '../../../Shared/Services/utils'
import * as local from '../../../Shared/Assets/ar.json'
import { getDocumentsTypes } from '../../../Shared/Services/APIs/encodingFiles/documentType'

interface State {
  documentTypes: any[]
  selectAll: boolean
  loading: boolean
}

interface Props extends RouteComponentProps<{}, {}, { id: string }> {
  previousStep?: () => void
  getDocuments: typeof getDocuments
  addAllToSelectionArray: typeof addAllToSelectionArray
  clearSelectionArray: typeof clearSelectionArray
  edit: boolean
  view?: boolean
  loading: boolean
  documents: any[]
  selectionArray: Image[]
}
class DocumentsUpload extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      documentTypes: [],
      selectAll: false,
      loading: false,
    }
  }

  async componentDidMount() {
    const customerType = (this.props.location?.state as any)?.sme
      ? 'company'
      : 'individual'

    const response = await getDocumentsTypes('customer', true, customerType)
    if (response.status === 'success') {
      this.setState({
        documentTypes: response.body.documentTypes,
      })
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(response.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
    this.props.getDocuments({
      customerId: this.props.location.state.id,
      docType: 'customer',
    })
  }

  componentWillUnmount() {
    this.props.clearSelectionArray()
  }

  selectAllOptions() {
    if (this.state.selectAll === true) {
      this.setState({ selectAll: false })
      this.props.clearSelectionArray()
    } else {
      this.setState({ selectAll: true })
      const images: Image[] = []
      this.props.documents.map((doc) => {
        doc.imagesFiles.map((image) => {
          images.push({
            fileName: image.key,
            url: image.url,
          })
        })
      })
      this.props.addAllToSelectionArray(images)
    }
  }

  render() {
    return (
      <>
        <Loader
          type="fullscreen"
          open={this.props.loading || this.state.loading}
        />
        <Container>
          <Row style={{ justifyContent: 'space-between' }}>
            <div
              style={{
                textAlign: 'right',
                padding: '0.75rem 1.25rem',
                marginRight: '1rem',
              }}
            >
              <Form.Check
                type="checkbox"
                id="check-all"
                label={local.checkAll}
                checked={this.state.selectAll}
                onChange={() => this.selectAllOptions()}
              />
            </div>
            <div
              style={{
                textAlign: 'right',
                padding: '0.75rem 1.25rem',
                marginRight: '1rem',
              }}
            >
              <Button
                style={{ width: '150px' }}
                variant="primary"
                disabled={this.props.selectionArray.length <= 0}
                onClick={async () => {
                  this.setState({ loading: true })
                  await downloadAsZip(
                    this.props.selectionArray,
                    `customer-${
                      this.props.location.state.id
                    }-${new Date().valueOf()}`
                  )
                  this.setState({ loading: false })
                }}
              >{`${local.download}(${this.props.selectionArray.length})`}</Button>
            </div>
          </Row>
          {this.state.documentTypes.map((documentType: DocumentType, index) => {
            return (
              <DocumentUploader
                key={index}
                documentType={documentType}
                edit={this.props.edit}
                keyName="customerId"
                keyId={this.props.location.state.id}
                view={this.props.view}
              />
            )
          })}
        </Container>
      </>
    )
  }
}

const addDocumentToProps = (dispatch) => {
  return {
    getDocuments: (obj) => dispatch(getDocuments(obj)),
    addAllToSelectionArray: (images) =>
      dispatch(addAllToSelectionArray(images)),
    clearSelectionArray: () => dispatch(clearSelectionArray()),
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    documents: state.documents as any[],
    selectionArray: state.selectionArray,
  }
}

export default connect(
  mapStateToProps,
  addDocumentToProps
)(withRouter(DocumentsUpload))
