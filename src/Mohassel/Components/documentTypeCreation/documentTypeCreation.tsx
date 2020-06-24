import React, { Component } from 'react'
import DocumentTypeCreationForm from './documentTypeCreationForm'
import { withRouter } from 'react-router-dom';
interface Props {
    history: any;
    edit: boolean;
}
 class DocumentTypeCreation extends Component<Props> {
   

    render() {
        return (
            <div>
                <DocumentTypeCreationForm />
            </div>
        )
    }
}

export default  withRouter(DocumentTypeCreation);
