import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Spinner from 'react-bootstrap/Spinner'
import { connect } from 'react-redux'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import { download, getErrorMessage } from '../../Services/utils'
import {
  addToDocuments,
  deleteDocument,
  uploadDocument,
  deleteFromDocuments,
  invalidDocument,
  addNewToDocuments,
  AddToSelectionArray,
  RemoveFromSelectionArray,
} from '../../redux/document/actions'
import { Image } from '../../redux/document/types'
import local from '../../Assets/ar.json'
import { DocumentType } from '../../Services/interfaces'

interface Props {
  documentType: DocumentType
  keyName: string
  keyId: string
  edit: boolean
  view?: boolean
  handleChangeFromParent?: boolean
  loading: boolean
  uploadDocument: typeof uploadDocument
  addToDocuments: typeof addToDocuments
  deleteDocument: typeof deleteDocument
  deleteFromDocuments: typeof deleteFromDocuments
  invalidDocument: typeof invalidDocument
  addNewToDocuments: typeof addNewToDocuments
  AddToSelectionArray: typeof AddToSelectionArray
  RemoveFromSelectionArray: typeof RemoveFromSelectionArray
  document: any
  documents: any[]
  selectionArray: Image[]
  docType?: string
}

interface State {
  dragging: boolean
}

class DocumentUploader extends Component<Props, State> {
  private fileInput: React.RefObject<HTMLInputElement>

  private dragEventCounter = 0

  constructor(props) {
    super(props)
    this.fileInput = React.createRef()
    this.state = {
      dragging: false,
    }
  }

  getImageFilesLength(): number {
    const len: number = this.props.documents.find(
      (doc) => doc?.docName === this.props.documentType.name
    )?.imagesFiles?.length
    if (len > 0) return len
    return 0
  }

  dragleaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter -= 1
    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false })
    }
  }

  dragenterListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter += 1
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      this.setState({ dragging: true })
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === 'Files'
    ) {
      this.setState({ dragging: true })
    }
  }

  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  dropListener = (event: React.DragEvent<HTMLDivElement>, name: string) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter = 0
    this.setState({ dragging: false })
    if (
      event.dataTransfer.files &&
      event.dataTransfer.files[0] &&
      !this.props.view
    ) {
      this.readFiles(event.dataTransfer.files, name)
    }
  }

  handleOnChange = (event) => {
    event.preventDefault()
    const imagesLimit =
      this.props.documentType.pages +
      this.calculateNumOfValidDocuments(this.props.documentType.name)
    if (
      event.target.files.length <= imagesLimit &&
      this.getImageFilesLength() <= imagesLimit &&
      !this.props.view
    ) {
      this.readFiles(event.target.files, this.props.documentType.name)
    } else {
      Swal.fire({
        text: local.numberOfDocumentsError + this.props.documentType.pages,
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  calculateNumOfValidDocuments(name: string): number {
    const numOfValidDocs: number = this.props.documents
      .find((doc) => doc?.docName === name)
      ?.imagesFiles.filter((doc) => {
        return !doc.valid
      }).length
    if (numOfValidDocs > 0) return numOfValidDocs
    return 0
  }

  async deleteDocument(event, name: string, key: number) {
    this.overrideEventDefaults(event)

    const docToDelete = this.props.documents.find(
      (doc) => doc?.docName === name
    )?.imagesFiles[key]

    const data = {
      [this.props.keyName]: this.props.keyId,
      docName: name,
      key: docToDelete?.key,
      delete:
        this.props.documentType.updatable && this.props.documentType.active,
    }

    if (this.props.handleChangeFromParent) {
      this.props.document.status = 'success'
    } else {
      await this.props.deleteDocument(data, this.props.documentType.type)
    }

    if (
      this.props.document.status === 'success' &&
      this.props.documentType.updatable
    ) {
      this.props.deleteFromDocuments(data.key, name)
    } else if (
      this.props.document.status === 'success' &&
      !this.props.documentType.updatable
    ) {
      this.props.invalidDocument(data.key, name)
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(this.props.document.error?.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  async readFiles(files: Array<File> | FileList, name: string) {
    const imagesLimit =
      this.props.documentType.pages + this.calculateNumOfValidDocuments(name)
    const flag: boolean = this.checkFileType(files)
    if (flag)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.invalidFileType,
        icon: 'error',
      })
    else if (
      files.length <= imagesLimit &&
      this.getImageFilesLength() < imagesLimit
    ) {
      for (let index = 0; index < files.length; index += 1) {
        const formData = new FormData()
        formData.append('docName', name)
        formData.append(this.props.keyName, this.props.keyId)
        formData.append('file', files[index])

        if (this.props.handleChangeFromParent) {
          this.props.document.status = 'success'
        } else {
          // eslint-disable-next-line no-await-in-loop
          await this.props.uploadDocument(
            formData,
            this.props.documentType.type
          )
        }

        if (this.props.document.status === 'success') {
          const reader = new FileReader()
          const file = files[index]
          reader.onloadend = () => {
            const newDocument = {
              key: this.props.document.body?.message ?? `customer/${file.name}`,
              url: reader.result,
              valid: true,
              ...(this.props.handleChangeFromParent && { file }),
            }

            if (this.props.documents.find((doc) => doc?.docName === name))
              this.props.addToDocuments(newDocument, name)
            else {
              this.props.addNewToDocuments({
                docName: name,
                imagesFiles: [newDocument],
                type: this.props.docType,
              })
            }
          }
          reader.readAsDataURL(file)
        } else {
          Swal.fire({
            title: local.errorTitle,
            text: getErrorMessage(this.props.document.error?.error),
            icon: 'error',
            confirmButtonText: local.confirmationText,
          })
        }
      }
    }
  }

  constructArr(name: string) {
    const len = this.props.documentType.active
      ? this.props.documentType.pages + this.calculateNumOfValidDocuments(name)
      : this.props.documents.find((doc) => doc.docName === name).imagesFiles
          .length
    const arr: number[] = []
    for (let i = 0; i < len; i += 1) {
      arr.push(i)
    }
    return arr
  }

  checkFileType(files: Array<File> | FileList) {
    const { length } = files
    let flag = false
    for (let index = 0; index < length; index += 1) {
      if (
        files[index].type === 'image/png' ||
        files[index].type === 'image/jpeg' ||
        files[index].type === 'image/jpg'
      )
        flag = false
      else return true
    }
    return flag
  }

  triggerInputFile() {
    this.fileInput.current?.click()
  }

  calculateLimit() {
    return (
      this.getImageFilesLength() -
      this.calculateNumOfValidDocuments(this.props.documentType.name)
    )
  }

  downloadPhoto(document) {
    const fileName = document.key.split('/')
    download(document.url, fileName[1])
  }

  selectItem(document: any) {
    if (
      !this.props.selectionArray.find(
        (image) => image.fileName === document.key
      )
    ) {
      this.props.AddToSelectionArray({
        url: document.url,
        fileName: document.key,
      })
    } else {
      this.props.RemoveFromSelectionArray(document.key)
    }
  }

  renderPhotoByName(key: number, name: string) {
    const document = this.props.documents.find((doc) => doc?.docName === name)
      .imagesFiles[key]
    return (
      <Card.Body key={key} className="document-upload-container">
        <Row data-qc="document-actions" className="document-actions">
          {this.props.documentType.active &&
            this.props.documents.find((doc) => doc?.docName === name)
              .imagesFiles[key]?.valid &&
            !this.props.view && (
              <span
                className="icon"
                onClick={(e) => this.deleteDocument(e, name, key)}
              >
                <img
                  className={
                    this.props.documentType.updatable
                      ? ''
                      : 'document-action-icon'
                  }
                  alt="delete"
                  src={
                    this.props.documentType.updatable
                      ? require('../../Assets/deleteIcon.svg')
                      : require('../../Assets/deactivateDoc.svg')
                  }
                />
              </span>
            )}
          <span
            className="icon"
            onClick={() => {
              this.downloadPhoto(
                this.props.documents.find((doc) => doc?.docName === name)
                  ?.imagesFiles[key]
              )
            }}
          >
            <img
              alt="download"
              src={require('../../Assets/downloadIcon.svg')}
            />
          </span>
          <span className="icon">
            <Form.Check
              type="checkbox"
              id={document.key}
              onChange={() => this.selectItem(document)}
              checked={
                !!this.props.selectionArray.find(
                  (image) => image.fileName === document.key
                )
              }
              label=""
            />
          </span>
        </Row>
        <Row style={{ height: '' }}>
          {!this.props.documents.find((doc) => doc?.docName === name)
            ?.imagesFiles[key]?.valid && (
            <div className="invalid-document">
              <img
                alt="deactivate"
                src={require('../../Assets/deactivateIcon.svg')}
              />
            </div>
          )}
          <div
            className={
              this.props.documents.find((doc) => doc?.docName === name)
                ?.imagesFiles[key]?.valid
                ? ''
                : 'invalid-image'
            }
          >
            <img
              className="uploaded-image"
              src={
                this.props.documents.find((doc) => doc?.docName === name)
                  ?.imagesFiles[key]?.url as string
              }
              key={key}
              alt=""
            />
          </div>
        </Row>
      </Card.Body>
    )
  }

  renderUploadPhoto(key: number) {
    return (
      <Card.Body
        key={key}
        className="document-upload-container"
        onClick={() => this.triggerInputFile()}
      >
        <img
          src={
            this.props.view
              ? require('../../Assets/imagePlaceholder.svg')
              : require('../../Assets/uploadDrag.svg')
          }
          alt="upload-document"
        />
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <div>
            {this.props.view
              ? local.documentNotUploadedYet
              : local.documentUploadDragDropText}
          </div>
          {!this.props.view && <div>{local.documentUploadBrowseFileText}</div>}
        </div>
      </Card.Body>
    )
  }

  renderDropHere(key: number) {
    return (
      <div key={key} className="document-upload-container">
        <h5>Drop here</h5>
      </div>
    )
  }

  renderLoading() {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          margin: '20px',
          flex: 1,
          backgroundColor: '#ffffff',
          textAlign: 'center',
          width: '100%',
          height: '200px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  renderContainer(name: string) {
    const Limit =
      this.props.documentType.pages + this.calculateNumOfValidDocuments(name)
    return (
      <Card
        style={{
          display: 'flex',
          overflowX: 'scroll',
          flexDirection: 'row',
          flexFlow: 'nowrap',
          justifyContent: 'flex-start',
          backgroundColor: '#fafafa',
          cursor:
            this.props.documents.find((doc) => doc?.docName === name)
              ?.imagesFiles.length === Limit
              ? 'not-allowed'
              : 'pointer',
          border: '#e5e5e5 solid 1px',
          borderRadius: 4,
        }}
        data-qc={`upload-${name}`}
        onDrag={this.overrideEventDefaults}
        onDragStart={this.overrideEventDefaults}
        onDragEnd={this.overrideEventDefaults}
        onDragOver={this.overrideEventDefaults}
        onDragEnter={this.dragenterListener}
        onDragLeave={this.dragleaveListener}
        onDrop={(e) => this.dropListener(e, name)}
      >
        <input
          disabled={this.props.view}
          multiple
          type="file"
          name="img"
          style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/jpeg"
          ref={this.fileInput}
          onChange={this.handleOnChange}
          onClick={(event) => {
            event.currentTarget.value = ''
          }}
        />
        {this.props.loading
          ? this.renderLoading()
          : this.constructArr(name).map((_value: number, key: number) => {
              if (
                this.props.documents.find(
                  (document) => document?.docName === name
                )?.imagesFiles[key] === undefined
              ) {
                if (this.state.dragging) return this.renderDropHere(key)
                return this.renderUploadPhoto(key)
              }
              return this.renderPhotoByName(key, name)
            })}
      </Card>
    )
  }

  renderInactiveDoc(name) {
    return (
      <div style={{ marginBottom: 30 }}>
        <h4 style={{ textAlign: 'right' }}>
          {this.props.documentType.name}
          <span
            style={{
              margin: '0  10px',
              fontSize: '14px',
              color: '#d51b1b',
              fontWeight: 'bold',
            }}
          >
            {local.inactiveDocument}
          </span>
        </h4>
        <div
          style={{
            display: 'flex',
            overflowX: 'scroll',
            flexDirection: 'row',
            flexFlow: 'nowrap',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            cursor: 'pointer',
            border: '#e5e5e5 solid 1px',
            borderRadius: 4,
            background: 'rgba(51,51,51,0.85)',
          }}
          data-qc={`inactiveDoc-${name}`}
        >
          {this.props.loading
            ? this.renderLoading()
            : this.constructArr(name).map((_value: number, key: number) => {
                return this.renderPhotoByName(key, name)
              })}
        </div>
      </div>
    )
  }

  render() {
    return this.props.documentType.active ? (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexFlow: 'nowrap',
            justifyContent: 'space-between',
            margin: '1rem 2rem',
          }}
        >
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            <span>
              {local[this.props.documentType.name] ||
                this.props.documentType.name}
              &nbsp;
            </span>
            <span
              style={{
                margin: '0  10px',
                fontSize: '14px',
                color: this.props.documentType.updatable
                  ? '#7dc356'
                  : '#d51b1b',
              }}
            >
              {this.props.documentType.updatable
                ? local.updatable
                : local.nonUpdatable}
            </span>
          </div>
          {!this.props.documentType.updatable && (
            <small
              style={{ color: '#edb600', fontSize: '12px', fontWeight: 'bold' }}
            >{`${
              local.numOfInvalidImages
            } ( ${this.calculateNumOfValidDocuments(
              this.props.documentType.name
            )} )`}</small>
          )}
          <small
            style={{ color: '#6e6e6e', fontSize: '12px', fontWeight: 'bold' }}
          >{`${local.numOfUploadedImages} ( ${
            this.getImageFilesLength() -
            this.calculateNumOfValidDocuments(this.props.documentType.name)
          } / ${this.props.documentType.pages} )`}</small>
        </div>
        {this.renderContainer(this.props.documentType.name)}
      </div>
    ) : !this.props.documentType.active &&
      this.props.documents.find(
        (doc) => doc?.docName === this.props.documentType.name
      )?.imagesFiles.length > 0 ? (
      this.renderInactiveDoc(this.props.documentType.name)
    ) : null
  }
}
const addDocumentToProps = (dispatch) => {
  return {
    uploadDocument: (document, docType) =>
      dispatch(uploadDocument(document, docType)),
    deleteDocument: (document, docType) =>
      dispatch(deleteDocument(document, docType)),
    addToDocuments: (document, docName) =>
      dispatch(addToDocuments(document, docName)),
    deleteFromDocuments: (key, docName) =>
      dispatch(deleteFromDocuments(key, docName)),
    invalidDocument: (key, docName) => dispatch(invalidDocument(key, docName)),
    addNewToDocuments: (document) => dispatch(addNewToDocuments(document)),
    AddToSelectionArray: (image) => dispatch(AddToSelectionArray(image)),
    RemoveFromSelectionArray: (image) =>
      dispatch(RemoveFromSelectionArray(image)),
  }
}
const mapStateToProps = (state) => {
  return {
    document: state.document,
    documents: state.documents,
    loading: state.loading,
    selectionArray: state.selectionArray,
  }
}

export default connect(mapStateToProps, addDocumentToProps)(DocumentUploader)
