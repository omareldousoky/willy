import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import * as local from '../../../Shared/Assets/ar.json';
import './managerHierarchy.scss';
interface Props {
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;

}
export interface Managers {
    branchId?: string;
    operationsManager: string;
    areaManager: string;
    areaSupervisor: string;
    centerManager: string;
    branchManager: string;
}
export interface UserOfBranch {
    name: string;
    _id: string;
}
export default function BranchBasicsCard(props: Props) {
    return (
        <div className="branch-basics-card">
            <div className="row-nowrap">
                <span className="basic-info">
                <img src={require('../../Assets/basicInfo.svg')} />
                <Form.Label>{local.basicInfo}</Form.Label>
                </span>
            </div>
            <div className="branch-basics-container">
            <Col>
                <Row><Form.Label className="basic-info-label">{local.oneBranch}</Form.Label></Row>
                <Row><Form.Label className="basic-info-data">{props.name}</Form.Label></Row>
            </Col>
            <Col>
                <Row><Form.Label className="basic-info-label">{local.branchCode}</Form.Label></Row>
                <Row><Form.Label className="basic-info-data">{props.branchCode}</Form.Label></Row>
            </Col>
            <Col>
                <Row><Form.Label className="basic-info-label">{local.creationDate}</Form.Label></Row>
                <Row><Form.Label className="basic-info-data" >{props.createdAt}</Form.Label></Row>
            </Col>
            <Col>
                <Row><Form.Label className="basic-info-label">{local.status}</Form.Label></Row>
                <Row><Form.Label className="basic-info-data">{props.status === "active" ? local.activeBranch : local.inActiveBranch}</Form.Label></Row>
            </Col>
            </div>
        </div>
    );
}
