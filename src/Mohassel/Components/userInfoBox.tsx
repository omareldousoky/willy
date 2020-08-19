import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import * as local from '../../Shared/Assets/ar.json';
import { getRenderDate } from '../Services/getRenderDate';
import Row from 'react-bootstrap/Row';
import { arabicGender, timeToArabicDate } from '../Services/utils';
import Can from '../config/Can';

interface Props {
    values: any;
    noHeader?: boolean;
    getIscore?: Function;
};

interface State {
    loading: boolean;
}
class InfoBox extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    getIscore(data) {
        if (this.props.getIscore) {
            this.props.getIscore(data)
        }
    }
    render() {
        const values = this.props.values;
        return (
            <div style={{ textAlign: 'right', backgroundColor: '#f7fff2', padding: 15, border: '1px solid #e5e5e5', width: '100%' }}>
                {!this.props.noHeader && <h5>{local.mainInfo}</h5>}
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.name}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{values.customerName} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.customerCode}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{(values.key) ? values.key : 'N/A'} </Form.Label>
                        </Row>
                    </Form.Group>
                    {this.props.getIscore && <Col>
                        <Can I='getIscore' a='customer'>
                            <span style={{ cursor: 'pointer', padding: 10 }} onClick={() => this.getIscore(this.props.values)}> <span className="fa fa-file-pdf-o" style={{ margin: "0px 0px 0px 5px" }}></span>iScorePDF</span>
                        </Can>
                    </Col>}
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.nationalId}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{values.nationalId} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.birthDate}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{timeToArabicDate(values.birthDate, false)} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.gender}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{arabicGender(values.gender)} </Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.nationalIdIssueDate}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{timeToArabicDate(values.nationalIdIssueDate, false)} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.businessSector}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{values.businessSector} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.businessActivity}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{values.businessActivity} </Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.businessSpeciality}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{values.businessSpeciality} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.permanentEmployeeCount}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{(values.permanentEmployeeCount) ? values.permanentEmployeeCount : 0} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.partTimeEmployeeCount}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{(values.partTimeEmployeeCount) ? values.partTimeEmployeeCount : 0} </Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
            </div>
        )
    }
}
export default InfoBox