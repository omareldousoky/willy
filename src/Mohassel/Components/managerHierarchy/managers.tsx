import React, { Component } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import * as local from '../../../Shared/Assets/ar.json';
import BranchBasicsCard from './branchBasicsCard';
import Search from '../../../Shared/Components/Search/search';
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
                    <Row>
                        <Form.Group as = {Col} id="operationsManager">          
                                <Form.Label className={"managers-label"} >{local.operationsManager}</Form.Label>
                                <Form.Control />   
                        </Form.Group>
                        <Form.Group as = {Col} id="districtManager">
                                <Form.Label className={"managers-label"} >{local.districtManager}</Form.Label>
                                <Form.Control />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as = {Col} id="districtSupervisor"> 
                                <Form.Label className={"managers-label"} >{local.districtSupervisor}</Form.Label>
                                <Form.Control />      
                        </Form.Group>

                        <Form.Group as = {Col} id="centerManager">
                                <Form.Label className={"managers-label"} >{local.centerManager}</Form.Label>
                                <Form.Control />   
                        </Form.Group>
                    </Row>
                    <Form.Group as = {Col}  sm = {6} id="branchManager">            
                            <Form.Label className={"managers-label"} >{local.branchManager}</Form.Label>
                            <Form.Control />   
                    </Form.Group>
                </Form>
                <Form.Group>
        <Button className={'save-button'} onClick = {()=>{console.log()}}>{local.save}</Button>
                </Form.Group>
            </div>
        )
    }
}
