import React, { Component } from 'react'
import { UserDataForm } from './userDataForm';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import * as local from '../../../Shared/Assets/ar.json';
import Wizard from '../wizard/Wizard';
import { Loader } from '../../../Shared/Components/Loader';
import {
    initialStep1,
    initialStep2,
    userCreationValidationStepOne,
    editUserValidationStepOne,
} from './userFormInitialState';
import {
    Values,
    User,
    RolesBranchesValues,
    UserInfo,
} from './userCreationinterfaces';
import UserRolesAndPermisonsFrom from './userRolesAndPermisonsForm';
import './userCreation.scss';
import { getUserRolesAndBranches } from '../../Services/APIs/User-Creation/getUserRolesAndBranches'
import { createUser } from '../../Services/APIs/User-Creation/createUser';
import { editUser } from '../../Services/APIs/User-Creation/editUser';
import { getUserDetails } from '../../Services/APIs/Users/userDetails';
import { timeToDateyyymmdd } from '../../Services/utils';
import Card from 'react-bootstrap/Card';

interface Props {
    edit: boolean;
    history: any;
}
interface State {
    step: number;
    step1: Values;
    loading: boolean;
    step2: RolesBranchesValues;
    branchesLabeled: Array<object>;
    rolesLabeled: Array<object>;
}
class UserCreation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step: 1,
            loading: false,
            step1: initialStep1,
            step2: initialStep2,
            branchesLabeled: [],
            rolesLabeled: [],
        }
    }
    async getUser() {
        const _id = this.props.history.location.state.details;
        const res = await getUserDetails(_id);
        const step1Data: Values = {
            name: res.body.user.name,
            username: res.body.user.username,
            nationalId: res.body.user.nationalId,
            hrCode: res.body.user.hrCode,
            birthDate: timeToDateyyymmdd(res.body.user.birthDate),
            gender: res.body.user.gender,
            nationalIdIssueDate: timeToDateyyymmdd(res.body.user.nationalIdIssueDate),
            mobilePhoneNumber: res.body.user.mobilePhoneNumber,
            hiringDate: timeToDateyyymmdd(res.body.user.hiringDate),
            password: '',
            confirmPassword: '',

        }
        const step2data: RolesBranchesValues = { roles: [], branches: [] }
        res.body.roles?.forEach(role => {
            step2data.roles.push({ label: role.roleName, value: role._id, hasBranch: role.hasBranch });
        }),
            res.body.branches?.forEach(branch => {
                step2data.branches?.push({ branchName: branch.name? branch.name : 'HQ', _id: branch._id });
            })
        this.setState({ step1:step1Data, step2:step2data })
    }
    async getUserRolePermissions () {
        const RolesAndBranches = await getUserRolesAndBranches();
        const labeldRoles: Array<object> = [];
        const labeldBranches: Array<object> = [];
        if (RolesAndBranches[0].status === 'success') {
            RolesAndBranches[0].body.roles.forEach(role => {
                labeldRoles.push({
                    label: role.roleName,
                    hasBranch: role.hasBranch,
                    value: role._id,
                })
            })
            this.setState({
                loading: false,
                rolesLabeled: labeldRoles,
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({
                loading: false,
            })
        }
        if (RolesAndBranches[1].status === 'success') {
            RolesAndBranches[1].body.data.data.forEach(branch => {
                labeldBranches.push({ _id: branch._id, branchName: branch.name? branch.name: 'HQ' })
            })
            this.setState({
                branchesLabeled: labeldBranches,
            })
        } else {
            Swal.fire('', local.searchError, 'error');
        }


    }
      componentDidMount() {
        if (this.props.edit) {
           this.setState({loading: true}, () => this.getUser())
        }  else {

        }
            
        this.setState({ loading: true },()=>this.getUserRolePermissions())
    }
  

    cancel(): void {
        this.setState({
            step: 1,
            step1:initialStep1,
            step2: initialStep2,
        })
        this.props.history.goBack();
    }
    previousStep(values, step: number): void {
        this.setState({
            step: step - 1,
            [`step${step}`]: values,
        } as State);
    }
    prepareUser(userObj: User) {
        const user = {
            ...userObj.userInfo,
            branches: userObj.branches, roles: userObj.roles
        };
        user.birthDate = new Date(user.birthDate).valueOf();
        user.hiringDate = new Date(user.hiringDate).valueOf();
        user.nationalIdIssueDate = new Date(user.nationalIdIssueDate).valueOf();
        return user;
    }
    async createUser(userObj: User) {
        const user = this.prepareUser(userObj);
        this.setState({ loading: true });
        const res = await createUser({user});
        if (res.status === 'success') {
            Swal.fire("success", local.userCreated).then(() => {
                this.props.history.goBack();
            });
        } else {
            Swal.fire("error", local.userCreationError)    
        }
        this.setState({ loading: false });
    }
    async editUser(userObj: User) {
        const user = this.prepareUser(userObj);
        const id = this.props.history.location.state.details;
        this.setState({ loading: true });
        const res = await editUser(user, id);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.userEdited).then(() => {
                this.props.history.goBack();

            });
        } else {
            Swal.fire("error", local.userCreationError)
            this.setState({ loading: false });
        }
    }
    submit = (values: object) => {
        if (this.state.step < 2) {
            this.setState({
                [`step${this.state.step}`]: values,
                step: this.state.step + 1,
            } as any)
        }
        else {
            this.setState({ step2: values } as any)
            const labeledBranches = this.state.step2.branches;
            const labeledRoles = this.state.step2.roles;
            const branches: string[] = labeledBranches.map(
                (branch) => {
                    return branch._id;
                }
            );

            const roles: string[] = labeledRoles.map(
                (role) => {
                    return role.value;
                }
            );
            const userObj: User = {
                userInfo: this.getUserInfo(),
                roles,
                branches,
            }
            if (this.props.edit) {
                this.editUser(userObj);

            } else {
                this.createUser(userObj);
            }
        }
    }

    getUserInfo(): UserInfo {
        const user = this.state.step1;
        return {
            name: user.name,
            username: user.username,
            nationalId: user.nationalId,
            gender: user.gender,
            birthDate: user.birthDate,
            nationalIdIssueDate: user.nationalIdIssueDate,
            hrCode: user.hrCode,
            mobilePhoneNumber: user.mobilePhoneNumber,
            hiringDate: user.hiringDate,
            password: user.password,
            faxNumber: "",
            emailAddress: "",

        }
    }

    componentWillUnmount() {
        
        initialStep2.roles = [];
        initialStep2.branches = [];
    }
    renderStepOne(): any {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.step1}
                onSubmit={this.submit}
                validationSchema={this.props.edit ? editUserValidationStepOne : userCreationValidationStepOne}
                validateOnBlur
                validateOnChange
            >
                {(formikProps) =>
                    <UserDataForm {...formikProps} edit={this.props.edit} cancle={() => this.cancel()} />
                }
            </Formik>
        )
    }
    renderStepTwo(): any {
        return (
          
                    <UserRolesAndPermisonsFrom
                        handleSubmit = {this.submit}
                        values={this.state.step2}
                        userRolesOptions={this.state.rolesLabeled}
                        userBranchesOptions={this.state.branchesLabeled}
                        previousStep={(valuesOfStep2) => this.previousStep(valuesOfStep2, 2)}
                    />
        );
    }
    renderSteps() {
        switch (this.state.step) {
            case 1:
                return this.renderStepOne();
            case 2:
                return this.renderStepTwo();
            default: return null;
        }
    }
    render() {
        return (
            <>
                <Loader type="fullscreen" open={this.state.loading} />
                <Card >
                    <div style={{ display: "flex", flexDirection: "row" }} >


                            <Wizard
                                currentStepNumber={this.state.step - 1}
                                stepsDescription={[local.userBasicStep1, local.userRolesStep2]}
                            />

                        <Card.Body className={'formsContainer'}>
                        
                                {this.renderSteps()}
                        
                        </Card.Body>

                    </div>
                </Card>
            </>
        );
    }
}

export default withRouter(UserCreation);
