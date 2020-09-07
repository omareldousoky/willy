import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { uploadDocument } from '../../Services/APIs/Customer-Creation/uploadDocument';
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/getDocumentsTypes';
import { deleteDocument } from '../../Services/APIs/Customer-Creation/deleteDocument';
import * as local from '../../../Shared/Assets/ar.json';
import DocumentUploader from '../documentUploader/documentUploader';
import { Loader } from '../../../Shared/Components/Loader';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { DocumentType } from '../../Services/interfaces'
import { connect } from 'react-redux';
import { getDocuments } from '../../redux/document/actions'
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
  getDocuments: typeof getDocuments;
  edit: boolean;
  view?: boolean;
  loading: boolean;
  documents: any[];
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
    this.setState({loading: false})
    if (this.props.edit || this.props.view) {
      console.log('l')
      await this.props.getDocuments({ customerId: this.props.customerId, docType: 'customer' });
    }
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
        <Loader type="fullscreen" open={this.props.loading || this.state.loading} />
        <Row>  <div style={{ textAlign: 'right', padding: "0.75rem 1.25rem", marginRight: '1rem' }} onClick={() => this.selectAllOptions()} >
          <Form.Check
            type='checkbox'
            id='check-all'
            label={local.checkAll}
            checked={this.state.checkAll}
          />
        </div> </Row>
        { this.state.documentTypes.map((documentType: DocumentType, index) => {
          
          return (
            <DocumentUploader
              key={index}
              documentType={documentType}
              edit={this.props.edit}
              keyName="customerId"
              keyId={this.props.customerId}
              view={this.props.view}

            />
          )
        })}
      </>
    );
  }
}

const addDocumentToProps = dispatch => {
  return {
    getDocuments: (obj) => dispatch(getDocuments(obj)),
  };
}
const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    documents: state.documents as any[],

  }
}

export default connect(mapStateToProps, addDocumentToProps)(DocumentsUpload);