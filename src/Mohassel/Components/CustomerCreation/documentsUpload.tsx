import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { uploadDocument } from '../../Services/APIs/Customer-Creation/uploadDocument';
import { getCustomerDocuments } from '../../Services/APIs/Customer-Creation/getDocuments';
import { deleteDocument } from '../../Services/APIs/Customer-Creation/deleteDocument';
import * as local from '../../../Shared/Assets/ar.json';

interface Document {
  key: string;
  url: string | ArrayBuffer | null;
}
interface State {
  nationalId: Array<Document>;
  receipts: Array<Document>;
  loanApplication: Array<Document>;
  additionalPapers: Array<Document>;
  dragging: boolean;
  loading: Array<string>;
}
interface Props {
  customerId: string;
  previousStep: () => void;
  edit: boolean;
}
class DocumentsUpload extends Component<Props, State>{
  private fileInputnationalId: React.RefObject<HTMLInputElement>;
  private fileInputreceipts: React.RefObject<HTMLInputElement>;
  private fileInputloanApplication: React.RefObject<HTMLInputElement>;
  private fileInputadditionalPapers: React.RefObject<HTMLInputElement>;
  private dragEventCounter = 0;
  constructor(props) {
    super(props);
    this.fileInputnationalId = React.createRef();
    this.fileInputreceipts = React.createRef();
    this.fileInputloanApplication = React.createRef();
    this.fileInputadditionalPapers = React.createRef();
    this.state = {
      nationalId: [],
      receipts: [],
      loanApplication: [],
      additionalPapers: [],
      dragging: false,
      loading: [],
    }
  }
  async componentDidMount() {
    if (this.props.edit) {
      this.setState({ loading: ["nationalId", "receipts", "loanApplication", "additionalPapers"] } as State);
      const res = await getCustomerDocuments(this.props.customerId);
      if (res.status === "success") {
        this.setState({ loading: [] })
        Object.keys(res.body.docs).forEach(element => {
          this.setState({
            [element]: res.body.docs[element]
          } as State)
        })
      } else {
        this.setState({ loading: [] })
        Swal.fire("", "error in getting customer documents", "error");
      }
    }
  }
  triggerInputFile(name: string) {
    const limit = this.getImagesLimit(name);
    if (this.state[name].length < limit) {
      this[`fileInput${name}`].current?.click()
    }
  }
  handleOnChange = (event, name: string) => {
    event.preventDefault();
    const imagesLimit = this.getImagesLimit(name);
    if (event.target.files.length <= imagesLimit && this.state[name].length <= imagesLimit) {
      this.readFiles(event.target.files, name);
    } else {
      Swal.fire('', local.numberOfDocumentsError + this.getImagesLimit(name), 'error')
    }
  }
  getImagesLimit(name: string): number {
    switch (name) {
      case 'nationalId': return 2;
      case 'receipts': return 3;
      case 'loanApplication': return 3;
      case 'additionalPapers': return 3;
      default: return 0;
    }
  }
  async readFiles(files: Array<File> | FileList, name: string) {
    const imagesLimit = this.getImagesLimit(name);
    const flag: boolean = this.checkFileType(files)
    if (flag) Swal.fire('', local.invalidFileType, 'error')
    else if (files.length <= imagesLimit && this.state[name].length < imagesLimit) {
      this.setState({ loading: [...this.state.loading, name] } as State);
      for (let index = 0; index < files.length; index++) {
        const formData = new FormData();
        formData.append("docName", name);
        formData.append("customerId", this.props.customerId);
        formData.append("file", files[index]);
        const res = await uploadDocument(formData);
        if (res.status === 'success') {
          const reader = new FileReader();
          const file = files[index];
          reader.onloadend = () => {
            const document: Document = {
              key: res.body.message,
              url: reader.result
            }
            this.setState({
              [name]: [...this.state[name], document]
            } as any)
          }
          reader.readAsDataURL(file)
        } else {
          this.setState({ loading: this.state.loading.filter(val => val !== name) } as State);
          Swal.fire("", local.documentUploadError, "error")
        }
      }
      this.setState({ loading: this.state.loading.filter(val => val !== name) } as State);
    }
  }
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

