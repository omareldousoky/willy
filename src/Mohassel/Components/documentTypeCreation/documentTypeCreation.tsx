import React, { Component } from 'react'
import { Formik } from 'formik'
import Container from 'react-bootstrap/Container';
import DocumentTypeCreationForm from './documentTypeCreationForm'
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
interface Props {
    history: any;
    edit: boolean;
}
class DocumentTypeCreation extends Component<Props> {


    render() {
        return (
            <div>
                <Container>
                    <Card>
                        <Card.Body>
                            <DocumentTypeCreationForm />
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }
}

export default withRouter(DocumentTypeCreation);
