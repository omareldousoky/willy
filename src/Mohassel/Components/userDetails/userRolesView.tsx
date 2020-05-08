import React, { Component } from 'react';
import Labels from '../Labels/labels';
import './userDetails.scss';
import Card from 'react-bootstrap/Card';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
    roles: string[];
    hasBranch: boolean;
}

interface State {
    selectedRole?: string;
}

export default class UserRolesView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedRole: this.props.roles[0],
        }

    }
    handleClick = (index: number) => {
        this.setState({ selectedRole: this.props.roles[index] })

    };
    roleCard() {
        return (
            <>
                <Card>
                    <Card.Body
                        className={'roleContainer'}
                    >
                        <span
                            className={'iconConatiner'}
                        ><img
                                className={"iconImage"}
                                alt={'role'} src={require('../../Assets/roleIcon.svg')} />{local.role}</span>
                        <div className={'rowContainer'}>
                            <div className={'columnContianer'}><div className={'subTitle'}>{local.roleName}</div><div>{this.state.selectedRole}</div> </div>
        <div className={'columnContianer'}><div className={'subTitle'}>{local.permissions} </div><div>{this.props.hasBranch? local.branches : local.headquarters}</div></div>
                        </div>
                    </Card.Body>
                </Card>
            </>
        );
    }
    render() {
        console.log(this.state.selectedRole);
        return (
            <>
                <div className={'labelContainer'}>
                    <Labels defaultSelect={true} isClickable={true} onClick={this.handleClick} labelsTextArr={this.props.roles} />
                </div>
                {this.roleCard()}
            </>
        )
    }
}