  dropListener = (event: React.DragEvent<HTMLDivElement>, name: string) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter = 0;
    this.setState({ dragging: false });
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.readFiles(event.dataTransfer.files, name);
    }
  };
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
  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  async deleteDocument(event, name: string, key: number) {
    this.overrideEventDefaults(event);
    this.setState({ loading: [...this.state.loading, name] } as State);
    const data = {
      customerId: this.props.customerId,
      docName: name,
      key: this.state[name][key].key
    }
    const res = await deleteDocument(data);
    if (res.status === "success") {
      this.setState({
        [name]: this.state[name].filter((_el, index) => index !== key),
        loading: this.state.loading.filter(val => val !== name)
      } as State)
    } else {
      this.setState({ loading: this.state.loading.filter(val => val !== name) } as State);
      Swal.fire("", local.deleteError, "error")
    }
  }

  constructArr(name: string) {
    const len = this.getImagesLimit(name);
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
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
      <div key={key} className="document-upload-container">
        <img src={'/src/Mohassel/Assets/uploadDrag.svg'}
          alt="upload-document"
        />
        <div style={{ marginTop: 30 }}>
          <h5>{local.documentUploadDragDropText}</h5>
          <h5>{local.documentUploadBrowseFileText}</h5>
        </div>
      </div>
    )
  }
  renderPhotoByName(key: number, name: string) {
    return (
      <div key={key} className="document-upload-container">
        <div data-qc="delete-document" className="delete-document" onClick={(e) => this.deleteDocument(e, name, key)}>
          <span className="fa fa-trash">{local.delete}</span>
        </div>
        <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={this.state[name][key].url} key={key} alt="" />
      </div>
    )
  }
  renderLoading() {
    return (
      <div className="document-upload-container">
        <Spinner animation="border"></Spinner>
      </div>
    )
  }

  renderContainer(name: string) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', cursor: this.state[name].length === this.getImagesLimit(name) ? 'not-allowed' : 'pointer', border: '#e5e5e5 solid 1px', borderRadius: 4 }}
        data-qc={`upload-${name}`}
        onClick={() => this.triggerInputFile(name)}
        onDrag={this.overrideEventDefaults}
        onDragStart={this.overrideEventDefaults}
        onDragEnd={this.overrideEventDefaults}
        onDragOver={this.overrideEventDefaults}
        onDragEnter={this.dragenterListener}
        onDragLeave={this.dragleaveListener}
        onDrop={(e) => this.dropListener(e, name)}>
        <input multiple type="file" name="img" style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/jpeg"
          ref={this[`fileInput${name}`]} onChange={(e) => this.handleOnChange(e, name)} />
        {(this.state.loading.includes(name)) ? this.renderLoading()
          : this.constructArr(name).map((_value: number, key: number) => {
            if (this.state[name][key] === undefined) {
              if (this.state.dragging) return this.renderDropHere(key)
              else return this.renderUploadPhoto(key)
            } else return this.renderPhotoByName(key, name)
          })}
      </div>
    )
  }
  render() {
    return (
      <>
        <div style={{ marginBottom: 30 }}>
          <h4 style={{ textAlign: 'right' }}>{local.nationalIdPhoto}</h4>
          {this.renderContainer('nationalId')}
        </div>
        <div style={{ marginBottom: 30 }}>
          <h4 style={{ textAlign: 'right' }}>{local.receipts}</h4>
          {this.renderContainer('receipts')}
        </div>
        <div style={{ marginBottom: 30 }}>

          <h4 style={{ textAlign: 'right' }}>{local.loanApplication}</h4>
          {this.renderContainer('loanApplication')}
        </div>
        <div style={{ marginBottom: 30 }}>

          <h4 style={{ textAlign: 'right' }}>{local.additionalPapers}</h4>
          {this.renderContainer('additionalPapers')}
        </div>
        <Button disabled style={{ float: 'right', marginBottom: 30 }} onClick={() => this.props.previousStep()} data-qc="previous">{local.previous}</Button>
      </>
    )
  }
}
export default DocumentsUpload;