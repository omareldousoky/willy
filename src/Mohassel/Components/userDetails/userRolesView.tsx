import React, { Component } from 'react';
import Labels from '../Labels/labels';
import './userDetails.scss';
import Card from 'react-bootstrap/Card';
import * as local from '../../../Shared/Assets/ar.json';
import { Role, Section } from './userDetailsInterfaces';
import { getPermissions } from '../../Services/APIs/Roles/roles';
import { Loader } from '../../../Shared/Components/Loader';
import RoleTable from '../Roles/roleTable';
interface Props {
    roles: Role[];
}

interface State {
    selectedRole?: Role;
    rolesLabels: string[];
    loading: boolean;
    allSections: Array<Section>;
}

export default class UserRolesView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedRole: this.props.roles[0],
            rolesLabels: [],
            allSections: [],
            loading:false,
            
        }

    }
    async getAllPermissions() {
        this.setState({ loading: true })
        const id = (this.state.selectedRole?.hasBranch) ? 'branch' : 'hq';
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
    handleClick = async (index: number) => {
        this.setState({ selectedRole: this.props.roles[index] });
        await this.getAllPermissions();

    };
   
     componentDidMount(){
        this.setState({
            rolesLabels: this.props.roles.map((role)=>{return role.roleName},()=> {
                this.getAllPermissions()
            })
        })

    }
    roleCard() {
        return (
            <>
                <Card>
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body
                        className={'roleContainer'}
                    >
                        <span
                            className={'iconConatiner'}
                        ><img
                                className={"iconImage"}
                                alt={'role'} src={require('../../Assets/roleIcon.svg')} />{local.role}</span>
                        <div className={'rowContainer'}>
                            <div className={'columnContianer'}><div className={'subTitle'}>{local.roleName}</div><div>{this.state.selectedRole?.roleName}</div> </div>
        <div className={'columnContianer'}><div className={'subTitle'}>{local.permissions} </div><div>{this.state.selectedRole?.hasBranch? local.branches : local.headquarters}</div></div>
                        </div>
                    </Card.Body>
                </Card>
            </>
        );
    }
    render() {
        return (
            <>
                <div className={'labelContainer'}>
                    <Labels 
                    defaultSelect={true}
                     isClickable={true} 
                     onClick={this.handleClick} 
                     labelsTextArr={this.state.rolesLabels} />
                </div>
                {this.roleCard()}
                <div className="d-flex">
                        <span style={{ padding: "5px", margin: " 30px 30px 10px 0px", fontSize: 14, fontWeight:'bold' }}><img style={{ float: "right", margin:'0px 5px' }} alt="search-icon" src={require('../../Assets/permissions-inactive.svg')} /> {local.permissions}</span>
                    </div>
                    <RoleTable sections={this.state.allSections} permissions={this.state.selectedRole?.permissions} />
            </>
        )
    }
}


