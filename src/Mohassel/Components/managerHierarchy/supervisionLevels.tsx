import React, { Component } from 'react'
import BranchBasicsCard from './branchBasicsCard';
import { SupervisionGroup } from './supervisionGroup';
import * as local from '../../../Shared/Assets/ar.json';
import { Button, Form, Row } from 'react-bootstrap';
import { updateOfficersGroups } from '../../Services/APIs/ManagerHierarchy/updateOfficersGroups';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import Can from '../../config/Can';
import ability from '../../config/ability';
import { Loader } from '../../../Shared/Components/Loader';
import { GroupsApproval } from './groupsApproval';
import Swal from 'sweetalert2';
import { officersGroupsApproval } from '../../Services/APIs/ManagerHierarchy/officersGroupsApproval';
interface Props {
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;

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
export default class SupervisionLevels extends Component<Props, State> {
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

        this.getUsers();
        this.getGroups();
    }
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        if (res.status = "success") {
            console.log(res.body.data);
            this.setState({
                groups: res.body.data.groups,
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
    async getUsers() {
        this.setState({ loading: true })
        const obj = {
            branchId: this.props.branchId,
            from: 0,
            size: 1000,
        };
        const res = await searchUsers(obj);
        if (res.status === "success") {
            this.setState({
                usersOfBranch: res.body.data
            })
        }
        this.setState({ loading: false })
    }
    async approveGroups() {
        const table = document.createElement("table");
        table.className = "swal-table";
        table.innerHTML = `<thead><tr>
                <th>${local.branch}</th>
                <th>${local.transactionType}</th>
                <th>${local.createdAt}</th>
                </thead>
                <tbody><tr><td>${this.props.name}</td>
                <td>${local.levelsOfSupervision}</td>
                <td>${this.state.startDate}</td>
                </tr></tbody>`

        Swal.fire({
            width: 700,
            title: local.installmentPaymentConfirmation,
            html: table,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: local.submit,
            cancelButtonText: local.cancel,
            confirmButtonColor: '#7dc356',
            cancelButtonColor: '#d33',
        }).then(async (isConfirm) => {
            if(isConfirm.value){
                this.setState({loading: true});
                const res = await officersGroupsApproval({
                    branchId: this.props.branchId
                })
                if(res.status==="success"){
                    this.setState({loading: false})
                    Swal.fire('success',local.approveGroupsSuccess)
                }else{
                    this.setState({loading: false})
                    Swal.fire('error', local.approveGroupsError)
                }
            }
        }

        )
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
                {this.state.groups && this.state.status !== "approved" && <GroupsApproval
                    branchName={this.props.name}
                    branchCode={this.props.branchCode}
                    startDate={this.state.startDate}
                    approveOfficersGroup={async () => {
                        await this.approveGroups();
                    }

                    }
                />}
                <BranchBasicsCard
                    name={this.props.name}
                    branchCode={this.props.branchCode}
                    createdAt={this.props.createdAt}
                    status={this.props.status}
                />
                <Row>
                    {this.state.groups.map((item, index) => {
                        return (
                            <SupervisionGroup key={index} seqNo={index + 1} deleteGroup={this.removeGroup} usersOfBranch={this.state.usersOfBranch} group={item} />);
                    })
                    }
                    <Row className={'add-supervisor-container'}>
                        <span className={'add-member'} onClick={() => {
                            const newGroup = this.state.groups;
                            newGroup.push({ leader: '', officers: [] });
                            this.setState({ groups: newGroup });
                        }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                    </Row>
                </Row>
                <Can I="updateGroupLeadersHierarchy" a="branch">
                    <Form.Group>
                        <Button
                            onClick={async () => {
                                await this.updateGroups();
                            }}
                            className={'save-button'}
                        >{local.save}</Button>
                    </Form.Group>
                </Can>
            </div>

        )
    }
}
