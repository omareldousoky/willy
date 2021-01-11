import React, { Component } from 'react'
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import './clearance.scss';
import Row from 'react-bootstrap/Row';
interface Props {
 photoObject: {
  receiptPhotoURL: string;
  receiptPhoto: any;
 };
  review?: boolean;
  handlePhotoChange?: any;
  

}
interface State {
  dragging: boolean;
  imgSrc: string | ArrayBuffer | null;
  loading: boolean;
}
class ReceiptPhoto extends Component<Props, State> {
  private fileInput: React.RefObject<HTMLInputElement>;
  private dragEventCounter = 0;
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      dragging: false,
      imgSrc: '',
      loading: false,
    }
  }
  triggerInputFile() {
    const limit = 1;
    this[`fileInput`].current?.click()
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

  constructArr() {
    const len = 1;
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
  async readFiles(files: Array<File> | FileList,) {
    const imagesLimit = 1;
    const flag: boolean = this.checkFileType(files)
    if (flag) Swal.fire('', local.invalidFileType, 'error')
    else if (files.length <= imagesLimit) {
      for (let index = 0; index < files.length; index++) {
        const formData = new FormData();
          const reader = new FileReader();
          const file = files[index];
          console.log(file);
          reader.onloadend = () => {
            this.setState({
              imgSrc: reader.result,
            })
            this.props.handlePhotoChange(reader.result);
          }
          reader.readAsDataURL(file)
          
      }
    }
  }
  async deleteDocument(event) {

    this.overrideEventDefaults(event);
    this.setState({imgSrc: ''})
    this.props.handlePhotoChange('');
  }
  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event);
    this.dragEventCounter = 0;
    this.setState({ dragging: false });
    if (event.dataTransfer.files && event.dataTransfer.files[0] && !this.props.review) {
      this.readFiles(event.dataTransfer.files);
    }
  };
  handleOnChange = (event) => {
    event.preventDefault();
    const imagesLimit = 1;
    if (event.target.files.length <= imagesLimit && !this.props.review) {
      this.readFiles(event.target.files);
    } 
  }

  renderLoading() {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          margin: "20px",
          flex: 1,
          backgroundColor: "#ffffff",
          textAlign: "center",
          width: "100%",
          height: "200px",
          justifyContent: "center",
          alignItems: "center",
        }}>
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
      <Card.Body key={key} className="document-upload-container"
        onClick={() => this.triggerInputFile()}
      >
        <img src={this.props.review?  require('../../../Shared/Assets/imagePlaceholder.svg') : require('../../../Shared/Assets/uploadDrag.svg')}
          alt="upload-document"
        />
        <div style={{ marginTop: "10px", fontSize: "12px" }}>
        <div>{this.props.review ? local.documentNotUploadedYet : local.documentUploadDragDropText}</div>
          {!this.props.review && <div>{local.documentUploadBrowseFileText}</div>}
        </div>
      </Card.Body>
    )
  }

  renderPhotoByName(key: number) {
    return (
      <Card.Body key={key} className="document-upload-container" >
       {!this.props.review && <Row data-qc="document-actions" className="document-actions" >
        <span className="fa icon" onClick={(e) => this.deleteDocument(e)}><img  alt="delete" src={ require('../../../Shared/Assets/deleteIcon.svg')} /></span>
        </Row> }
        <Row style={{ height: "" }}>
          <div>
            <img className={"uploaded-image"} src={this.state.imgSrc as string} key={key} alt="" />
          </div>
        </Row>
      </Card.Body>
    )
  }

  renderContainer() {
    const Limit = 1;
    return (
      <Card style={{
        display: 'flex',
        width: '100%',
        overflowX: "scroll",
        flexDirection: "row",
        flexFlow: "nowrap",
        justifyContent: "flex-start",
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        border: '#e5e5e5 solid 1px', 
        borderRadius: 4
      }}
        data-qc={`upload-${name}`}
        onDrag={this.overrideEventDefaults}
        onDragStart={this.overrideEventDefaults}
        onDragEnd={this.overrideEventDefaults}
        onDragOver={this.overrideEventDefaults}
        onDragEnter={this.dragenterListener}
        onDragLeave={this.dragleaveListener}
        onDrop={(e) => this.dropListener(e)}
      >

        <input disabled={this.props.review} multiple type="file" name="img" style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/jpeg"
          ref={this[`fileInput`]} onChange={this.handleOnChange}
          onClick={(event) => {
            event.currentTarget.value = ""
          }} />
        {this.state.loading ? this.renderLoading()
          :
          this.constructArr().map((_value: number, key: number) => {
            if (this.state.imgSrc=== '') {
              if (this.state.dragging) return this.renderDropHere(key)
              else return this.renderUploadPhoto(key)
            } else return this.renderPhotoByName(key)

          })}
      </Card>
    )
  }
  render() {
    return (
        <div style={{width:'100%'}}>
          {this.renderContainer()}
        </div>
    )
  }
}


export default withRouter(ReceiptPhoto)