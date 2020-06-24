import React, { Component } from 'react'
import { DocumentType } from '../../Services/interfaces'
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Spinner from 'react-bootstrap/Spinner';
interface Props {
 documentType: DocumentType;
 uploadDocumentFun: any;
 deleteDocumentFun: any;
 keyName: string;
 keyId: string;
}

interface Document {
    key: string;
    url: string | ArrayBuffer | null;
}

interface  State {
 loading: boolean;
 dragging: boolean;
 imagesFiles: Array<Document>;
}
 class DocumentUploader extends Component<Props , State> {
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            loading: false,
            dragging: false,
            imagesFiles: [],
        }
    }

    private dragEventCounter = 0;
    triggerInputFile(name: string) {
    
        const limit = this.props.documentType.pages;
        if (this.state.imagesFiles.length < limit) {
            console.log('ff',this[`fileInput`]);
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
        const len = this.props.documentType.pages;
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
    const imagesLimit = this.props.documentType.pages;
    const flag: boolean = this.checkFileType(files)
    if (flag) Swal.fire('', local.invalidFileType, 'error')
    else if (files.length <= imagesLimit && this.state.imagesFiles.length < imagesLimit) {
      this.setState({ loading: true} );
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
              url: reader.result
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
      this.setState({ loading: false});
    }
  }
      dropListener = (event: React.DragEvent<HTMLDivElement>, name: string) => {
        this.overrideEventDefaults(event);
        this.dragEventCounter = 0;
        this.setState({ dragging: false });
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
          this.readFiles(event.dataTransfer.files, name);
        }
      };
      handleOnChange = (event, name: string) => {
        event.preventDefault();
        const imagesLimit = this.props.documentType.pages;
        if (event.target.files.length <= imagesLimit && this.state.imagesFiles.length <= imagesLimit) {
          this.readFiles(event.target.files, name);
        } else {
          Swal.fire('', local.numberOfDocumentsError + this.props.documentType.pages, 'error')
        }
      }
      renderLoading() {
        return (
          <div className="document-upload-container">
            <Spinner animation="border"></Spinner>
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
          <div key={key} className="document-upload-container">
            <img src={require('../../Assets/uploadDrag.svg')}
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
            <div data-qc="delete-document" className="delete-document" onClick={(e) => this.props.deleteDocumentFun(e, name, key)}>
              <span className="fa fa-trash">{local.delete}</span>
            </div>
            <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={ this.state.imagesFiles[key].url as string } key={key} alt="" />
          </div>
        )
      }
    renderContainer(name: string) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', cursor: this.state.imagesFiles.length === this.props.documentType.pages ? 'not-allowed' : 'pointer', border: '#e5e5e5 solid 1px', borderRadius: 4 }}
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
              ref={this[`fileInput`]} onChange={(e) => this.handleOnChange(e, name)} />
            {this.state.loading ? this.renderLoading()
          : this.constructArr(name).map((_value: number, key: number) => {
            if (this.state.imagesFiles[key] === undefined) {
              if (this.state.dragging) return this.renderDropHere(key)
              else return this.renderUploadPhoto(key)
            } else return this.renderPhotoByName(key, name)
          })}
          </div>
            ) 
      }
    render() {
        return (
            <div style={{ marginBottom: 30 }}>
            <h4 style={{ textAlign: 'right' }}>{this.props.documentType.name}</h4>
            {this.renderContainer(this.props.documentType.name)}
          </div>
        )
    }
}

export default DocumentUploader