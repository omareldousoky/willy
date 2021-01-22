import React, { Component } from 'react';
import './managerHierarchy.scss';
import local from '../../../Shared/Assets/ar.json';
import { Row, Form, Table, Button } from 'react-bootstrap';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { OfficersGroup } from '../../../Shared/Services/interfaces';
import ability from '../../config/ability';
import { deleteOfficersGroups } from '../../Services/APIs/ManagerHierarchy/deleteOfficersGroups';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { approveOfficersGroups } from '../../Services/APIs/ManagerHierarchy/approveOfficersGroups';
import { unApproveOfficersGroups } from '../../Services/APIs/ManagerHierarchy/unApproveOfficersGroups';
interface Props {
    branchId: string;
    mode: string;
}

interface State {
    data: {
        id: string;
        branchId: string;
        startDate: number;
        groups: OfficersGroup[];
    };
    loanOfficers: Map<string, string>;
    loading: boolean;
    selectedGroups: OfficersGroup[];
    checkAll: boolean;
    chosenStatus: string;
}
class SupervisionLevelsActions extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            loanOfficers: new Map(),
            data: {
                id: "",
                branchId: "",
                startDate: 0,
                groups: [{
                    id: '',
                    leader: '',
                    officers: [],
                    status: '',

                }]
            },
            selectedGroups: [],
            checkAll: false,
            chosenStatus: '',
        }
    }
    componentDidMount() {
        this.initialState();

    }
    componentDidUpdate(prevProps) {
        if (this.props.mode !== prevProps.mode) {
            this.initialState();
        }
    }
    async initialState() {
        this.setState({
            loading: false,
            loanOfficers: new Map(),
            data: {
                id: "",
                branchId: "",
                startDate: 0,
                groups: [{
                    id: '',
                    leader: '',
                    officers: [],
                    status: '',

                }]
            },
            selectedGroups: [],
            checkAll: false,
            chosenStatus: this.props.mode === 'unapprove' ? 'approved' : 'pending',
        })
        await this.getLoanOfficers();
        await this.getGroups();
    }
    submit = async () =>{
        const obj={
            branchId: this.props.branchId,
            groupIds: this.state.selectedGroups.map((group) => group.id)
        }
        if (this.props.mode === 'delete') {
            this.deleteOfficers(obj);
        } else if (this.props.mode === 'approve') {
            this.approveOfficers(obj);
        } else if (this.props.mode === 'unapprove') {
            this.unApproveOfficers(obj);
        }
    }
    async deleteOfficers(obj) {
        const  res = await deleteOfficersGroups(obj, this.props.branchId);
        if(res.status==='success'){
            Swal.fire('Success','','success').then(()=> window.location.reload())
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
    }
    async approveOfficers(obj){

        const res = await approveOfficersGroups({branchesGroupIds:[obj]})
        if(res.status==='success'){
            Swal.fire('Success','','success').then(()=> window.location.reload())
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
    }
    async unApproveOfficers(obj){
        const res = await unApproveOfficersGroups({branchesGroupIds:[obj]})
        if(res.status==='success'){
            Swal.fire('Success','','success').then(()=> window.location.reload())
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
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
            const data: any[] = res.body.data;
            const officers = new Map()
            data.map((officer, index) => {
                return (officers.set(officer._id, officer.name));

            })
            this.setState({
                loanOfficers: officers,
            })
        }
        this.setState({ loading: false })
    }
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        const resData = res.body.data;
        resData.groups = res.body.data.groups?.filter((group) => group.status === this.state.chosenStatus);
        if (res.status = "success") {
            if (res.body.data)
                this.setState({
                    data: res.body.data,
                })
        }
        this.setState({ loading: false })
    }
    addRemoveItemFromChecked(group: OfficersGroup) {
        if (this.state.selectedGroups.findIndex(groupItem => groupItem.id === group.id) > -1) {
            this.setState({
                selectedGroups: this.state.selectedGroups.filter(el => el.id !== group.id),
            })
        } else {
            this.setState({
                selectedGroups: [...this.state.selectedGroups, group],
            })
        }
    }
    checkAll(e: React.FormEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            this.setState({ checkAll: true, selectedGroups: this.state.data.groups.filter((group) => group.status === this.state.chosenStatus) })
        } else this.setState({ checkAll: false, selectedGroups: [] })
    }
    render() {
        return (
            <div style={{padding:'10px', textAlign:"right"}}>
                <Form.Check
                    type={'checkbox'}
                    label={local.checkAll}
                    onChange={(e) => this.checkAll(e)}
                />
                {
                    this.state.data.groups.map((group, index) => {
                        return (
                            <Row key={group.id} className="row-nowrap" style={{margin:'10px', justifyContent:'flex-start'}}>
                                <Row style={{display:'flex',flexDirection:'row', justifyContent:'space-between', marginLeft:'15px'}}>
                                <Form.Check 
                                 type="checkbox"
                                 checked={Boolean(this.state.selectedGroups.find(currGroup => currGroup.id === group.id))}
                                 onChange={()=>this.addRemoveItemFromChecked(group)}
                                />
                                </Row>
                                <Table striped bordered hover>
                                    <tbody style={{ padding: "2rem 0", textAlign: "right", fontWeight: 'bold' }} key={index}>
                                        <tr style={{ height: '50px' }}><td className="header">{local.groupManager}</td><td>{this.state.loanOfficers.get(group.leader)}</td></tr>
                                        <tr style={{ height: '50px' }}><td className="header">{local.loanOfficerOrCoordinator}</td><td className="cell">
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexFlow: 'row wrap ' }}>
                                                {group.officers.map((officer, i) => {
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={'labelBtn'}>
                                                            {this.state.loanOfficers.get(officer)}
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        </td></tr>
                                        <tr style={{ height: '50px' }}><td className="header">{local.status}</td><td className="cell">{group.status ? local[group.status] : null}</td></tr>
                                    </tbody>
                                </Table>
                            </Row>
                        )
                    }
                    )
                }
                  {(ability.can('approveOfficersGroup', 'branch') || ability.can('unApproveOfficersGroup', 'branch') || ability.can('deleteOfficersGroup','branch')) &&
                    <Form.Group>
                        <Button
                            style={{ width: '300px' }}
                            onClick={async () => {
                                await this.submit();
                            }}
                            className={'save-button'}
                        >{this.props.mode === 'approve' ? local.approveSuperVisionGroups : this.props.mode==='unapprove'? local.unApproveSuperVisionGroups : local.deleteSuperVisionGroups}</Button>
                    </Form.Group>
                }
            </div>
        )
    }
}

export default SupervisionLevelsActions
