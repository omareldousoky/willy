import React, { Component } from 'react'
import BranchBasicsCard from './branchBasicsCard';
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
    location: {
        state: {
            branchId: string;
            name: string;
            branchCode: number;
            createdAt: string;
            status: string;
        };
    };
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
 class SupervisionLevels extends Component<Props, State> {
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
        const res = await getOfficersGroups(this.props.location.state.branchId)
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
        const res = await updateOfficersGroups({ groups: this.state.groups }, this.props.location.state.branchId);
        this.setState({ loading: false })
    }
    async getLoanOfficers() {
        this.setState({ loading: true })
        const obj = {
            branchId: this.props.location.state.branchId,
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
    async approveGroups() {
        const table = document.createElement("table");
        table.className = "swal-table";
        table.innerHTML = `<thead><tr>
                <th>${local.branch}</th>
                <th>${local.transactionType}</th>
                <th>${local.createdAt}</th>
                </thead>
                <tbody><tr><td>${this.props.location.state.name}</td>
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
                    branchId: this.props.location.state.branchId
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
                <BranchBasicsCard
                    name={this.props.location.state.name}
                    branchCode={this.props.location.state.branchCode}
                    createdAt={this.props.location.state.createdAt}
                    status={this.props.location.state.status}
                />
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
export default withRouter(SupervisionLevels);