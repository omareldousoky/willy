import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import print from 'Shared/Utils/printIframe'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as local from '../../../Shared/Assets/ar.json'
import DocumentUploader from '../../../Shared/Components/documentUploader/documentUploader'
import { Loader } from '../../../Shared/Components/Loader'
import { DocumentType } from '../../../Shared/Services/interfaces'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
  clearDocuments,
} from '../../../Shared/redux/document/actions'
import { Image } from '../../../Shared/redux/document/types'
import { downloadAsZip, getErrorMessage } from '../../../Shared/Services/utils'
import { getDocumentsTypes } from '../../../Shared/Services/APIs/encodingFiles/documentType'

interface State {
  documentTypes: any[]
  selectAll: boolean
  loading: boolean
}
interface Props {
  customerId: string
  previousStep?: () => void
  getDocuments: typeof getDocuments
  addAllToSelectionArray: typeof addAllToSelectionArray
  clearSelectionArray: typeof clearSelectionArray
  clearDocuments: typeof clearDocuments
  edit: boolean
  view?: boolean
  loading: boolean
  documents: any[]
  selectionArray: Image[]
  isCompany?: boolean
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
    const response = await getDocumentsTypes(
      'customer',
      false,
      this.props.isCompany ? 'company' : 'individual'
    )
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
    if (this.props.edit || this.props.view) {
      await this.props.getDocuments({
        customerId: this.props.customerId,
        docType: 'customer',
      })
    }
  }

  componentWillUnmount() {
    this.props.clearSelectionArray()
    this.props.clearDocuments()
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
        <Row style={{ justifyContent: 'space-between' }}>
          <div
            style={{
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
          <Row className="d-flex justify-content-end flex-grow-1 spacing-document text-right">
            <Col xs={12} lg={10}>
              <Button
                className="mr-2"
                variant="secondary"
                disabled={this.props.selectionArray.length <= 0}
                onClick={async () => {
                  this.setState({ loading: true })
                  print(this.props.selectionArray)
                  this.setState({ loading: false })
                }}
              >{`${local.print}(${this.props.selectionArray.length})`}</Button>
              <Button
                variant="primary"
                disabled={this.props.selectionArray.length <= 0}
                onClick={async () => {
                  this.setState({ loading: true })
                  await downloadAsZip(
                    this.props.selectionArray,
                    `Customer-${this.props.customerId}-${new Date().valueOf()}`
                  )
                  this.setState({ loading: false })
                }}
              >{`${local.download}(${this.props.selectionArray.length})`}</Button>
            </Col>
          </Row>
        </Row>
        {this.state.documentTypes.map((documentType: DocumentType, index) => {
          return (
            <DocumentUploader
              key={index}
              documentType={documentType}
              edit={this.props.edit}
              keyName="customerId"
              keyId={this.props.customerId}
              view={this.props.view}
            />
          )
        })}
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
    clearDocuments: () => dispatch(clearDocuments()),
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    documents: state.documents as any[],
    selectionArray: state.selectionArray,
  }
}

export default connect(mapStateToProps, addDocumentToProps)(DocumentsUpload)
