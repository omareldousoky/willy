import React, { Component } from 'react'
import { SupervisionGroup } from './supervisionGroup';
import * as local from '../../../Shared/Assets/ar.json';
import { Button, Form, Row } from 'react-bootstrap';
import { updateOfficersGroups } from '../../Services/APIs/ManagerHierarchy/updateOfficersGroups';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import Can from '../../config/Can';
import { withRouter } from 'react-router-dom';
import ability from '../../config/ability';
import { Loader } from '../../../Shared/Components/Loader';
import Swal from 'sweetalert2';
import { officersGroupsApproval } from '../../Services/APIs/ManagerHierarchy/officersGroupsApproval';
interface Props {
    history: any;
    branchId: string;
}
export interface Group {
    leader: string;
    officers: string[];
}
interface State {
    groups: Group[];
    usersOfBranch: any[];
    disabled: boolean;
    loading: boolean;
    status: string;
    startDate: number;

}
 class SupervisionLevelsCreation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            groups: [],
            usersOfBranch: [],
            disabled: true,
            loading: false,
            status: '',
            startDate: 0
        }
    }
    componentDidMount() {
        if (ability.can("updateGroupLeadersHierarchy", "branch")) {
            this.setState({ disabled: false })
        }

        this.getLoanOfficers();
        this.getGroups();
    }
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        if (res.status = "success") {
            this.setState({
                groups: res.body.data.groups ? res.body.data.groups : [] ,
                status: res.body.data.status,
                startDate: res.body.data.startDate,
            })
        }
        this.setState({ loading: false })
    }

    async updateGroups() {
        this.setState({ loading: true })
        const res = await updateOfficersGroups({ groups: this.state.groups }, this.props.branchId);
        this.setState({ loading: false })
    }
    async getLoanOfficers() {
        this.setState({ loading: true })
        const obj = {
            branchId: this.props.branchId,
            from: 0,
            size: 1000,
        };
        const res = await searchLoanOfficer(obj);
        if (res.status === "success") {
            this.setState({
                usersOfBranch: res.body.data
            })
        }
        this.setState({ loading: false })
    }
    removeGroup = (index) => {
        const newGroups = this.state.groups;
        newGroups.splice(index, 1);
        this.setState({
            groups: newGroups
        })
    }
    render() {
        return (
            <div>
                <Loader open={this.state.loading} type="fullscreen" />
                <Row>
                <Row className={'add-supervisor-container'}>
                        <span className={'add-member'} onClick={() => {
                            const newGroup = this.state.groups;
                            newGroup.push({ leader: '', officers: [] });
                            this.setState({ groups: newGroup });
                        }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                    </Row>
                    {this.state.groups.map((item, index) => {
                        return (
                            <SupervisionGroup key={index} seqNo={index + 1} deleteGroup={this.removeGroup} usersOfBranch={this.state.usersOfBranch} group={item} />);
                    })
                    }
                </Row>
                {/* <Can I="updateGroupLeadersHierarchy" a="branch"> */}
                    <Form.Group>
                        <Button
                            onClick={async () => {
                                await this.updateGroups();
                            }}
                            className={'save-button'}
                        >{local.save}</Button>
                    </Form.Group>
                {/* </Can> */}
            </div>

        )
    }
}
export default withRouter(SupervisionLevelsCreation);