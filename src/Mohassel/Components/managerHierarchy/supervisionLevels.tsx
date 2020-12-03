import React, { Component } from 'react'
import BranchBasicsCard from './branchBasicsCard';

interface Props {
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;

}
export default class SupervisionLevels extends Component<Props, {}> {
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
            </div>
        )
    }
}
