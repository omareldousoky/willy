import React, { Component } from 'react'
import { SupervisionGroup } from './supervisionGroup';
import * as local from '../../../Shared/Assets/ar.json';
import { Button, Form, Row } from 'react-bootstrap';
import { updateOfficersGroups } from '../../Services/APIs/ManagerHierarchy/updateOfficersGroups';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import ability from '../../config/ability';
import { Loader } from '../../../Shared/Components/Loader';
import Swal from 'sweetalert2';
import { createOfficersGroups } from '../../Services/APIs/ManagerHierarchy/createOfficersGroups';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { OfficersGroup } from '../../../Shared/Services/interfaces';
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
interface Props {
    branchId: string;
    mode: string;
}
interface State {
    groups: OfficersGroup[];
    usersOfBranch: any[];
    loanOfficersOfBranch: any[];
    loading: boolean;

}
class SupervisionLevelsCreation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            groups: [],
            usersOfBranch: [],
            loanOfficersOfBranch: [],
            loading: false,
        }
    }
    componentDidMount() {
        this.initialState();
    }
    async initialState() {
        this.setState({
            groups: [],
            usersOfBranch: [],
            loading: false,
        })
        await this.getUsersOfBranch();
        await this.getLoanOfficers();
        if (this.props.mode !== 'create')
            await this.getGroups();
    }
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        if (res.status = "success") {
            if (res.body.data && (this.props.mode === 'edit')) {
                const data = res.body.data.groups?.filter((group) => group.status === "pending");
                this.setState({
                    groups: res.body.data.groups ? data : [],
                })
            }
        }
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
                loanOfficersOfBranch: res.body.data
            })
        }
        this.setState({ loading: false })
    }
    async getUsersOfBranch() {
        this.setState({ loading: true })
        const obj = {
            branchId: this.props.branchId,
            from: 0,
            size: 1000,
        };
        const res = await searchUsers(obj);
        if (res.status === 'success') {
            this.setState({
                usersOfBranch: res.body.data
            })
        }
        this.setState({ loading: false });
    }
    removeGroup = (index) => {
        const newGroups = this.state.groups;
        newGroups.splice(index, 1);
        this.setState({
            groups: newGroups
        })
    }
    submit = async () => {
        if (this.props.mode === 'create') {
            const obj = {
                branchId: this.props.branchId,
                groups: this.state.groups,
            };
            const res = await createOfficersGroups(obj);
            if (res.status === 'success') {
                Swal.fire('Success', '', 'success').then(() => window.location.reload());
            } else {
                Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
            }
        }
        else if (this.props.mode === 'edit') {
            const obj = {
                branchId: this.props.branchId,
                groups: this.state.groups,
            }
            const res = await updateOfficersGroups(obj, this.props.branchId)
            if (res.status === 'success') {
                Swal.fire('Success', '', 'success').then(() => window.location.reload());
            } else {
                Swal.fire('Error c!', getErrorMessage(res.error.error), 'error');
            }
        }
    }
    componentDidUpdate(pervProps) {
        if (this.props.mode !== pervProps.mode) {
            this.initialState();
        }
    }
    render() {
        return (
            <div>
                <Loader open={this.state.loading} type="fullscreen" />
                {((this.props.mode === 'create' && this.state.usersOfBranch.length) || this.state.groups.length) ? <>
                    <Row>
                        {this.props.mode === 'create' &&this.state.usersOfBranch.length && <Row className={'add-supervisor-container'}>
                            <span className={'add-member'} onClick={() => {
                                const newGroup = this.state.groups;
                                newGroup.push({ leader: '', officers: [] });
                                this.setState({ groups: newGroup });
                            }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                        </Row>
                        }
                        {this.state.groups.map((item, index) => {
                            return (
                                <SupervisionGroup
                                    mode={this.props.mode}
                                    key={index}
                                    seqNo={index + 1} deleteGroup={this.removeGroup}
                                    loanOfficersOfBranch={this.state.loanOfficersOfBranch}
                                    usersOfBranch={this.state.usersOfBranch} group={item} />);
                        })
                        }
                    </Row>
                    {(ability.can('createOfficersGroup', 'branch') || ability.can('updateOfficersGroup', 'branch')) &&
                        <Form.Group>
                            <Button
                                disabled={!this.state.groups.length}
                                style={{ width: '300px' }}
                                onClick={async () => {
                                    await this.submit();
                                }}
                                className={'save-button'}
                            >{this.props.mode === 'create' ? local.createSuperVisionGroups : local.editSuperVisionGroups}</Button>
                        </Form.Group>
                    }
                </>
                    : <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <img alt='no-data-found' src={require('../../../Shared/Assets/no-results-found.svg')} />
                        <h4>{this.props.mode==='create'? local.noUsersInBranch :local.noResultsFound}</h4>
                    </div>
                }
            </div>

        )
    }

}
export default SupervisionLevelsCreation;