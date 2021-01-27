import React, { Component } from 'react'
import { SupervisionGroup } from './supervisionGroup';
import * as local from '../../../Shared/Assets/ar.json';
import { Button, Form, Row } from 'react-bootstrap';
import { updateOfficersGroups } from '../../Services/APIs/ManagerHierarchy/updateOfficersGroups';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';
import ability from '../../config/ability';
import { Loader } from '../../../Shared/Components/Loader';
import Swal from 'sweetalert2';
import { createOfficersGroups } from '../../Services/APIs/ManagerHierarchy/createOfficersGroups';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { LoanOfficer, OfficersGroup } from '../../../Shared/Services/interfaces';
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
interface Props {
    branchId: string;
    mode: string;
}
interface State {
    groups: OfficersGroup[];
    loading: boolean;
    users: Array<LoanOfficer>;
    loanOfficers: Array<LoanOfficer>;
}
interface Group {
    id?: string;
    leader: string;
    officers: string[];
}
class SupervisionLevelsCreation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            groups: [],
            users: [],
            loanOfficers: [],
            loading: false,
        }
    }
    componentDidMount() {
        this.initialState();
    }
    async initialState() {
        this.setState({
            groups: [],
            users: [],
            loanOfficers: [],
            loading: false,
        })
        if (this.props.mode === 'edit'){
            await this.getGroups();
        } else {
            this.setState({
                groups:[],
            })
        }
        await this.getUsers();
        await this.getLoanOfficers();
    }
    async getUsers() {
        this.setState({ loading: true })
        const query = { from: 0, size: 100, status: 'active', branchId: this.props.branchId };
        const res = await searchUsers(query); 
        if (res.status == 'success' && res.body.data) {
            this.setState({ users: res.body.data })
        }
        this.setState({ loading: false })
    }
    async getLoanOfficers() {
        this.setState({ loading: true })
        const query = { from: 0, size: 100, status: 'active' };
        const officerQuery = { ...query, branchId: this.props.branchId }
        const res = await searchLoanOfficer(officerQuery);
        if (res.status == 'success' && res.body.data) {
            this.setState({ loanOfficers: res.body.data })
        }
        this.setState({ loading: false })
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
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
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
    submit = async () => {
        if (this.props.mode === 'create') {
            const obj = {
                branchId: this.props.branchId,
                groups: this.prepareGroups(),
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
                groups: this.prepareGroups(),
            }
            const res = await updateOfficersGroups(obj, this.props.branchId)
            if (res.status === 'success') {
                Swal.fire('Success', '', 'success').then(() => window.location.reload());
            } else {
                Swal.fire('Error c!', getErrorMessage(res.error.error), 'error');
            }
        }
    }
    prepareGroups() {
        const groups: Group[] = [];
        this.state.groups?.map((group) => {
            if (group.id && this.props.mode === 'edit') {
                groups.push({
                    id: group.id,
                    leader: group.leader.id,
                    officers: group.officers ? group.officers.filter(officer => officer.id).map(officer=>officer.id) : [],
                })
            } else if (this.props.mode === 'create') {
                groups.push({
                    leader: group.leader.id,
                    officers: group.officers ? group.officers.filter(officer => officer.id).map(officer=>officer.id) : [],
                })
            }

        })
        return groups;
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
                {((this.props.mode === 'create' && this.state.users.length) || this.state.groups.length) ? <>
                    <Row>
                        {this.state.groups.map((item, index) => {
                            return (
                                <SupervisionGroup
                                    branchId={this.props.branchId}
                                    mode={this.props.mode}
                                    key={index}
                                    seqNo={index + 1} deleteGroup={this.removeGroup}
                                    group={item}
                                    users={this.state.users}
                                    loanOfficers={this.state.loanOfficers}
                                />);
                        })
                        }
                        {this.props.mode === 'create' && this.state.users.length && <Row className={'add-supervisor-container'}>
                            <span className={'add-member'} onClick={() => {
                                const newGroup = this.state.groups;
                                newGroup.push({ leader: { id: '', name: '' }, officers: [] });
                                this.setState({ groups: newGroup });
                            }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                        </Row>
                        }
                    </Row>
                    {(ability.can('createOfficersGroup', 'branch') || ability.can('updateOfficersGroup', 'branch')) &&
                        <Form.Group>
                            <Button
                                disabled={(!this.state.groups.length)}
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
                        <h4>{this.props.mode === 'create' ? local.noUsersInBranch : local.noResultsFound}</h4>
                    </div>
                }
            </div>

        )
    }

}
export default SupervisionLevelsCreation;