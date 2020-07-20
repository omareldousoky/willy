import React, { Component } from 'react'
import DocumentUploader from '../documentUploader/documentUploader'
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/getDocumentsTypes'
import { getApplicationDocuments } from '../../Services/APIs/loanApplication/getDocuments';
import { uploadDocument } from '../../Services/APIs/loanApplication/uploadDocument'
import { deleteDocument } from '../../Services/APIs/loanApplication/deleteDocument'
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader'
import ability from '../../config/ability'
interface Props {
    application: any;
}
interface State {
    loading: boolean;
    docsOfImagesFiles: any[];
    documentTypes: any[];
}
class UploadDocuments extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            documentTypes: [],
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
    componentDidMount() {
        this.setState({ loading: true });
        this.getDocumentTypes();
        this.getApplicationDocuments();
        this.setState({ loading: false });

    }
    prepareApplicationDocuments(customerDocs: any[], name: string) {

        let ImageFiles: any[] = [];
        customerDocs?.map((doc) => {
            ImageFiles = doc.docs;
        });
        return ImageFiles;
    }
    checkPermission() {
        return ability.can('addingDocuments', 'application');
    }
    render() {
        return (
            <>
                <Loader type="fullscreen" open={this.state.loading} />
                {this.state.documentTypes.map((documentType, index) => {
                    const ImageFiles = this.state.docsOfImagesFiles.filter(item => item.name === documentType.name);
                    return (
                        <DocumentUploader
                            key={index}
                            documentType={documentType}
                            uploadDocumentFun={uploadDocument}
                            deleteDocumentFun={deleteDocument}
                            edit={this.checkPermission()}
                            uploadedImageFile={this.prepareApplicationDocuments(ImageFiles, documentType.name)}
                            keyName="applicationId"
                            keyId={this.props.application._id as string}
                            view={(this.props.application.status === "paid" ||
                                this.props.application.status === "canceled" || !this.checkPermission()) as boolean}
                        />
                    )

                })}
            </>
        )
    }
}

export default UploadDocuments
