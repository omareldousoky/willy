import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as local from '../../Assets/ar.json'
import DocumentUploader from '../documentUploader/documentUploader'
import { Loader } from '../Loader'
import { DocumentType } from '../../Services/interfaces'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
} from '../../redux/document/actions'
import { Image } from '../../redux/document/types'
import { downloadAsZip, getErrorMessage } from '../../Services/utils'
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/documentType'

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
  edit: boolean
  view?: boolean
  loading: boolean
  documents: any[]
  selectionArray: Image[]
  isCompany?: boolean
}
class DocumentsUploadComponent extends Component<Props, State> {
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
      Swal.fire('Error !', getErrorMessage(response.error.error), 'error')
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
          <div
            style={{
              padding: '0.75rem 1.25rem',
              marginRight: '1rem',
            }}
          >
            <Button
              style={{ width: '150px' }}
              variant="primary"
              disabled={!this.props.selectionArray.length}
              onClick={async () => {
                this.setState({ loading: true })
                await downloadAsZip(
                  this.props.selectionArray,
                  `customer-${this.props.customerId}-${new Date().valueOf()}`
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
              keyId={this.props.customerId}
              view={this.props.view}
              docType="customer"
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
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    documents: state.documents as any[],
    selectionArray: state.selectionArray,
  }
}

export const DocumentsUpload = connect(
  mapStateToProps,
  addDocumentToProps
)(DocumentsUploadComponent)
