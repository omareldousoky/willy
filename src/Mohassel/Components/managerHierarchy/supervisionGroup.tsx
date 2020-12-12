import React, { Component } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import * as local from '../../../Shared/Assets/ar.json';
import './managerHierarchy.scss';
interface Props {
    seqNo: number;
    deleteGroup: any;
}
interface State {
    officers: string[];
}
export class SupervisionGroup extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            officers: ['dddd','ddddddd','ffff'],
        }
    }
    render() {
        return (
            <div className='supervision-group-container'>
                <div className={'group-supervisor-row'}>
                    <Col sm={6}>
                        <Form.Label className="supervision-label" as={Col}>{`${local.groupManager} ( ${this.props.seqNo} )`}</Form.Label>
                        <Form.Control type="text" />
                    </Col>
                    <div onClick={this.props.deleteGroup}>
                        <img src={require('../../../Shared/Assets/deleteIcon.svg')} />
                    </div>
                </div>
                <Row className={'officers-container'}>
                {
                    this.state.officers.map((officer, index) => {
                        return (
                            <Col key={index} sm={5}>
                                <Form.Label className={'supervision-label'}><img onClick={()=>{
                                    const newOfficers = this.state.officers;
                                    newOfficers.splice(index,1);
                                    this.setState({officers: newOfficers});
                                }} alt="removeIcon"  src ={require('../../Assets/removeIcon.svg')}/> {local.loanOfficerOrCoordinator}</Form.Label>
                                <Form.Control  value = {officer} />
                            </Col>
                        )
                    })
                }
                </Row>
                <Row className="add-member-container">
                    <span className={'add-member'} onClick={()=>{
                        const newOfficers = this.state.officers;
                        newOfficers.push('');
                        this.setState({
                            officers: newOfficers
                        })
                    }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addLoanOfficer}</span>
                </Row>
            </div>
        )
    }
}
