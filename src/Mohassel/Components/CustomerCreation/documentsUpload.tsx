import React, { useState, Component } from 'react';
import Swal from 'sweetalert2';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';

interface State {
  nationalId: Array<string>;
  reciepts: Array<string>;
  loanApplication: Array<string>;
  additionalPapers: Array<string>;
  dragging: boolean;
}
interface Props {

}
class DocumentsUpload extends Component<Props, State>{
  private fileInput_nationalId: React.RefObject<HTMLInputElement>;
  private fileInput_reciepts: React.RefObject<HTMLInputElement>;
  private fileInput_loanApplication: React.RefObject<HTMLInputElement>;
  private fileInput_additionalPapers: React.RefObject<HTMLInputElement>;
  private dragEventCounter: number = 0;
  constructor(props) {
    super(props);
    this.fileInput_nationalId = React.createRef();
    this.fileInput_reciepts = React.createRef();
    this.fileInput_loanApplication = React.createRef();
    this.fileInput_additionalPapers = React.createRef();
    this.state = {
      nationalId: [],
      reciepts: [],
      loanApplication: [],
      additionalPapers: [],
      dragging: false,
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
      case 'reciepts': return 3;
      case 'loanApplication': return 3;
      case 'additionalPapers': return 3;
      default: return 0;
    }
  }
  readFiles(files: Array<File> | FileList, name: string) {
    const imagesLimit = this.getImagesLimit(name);
    if (files.length <= imagesLimit && this.state[name].length < imagesLimit) {
      for (let index = 0; index < files.length; index++) {
        let reader = new FileReader();
        const file = files[index];
        reader.onloadend = () => {
          this.setState({
            [name]: [...this.state[name], reader.result]
          } as any)
        }
        reader.readAsDataURL(file)
      }
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
  renderDropHere(key: number) {
    return (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', margin: 10, flex: 1, backgroundColor: 'white', textAlign: 'center', minHeight: 300, justifyContent: 'center' }}>
        <h5>Drop here</h5>
      </div>
    )
  }
  renderUploadPhoto(key: number) {
    return (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', margin: 10, flex: 1, backgroundColor: 'white', textAlign: 'center', minHeight: 300, justifyContent: 'center' }}>
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
      <div key={key} style={{ display: 'flex', flexDirection: 'column', margin: 10, flex: 1, backgroundColor: 'white', textAlign: 'center', minHeight: 300, justifyContent: 'center' }}>
        <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={this.state[name][key]} key={key} alt="" />
      </div>
    )
  }
  renderContainer(name: string) {
  }
  render() {
    return (
      <Form>
        <>
          <h4 style={{ textAlign: 'right' }}>{local.nationalIdPhoto}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#F5F5F5', cursor: 'pointer' }}
            onClick={() => this.triggerInputFile('nationalId')}
            onDrag={this.overrideEventDefaults}
            onDragStart={this.overrideEventDefaults}
            onDragEnd={this.overrideEventDefaults}
            onDragOver={this.overrideEventDefaults}
            onDragEnter={this.dragenterListener}
            onDragLeave={this.dragleaveListener}
            onDrop={(e) => this.dropListener(e, 'nationalId')}>
            <input multiple type="file" name="img" style={{ display: 'none' }}
              ref={this.fileInput_nationalId} onChange={(e) => this.handleOnChange(e, 'nationalId')} />
            {[0, 1].map((_value: number, key: number) => {
              if (this.state.nationalId[key] === undefined) {
                if (this.state.dragging) return this.renderDropHere(key)
                else return this.renderUploadPhoto(key)
              } else return this.renderPhotoByName(key, 'nationalId')
            })}
          </div>
        </>
        <>
          <h4 style={{ textAlign: 'right' }}>{local.reciepts}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#F5F5F5', cursor: 'pointer' }}
            onClick={() => this.triggerInputFile('reciepts')}
            onDrag={this.overrideEventDefaults}
            onDragStart={this.overrideEventDefaults}
            onDragEnd={this.overrideEventDefaults}
            onDragOver={this.overrideEventDefaults}
            onDragEnter={this.dragenterListener}
            onDragLeave={this.dragleaveListener}
            onDrop={(e) => this.dropListener(e, 'reciepts')}>
            <input multiple type="file" name="img" style={{ display: 'none' }}
              ref={this.fileInput_reciepts} onChange={(e) => this.handleOnChange(e, 'reciepts')} />
            {[0, 1, 2].map((_value: number, key: number) => {
              if (this.state.reciepts[key] === undefined) {
                if (this.state.dragging) return this.renderDropHere(key)
                else return this.renderUploadPhoto(key)
              } else return this.renderPhotoByName(key, 'reciepts')
            })}
          </div>
        </>
        <>
          <h4 style={{ textAlign: 'right' }}>{local.loanApplication}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#F5F5F5', cursor: 'pointer' }}
            onClick={() => this.triggerInputFile('loanApplication')}
            onDrag={this.overrideEventDefaults}
            onDragStart={this.overrideEventDefaults}
            onDragEnd={this.overrideEventDefaults}
            onDragOver={this.overrideEventDefaults}
            onDragEnter={this.dragenterListener}
            onDragLeave={this.dragleaveListener}
            onDrop={(e) => this.dropListener(e, 'loanApplication')}>
            <input multiple type="file" name="img" style={{ display: 'none' }}
              ref={this.fileInput_loanApplication} onChange={(e) => this.handleOnChange(e, 'loanApplication')} />
            {[0, 1, 2].map((_value: number, key: number) => {
              if (this.state.loanApplication[key] === undefined) {
                if (this.state.dragging) return this.renderDropHere(key)
                else return this.renderUploadPhoto(key)
              } else return this.renderPhotoByName(key, 'loanApplication')
            })}
          </div>
        </>
        <>
          <h4 style={{ textAlign: 'right' }}>{local.additionalPapers}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#F5F5F5', cursor: 'pointer' }}
            onClick={() => this.triggerInputFile('additionalPapers')}
            onDrag={this.overrideEventDefaults}
            onDragStart={this.overrideEventDefaults}
            onDragEnd={this.overrideEventDefaults}
            onDragOver={this.overrideEventDefaults}
            onDragEnter={this.dragenterListener}
            onDragLeave={this.dragleaveListener}
            onDrop={(e) => this.dropListener(e, 'additionalPapers')}>
            <input multiple type="file" name="img" style={{ display: 'none' }}
              ref={this.fileInput_additionalPapers} onChange={(e) => this.handleOnChange(e, 'additionalPapers')} />
            {[0, 1, 2].map((_value: number, key: number) => {
              if (this.state.additionalPapers[key] === undefined) {
                if (this.state.dragging) return this.renderDropHere(key)
                else return this.renderUploadPhoto(key)
              } else return this.renderPhotoByName(key, 'additionalPapers')
            })}
          </div>
        </>
      </Form>
    )
  }
}
export default DocumentsUpload;