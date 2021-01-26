import React, { Component, CSSProperties } from 'react'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import Can from '../../config/Can';
import { theme } from '../../../theme'
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { getErrorMessage, } from '../../../Shared/Services/utils';
import BranchBasicsCard, { Managers } from './branchBasicsCard';;
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import { getManagerHierarchy } from "../../Services/APIs/ManagerHierarchy/getManagerHierarchy";
import Swal from 'sweetalert2';
import ability from '../../config/ability';
import ManagersCreation from './managersCreation';
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
    usersOfBranch: Map<string, string>;
    tabsArray: Array<Tab>;
    activeTab: string;

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
            activeTab: 'mainInfo',
            loading: false,
            tabsArray: [{
                header: local.managers,
                stringKey: 'mainInfo'
            }],
            data: {
                branchManager: "",
                branchId: "",
                operationsManager: "",
                areaManager: "",
                areaSupervisor: "",
                centerManager: ""
            },
            usersOfBranch: new Map(),
        }
    }
    componentDidMount() {
        this.getUsersOfBranch();
        this.getManagers();
        const tabsToRender: Array<Tab> = [{
            header: local.managers,
            stringKey: 'mainInfo'
        }]

        if (ability.can('updateBranchManagersHierarchy', 'branch')) {
            tabsToRender.push({
                header: local.editManagers,
                stringKey: 'editManagers',
            })
        }
        this.setState({
            tabsArray: tabsToRender,
        })
    }
    async getManagers() {
        this.setState({loading: true})
        const res = await getManagerHierarchy(this.props.branchId);
        if (res.status === "success") {
            this.setState({
                data: res.body.data,
            })
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
        }
        this.setState({loading: false})
    }
    async getUsersOfBranch() {
        this.setState({loading: true});
        const obj = {
            from: 0,
            size: 1000,
        };
        const res = await searchUsers(obj);
        if (res.status === "success") {
            const users = new Map();
            res.body.data.map((user) => { return (users.set(user._id, user.name)) })
            this.setState({
                usersOfBranch: users
            })
        }
        this.setState({loading: false});
    }
    renderMainInfo() {
        return (
            this.state.data ?
                <Table striped bordered hover>
                    <tbody style={{ padding: "2rem 0" }}>
                        <tr style={{ height: '50px' }}><td style={header}>{local.operationsManager}</td><td style={cell}>{this.state.usersOfBranch.get(this.state.data.operationsManager)}</td></tr>
                        <tr style={{ height: '50px' }}><td style={header}>{local.districtManager}</td><td style={cell}>{this.state.usersOfBranch.get(this.state.data.areaManager)}</td></tr>
                        <tr style={{ height: '50px' }}><td style={header}>{local.districtSupervisor}</td><td style={cell}>{this.state.usersOfBranch.get(this.state.data.areaSupervisor)}</td></tr>
                        <tr style={{ height: '50px' }}><td style={header}>{local.centerManager}</td><td style={cell}>{this.state.usersOfBranch.get(this.state.data.centerManager)}</td></tr>
                        <tr style={{ height: '50px' }}><td style={header}>{local.branchManager}</td><td style={cell}>{this.state.usersOfBranch.get(this.state.data.branchManager)}</td></tr>
                    </tbody>
                </Table>
                : <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img alt='no-data-found' src={require('../../../Shared/Assets/no-results-found.svg')} />
                    <h4>{local.noResultsFound}</h4>
                </div>
        )
    }
    renderEditManager() {
        return (
            <Can I='updateBranchManagersHierarchy' a='branch'>
                <ManagersCreation
                    branchId={this.props.branchId}
                />
            </Can>
        )
    }
    renderContent() {
        switch (this.state.activeTab) {
            case 'mainInfo':
                return this.renderMainInfo();
            case 'editManagers':
                return this.renderEditManager();
            default:
                return null;
        }
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
                {this.state.usersOfBranch ? <Card>
                    <CardNavBar
                        header={'here'}
                        array={this.state.tabsArray}
                        active={this.state.activeTab}
                        selectTab={(stringKey: string) => { this.setState({ activeTab: stringKey }) }}
                    />
                    <Card.Body>
                        {this.renderContent()}
                    </Card.Body>
                </Card>
                    : <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <img alt='no-data-found' src={require('../../../Shared/Assets/no-results-found.svg')} />
                        <h4>{local.noResultsFound}</h4>
                    </div>
                }
            </>
        )
    }
}

export default withRouter(ManagerProfile);