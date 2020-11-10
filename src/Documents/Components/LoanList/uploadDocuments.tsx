import React, { Component } from 'react'
import DocumentUploader from '../../../Shared/Components/documentUploader/documentUploader';
import { getDocumentsTypes } from '../../../Mohassel/Services/APIs/encodingFiles/getDocumentsTypes';
import { getApplicationDocuments } from '../../../Mohassel/Services/APIs/loanApplication/getDocuments';
import { getApplication } from '../../../Mohassel/Services/APIs/loanApplication/getApplication';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../Shared/Components/Loader'
import { connect } from 'react-redux';
import { getDocuments, addAllToSelectionArray, clearSelectionArray } from '../../../Shared/redux/document/actions'
import { Image } from '../../../Shared/redux/document/types';
import { downloadAsZip } from "../../../Shared/Services/utils";
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
interface Props {
    history: any;
    getDocuments: typeof getDocuments;
    addAllToSelectionArray: typeof addAllToSelectionArray;
    clearSelectionArray: typeof clearSelectionArray;
    loading: boolean;
    documents: any[];
    selectionArray: Image[];
}
interface State {
    application: any;
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
            application: {},
            docsOfImagesFiles: [[{
                key: '',
                url: '',
            }]],
        }
    }

    async getDocumentTypes() {
        const query = this.state.application.status === "issued" ? "loanApplication,issuedLoan" : "loanApplication";
        const response = await getDocumentsTypes('loanApplication,issuedLoan', true);
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
        const res = await getApplicationDocuments(this.state.application._id as string);
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
    async getAppByID(id) {
        this.setState({ loading: true });
        const application = await getApplication(id);
        if (application.status === "success") {
            this.setState({
                loading: false,
                application: application.body
            }, () => this.props.getDocuments({ applicationId: this.state.application._id, docType: this.state.application.status === "issued" ? "issuedLoan" : "loanApplication" }))
        } else {
            Swal.fire('', 'fetch error', 'error')
            this.setState({ loading: false })
        }
    }
    async componentDidMount() {
        const appId = this.props.history.location.state.id;
        this.getAppByID(appId)
        this.getDocumentTypes();
    }
    render() {
        return (
            <Container>
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
                            const res = await downloadAsZip(this.props.selectionArray, `loan-${this.state.application._id}-${new Date().valueOf()}`);
                            this.setState({ loading: false })
                        }}>{`${local.download}(${this.props.selectionArray.length})`}</Button> </div>
                </Row>
                {this.state.documentTypes.map((documentType, index) => {
                    return (
                        <DocumentUploader
                            key={index}
                            documentType={documentType}
                            edit={true}
                            keyName="applicationId"
                            keyId={this.state.application._id as string}
                            view={(this.state.application.status === "paid" || this.state.application.status === "rejected" ||
                                this.state.application.status === "canceled") as boolean}
                        />
                    )
                })}
            </Container>
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

export default connect(mapStateToProps, addDocumentToProps)(withRouter(UploadDocuments));
