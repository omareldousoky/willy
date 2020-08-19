import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { uploadDocument } from '../../Services/APIs/Customer-Creation/uploadDocument';
import { getCustomerDocuments } from '../../Services/APIs/Customer-Creation/getDocuments';
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/getDocumentsTypes';
import { deleteDocument } from '../../Services/APIs/Customer-Creation/deleteDocument';
import * as local from '../../../Shared/Assets/ar.json';
import DocumentUploader from '../documentUploader/documentUploader';
import { Loader } from '../../../Shared/Components/Loader';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

interface State {
  loading: boolean;
  docsOfImagesFiles: any[];
  documentTypes: any[];
  selectionArray: any[];
  options: any[];
  checkAll: boolean;
}
interface Props {
  customerId: string;
  previousStep?: () => void;
  edit: boolean;
  view?: boolean;
}
class DocumentsUpload extends Component<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      documentTypes: [],
      docsOfImagesFiles: [[{
        key: '',
        url: '',
      }]],
      selectionArray: [],
      loading: false,
      checkAll: false,
      options: [],
    }
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const response = await getDocumentsTypes('customer');
    if (response.status === "success") {
      this.setState({
        documentTypes: response.body.documentTypes,
      })

    } else {
      Swal.fire("error", "error in getting customer documents", "error");
    }
    if (this.props.edit || this.props.view) {
      const res = await getCustomerDocuments(this.props.customerId);
      if (res.status === "success") {
        if (res.body.docs) {
          const arrOfDocs: any[] = res.body.docs;
          arrOfDocs.map((item) =>{
            return(
              this.setState({
                options: [...this.state.options,...item.docs]
              })
            )
          }

          )

        this.setState({
          docsOfImagesFiles: res.body.docs,
        })
      }
    } else {
      Swal.fire("error", "error in getting customer documents", "error");
    }

  }
    this.setState({ loading: false })
  }
prepareCustomerDocuments(customerDocs: any[]) {

  let ImageFiles: any[] = [];
  customerDocs?.map((doc) => {
    ImageFiles = doc.docs;
  });
  return ImageFiles;
}
selectAllOptions() {
  if (this.state.checkAll) {
    this.setState({
      selectionArray: [],
      checkAll: false
    })
  } else {
    this.setState({
      selectionArray: [...this.state.options],
      checkAll: true
    })
  }
}
render() {
  return (
    <>
      <Loader type="fullscreen" open={this.state.loading} />
      <Row>  <div style={{ textAlign: 'right', padding: "0.75rem 1.25rem", marginRight: '1rem' }} onClick={() => this.selectAllOptions()} >
        <Form.Check
          type='checkbox'
          id='check-all'
          label={local.checkAll}
          checked={this.state.checkAll}
        />
      </div> </Row>
      {this.state.documentTypes.map((documentType, index) => {
        const ImageFiles = this.state.docsOfImagesFiles.filter(item => item.name === documentType.name);

        return (
          <DocumentUploader
            key={index}
            documentType={documentType}
            uploadDocumentFun={uploadDocument}
            deleteDocumentFun={deleteDocument}
            edit={this.props.edit}
            uploadedImageFile={this.prepareCustomerDocuments(ImageFiles)}
            keyName="customerId"
            keyId={this.props.customerId}
            view={this.props.view}
            selectionArray= {this.state.selectionArray}

          />
        )
      })}
    </>
  );
}
}
export default DocumentsUpload;