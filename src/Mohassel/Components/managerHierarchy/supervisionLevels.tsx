import React, { Component } from 'react'
import BranchBasicsCard from './branchBasicsCard';
import { SupervisionGroup } from './supervisionGroup';
import * as local from '../../../Shared/Assets/ar.json';
import { Button, Form, Row } from 'react-bootstrap';
import { updateOfficersGroups } from '../../Services/APIs/ManagerHierarchy/updateOfficersGroups';

interface Props {
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;

}
interface Group {
    leader: string;
    officers: string[];
}
interface State {
    groups: Group[];

}
export default class SupervisionLevels extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            groups:[],
        }
    }
    removeGroup = (index)=>{
        const newGroups = this.state.groups;
        newGroups.splice(index,1);
        this.setState({
            groups : newGroups
        })
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
                <Row>
                    {this.state.groups.map((item , index) =>{ 
                        return(
                        <SupervisionGroup key= {index} seqNo ={index+1}  deleteGroup = {this.removeGroup}/>);       
                    })
                    }
                    <Row className={'add-supervisor-container'}>
                    <span className={'add-member'} onClick={() => {
                       const newGroup = this.state.groups;
                       newGroup.push({leader:'', officers:[]});
                       this.setState({groups: newGroup});
                    }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                    </Row>
                </Row>
                <Form.Group>
                <Button 
                onClick = {async() =>{
                    const data={ groups : [
                        
                        {
                            leader: '5fd0a00be6bce17603b82de1',
                            officers: ['5f7c7af1ba0e8c0da7c79ddd']
                        }
                    ]}
                    await updateOfficersGroups(data,'5e9ee6f52caac41f46b1ae03');
                } }
                className={'save-button'}
                >{local.save}</Button>
                </Form.Group>
            </div>

        )
    }
}
