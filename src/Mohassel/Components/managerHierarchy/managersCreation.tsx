import React, { Component } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import * as local from '../../../Shared/Assets/ar.json';
import UsersSearch from './usersSearch';
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import { getManagerHierarchy } from "../../Services/APIs/ManagerHierarchy/getManagerHierarchy";
import { updateManagerHierarchy } from "../../Services/APIs/ManagerHierarchy/updateManagersHierarchy";
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import ability from '../../config/ability';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
interface Props {
            branchId: string;
}
interface State {
    usersOfBranch: any[];
    values: any;
    loading: boolean;
    disabled: boolean;
}
 class Managers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            usersOfBranch: [],
            loading: false,
            values: {
                operationsManager: '',
                areaManager: '',
                areaSupervisor: '',
                centerManager: '',
                branchManager: '',
            },
            disabled: true,
        }
    }
    componentDidMount() {
        if(ability.can("updateBranchManagersHierarchy","branch")){
            this.setState({disabled:false})
        }
        this.setState({ loading: true });
        this.getUsers();
        this.getManagers();
        this.setState({ loading: false });
        
    }
    async getUsers() {
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
    async getManagers() {
        const res = await getManagerHierarchy(this.props.branchId);
        if (res.status === "success") {
            const values = {
                operationsManager: res.body.data.operationsManager,
                areaManager: res.body.data.areaManager,
                areaSupervisor: res.body.data.areaSupervisor,
                centerManager: res.body.data.centerManager,
                branchManager: res.body.data.branchManager
            }
            this.setState({
                values: values
            })
        }
    }
    async updateManagers() {
        this.setState({ loading: true });
      const res=  await updateManagerHierarchy(this.state.values, this.props.branchId);
        if(res.status=='success'){
            Swal.fire('Success !',local.updateSuccess ,'success');
        } else {
            Swal.fire('Error !', getErrorMessage(res.error.error),'error');
        }
        this.setState({ loading: false });

    }
    render() {
        return (
            <div>
                <Loader open={this.state.loading} type={'fullscreen'} />
                <Form className="managers-form">
                    <Form.Group className={'managers-form-group'} as={Col} id="operationsManager">
                        <Form.Label className={"managers-label"} >{local.operationsManager}</Form.Label>
                        <Row><UsersSearch usersOfBranch={this.state.usersOfBranch} objectKey={'operationsManager'} item={this.state.values}  disabled = {this.state.disabled}/> </Row>
                    </Form.Group>
                    <Form.Group className={'managers-form-group'} as={Col} id="districtManager">
                        <Form.Label className={"managers-label"} >{local.districtManager}</Form.Label>
                        <Row><UsersSearch usersOfBranch={this.state.usersOfBranch} objectKey={'areaManager'} item={this.state.values}  disabled = {this.state.disabled}/> </Row>
                    </Form.Group>
                    <Form.Group className={'managers-form-group'} as={Col} id="districtSupervisor">
                        <Form.Label className={"managers-label"} >{local.districtSupervisor}</Form.Label>
                        <Row><UsersSearch usersOfBranch={this.state.usersOfBranch} objectKey={'areaSupervisor'} item={this.state.values}  disabled = {this.state.disabled}/> </Row>
                    </Form.Group>
                    <Form.Group className={'managers-form-group'} as={Col} id="centerManager">
                        <Form.Label className={"managers-label"} >{local.centerManager}</Form.Label>
                        <Row><UsersSearch usersOfBranch={this.state.usersOfBranch} objectKey={'centerManager'} item={this.state.values}  disabled = {this.state.disabled}/> </Row>
                    </Form.Group>
                    <Form.Group className={'managers-form-group'} as={Col} id="branchManager">
                        <Form.Label className={"managers-label"} >{local.branchManager}</Form.Label>
                        <Row><UsersSearch usersOfBranch={this.state.usersOfBranch} objectKey={'branchManager'} item={this.state.values}  disabled = {this.state.disabled}/> </Row>
                    </Form.Group>
                </Form>
                <Can I="updateBranchManagersHierarchy" a="branch">
                    <Form.Group>
                        <Button className={'save-button'} onClick={async () => {
                            await this.updateManagers();
                        }}>{local.save}</Button>
                    </Form.Group>
                </Can>
            </div>
        )
    }
}
export default withRouter(Managers);