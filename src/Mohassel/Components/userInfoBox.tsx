import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import * as local from '../../Shared/Assets/ar.json';
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
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.name}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.customerName} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.customerCode}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={(values.customerCode) ? values.customerCode : 'N/A'} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.nationalId}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.nationalId} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.birthDate}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.birthDate} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.gender}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.gender} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.nationalIdIssueDate}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.nationalIdIssueDate} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.businessSector}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.businessSector} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.businessActivity}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.businessActivity} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.businessSpeciality}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={values.businessSpeciality} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.permanentEmployeeCount}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={(values.permanentEmployeeCount) ? values.permanentEmployeeCount : 0} />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label style={{marginRight:0, color:'#6e6e6e'}}>{local.partTimeEmployeeCount}</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={(values.partTimeEmployeeCount) ? values.partTimeEmployeeCount : 0} />
                    </Form.Group>
                </Form.Row>
            </Form>
        )
    }
}
export default InfoBox