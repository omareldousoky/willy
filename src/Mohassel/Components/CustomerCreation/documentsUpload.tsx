import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { uploadDocument } from '../../Services/APIs/Customer-Creation/uploadDocument';
import { getCustomerDocuments } from '../../Services/APIs/Customer-Creation/getDocuments';
import {getDocumentsTypes} from '../../Services/APIs/encodingFiles/getDocumentsTypes';
import { deleteDocument } from '../../Services/APIs/Customer-Creation/deleteDocument';
import * as local from '../../../Shared/Assets/ar.json';
import DocumentUploader from '../documentUploader/documentUploader';
import { Loader } from '../../../Shared/Components/Loader';

interface State {
  loading: boolean;
  docsOfImagesFiles: any[];
  documentTypes: any[];
}
interface Props {
  customerId: string;
  previousStep: () => void;
  edit: boolean;
}
class DocumentsUpload extends Component<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      documentTypes: [],
      docsOfImagesFiles: [[{
        key: '',
        url:'',
      }]],
      loading: false,
    }
  }
  async componentDidMount() {
    if (this.props.edit) {
      this.setState({ loading: true});
      const res = await getCustomerDocuments(this.props.customerId);
      const response = await getDocumentsTypes('customer');
      if (res.status === "success") {
        if(res.body.docs){
           this.setState({
            docsOfImagesFiles : res.body.docs,
           })
      }
      } else {
        Swal.fire("error", "error in getting customer documents", "error");
      }
      if(response.status === "success") {
        this.setState({
          documentTypes: response.body.documentTypes,
        })
         
      } else {
        Swal.fire("error", "error in getting customer documents", "error");
      }

      this.setState({ loading: false })
    }
  }
  prepareCustomerDocuments(customerDocs: any[], name: string){
    
      let ImageFiles: any[] = [];
      customerDocs?.map((doc)=> {
        ImageFiles = doc.docs;
      });
      return ImageFiles;
  } 


  render() {
    return (

      <>
      <Loader type="fullscreen"  open ={this.state.loading} />
    {this.state.documentTypes.map((documentType,index) => {
      const ImageFiles = this.state.docsOfImagesFiles.filter(item => item.name === documentType.name );
      return (
        <DocumentUploader
        key={index}
        documentType = {documentType}
        uploadDocumentFun = {uploadDocument}
        deleteDocumentFun = {deleteDocument}
        edit= {this.props.edit}
        uploadedImageFile = { this.prepareCustomerDocuments(ImageFiles,documentType.name) }
        keyName = "customerId"
        keyId = {this.props.customerId}
         />
      )
  
      })}
  </>
      
    );
  }
}
export default DocumentsUpload;