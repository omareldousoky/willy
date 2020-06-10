import React, { Component } from 'react';
import { getPermissions, createRole, editRole } from '../../Services/APIs/Roles/roles';
import { Loader } from '../../../Shared/Components/Loader';
import { step1, roleCreationStep1Validation } from './roleStates'
import Wizard from '../wizard/Wizard';
import * as local from '../../../Shared/Assets/ar.json';
import RoleTable from './roleTable';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
export interface Section {
    _id: string;
    key: string;
    i18n: any;
    actions: Array<any>;
}
interface Props {
    history: any;
    edit: boolean;
    application: any;
    test: boolean;
}
interface State {
    step: number;
    step1: {
        roleName: string;
        hQpermission: boolean;
    };
    sections: Array<Section>;
    permissions: Array<any>;
    loading: boolean;
}
class RoleCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            step: 1,
            step1: step1,
            sections: [],
            permissions: [],
            loading: false,
        };
    }
    componentDidMount() {
        if (this.props.edit) {
            const role = this.props.history.location.state.role;
            const step1Edit = { ...this.state.step1 };
            step1Edit.roleName = role.roleName;
            step1Edit.hQpermission = !role.hasBranch
            this.getEditPermissions(role.hasBranch);
            this.setState({
                step1: step1Edit
            })
        }
    }
    async getPermissions() {
        this.setState({ loading: true })
        const id = (this.state.step1.hQpermission) ? 'hq' : 'branch';
        const res = await getPermissions(id);
        if (res.status === "success") {
            const sections = res.body.actions;
            this.setState({
                loading: false,
                sections,
            })
        } else {
            this.setState({ loading: false })
        }
    }
    async getEditPermissions(hasbranch) {
        this.setState({ loading: true })
        const id = (!hasbranch) ? 'hq' : 'branch';
        const res = await getPermissions(id);
        if (res.status === "success") {
            const sections = res.body.actions;
            const rolePermissionsArray = [];
            const rolePermissions = (this.props.history.location.state.role.permissions) ? this.props.history.location.state.role.permissions : {};
            Object.keys(rolePermissions).forEach((roleSection) => {
                const sectionObject = sections.find((section) => section.key === roleSection)
                sectionObject && sectionObject.actions.map((action, i) => {
                    const keyArray = Object.keys(action);
                    const i18nI = keyArray.indexOf('i18n');
                    keyArray.splice(i18nI, 1)
                    keyArray.map(key => {
                        const value = action[key]
                        if ((rolePermissions[roleSection] & value) === value) {
                            if (!Object.keys(rolePermissionsArray).includes(roleSection)) {
                                rolePermissionsArray[roleSection] = [];
                            }
                            if (!rolePermissionsArray[roleSection].includes(value)) {
                                rolePermissionsArray[roleSection].push(value)
                            }
                        }
                    })

                })
            })
            this.setState({
                loading: false,
                sections,
                permissions: rolePermissionsArray
            })
        } else {
            this.setState({ loading: false })
        }
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
    renderStepOne(): any {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.step1}
                onSubmit={this.submitToStep2}
                validationSchema={roleCreationStep1Validation}
                validateOnBlur
                validateOnChange
            >
                {(formikProps) =>
                    // <UserDataForm {...formikProps} cancle={() => this.cancel()} />
                    <Form onSubmit={formikProps.handleSubmit}>
                        <Col>
                            <Form.Group as={Row} controlId="roleName" >
                                <Form.Label style={{ margin: 0 }}>{local.roleName}</Form.Label>
                                <Col sm={6}>
                                    <Form.Control
                                        type="text"
                                        name="roleName"
                                        data-qc="roleName"
                                        value={(formikProps.values.roleName).toString()}
                                        onBlur={formikProps.handleBlur}
                                        onChange={formikProps.handleChange}
                                        isInvalid={Boolean(formikProps.errors.roleName) && Boolean(formikProps.touched.roleName)}
                                        disabled={this.props.edit}
                                    >
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {formikProps.errors.roleName}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="hQpermission">
                                {/* <Col sm={4}/> */}
                                <Col sm={1}>
                                    <Form.Check
                                        type="checkbox"
                                        name="hQpermission"
                                        data-qc="hQpermission"
                                        value={(formikProps.values.hQpermission).toString()}
                                        checked={formikProps.values.hQpermission}
                                        onBlur={formikProps.handleBlur}
                                        onChange={formikProps.handleChange}
                                        isInvalid={Boolean(formikProps.errors.hQpermission) && Boolean(formikProps.touched.hQpermission)}
                                        disabled={this.props.edit}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formikProps.errors.hQpermission}
                                    </Form.Control.Feedback>
                                </Col>
                                <Form.Label style={{ textAlign: 'right' }} column md={4}>{local.hQpermission}</Form.Label>

                            </Form.Group>
                            <Form.Group as={Row} className="justify-content-around">
                                <Button style={{ width: '20%' }} onClick={() => { this.cancel() }}>{local.cancel}</Button>
                                <Button style={{ float: 'left', width: '20%' }} type="submit" data-qc="next">{local.next}</Button>
                            </Form.Group>
                        </Col>
                    </Form>
                }
            </Formik>
        )
    }
    renderStepTwo(): any {
        return (
            <div style={{ backgroundColor: '#fafafa' }}>
                <>
                    <RoleTable sections={this.state.sections} permissions={this.state.permissions} updatePerms={(perms) => { this.setState({ permissions: perms }) }} />
                    <Row className="justify-content-around">
                        <Button style={{ width: '20%' }} onClick={() => { this.previousStep(2) }}>{local.previous}</Button>
                        <Button style={{ float: 'left', width: '20%' }} type="button" onClick={() => this.submit()} data-qc="next">{local.submit}</Button>
                    </Row>
                </>
            </div>
        )
    }
    async submit() {
        const perms: Array<any> = []
        if (this.state.permissions && Object.keys(this.state.permissions).length > 0) {
            if (!this.props.edit) {
                this.setState({ loading: true });
                Object.keys(this.state.permissions).forEach(key => perms.push({ key: key, value: this.state.permissions[key] }))
                const obj = {
                    roleName: this.state.step1.roleName,
                    hasBranch: !this.state.step1.hQpermission,
                    permissions: perms
                }
                const res = await createRole(obj);
                if (res.status === 'success') {
                    this.setState({ loading: false });
                    Swal.fire("success", local.userRoleCreated).then(() => { this.props.history.push("/manage-accounts") })
                } else {
                    Swal.fire("error", local.userRoleCreationError, 'error')
                    this.setState({ loading: false });
                }
            } else {
                this.setState({ loading: true });
                Object.keys(this.state.permissions).forEach(key => perms.push({ key: key, value: this.state.permissions[key] }))
                const obj = {
                    id: this.props.history.location.state.role._id,
                    permissions: perms
                }
                const res = await editRole(obj);
                if (res.status === 'success') {
                    this.setState({ loading: false });
                    Swal.fire("success", local.userRoleEdited).then(() => { this.props.history.push("/manage-accounts") })
                } else {
                    Swal.fire("error", local.userRoleEditError, 'error')
                    this.setState({ loading: false });
                }
            }
        } else {
            Swal.fire("warning", local.mustSelectPermissions, 'warning')
        }
    }
    submitToStep2 = (values: object) => {
        this.setState({
            [`step${this.state.step}`]: values,
            step: this.state.step + 1,
        } as any, () => {
            if (this.state.step === 2 && !this.props.edit) {
                this.getPermissions();
            }
        })
    }
    previousStep(step: number): void {
        this.setState({
            step: step - 1,
        } as State);
    }
    cancel(): void {
        this.setState({
            step: 1,
            step1,
        })
        this.props.history.push("/manage-accounts");
    }
    render() {
        return (
            <div>
                <Loader type="fullscreen" open={this.state.loading} />

                <div style={{ display: "flex", flexDirection: "row", textAlign: 'right' }}>
                    <Wizard
                        currentStepNumber={this.state.step - 1}
                        stepsDescription={[local.userBasicStep1, local.rolesStep2]}
                    />

                    <div style={{ width: '70%', margin: '40px auto' }}>
                        {this.renderSteps()}
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(RoleCreation);