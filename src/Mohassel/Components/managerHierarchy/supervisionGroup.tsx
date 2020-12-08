import React from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import * as local from '../../../Shared/Assets/ar.json';
import './managerHierarchy.scss';
interface Props {
    seqNo: number;
}
export const SupervisionGroup = (props: Props) => {
    return (
        <div className='supervision-group-container'>
            <Row style={{width:'80%' , marginRight:"1rem"}}>
                <Col>
                    <Form.Label className="supervision-label" as={Col}>{`${local.groupManager}(${props.seqNo})`}</Form.Label>
                    <Form.Control type="text" />
                </Col>
                <Col>
                    <Form.Label className="supervision-label" as={Col}>{local.emailAddress}*</Form.Label>
                    <Form.Control type="email" />
                </Col>
            </Row>
        </div>
    )
}
