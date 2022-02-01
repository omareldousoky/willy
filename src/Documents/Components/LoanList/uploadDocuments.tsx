import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import DocumentUploader from '../../../Shared/Components/documentUploader/documentUploader'
import { getApplicationDocuments } from '../../../Shared/Services/APIs/loanApplication/getDocuments'
import { getApplication } from '../../../Shared/Services/APIs/loanApplication/getApplication'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
} from '../../../Shared/redux/document/actions'
import { Image } from '../../../Shared/redux/document/types'
import { downloadAsZip, getErrorMessage } from '../../../Shared/Services/utils'
import { getDocumentsTypes } from '../../../Shared/Services/APIs/encodingFiles/documentType'

interface Props extends RouteComponentProps<{}, {}, { id: string }> {
  getDocuments: typeof getDocuments
  addAllToSelectionArray: typeof addAllToSelectionArray
  clearSelectionArray: typeof clearSelectionArray
  loading: boolean
  documents: any[]
  selectionArray: Image[]
}
interface State {
  application: any
  loading: boolean
  documentTypes: any[]
  selectAll: boolean
}
class UploadDocuments extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      documentTypes: [],
      selectAll: false,
      application: {},
    }
  }

  async componentDidMount() {
    const appId = this.props.location.state.id
    this.getAppByID(appId)
    this.getDocumentTypes()
  }

  componentWillUnmount() {
    this.props.clearSelectionArray()
  }

  async getDocumentTypes() {
    const customerType = (this.props.location?.state as any)?.sme
      ? 'company'
      : 'individual'

    const response = await getDocumentsTypes(
      'loanApplication,issuedLoan',
      true,
      customerType
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
  }

  async getApplicationDocuments() {
    const res = await getApplicationDocuments(
      this.state.application._id as string
    )
    if (res.status !== 'success') {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  async getAppByID(id) {
    this.setState({ loading: true })
    const application = await getApplication(id)
    if (application.status === 'success') {
      this.setState(
        {
          loading: false,
          application: application.body,
        },
        () =>
          this.props.getDocuments({
            applicationId: this.state.application._id,
            docType:
              this.state.application.status === 'issued'
                ? 'issuedLoan'
                : 'loanApplication',
          })
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(application.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
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

  render() {
    return (
      <Container>
        <Loader
          type="fullscreen"
          open={this.state.loading || this.props.loading}
        />
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
                  `loan-${this.state.application._id}-${new Date().valueOf()}`
                )
                this.setState({ loading: false })
              }}
            >{`${local.download}(${this.props.selectionArray.length})`}</Button>
          </div>
        </Row>
        {this.state.documentTypes.map((documentType, index) => {
          return (
            <DocumentUploader
              key={index}
              documentType={documentType}
              edit
              keyName="applicationId"
              keyId={this.state.application._id as string}
              view={
                (this.state.application.status === 'rejected' ||
                  this.state.application.status === 'canceled') as boolean
              }
            />
          )
        })}
      </Container>
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
)(withRouter(UploadDocuments))
