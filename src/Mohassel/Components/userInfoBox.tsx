import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import * as local from '../../Shared/Assets/ar.json';
import { getRenderDate } from '../Services/getRenderDate';
import Row from 'react-bootstrap/Row';

interface Props {
    values: any;
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
    render() {
        const values = this.props.values;
        return (
            <Form style={{ textAlign: 'right', backgroundColor: '#f7fff2', padding: 15, border: '1px solid #e5e5e5' }}>
                <h5>{local.mainInfo}</h5>
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
                            <Form.Label>{(values.customerCode) ? values.customerCode : 'N/A'} </Form.Label>
                        </Row>
                    </Form.Group>
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
                            <Form.Label>{getRenderDate(values.birthDate)} </Form.Label>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.gender}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{values.gender} </Form.Label>
                        </Row>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Row>
                            <Form.Label style={{ color: '#6e6e6e' }}>{local.nationalIdIssueDate}</Form.Label>
                        </Row>
                        <Row>
                            <Form.Label>{getRenderDate(values.nationalIdIssueDate)} </Form.Label>
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
            </Form>
        )
    }
}
export default InfoBox