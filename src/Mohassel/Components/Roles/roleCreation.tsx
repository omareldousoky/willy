import React, { Component } from "react";
import {
  getPermissions,
  createRole,
  editRole,
} from "../../Services/APIs/Roles/roles";
import { Loader } from "../../../Shared/Components/Loader";
import { step1, roleCreationStep1Validation } from "./roleStates";
import Wizard from "../wizard/Wizard";
import * as local from "../../../Shared/Assets/ar.json";
import RoleTable from "./roleTable";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { theme } from "../../../theme";
import { getRoles } from "../../Services/APIs/Roles/roles";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { customFilterOption, getErrorMessage } from '../../../Shared/Services/utils';
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
    managerRole?: string;
  };

  sections: Array<Section>;
  permissions: Array<any>;
  managerRolesList: Array<any>;
  loading: boolean;
}
class RoleCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 1,
      step1: step1,
      sections: [],
      permissions: [],
      managerRolesList: [],
      loading: false,
    };
  }
  componentDidMount() {
    if (this.props.edit) {
      const role = this.props.history.location.state.role;
      const step1Edit = { ...this.state.step1 };
      step1Edit.roleName = role.roleName;
      step1Edit.hQpermission = !role.hasBranch;
      step1Edit.managerRole = role.managerRole;
      this.getEditPermissions(role.hasBranch);
      this.setState({
        step1: step1Edit,
      });
    }
    this.getRolesForManager();
  }
  async getPermissions() {
    this.setState({ loading: true });
    const id = this.state.step1.hQpermission ? "hq" : "branch";
    const res = await getPermissions(id);
    if (res.status === "success") {
      const sections = res.body.actions;
      this.setState({
        loading: false,
        sections,
      });
    } else {
      this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(res.error.error), 'error'));
    }
  }
  async getRolesForManager() {
    this.setState({ loading: true });
    const res = await getRoles();
    if (res.status === "success") {
      this.setState({
        managerRolesList: this.prepareManagerRolesOptions(res.body.roles),
        loading: false,
      });
    } else {
      this.setState({ loading: false },()=> Swal.fire('Error !', getErrorMessage(res.error.error), 'error'));
    }
  }
  prepareManagerRolesOptions(roles: Array<any>) {
    const managerRoles: any[] = [];
    roles.forEach((role) => {
      managerRoles.push({
        label: role.roleName,
        value: role._id,
      });
    });
    return managerRoles;
  }
  async getEditPermissions(hasbranch) {
    this.setState({ loading: true });
    const id = !hasbranch ? "hq" : "branch";
    const res = await getPermissions(id);
    if (res.status === "success") {
      const sections = res.body.actions;
      const rolePermissionsArray = [];
      const rolePermissions = this.props.history.location.state.role.permissions
        ? this.props.history.location.state.role.permissions
        : {};
      Object.keys(rolePermissions).forEach((roleSection) => {
        const sectionObject = sections.find(
          (section) => section.key === roleSection
        );
        sectionObject &&
          sectionObject.actions.map((action, i) => {
            const keyArray = Object.keys(action);
            const i18nI = keyArray.indexOf("i18n");
            keyArray.splice(i18nI, 1);
            keyArray.map((key) => {
              const value = action[key];
              if ((BigInt(rolePermissions[roleSection]) & BigInt(value)).toString() === BigInt(value).toString()) {
                if (!Object.keys(rolePermissionsArray).includes(roleSection)) {
                  rolePermissionsArray[roleSection] = [];
                }
                if (!rolePermissionsArray[roleSection].includes(value)) {
                  rolePermissionsArray[roleSection].push(value);
                }
              }
            });
          });
      });
      this.setState({
        loading: false,
        sections,
        permissions: rolePermissionsArray,
      });
    } else {
      this.setState({ loading: false }, ()=> Swal.fire('Error !', getErrorMessage(res.error.error), 'error'));
    }
  }
  renderSteps() {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne();
      case 2:
        return this.renderStepTwo();
      default:
        return null;
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
        {(formikProps) => (
          // <UserDataForm {...formikProps} cancle={() => this.cancel()} />
          <Form onSubmit={formikProps.handleSubmit} className="data-form">
            <Col>
              <Form.Group className="data-group" controlId="roleName">
                <Form.Label className="data-label">{local.roleName}</Form.Label>
                <Form.Control
                  type="text"
                  name="roleName"
                  data-qc="roleName"
                  value={formikProps.values.roleName.toString()}
                  onBlur={formikProps.handleBlur}
                  onChange={formikProps.handleChange}
                  isInvalid={
                    Boolean(formikProps.errors.roleName) &&
                    Boolean(formikProps.touched.roleName)
                  }
                  disabled={this.props.edit}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.roleName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="hQpermission"
                className="data-group row-nowrap"
              >
                <Form.Check
                  type="checkbox"
                  name="hQpermission"
                  data-qc="hQpermission"
                  style={{ marginRight: "20px" }}
                  value={formikProps.values.hQpermission.toString()}
                  checked={formikProps.values.hQpermission}
                  onBlur={formikProps.handleBlur}
                  onChange={formikProps.handleChange}
                  isInvalid={
                    Boolean(formikProps.errors.hQpermission) &&
                    Boolean(formikProps.touched.hQpermission)
                  }
                  disabled={this.props.edit}
                />
                <Form.Control.Feedback type="invalid">
                  {formikProps.errors.hQpermission}
                </Form.Control.Feedback>
                <Form.Label style={{ textAlign: "right" }}>
                  {local.hQpermission}
                </Form.Label>
              </Form.Group>
              <Form.Group
                className={"data-group"}
                controlId="managerRole"
                style={{ minHeight: "20rem" }}
              >
                <Form.Label className={"data-label"}>
                  {local.selectManagerRole}
                </Form.Label>
                <Select
									styles={theme.selectStyleWithBorder}
									theme={theme.selectTheme}
                  isSearchable={true}
                  filterOption={customFilterOption}
                  isDisabled={this.props.edit}
                  placeholder={
                    <span
                      style={{ width: "100%", padding: "5px", margin: "5px" }}
                    >
                      <img
                        style={{ float: "right" }}
                        alt="search-icon"
                        src={require("../../Assets/searchIcon.svg")}
                      />{" "}
                      {local.searchByUserRole}
                    </span>
                  }
                  value={this.state.managerRolesList.find(
                    (item) => item.value === formikProps.values.managerRole
                  )}
                  name="mangerRole"
                  data-qc="managerRole"
                  onChange={(e) => {
                    formikProps.values.managerRole = e.value;
                  }}
                  options={this.state.managerRolesList}
                />
              </Form.Group>
              <Form.Group as={Row} className="justify-content-around">
                <Button
                  style={{ width: "20%" }}
                  onClick={() => {
                    this.cancel();
                  }}
                >
                  {local.cancel}
                </Button>
                <Button
                  style={{ float: "left", width: "20%" }}
                  type="submit"
                  data-qc="next"
                >
                  {local.next}
                </Button>
              </Form.Group>
            </Col>
          </Form>
        )}
      </Formik>
    );
  }
  renderStepTwo(): any {
    return (
      <div style={{ backgroundColor: "#fafafa" }}>
        <>
          <RoleTable
            sections={this.state.sections}
            permissions={this.state.permissions}
            updatePerms={(perms) => {
              this.setState({ permissions: perms });
            }}
          />
          <Row className="justify-content-around">
            <Button
              style={{ width: "20%" }}
              onClick={() => {
                this.previousStep(2);
              }}
            >
              {local.previous}
            </Button>
            <Button
              style={{ float: "left", width: "20%" }}
              type="button"
              onClick={() => this.submit()}
              data-qc="next"
            >
              {local.submit}
            </Button>
          </Row>
        </>
      </div>
    );
  }
  async submit() {
    const perms: Array<any> = [];
    if (
      this.state.permissions &&
      Object.keys(this.state.permissions).length > 0
    ) {
      if (!this.props.edit) {
        this.setState({ loading: true });
        Object.keys(this.state.permissions).forEach((key) =>
          perms.push({ key: key, value: this.state.permissions[key] })
        );
        const obj = {
          roleName: this.state.step1.roleName,
          hasBranch: !this.state.step1.hQpermission,
          managerRole: this.state.step1.managerRole,
          permissions: perms,
        };
        const res = await createRole(obj);
        if (res.status === "success") {
          this.setState({ loading: false });
          Swal.fire("success", local.userRoleCreated).then(() => {
            this.props.history.push("/manage-accounts");
          });
        } else {
          this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(res.error.error), 'error'));
        }
      } else {
        this.setState({ loading: true });
        Object.keys(this.state.permissions).forEach((key) =>
          perms.push({ key: key, value: this.state.permissions[key] })
        );
        const obj = {
          id: this.props.history.location.state.role._id,
          permissions: perms,
        };
        const res = await editRole(obj);
        if (res.status === "success") {
          this.setState({ loading: false });
          Swal.fire("success", local.userRoleEdited).then(() => {
            this.props.history.push("/manage-accounts");
          });
        } else {
          this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(res.error.error), 'error'));
        }
      }
    } else {
      Swal.fire("warning", local.mustSelectPermissions, "warning");
    }
  }
  submitToStep2 = (values: object) => {
    this.setState(
      {
        [`step${this.state.step}`]: values,
        step: this.state.step + 1,
      } as any,
      () => {
        if (this.state.step === 2 && !this.props.edit) {
          this.getPermissions();
        }
      }
    );
  };
  previousStep(step: number): void {
    this.setState({
      step: step - 1,
    } as State);
  }
  cancel(): void {
    this.setState({
      step: 1,
      step1,
    });
    this.props.history.push("/manage-accounts");
  }
  render() {
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
        <Container style={{ height: "fit-content" }}>
          <Card>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "right",
              }}
            >
              <Wizard
                currentStepNumber={this.state.step - 1}
                stepsDescription={[local.userBasicStep1, local.rolesStep2]}
              />
              <Card.Body>{this.renderSteps()}</Card.Body>
            </div>
          </Card>
        </Container>
      </>
    );
  }
}
export default withRouter(RoleCreation);
