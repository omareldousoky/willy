import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { uploadDocument } from '../../Services/APIs/Customer-Creation/uploadDocument';
import * as local from '../../../Shared/Assets/ar.json';

interface State {
  nationalId: Array<string>;
  receipts: Array<string>;
  loanApplication: Array<string>;
  additionalPapers: Array<string>;
  dragging: boolean;
  loading: Array<string>;
}
interface Props {
  customerId: string;
  previousStep: () => void;
}
class DocumentsUpload extends Component<Props, State>{
  private fileInput_nationalId: React.RefObject<HTMLInputElement>;
  private fileInput_receipts: React.RefObject<HTMLInputElement>;
  private fileInput_loanApplication: React.RefObject<HTMLInputElement>;
  private fileInput_additionalPapers: React.RefObject<HTMLInputElement>;
  private dragEventCounter: number = 0;
  constructor(props) {
    super(props);
    this.fileInput_nationalId = React.createRef();
    this.fileInput_receipts = React.createRef();
    this.fileInput_loanApplication = React.createRef();
    this.fileInput_additionalPapers = React.createRef();
    this.state = {
      nationalId: [],
      receipts: [],
      loanApplication: [],
      additionalPapers: [],
      dragging: false,
      loading: [],
    }
  }
  triggerInputFile(name: string) {
    this[`fileInput_${name}`].current?.click()
  }
  handleOnChange = (event, name: string) => {
    event.preventDefault();
    if (event.target.files.length <= 2 && this.state[name].length <= 2) {
      this.readFiles(event.target.files, name);
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
    if (files.length <= imagesLimit && this.state[name].length < imagesLimit) {
      this.setState({ loading: [...this.state.loading, name] } as State);
      for (let index = 0; index < files.length; index++) {
        const formData = new FormData();
        formData.append("docName", name);
        formData.append("customerId", this.props.customerId);
        formData.append("file", files[index]);
        const res = await uploadDocument(formData);
        if (res.status === 'success') {
          let reader = new FileReader();
          const file = files[index];
          reader.onloadend = () => {
            this.setState({
              [name]: [...this.state[name], reader.result]
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
  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  constructArr(name: string) {
    const len = this.getImagesLimit(name);
    let arr: number[] = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
  }
  renderDropHere(key: number) {
    return (
      <div key={key} className="document-upload-image-container">
        <h5>Drop here</h5>
      </div>
    )
  }
  renderUploadPhoto(key: number) {
    return (
      <div key={key} className="document-upload-image-container">
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
      <div key={key} className="document-upload-image-container">
        <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={this.state[name][key]} key={key} alt="" />
      </div>
    )
  }
  renderLoading() {
    return (
      <div className="document-upload-image-container">
        <Spinner animation="border"></Spinner>
      </div>
    )
  }

  renderContainer(name: string) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer', border: '#e5e5e5 solid 1px', borderRadius: 4 }}
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
          ref={this[`fileInput_${name}`]} onChange={(e) => this.handleOnChange(e, name)} />
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
        <Button disabled style={{ float: 'right',marginBottom: 30 }} onClick={() => this.props.previousStep()} data-qc="previous">{local.previous}</Button>
      </>
    )
  }
}
export default DocumentsUpload;