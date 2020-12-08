import React, { Component } from 'react'
import BranchBasicsCard from './branchBasicsCard';
import { SupervisionGroup } from './supervisionGroup';
import * as local from '../../../Shared/Assets/ar.json';
import { Row } from 'react-bootstrap';

interface Props {
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;

}
interface State {
    indices: number[];

}
export default class SupervisionLevels extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            indices:[0],
        }
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
                    {this.state.indices.map((item , index) =>
                    { 
                        return(
                        <SupervisionGroup key= {index} seqNo ={item+1} />);
                        
                    })
                    }

                    <span onClick={() => {
                       const sequence = this.state.indices;
                       sequence.push(this.state.indices.length);
                       this.setState({indices: sequence});
                    }} ><img src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                </Row>
            </div>

        )
    }
}
