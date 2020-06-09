import React, { Component } from 'react';
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RoleTable from './roleTable';
import { getPermissions } from '../../Services/APIs/Roles/roles';
import { Section } from "./roleCreation";
import RoleUsers from './roleUsers';
import Button from 'react-bootstrap/Button';
import BackButton from '../BackButton/back-button';
import { withRouter } from 'react-router-dom';
interface Role {
    permissions: Array<any>;
    hasBranch: boolean;
    roleName: string;
    _id: string;
}
interface State {
    prevId: string;
    role: Role;
    activeTab: string;
    allSections: Array<Section>;
    tabsArray: Array<Tab>;
    loading: boolean;
}

interface Props {
    history: any;
    location: any;
}
class RoleProfile extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            prevId: '',
            role: {
                _id: '',
                hasBranch: false,
                permissions: [],
                roleName: ''
            },
            activeTab: 'roleDetails',
            tabsArray: [{
                header: local.roles,
                stringKey: 'roleDetails'
            },
            {
                header: local.users,
                stringKey: 'roleUsers'
            }],
            loading: false,
            allSections: [],

        };
    }
    componentDidMount() {
        const role = this.props.history.location.state;
        this.setState({
            role
        }, () => this.getAllPermissions())
    }
    async getAllPermissions() {
        this.setState({ loading: true })
        const id = (this.state.role.hasBranch) ? 'branch' : 'hq';
        const res = await getPermissions(id);
        if (res.status === "success") {
            this.setState({
                loading: false,
                allSections: res.body.actions
            })
        } else {
            this.setState({ loading: false })
        }
    }
    renderContent() {
        switch (this.state.activeTab) {
            case 'roleDetails':
                return <div>
                    <Form style={{ textAlign: 'right', backgroundColor: '#f7fff2', padding: 15, border: '1px solid #e5e5e5' }}>
                        <h5>{local.role}</h5>
                        <Form.Row>
                            <Form.Group as={Col} md="4">
                                <Row>
                                    <Form.Label style={{ color: '#6e6e6e' }}>{local.roleName}</Form.Label>
                                </Row>
                                <Row>
                                    <Form.Label>{this.state.role.roleName} </Form.Label>
                                </Row>
                            </Form.Group>
                            <Form.Group as={Col} md="4">
                                <Row>
                                    <Form.Label style={{ color: '#6e6e6e' }}>{local.permissions}</Form.Label>
                                </Row>
                                <Row>
                                    <Form.Label>{this.state.role.hasBranch ? local.branchPermissions : local.allPermissions}</Form.Label>
                                </Row>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    <div className="d-flex">
                        <span style={{ padding: "5px", margin: " 30px 30px 10px 0px", fontSize: 14, fontWeight: 'bold' }}><img style={{ float: "right", margin: '0px 5px' }} alt="search-icon" src={require('../../Assets/permissions-inactive.svg')} /> {local.permissions}</span>
                    </div>
                    <RoleTable sections={this.state.allSections} permissions={this.state.role.permissions} />
                </div>
            case 'roleUsers':
                return <RoleUsers role={this.state.role} />
            default:
                return null
        }
    }
    render() {
        return (
            <Container>
                {Object.keys(this.state.role).length > 0 &&
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <BackButton title={local.roleDetails} />
                            <div>
                                <span onClick={() => { this.props.history.push({ pathname: "/manage-accounts/roles/edit-role", state: { role: this.state.role } }) }}><span className='fa fa-pencil-alt icon'> {local.edit}</span></span>
                            </div>
                        </div>
                        <Card style={{ marginTop: 15 }}>
                            <CardNavBar
                                header={'here'}
                                array={this.state.tabsArray}
                                active={this.state.activeTab}
                                selectTab={(index: string) => this.setState({ activeTab: index })}
                            />
                            <Loader type="fullscreen" open={this.state.loading} />
                            <div>
                                {this.renderContent()}
                            </div>
                        </Card>
                    </div>
                }
            </Container>
        )
    }
}
export default withRouter(RoleProfile);