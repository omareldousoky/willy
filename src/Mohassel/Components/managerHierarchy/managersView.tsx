import React, { Component, CSSProperties } from 'react'
import { Loader } from '../../../Shared/Components/Loader'
import BackButton from '../BackButton/back-button';
import * as local from '../../../Shared/Assets/ar.json';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import Can from '../../config/Can';
import { theme } from '../../../theme'
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { getErrorMessage, timeToDate } from '../../../Shared/Services/utils';
import BranchBasicsCard, { Managers, UserOfBranch } from './branchBasicsCard';;
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import { getManagerHierarchy } from "../../Services/APIs/ManagerHierarchy/getManagerHierarchy";
import Swal from 'sweetalert2';

interface Props {
    history: any;
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;
}
interface State {
    loading: boolean;
    data: Managers;
    usersOfBranch: UserOfBranch[];

}
const header: CSSProperties = {
    textAlign: "right",
    fontSize: "14px",
    width: "15%",
    color: theme.colors.lightGrayText
}
const cell: CSSProperties = {
    textAlign: "right",
    padding: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: theme.colors.blackText,

}
class ManagerProfile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            data: {
               branchManager:"",
               branchId:"",
               operationsManager:"",
               areaManager:"",
               areaSupervisor:"",
               centerManager:""
            },
            usersOfBranch: [],
        }
    }
    componentDidMount() {
        this.getManagers();
    }
    async getManagers() {
        const res = await getManagerHierarchy(this.props.branchId);
        if (res.status === "success") {
            this.setState({
                data: res.body.data,
            })
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
        }
    }
    async getUsersOfBranch(){
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
    }
    renderMainInfo() {
        return (
            <Table striped bordered hover>
                <tbody style={{padding:"2rem 0"}}>
                    <tr style={{height:'50px'}}><td style={header}>{local.operationsManager}</td><td style={cell}>{this.state.usersOfBranch.filter((user)=> user._id=== this.state.data.operationsManager)}</td></tr>
                    <tr style={{height:'50px'}}><td style={header}>{local.districtManager}</td><td style={cell}>{this.state.usersOfBranch.filter((user)=> user._id===this.state.data.areaSupervisor)}</td></tr>
                    <tr style={{height:'50px'}}><td style={header}>{local.districtSupervisor}</td><td style={cell}>{this.state.usersOfBranch.filter((user)=> user._id===this.state.data.areaSupervisor)}</td></tr>
                    <tr style={{height:'50px'}}><td style={header}>{local.centerManager}</td><td style={cell}>{this.state.usersOfBranch.filter((user)=> user._id===this.state.data.centerManager)}</td></tr>
                    <tr style={{height:'50px'}}><td style={header}>{local.branchManager}</td><td style={cell}>{this.state.usersOfBranch.filter((user)=> user._id===this.state.data.branchManager)}</td></tr>
                </tbody>
            </Table>
        )
    }
    render() {
        return (
            <>
                <Loader open={this.state.loading} type="fullscreen" />
                <BranchBasicsCard
                    name={this.props.name}
                    branchCode={this.props.branchCode}
                    createdAt={this.props.createdAt}
                    status={this.props.status}
                />
                <div style={{ paddingLeft: 30 }}>
                    <Can I='updateBranchManagersHierarchy' a='branch'><img alt={"edit"} onClick={()=> this.props.history.push('/manage-accounts/branches/branch-details/edit-managers',{
                        branchId: this.props.branchId,
                        branchCode: this.props.branchCode,
                        createdAt: this.props.createdAt,
                        status:this.props.status,
                        })}/></Can>
                    {local.edit}
                </div>
                <Card>
                    <Card.Title>
                    </Card.Title>
                    <Card.Body>
                        {this.renderMainInfo()}
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default withRouter(ManagerProfile);