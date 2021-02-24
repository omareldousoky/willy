import React, { Component } from 'react'
import { getDocumentsTypes } from '../../Services/APIs/encodingFiles/getDocumentsTypes';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Can from '../../config/Can';
import { Loader } from '../../../Shared/Components/Loader';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withRouter } from 'react-router-dom';
import { DocumentType } from '../../../Shared/Services/interfaces';
import { documentTypeLocalization, getErrorMessage } from '../../../Shared/Services/utils';
import { manageToolsArray } from './manageToolsInitials';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
interface Props {
    history: any;
}

interface State {
    documentTypes: DocumentType[];
    loading: boolean;
    manageToolsTabs: any[];
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
            manageToolsTabs: []
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
            Swal.fire("Error !", getErrorMessage(res.error.error),'error');
        }
    }
    componentDidMount() {
        this.getDocumentsTypes();
        this.setState({manageToolsTabs: manageToolsArray()})
    }

    render() {
        return (
            <div>
                <HeaderWithCards
                    header={local.encodingFiles}
                    array={this.state.manageToolsTabs}
                    active={this.state.manageToolsTabs.map(item => {return item.icon}).indexOf('encodingFiles')}
                />
                <Loader type="fullscreen" open={this.state.loading} />
                <Card className="main-card">
                    <Card.Body>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <h4 style={{ textAlign: "right" }}>{local.encodingFilesHQ}</h4>
                            <small style={{ color: '#6e6e6e', margin: "12px" }}>{`${local.numOfFiles} (${this.state.documentTypes.length})`}</small>
													<Can I='documentTypes' a='config'>
														<Button onClick={() => { this.props.history.push("/tools/encoding-files/create-encoding-files") }} className="big-button" style={{ marginLeft: 20, marginRight: "auto", width: "100px" }}>{local.create}</Button>
													</Can>
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
                                            <Can I='documentTypes' a='config'><Col>
                                                <span
                                                    onClick={() => { this.props.history.push({ pathname: "/tools/encoding-files/edit-encoding-files", state: { documentType: documentType } }) }}
                                                    className='icon'><img alt={"edit"} src={require('../../Assets/editIcon.svg')}></img></span>
                                            </Col></Can>
                                        </Row>

                                    </div>
                                )

                            }

                            )

                        }
                    </Card.Body>
                </Card >
            </div >

        )
    }
}
export default withRouter(EncodingFiles);