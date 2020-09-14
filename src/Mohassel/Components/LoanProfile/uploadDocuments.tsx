import React, { Component } from 'react'
import DocumentUploader from '../documentUploader/documentUploader'
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/getDocumentsTypes'
import { getApplicationDocuments } from '../../Services/APIs/loanApplication/getDocuments';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../Shared/Components/Loader'
import ability from '../../config/ability'
import { connect } from 'react-redux';
import { getDocuments, addAllToSelectionArray, clearSelectionArray } from '../../redux/document/actions'
import { Image } from '../../redux/document/types';
import { downloadAsZip } from '../../Services/utils';
interface Props {
    application: any;
    getDocuments: typeof getDocuments;
    addAllToSelectionArray: typeof addAllToSelectionArray;
    clearSelectionArray: typeof clearSelectionArray;
    loading: boolean;
    documents: any[];
    selectionArray: Image[];
}
interface State {
    loading: boolean;
    docsOfImagesFiles: any[];
    documentTypes: any[];
    selectAll: boolean;
}
class UploadDocuments extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            documentTypes: [],
            selectAll: false,
            docsOfImagesFiles: [[{
                key: '',
                url: '',
            }]],
        }
    }

    async getDocumentTypes() {

        const query = this.props.application.status === "issued" ? "loanApplication,issuedLoan" : "loanApplication";
        const response = await getDocumentsTypes('loanApplication,issuedLoan');
        if (response.status === "success") {
            this.setState({
                documentTypes: response.body.documentTypes,
            })

        } else {
            Swal.fire("error", "error in getting customer documents", "error");
        }

    }
    selectAllOptions() {
        if (this.state.selectAll === true) {
            this.setState({ selectAll: false });
            this.props.clearSelectionArray();
        } else {
            this.setState({ selectAll: true });
            const images: Image[] = [];
            this.props.documents.map((doc) => {
                doc.imagesFiles.map((image) => {
                    images.push({
                        fileName: image.key,
                        url: image.url,
                    })
                })
            });
            this.props.addAllToSelectionArray(images);
        }
    }
    async getApplicationDocuments() {
        const res = await getApplicationDocuments(this.props.application._id as string);
        if (res.status === "success") {
            if (res.body.docs) {
                this.setState({
                    docsOfImagesFiles: res.body.docs,
                })
            }
        } else {
            Swal.fire("error", "error in getting application documents", "error");
        }

    }
    async componentDidMount() {
        this.setState({ loading: true });
        this.getDocumentTypes();
        await this.props.getDocuments({ applicationId: this.props.application._id, docType: this.props.application.status === "issued" ? "issuedLoan" : "loanApplication" })
        this.setState({ loading: false });

    }
    checkPermission() {
        return ability.can('addingDocuments', 'application');
    }
    render() {
        return (
            <>
                <Loader type="fullscreen" open={this.state.loading || this.props.loading} />
                <Row style={{ justifyContent: "space-between" }}>
                    <div style={{ textAlign: 'right', padding: "0.75rem 1.25rem", marginRight: '1rem' }}>
                        <Form.Check
                            type='checkbox'
                            id='check-all'
                            label={local.checkAll}
                            checked={this.state.selectAll}
                            onChange={() => this.selectAllOptions()}
                        />
                    </div>
                    <div style={{ textAlign: 'right', padding: "0.75rem 1.25rem", marginRight: '1rem' }}>
                        <Button style={{ width: '150px' }} variant="primary" disabled={this.props.selectionArray.length <= 0} onClick={async () => {
                            this.setState({ loading: true })
                            const res = await downloadAsZip(this.props.selectionArray, `loan-${this.props.application._id}-${new Date().valueOf()}`);
                            this.setState({ loading: false })
                        }}>{`${local.download}(${this.props.selectionArray.length})`}</Button> </div>
                </Row>
                {this.state.documentTypes.map((documentType, index) => {
                    return (
                        <DocumentUploader
                            key={index}
                            documentType={documentType}
                            edit={this.checkPermission()}
                            keyName="applicationId"
                            keyId={this.props.application._id as string}
                            view={(this.props.application.status === "paid" || this.props.application.status === "rejected" ||
                                this.props.application.status === "canceled" || !this.checkPermission()) as boolean}
                        />
                    )

                })}
            </>
        )
    }
    componentWillUnmount() {
        this.props.clearSelectionArray();
      }
}
const addDocumentToProps = dispatch => {
    return {
        getDocuments: (obj) => dispatch(getDocuments(obj)),
        addAllToSelectionArray: (images) => dispatch(addAllToSelectionArray(images)),
        clearSelectionArray: () => dispatch(clearSelectionArray()),
    };
}
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        documents: state.documents as any[],
        selectionArray: state.selectionArray,
    }
}

export default connect(mapStateToProps, addDocumentToProps)(UploadDocuments);
