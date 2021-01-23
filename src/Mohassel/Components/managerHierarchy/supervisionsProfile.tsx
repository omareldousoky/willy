import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { OfficersGroup } from '../../../Shared/Services/interfaces';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import './managerHierarchy.scss'
import Table from 'react-bootstrap/Table';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar';
import './managerHierarchy.scss'
import local from '../../../Shared/Assets/ar.json';
import { Card } from 'react-bootstrap';
import SupervisionLevelsCreation from './supervisionLevelsCreation';
import BranchBasicsCard from './branchBasicsCard';
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups';
import SupervisionLevelsActions from './supervisionLevelsActions';

interface Props {
    history: any;
    branchId: string;
    name: string;
    branchCode: number;
    createdAt: string;
    status: string;
}
interface State {
    data: {
        id: string;
        branchId: string;
        startDate: number;
        groups: OfficersGroup[];
    };
    loanOfficers: Map<string, string>;
    userOfBranch: Map<string, string>;
    loading: boolean;
    tabsArray: Array<Tab>;
    activeTab: string;
}
class SupervisionsProfile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            loanOfficers: new Map(),
            userOfBranch: new Map(),
            activeTab: 'supervisionDetails',
            tabsArray: [],
            data: {
                id: "",
                branchId: "",
                startDate: 0,
                groups: []
            },
        }
    }


    componentDidMount() {
        this.setState({
            tabsArray: [{
                header: local.levelsOfSupervision,
                stringKey: 'supervisionDetails'
            },
            {
                header: local.createSuperVisionGroups,
                stringKey: 'createSuperVisionGroups',
            },
            {
                header: local.editSuperVisionGroups,
                stringKey: 'editSuperVisionGroups'
            },
            {
                header: local.deleteSuperVisionGroups,
                stringKey: 'deleteSuperVisionGroups'
            },
            {
                header: local.approveSuperVisionGroups,
                stringKey: 'approveSuperVisionGroups'
            }, {
                header: local.unApproveSuperVisionGroups,
                stringKey: 'unApproveSuperVisionGroups'
            }
            ]
        })
        this.getUsers();
        this.getLoanOfficers();
        this.getGroups();
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
            data.map((officer) => {
                return (officers.set(officer._id, officer.name));

            })
            this.setState({
                loanOfficers: officers,
            })
        }
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
            const data: any[] = res.body.data;
            const users = new Map()
            data.map((user) => {
                return (users.set(user._id, user.name));

            })
            this.setState({
                userOfBranch: users,
            })
        }
        this.setState({ loading: false })
    }
    async getGroups() {
        this.setState({ loading: true })
        const res = await getOfficersGroups(this.props.branchId)
        if (res.status = "success") {
            if (res.body.data)
                this.setState({
                    data: res.body.data,
                })
        }
        this.setState({ loading: false })
    }
    getStatus(status: string) {
        switch (status) {
            case 'pending':
                return <div className="status-chip outline under-review" style={{ width: '100px' }}>{local.pending}</div>
            case 'approved':
                return <div className="status-chip outline approved" style={{ width: '100px' }}>{local.approved}</div>
            default: return null;
        }
    }
    renderMainInfo() {
        return (
            this.state.data.groups.length ? <>
                {
                    this.state.data.groups.map((group, index) => {
                        return (
                            <Table striped bordered hover key={group.id}>
                                <tbody style={{ padding: "2rem 0", textAlign: "right", fontWeight: 'bold' }} key={index}>
                                    <tr style={{ height: '50px' }}><td className="header">{local.groupManager}</td><td>{this.state.userOfBranch.get(group.leader)}</td></tr>
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
                                    <tr style={{ height: '50px' }}><td className="header">{local.status}</td><td className="cell">{group.status ? this.getStatus(group.status) : null}</td></tr>
                                </tbody>
                            </Table>
                        )
                    }
                    )
                }
            </>
                : <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img alt='no-data-found' src={require('../../../Shared/Assets/no-results-found.svg')} />
                    <h4>{local.noResultsFound}</h4>
                </div>
        )
    }
    renderContent() {
        switch (this.state.activeTab) {
            case 'supervisionDetails':
                return this.renderMainInfo();
            case 'createSuperVisionGroups':
                return <SupervisionLevelsCreation
                    branchId={this.props.branchId}
                    mode={'create'}
                />
            case 'editSuperVisionGroups':
                return <SupervisionLevelsCreation
                    branchId={this.props.branchId}
                    mode={'edit'}
                />
            case 'deleteSuperVisionGroups':
                return <SupervisionLevelsActions
                    branchId={this.props.branchId}
                    mode={'delete'}
                />
            case 'approveSuperVisionGroups':
                return <SupervisionLevelsActions
                    branchId={this.props.branchId}
                    mode={'approve'}
                />
            case 'unApproveSuperVisionGroups':
                return <SupervisionLevelsActions
                    branchId={this.props.branchId}
                    mode={'unapprove'}
                />
            default:
                return null;
        }
    }
    render() {
        return (
            <>
                <Card>
                    <CardNavBar
                        header={'here'}
                        array={this.state.tabsArray}
                        active={this.state.activeTab}
                        selectTab={(stringKey: string) => { this.setState({ activeTab: stringKey }) }}
                    />
                    <Card.Title>
                        <BranchBasicsCard
                            name={this.props.name}
                            branchCode={this.props.branchCode}
                            createdAt={this.props.createdAt}
                            status={this.props.status}
                        />
                    </Card.Title>
                    <Card.Body>
                        {this.renderContent()}
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default withRouter(SupervisionsProfile);
