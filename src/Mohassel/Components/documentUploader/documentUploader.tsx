import React, { Component } from 'react'
import { DocumentType } from '../../Services/interfaces'
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { download } from '../../Services/utils';
import ability from '../../config/ability';
interface Document {
  key: string;
  url: string | ArrayBuffer | null;
  valid: boolean;
}

interface Props {
  documentType: DocumentType;
  uploadDocumentFun: any;
  deleteDocumentFun: any;
  keyName: string;
  keyId: string;
  edit: boolean;
  view?: boolean;
  uploadedImageFile: Array<Document>;
}


interface State {
  loading: boolean;
  dragging: boolean;
  imagesFiles: Array<Document>;
}
class DocumentUploader extends Component<Props, State> {
  private fileInput: React.RefObject<HTMLInputElement>;
  private dragEventCounter = 0;
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      loading: false,
      dragging: false,
      imagesFiles: [],
    }
  }
  static getDerivedStateFromProps(props, state) {
    if ((props.edit || props.view) && props.uploadedImageFile?.length > 0)
      if (props.uploadedImageFile !== state.imagesFiles && state.imagesFiles.length == 0) {
        return {
          imagesFiles: props.uploadedImageFile,
        }
      }
    return null;
  }

  calculateNumOfValidDocuments(): number {
    const numOfValidDocs: number = this.state.imagesFiles.filter((doc) => {
      return !doc.valid;
    }).length;
    return numOfValidDocs;
  }
  calculateLimit() {

    return (this.state.imagesFiles.length - this.calculateNumOfValidDocuments());

  }
  triggerInputFile() {
    const limit = this.props.documentType.pages + this.calculateNumOfValidDocuments();
    if (this.state.imagesFiles.length < limit) {
      this[`fileInput`].current?.click()
    }
  }
  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  dragenterListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      this.setState({ dragging: true });
    } else if (
      event.dataTransfer.types &&
      event.dataTransfer.types[0] === "Files"
    ) {
      this.setState({ dragging: true });
    }
  };
  dragleaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter--;
    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  constructArr(name: string) {
    const len = this.props.documentType.active ? this.props.documentType.pages + this.calculateNumOfValidDocuments() : this.state.imagesFiles.length;
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
  }
  checkFileType(files: Array<File> | FileList) {
    const length = files.length;
    let flag = false;
    for (let index = 0; index < length; index++) {
      if (files[index].type === "image/png" || files[index].type === "image/jpeg" || files[index].type === "image/jpg")
        flag = false;
      else return true;
    }
    return flag;
  }
  async readFiles(files: Array<File> | FileList, name: string) {
    const imagesLimit = this.props.documentType.pages + this.calculateNumOfValidDocuments();
    const flag: boolean = this.checkFileType(files)
    if (flag) Swal.fire('', local.invalidFileType, 'error')
    else if (files.length <= imagesLimit && this.state.imagesFiles.length < imagesLimit) {
      this.setState({ loading: true });
      for (let index = 0; index < files.length; index++) {
        const formData = new FormData();
        formData.append("docName", name);
        formData.append(this.props.keyName, this.props.keyId);
        formData.append("file", files[index]);
        const res = await this.props.uploadDocumentFun(formData);
        if (res.status === 'success') {
          const reader = new FileReader();
          const file = files[index];
          reader.onloadend = () => {
            const document: Document = {
              key: res.body.message,
              url: reader.result,
              valid: true,
            }
            this.setState({
              imagesFiles: [...this.state.imagesFiles, document]
            } as any)
          }
          reader.readAsDataURL(file)
        } else {
          this.setState({ loading: false });
          Swal.fire("", local.documentUploadError, "error")
        }
      }
      this.setState({ loading: false });
    }
  }
  async deleteDocument(event, name: string, key: number) {
    this.overrideEventDefaults(event);
    this.setState({ loading: true });
    const data = {
      [this.props.keyName]: this.props.keyId,
      docName: name,
      key: this.state.imagesFiles[key].key,
      delete: (this.props.documentType.updatable && this.props.documentType.active),
    }
    const res = await this.props.deleteDocumentFun(data);
    if (res.status === "success" && this.props.documentType.updatable) {
      this.setState({
        imagesFiles: this.state.imagesFiles.filter((_el, index) => index !== key),
        loading: false,
      })
     window.location.reload();
    } else if (res.status === "success" && !this.props.documentType.updatable) {
      const currentImages = this.state.imagesFiles;
      currentImages[key].valid = false;
      this.setState({
        imagesFiles: currentImages,
        loading: false,
      })

    }
    else {
      Swal.fire("", local.deleteError, "error")
      this.setState({ loading: false });
    }

  }
  dropListener = (event: React.DragEvent<HTMLDivElement>, name: string) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter = 0;
    this.setState({ dragging: false });
    if (event.dataTransfer.files && event.dataTransfer.files[0] && !this.props.view) {
      this.readFiles(event.dataTransfer.files, name);
    }
  };
  handleOnChange = (event, name: string) => {
    event.preventDefault();
    const imagesLimit = this.props.documentType.pages + this.calculateNumOfValidDocuments();
    if (event.target.files.length <= imagesLimit && this.state.imagesFiles.length <= imagesLimit && !this.props.view) {
      this.readFiles(event.target.files, name);
    } else {
      Swal.fire('', local.numberOfDocumentsError + this.props.documentType.pages, 'error')
    }
  }
  renderLoading() {
    return (
      <div className="document-upload-container">
        <Spinner animation="border" variant="primary"></Spinner>

      </div>
    )
  }
  renderDropHere(key: number) {
    return (
      <div key={key} className="document-upload-container">
        <h5>Drop here</h5>
      </div>
    )
  }
  renderUploadPhoto(key: number) {
    return (
      <Card.Body key={key} className="document-upload-container">
        <img src={this.props.view ? require('../../Assets/imagePlaceholder.svg') : require('../../Assets/uploadDrag.svg')}
          alt="upload-document"
        />
        <div style={{ marginTop: 30 }}>
          <h5>{this.props.view ? local.documentNotUploadedYet : local.documentUploadDragDropText}</h5>
          {!this.props.view && <h5>{local.documentUploadBrowseFileText}</h5>}
        </div>
      </Card.Body>
    )
  }
  downloadPhoto(document: Document) {
    const fileName = document.key.split('/');
    download(document.url, fileName[1]);
  }
  renderPhotoByName(key: number, name: string) {
    return (
      <Card.Body key={key} className="document-upload-container" style={{ cursor: this.state.imagesFiles[key].valid && this.props.documentType.active ? "pointer" : 'not-allowed' }}>
        {(this.props.documentType.active && this.state.imagesFiles[key].valid) && <div data-qc="document-actions" className="document-actions" >
          {!this.props.view && <span className="fa icon" onClick={(e) => this.deleteDocument(e, name, key)}><img alt="delete" src={require('../../Assets/deleteIcon.svg')} /></span>}
          {((!this.props.edit && this.props.view) || ((ability.can('addingDocuments', 'application') && this.props.documentType.type !== 'customer'))) && <span className="fa icon" onClick={() => { this.downloadPhoto(this.state.imagesFiles[key]) }}><img alt="download" src={require('../../Assets/downloadIcon.svg')} /></span>}
        </div>}
        {!this.state.imagesFiles[key]?.valid && <div className="invalid-document">
          <img src={require('../../Assets/deactivateIcon.svg')} />
        </div>}
        <img className={this.state.imagesFiles[key]?.valid ? "uploaded-image" : "uploaded-image invalid-image"} src={this.state.imagesFiles[key]?.url as string} key={key} alt="" />
      </Card.Body>
    )
  }
  renderContainer(name: string) {
    const Limit = this.props.documentType.pages + this.calculateNumOfValidDocuments();
    return (
      <Card style={{
        display: 'flex',
        overflowX: "scroll",
        flexDirection: "row",
        flexFlow: "nowrap",
        justifyContent: "space-between",
        backgroundColor: '#fafafa', cursor: this.state.imagesFiles.length === Limit ? 'not-allowed' : 'pointer', border: '#e5e5e5 solid 1px', borderRadius: 4,
      }}
        data-qc={`upload-${name}`}
        onClick={() => this.triggerInputFile()}
        onDrag={this.overrideEventDefaults}
        onDragStart={this.overrideEventDefaults}
        onDragEnd={this.overrideEventDefaults}
        onDragOver={this.overrideEventDefaults}
        onDragEnter={this.dragenterListener}
        onDragLeave={this.dragleaveListener}
        onDrop={(e) => this.dropListener(e, name)}>

        <input disabled={this.props.view} multiple type="file" name="img" style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/jpeg"
          ref={this[`fileInput`]} onChange={(e) => this.handleOnChange(e, name)} />
        {this.state.loading ? this.renderLoading()
          : this.constructArr(name).map((_value: number, key: number) => {

            if (this.state.imagesFiles[key] === undefined) {
              if (this.state.dragging) return this.renderDropHere(key)
              else return this.renderUploadPhoto(key)
            } else return this.renderPhotoByName(key, name)
          })}
      </Card>
    )
  }
  renderInactiveDoc(name) {
    return (
      <div style={{ marginBottom: 30 }}>
        <h4 style={{ textAlign: 'right' }}>{this.props.documentType.name}
          <span style={
            {
              margin: "0  10px",
              fontSize: "16px",
              color: "#d51b1b",
              fontWeight: "bold",

            }
          }>  {local.inactiveDocument} </span>
        </h4>
        <div style={{
          display: 'flex',
          overflowX: "scroll",
          flexDirection: "row",
          flexFlow: "nowrap",
          justifyContent: "space-between",
          backgroundColor: '#fafafa',
          cursor: 'not-allowed',
          border: '#e5e5e5 solid 1px',
          borderRadius: 4,
          opacity: .4,
        }}
          data-qc={`inactiveDoc-${name}`}>
          {this.state.loading ? this.renderLoading()
            : this.constructArr(name).map((_value: number, key: number) => {
              return this.renderPhotoByName(key, name)
            })}
        </div>
      </div>
    );
  }
  render() {
    return (
      this.props.documentType.active ?
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <h4 style={{ textAlign: 'right' }}>{this.props.documentType.name}  <span style={
              {
                margin: "0  10px",
                fontSize: "14px",
                color: this.props.documentType.updatable ? "#7dc356" : "#d51b1b"

              }
            }>{this.props.documentType.updatable ? local.updatable : local.nonUpdatable}</span></h4>
            {!this.props.documentType.updatable &&
              <small style={{ color: "#edb600", fontSize: "12px", fontWeight: 'bold' }}>{`${local.numOfInvalidImages} ( ${this.calculateNumOfValidDocuments()} )`}</small>}
            <small style={{ color: "#6e6e6e", fontSize: "12px", fontWeight: 'bold' }}>{`${local.numOfUploadedImages} ( ${this.state.imagesFiles.length - this.calculateNumOfValidDocuments()} / ${this.props.documentType.pages} )`}</small>
          </div>
          {this.renderContainer(this.props.documentType.name)}
        </div>
        :
        !this.props.documentType.active && this.state.imagesFiles.length > 0 ? this.renderInactiveDoc(this.props.documentType.name)
          : null
    )
  }
}

export default DocumentUploader