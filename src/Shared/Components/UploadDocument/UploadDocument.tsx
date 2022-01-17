import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import print from 'Shared/Utils/printIframe'
import DocumentUploader from 'Shared/Components/documentUploader/documentUploader'
import { getApplicationDocuments } from 'Shared/Services/APIs/loanApplication/getDocuments'
import * as local from 'Shared/Assets/ar.json'
import { Loader } from 'Shared/Components/Loader'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
  clearDocuments,
} from 'Shared/redux/document/actions'
import { Image } from 'Shared/redux/document/types'
import { downloadAsZip, getErrorMessage } from 'Shared/Services/utils'
import { getDocumentsTypes } from 'Shared/Services/APIs/encodingFiles/documentType'
import ability from '../../config/ability'
import { UploadDocumentProps, UploadDocumentState } from './types'
import './uploadDocument.scss'

class UploadDocuments extends Component<
  UploadDocumentProps,
  UploadDocumentState
> {
  constructor(props: UploadDocumentProps) {
    super(props)
    this.state = {
      loading: false,
      documentTypes: [],
      selectAll: false,
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    this.getDocumentTypes()
    await this.props.getDocuments({
      applicationId: this.props.application._id,
      docType:
        this.props.application.status === 'issued'
          ? 'issuedLoan'
          : 'loanApplication',
    })
    this.setState({ loading: false })
  }

  componentWillUnmount() {
    this.props.clearSelectionArray()
    this.props.clearDocuments()
  }

  async getApplicationDocuments() {
    const res = await getApplicationDocuments(
      this.props.application._id as string
    )
    if (res.status !== 'success') {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  async getDocumentTypes() {
    const response = await getDocumentsTypes(
      'loanApplication,issuedLoan',
      false,
      this.props.application.customer.customerType === 'company'
        ? 'company'
        : 'individual'
    )
    if (response.status === 'success') {
      this.setState({
        documentTypes: response.body.documentTypes,
      })
    } else {
      Swal.fire('Error !', getErrorMessage(response.error.error), 'error')
    }
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

  checkPermission() {
    return ability.can('addingDocuments', 'application')
  }

  render() {
    return (
      <>
        <Loader
          type="fullscreen"
          open={this.state.loading || this.props.loading}
        />
        <Row className="justify-content-between">
          <div className="spacing-document">
            <Form.Check
              type="checkbox"
              id="check-all"
              label={local.checkAll}
              checked={this.state.selectAll}
              onChange={() => this.selectAllOptions()}
            />
          </div>
          <Row className="flex-grow-1 justify-content-end spacing-document text-right">
            <Col xs={4}>
              <Button
                variant="secondary"
                disabled={this.props.selectionArray.length <= 0}
                onClick={async () => {
                  this.setState({ loading: true })
                  print(this.props.selectionArray)
                  this.setState({ loading: false })
                }}
              >{`${local.print}(${this.props.selectionArray.length})`}</Button>
            </Col>
            <Col xs={4}>
              <Button
                variant="primary"
                disabled={this.props.selectionArray.length <= 0}
                onClick={async () => {
                  this.setState({ loading: true })
                  await downloadAsZip(
                    this.props.selectionArray,
                    `loan-${this.props.application._id}-${new Date().valueOf()}`
                  )
                  this.setState({ loading: false })
                }}
              >{`${local.download}(${this.props.selectionArray.length})`}</Button>
            </Col>
          </Row>
        </Row>
        {this.state.documentTypes.map((documentType, index) => {
          return (
            <DocumentUploader
              key={index}
              documentType={documentType}
              edit={this.checkPermission()}
              keyName="applicationId"
              keyId={this.props.application._id as string}
              view={
                (this.props.application.status === 'rejected' ||
                  this.props.application.status === 'canceled' ||
                  !this.checkPermission()) as boolean
              }
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

export default connect(mapStateToProps, addDocumentToProps)(UploadDocuments)
