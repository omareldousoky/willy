import React, { Component } from 'react'
import { getDocumentsTypes } from '../../../Mohassel/Services/APIs/encodingFiles/getDocumentsTypes';
import { hideDocument } from '../../Services/APIs/hideDocument';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Loader } from '../../../Shared/Components/Loader';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withRouter } from 'react-router-dom';
import { DocumentType } from '../../../Shared/Services/interfaces';
import { documentTypeLocalization } from '../../../Shared/Services/utils';
interface Props {
    history: any;
}

interface State {
    documentTypes: DocumentType[];
    loading: boolean;
}
class EncodingFiles extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            documentTypes: [{
                id: "",
                pages: 0,
                type: "",
                paperType: "",
                name: "",
            }],
            loading: false,
        }

    }


    async getDocumentsTypes() {
        this.setState({ loading: true })
        const res = await getDocumentsTypes();
        if (res.status === "success") {
            this.setState({
                documentTypes: res.body.documentTypes,
                loading: false,
            })
        } else {
            this.setState({ loading: false })
            Swal.fire("error", local.getDocumentsTypesError);
        }
    }
    componentDidMount() {
        this.getDocumentsTypes();
    }
    async hideShowDocument(hidden: boolean, id: string | undefined) {
        if (id) {
            this.setState({ loading: true });
            const res = await hideDocument({ isHidden: hidden }, id);
            if (res.status === "success") {
                this.setState({ loading: false })
                this.getDocumentsTypes();
            } else {
                this.setState({ loading: false })
            }
        }
    }
    render() {
        return (
            <div>
                <Container>
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card>
                        <Card.Body>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <h4 style={{ textAlign: "right" }}>{local.encodingFilesHQ}</h4>
                                <small style={{ color: '#6e6e6e', margin: "12px" }}>{`${local.numOfFiles} (${this.state.documentTypes.length})`}</small>
                            </div>
                            {

                                this.state.documentTypes.map((documentType, index) => {
                                    return (
                                        <div key={index} style={{
                                            border: "solid 1px #e5e5e5", textAlign: "right", margin: "20px", padding: "20px"
                                        }}>
                                            <Row className="row-nowrap">
                                                <Col style={{ minWidth: "20%" }}>
                                                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#2f2f2f" }}>
                                                        {documentType.name}</div> </Col>
                                                <Col>
                                                    <div style={{ fontSize: "12px", color: "#6e6e6e" }}>{local.numOfPages}</div>
                                                    <div style={{ fontSize: "12px", color: "#2f2f2f", fontWeight: "bold" }}>{documentType.pages} </div>
                                                </Col>
                                                <Col>
                                                    <div style={{ fontSize: "12px", color: "#6e6e6e" }}>{local.allowUpdate}</div>
                                                    <div style={{ fontSize: "12px", color: "#2f2f2f", fontWeight: "bold" }}>{documentType.updatable ? local.yes : local.no} </div>
                                                </Col>
                                                <Col>
                                                    <div style={{ fontSize: "12px", color: "#6e6e6e" }}>{local.status}</div>
                                                    <div style={{ fontSize: "12px", color: "#2f2f2f", fontWeight: "bold" }}>{documentType.active ? local.activated : local.deactivated} </div>
                                                </Col>
                                                <Col style={{ minWidth: "20%" }}>
                                                    <div style={{ fontSize: "12px", color: "#6e6e6e" }}>{local.documentFor}</div>
                                                    <div style={{ fontSize: "12px", color: "#2f2f2f", fontWeight: "bold" }}>{documentTypeLocalization(documentType.type)} </div>
                                                </Col>
                                                <Col style={{ minWidth: "20%" }}>
                                                    <div style={{ fontSize: "12px", color: "#6e6e6e" }}>{local.documentFor}</div>
                                                    <Form.Check
                                                        type="switch"
                                                        data-qc="is-hidden"
                                                        checked={false}
                                                        label=""
                                                        id="is-hidden"
                                                        onChange={(e) => this.hideShowDocument(e.currentTarget.checked, documentType.id)}
                                                    /></Col>
                                            </Row>

                                        </div>
                                    )

                                }

                                )

                            }
                        </Card.Body>
                    </Card >
                </Container >
            </div >

        )
    }
}
export default withRouter(EncodingFiles);