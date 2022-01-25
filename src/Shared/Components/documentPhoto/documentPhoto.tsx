import React, { Component } from 'react'
import Swal from 'sweetalert2'
import './documentPhoto.scss'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'

import local from '../../Assets/ar.json'

interface Props {
  photoURL?: string
  view?: boolean
  handleImageChange?: any
  name: string
  handleBlur?: any
  edit?: boolean
}
interface State {
  dragging: boolean
  imgSrc: any
  loading: boolean
  key: string
}
class DocumentPhoto extends Component<Props, State> {
  private fileInput: React.RefObject<HTMLInputElement>

  private dragEventCounter = 0

  constructor(props) {
    super(props)
    this.fileInput = React.createRef()
    this.state = {
      dragging: false,
      imgSrc: '',
      loading: false,
      key: '',
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props?.photoURL && props?.photoURL !== '')
      if (
        (props.edit || props.view) &&
        props.photoURL !== state.imgSrc &&
        state.key !== 'updated'
      ) {
        return {
          imgSrc: props.photoURL,
          key: 'updated',
        }
      }
    return null
  }

  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
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

  dragleaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter -= 1
    if (this.dragEventCounter === 0) {
      this.setState({ dragging: false })
    }
  }

  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter = 0
    this.setState({ dragging: false })
    if (
      event.dataTransfer.files &&
      event.dataTransfer.files[0] &&
      !this.props.view
    ) {
      this.readFiles(event.dataTransfer.files)
    }
  }

  handleOnChange = (event) => {
    event.preventDefault()
    const imagesLimit = 1
    if (event.target.files.length <= imagesLimit && !this.props.view) {
      this.readFiles(event.target.files)
    }
  }

  async readFiles(files: Array<File> | FileList) {
    const imagesLimit = 1
    const flag: boolean = this.checkFileType(files)
    if (flag)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.invalidFileType,
        icon: 'error',
      })
    else if (files.length <= imagesLimit) {
      for (let index = 0; index < files.length; index += 1) {
        const reader = new FileReader()
        const file = files[index]
        reader.onloadend = () => {
          this.setState({
            imgSrc: reader.result,
          })
          this.props.handleImageChange(file)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  async deleteDocument(event) {
    this.overrideEventDefaults(event)
    this.setState({ imgSrc: '' })
    this.props.handleImageChange('')
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

  constructArr() {
    const len = 1
    const arr: number[] = []
    for (let i = 0; i < len; i += 1) {
      arr.push(i)
    }
    return arr
  }

  triggerInputFile() {
    this.fileInput.current?.click()
  }

  renderDropHere(key: number) {
    return (
      <div key={key} className="photo-upload-container">
        <h5>Drop here</h5>
      </div>
    )
  }

  renderUploadPhoto(key: number) {
    return (
      <div
        key={key}
        className="photo-upload-container"
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
      </div>
    )
  }

  renderPhotoByName(key: number) {
    return (
      <div key={key} className="photo-upload-container">
        {!this.props.view && (
          <Row data-qc="photo-actions" className="photo-actions">
            <span className="icon" onClick={(e) => this.deleteDocument(e)}>
              <img alt="delete" src={require('../../Assets/deleteIcon.svg')} />
            </span>
          </Row>
        )}
        <Row style={{ height: '' }}>
          <div>
            <Image
              className="uploaded-photo"
              src={this.state.imgSrc as string}
              key={key}
              alt=""
            />
          </div>
        </Row>
      </div>
    )
  }

  renderContainer() {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '350px',
          overflowX: 'scroll',
          flexDirection: 'row',
          flexFlow: 'nowrap',
          justifyContent: 'flex-start',
          backgroundColor: '#fafafa',
          cursor: 'pointer',
          border: '#e5e5e5 solid 1px',
          borderRadius: 4,
        }}
        data-qc={`upload-${this.props.name}`}
        onDrag={this.overrideEventDefaults}
        onDragStart={this.overrideEventDefaults}
        onDragEnd={this.overrideEventDefaults}
        onDragOver={this.overrideEventDefaults}
        onDragEnter={this.dragenterListener}
        onDragLeave={this.dragleaveListener}
        onDrop={(e) => this.dropListener(e)}
        onBlur={this.props.handleBlur}
      >
        <input
          disabled={this.props.view}
          multiple
          type="file"
          name="img"
          style={{ display: 'none' }}
          accept="image/png,image/jpg,image/jpeg"
          ref={this.fileInput}
          onChange={this.handleOnChange}
          onClick={(event) => {
            event.currentTarget.value = ''
          }}
        />
        {this.state.loading
          ? ''
          : this.constructArr().map((_value: number, key: number) => {
              if (this.state.imgSrc === '') {
                if (this.state.dragging) return this.renderDropHere(key)
                return this.renderUploadPhoto(key)
              }
              return this.renderPhotoByName(key)
            })}
      </div>
    )
  }

  render() {
    return <>{this.renderContainer()}</>
  }
}

export default DocumentPhoto
