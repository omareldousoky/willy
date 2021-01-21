import React, { Component } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import * as local from '../../../Shared/Assets/ar.json';
import './managerHierarchy.scss';
import { Group } from './supervisionLevelsCreation';
import UsersSearch from './usersSearch';
interface Props {
    seqNo: number;
    deleteGroup: any;
    group: Group;
    usersOfBranch: any[];
}
interface State {
    officers: string[];
}
export class SupervisionGroup extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state={
            officers: this.props.group.officers,
        }
    }
    render() {
        return (
            <div className='supervision-group-container'>
                <div className={'group-supervisor-row'}>
                    <Col sm={6}>
                        <Form.Label className="supervision-label" as={Col}>{`${local.groupManager} ( ${this.props.seqNo} )`}</Form.Label>
                        {<Row><UsersSearch usersOfBranch={this.props.usersOfBranch} objectKey={'leader'} item={this.props.group} /></Row> }
                    </Col> 
                    <div onClick={this.props.deleteGroup}>
                        <img src={require('../../../Shared/Assets/deleteIcon.svg')} />
                    </div>
                </div>
                <Row className={'officers-container'}>
                {
                    this.state.officers.map((officer, index) => {
                        return (
                            <Col key={index} sm={6}>
                                <Form.Label className={'supervision-label'}><img onClick={()=>{
                                    const newOfficers = this.state.officers;
                                    newOfficers.splice(index,1);
                                    this.setState({officers: newOfficers});
                                    this.props.group.officers = newOfficers;
                                }} alt="removeIcon"  src ={require('../../Assets/removeIcon.svg')}/> {local.loanOfficerOrCoordinator}</Form.Label>
                               <Row className="row-nowrap"><UsersSearch usersOfBranch = {this.props.usersOfBranch} objectKey={index} item={this.props.group.officers}/></Row>
                            </Col>
                        )
                    })
                }
                </Row>
                <Row className="add-member-container">
                    <span className={'add-member'} onClick={()=>{
                        const newOfficers = this.props.group.officers;
                        newOfficers.push('');
                       this.setState({
                           officers : newOfficers,
                       })
                       this.props.group.officers = newOfficers;
                    }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addLoanOfficer}</span>
                </Row>
            </div>
        )
    }
}
