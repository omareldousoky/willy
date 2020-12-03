import React, { Component } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import * as local from '../../../Shared/Assets/ar.json';
import BranchBasicsCard from './branchBasicsCard';

interface Props {
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;

}
export default class Managers extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
            <div>
                <BranchBasicsCard
                    name={this.props.name}
                    branchCode={this.props.branchCode}
                    createdAt={this.props.createdAt}
                    status={this.props.status}
                />
                <Form className="managers-form">
                    <Form.Group className="row-nowrap" id="operationsManager">
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.operationsManager}</Form.Label>
                            <Form.Control />
                        </Col>
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.emailAddress}</Form.Label>
                            <Form.Control type={'email'} />
                        </Col>
                    </Form.Group>

                    <Form.Group className="row-nowrap" id="districtManager">
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.districtManager}</Form.Label>
                            <Form.Control />
                        </Col>
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.emailAddress}</Form.Label>
                            <Form.Control type={'email'} />
                        </Col>
                    </Form.Group>

                    <Form.Group className="row-nowrap" id="districtSupervisor">
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.districtSupervisor}</Form.Label>
                            <Form.Control />
                        </Col>
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.emailAddress}</Form.Label>
                            <Form.Control type={'email'} />
                        </Col>
                    </Form.Group>

                    <Form.Group className="row-nowrap" id="centerManager">
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.centerManager}</Form.Label>
                            <Form.Control />
                        </Col>
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.emailAddress}</Form.Label>
                            <Form.Control type={'email'} />
                        </Col>
                    </Form.Group>

                    <Form.Group className="row-nowrap" id="branchManager">
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.branchManager}</Form.Label>
                            <Form.Control />
                        </Col>
                        <Col sm={5}>
                            <Form.Label className={"managers-label"} >{local.emailAddress}</Form.Label>
                            <Form.Control type={'email'} />
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}
