import React, { Component } from 'react'
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/getDocumentsTypes';
import * as local from '../../../Shared/Assets/ar.json';
import DocumentUploader from '../../../Shared/Components/documentUploader/documentUploader';
import { Loader } from '../../../Shared/Components/Loader';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { getDocuments, addAllToSelectionArray, clearSelectionArray } from '../../../Shared/redux/document/actions'
import { Image } from '../../../Shared/redux/document/types';
import { downloadAsZip } from '../../../Shared/Services/utils';

interface Props {
    customerId: string;
    previousStep?: () => void;
    getDocuments: typeof getDocuments;
    addAllToSelectionArray: typeof addAllToSelectionArray;
    clearSelectionArray: typeof clearSelectionArray;
    edit: boolean;
    view?: boolean;
    loading: boolean;
    documents: any[];
    selectionArray: Image[];
}
interface State {
    docsOfImagesFiles: any[];
    documentTypes: any[];
    options: any[];
    selectAll: boolean;
    loading: boolean;
}
class DeathCertificate extends Component<Props, State>  {
    constructor(props: Props) {
        super(props);
        this.state = {
            documentTypes: [],
            docsOfImagesFiles: [[{
                key: '',
                url: '',
            }]],
            options: [],
            selectAll: false,
            loading: false,
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
    async componentDidMount() {

        if (this.props.edit || this.props.view) {
            await this.props.getDocuments({ customerId: this.props.customerId, docType: 'deathCertificate'});
        }
    }
    render() {

        return (
            <>
                <Loader type="fullscreen" open={this.props.loading || this.state.loading} />
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
                            const res = await downloadAsZip(this.props.selectionArray, `deathCertificate-customer-${this.props.customerId}-${new Date().valueOf()}`);
                            this.setState({ loading: false })
                        }}>{`${local.download}(${this.props.selectionArray.length})`}</Button> </div>
                </Row>
                <DocumentUploader

                    documentType={{
                        pages: 1,
                        type: 'deathCertificate',
                        paperType: 'A4',
                        name: 'deathCertificate',
                        updatable: false,
                        customerType: 'individual',
                        active: true,
                    }}
                    edit={this.props.edit}
                    keyName="customerId"
                    keyId={this.props.customerId}
                    view={this.props.view}
                />
            </>
        );
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

export default connect(mapStateToProps, addDocumentToProps)(DeathCertificate);