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
import { createOfficersGroups } from '../../Services/APIs/ManagerHierarchy/createOfficersGroups';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { OfficersGroup } from '../../../Shared/Services/interfaces';
interface Props {
    branchId: string;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    approve?: boolean;
    unApprove?: boolean;
}
interface State {
    groups: OfficersGroup[];
    usersOfBranch: any[];
    disabled: boolean;
    loading: boolean;
    status: string;
    startDate: number;
    visitedIds: string[];
    selectAll: boolean;

}
class SupervisionLevelsCreation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            groups: [],
            usersOfBranch: [],
            disabled: true,
            loading: false,
            visitedIds: [],
            status: '',
            selectAll: false,
            startDate: 0
        }
    }
    componentDidMount() {
        this.getLoanOfficers();
        if (!this.props.create)
            this.getGroups();
    }
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        if (res.status = "success") {
            if (res.body.data && (this.props.edit || this.props.delete)) {
                console.log("woh");
                const data = res.body.data.groups?.filter((group) => group.status === "pending");
                this.setState({
                    groups: res.body.data.groups ? data : [],
                    startDate: res.body.data.startDate,
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
    submit = async () => {
        if (this.props.create) {
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
        else if (this.props.edit) {
            const obj = {
                branchId: this.props.branchId,
                groups: this.state.groups,
            }
            const res = await updateOfficersGroups(obj, this.props.branchId)
            if (res.status === 'success') {
                Swal.fire('Success', '', 'success').then(() => window.location.reload());
            } else {
                Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
            }
        }
    }
    render() {
        return (
            <div>
                <Loader open={this.state.loading} type="fullscreen" />
                <Row>
                    {this.props.create && <Row className={'add-supervisor-container'}>
                        <span className={'add-member'} onClick={() => {
                            const newGroup = this.state.groups;
                            newGroup.push({ leader: '', officers: [] });
                            this.setState({ groups: newGroup });
                        }} ><img className={'green-add-icon'} src={require('../../Assets/greenAdd.svg')} />{local.addGroupManager}</span>
                    </Row>
                    }
                    {
                        (this.props.delete || this.props.approve || this.props.unApprove) && <Row>
                            <Form.Check
                                type='checkbox'
                                id='check-all'
                                label={local.checkAll}
                                checked={this.state.selectAll}
                                // onChange={() => this.selectAllOptions()}
                            />
                        </Row>
                    }
                    {this.state.groups.map((item, index) => {
                        return (
                            <SupervisionGroup key={index}
                                edit={this.props.edit}
                                create={this.props.create}
                                delete={this.props.delete}
                                approve={this.props.approve}
                                unApprove={this.props.unApprove}
                                seqNo={index + 1} deleteGroup={this.removeGroup} usersOfBranch={this.state.usersOfBranch} group={item} />);
                    })
                    }
                </Row>
                {(ability.can('createOfficersGroup', 'branch') || ability.can('updateOfficersGroup', 'branch')) &&
                    <Form.Group>
                        <Button
                            style={{ width: '300px' }}
                            onClick={async () => {
                                await this.submit();
                            }}
                            className={'save-button'}
                        >{this.props.create ? local.createSuperVisionGroups : local.editSuperVisionGroups}</Button>
                    </Form.Group>
                }
            </div>

        )
    }
}
export default SupervisionLevelsCreation;