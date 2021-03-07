import React, { Component } from "react";
import { UserDataForm } from "./userDataForm";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import Swal from "sweetalert2";
import * as local from "../../../Shared/Assets/ar.json";
import Wizard from "../wizard/Wizard";
import { Loader } from "../../../Shared/Components/Loader";
import {
  initialStep1,
  initialStep2,
  initialStep3,
  userCreationValidationStepOne,
  editUserValidationStepOne,
} from "./userFormInitialState";
import {
  Values,
  User,
  RolesBranchesValues,
  UserInfo,
  MainChoosesValues,
} from "./userCreationinterfaces";
import UserRolesAndPermissionsFrom from "./userRolesAndPermissionsForm";
import "./userCreation.scss";
import { getUserRolesAndBranches } from "../../Services/APIs/User-Creation/getUserRolesAndBranches";
import { createUser } from "../../Services/APIs/User-Creation/createUser";
import { editUser } from "../../Services/APIs/User-Creation/editUser";
import { getUserDetails } from "../../Services/APIs/Users/userDetails";
import { getErrorMessage, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import Card from "react-bootstrap/Card";
import UserManagerForm from "./userManagerForm";
import { step2 } from "../CustomerCreation/customerFormIntialState";

interface Props {
  edit: boolean;
  history: any;
}
interface State {
  step: number;
  step1: Values;
  loading: boolean;
  step2: RolesBranchesValues;
  step3: MainChoosesValues;
  branchesLabeled: Array<object>;
  rolesLabeled: Array<object>;
  nationalId: string;
  username: string;
}
class UserCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 1,
      loading: false,
      step1: initialStep1,
      step2: initialStep2,
      step3: initialStep3,
      branchesLabeled: [],
      rolesLabeled: [],
      nationalId: "",
      username: "",
    };
  }
  async getUser() {
    const _id = this.props.history.location.state.details;
    const res = await getUserDetails(_id);
    if(res.status === "success"){
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
      password: "",
      confirmPassword: "",
    };
    this.setState({
      nationalId: res.body.user.nationalId,
      username: res.body.user.username,
    })
    const step2data: RolesBranchesValues = { roles: [], branches: [] };
    res.body.roles?.forEach((role) => {
      step2data.roles.push({
        label: role.roleName,
        value: role._id,
        managerRole: role.managerRole,
        hasBranch: role.hasBranch,
      });
    }),
      res.body.branches?.forEach((branch) => {
        step2data.branches?.push({
          branchName: branch.name ? branch.name : "invalid",
          _id: branch._id,
        });
      });
    const step3data: MainChoosesValues = {
      mainBranchId: res.body.user.mainBranchId,
      mainRoleId: res.body.user.mainRoleId,
      manager: res.body.user.manager,
    };
    this.setState({ step1: step1Data, step2: step2data, step3: step3data });
  } else {
    Swal.fire('Error', getErrorMessage(res.error.error),'error');
  }
  }
  async getUserRolePermissions() {
    const RolesAndBranches = await getUserRolesAndBranches();
    const labeldRoles: Array<object> = [];
    const labeldBranches: Array<object> = [];
    if (RolesAndBranches[0].status === "success") {
      RolesAndBranches[0].body.roles.forEach((role) => {
        labeldRoles.push({
          label: role.roleName,
          hasBranch: role.hasBranch,
          managerRole: role.managerRole,
          value: role._id,
        });
      });
      this.setState({
        loading: false,
        rolesLabeled: labeldRoles,
      });
    } else {
      Swal.fire("Error !", getErrorMessage(RolesAndBranches[0].error.error), "error");
      this.setState({
        loading: false,
      });
    }
    if (RolesAndBranches[1].status === "success") {
      RolesAndBranches[1].body.data.data.forEach((branch) => {
        labeldBranches.push({
          _id: branch._id,
          branchName: branch.name ? branch.name : "invalid",
        });
      });
      this.setState({
        branchesLabeled: labeldBranches,
      });
    } else {
      Swal.fire("Error !", getErrorMessage(RolesAndBranches[1].error.error), "error");
    }
  }
  componentDidMount() {
    if (this.props.edit) {
      this.setState({ loading: true }, () => this.getUser());
    }
    this.setState({ loading: true }, () => this.getUserRolePermissions());
  }

  cancel(): void {
    this.setState({
      step: 1,
      step1: initialStep1,
      step2: initialStep2,
      step3: initialStep3,
    });
    this.props.history.goBack();
  }
  previousStep(step: number): void {
    this.setState({
      step: step - 1,
    } as State);
  }
  prepareUser(values: object) {
    this.setState({ step3: values } as any);
    const labeledBranches = this.state.step2.branches;
    const labeledRoles = this.state.step2.roles;
    const branches: string[] = labeledBranches.map((branch) => {
      return branch._id;
    });

    const roles: string[] = labeledRoles.map((role) => {
      return role.value;
    });
    const userObj: User = {
      userInfo: this.getUserInfo(),
      roles,
      branches,
      mainRoleId: this.state.step3.mainRoleId,
      mainBranchId: this.state.step3.mainBranchId,
      manager: this.state.step3.manager,
    };
    const user = {
      ...userObj.userInfo,
      branches: userObj.branches,
      roles: userObj.roles,
      mainRoleId: userObj.mainRoleId,
      mainBranchId: userObj.mainBranchId,
      manager: userObj.manager,
    };
    user.birthDate = new Date(user.birthDate).valueOf();
    user.hiringDate = new Date(user.hiringDate).valueOf();
    user.nationalIdIssueDate = new Date(user.nationalIdIssueDate).valueOf();
    return user;
  }
  async createUser(user) {
    this.setState({ loading: true });
    const res = await createUser({ user });
    this.setState({ loading: false });
    if (res.status === "success") {
      Swal.fire("success", local.userCreated).then(() => {
        this.props.history.goBack();
      });
    } else {
      Swal.fire("Error !", getErrorMessage(res.error.error), 'error');
    }
  }
  async editUser(user) {
    const id = this.props.history.location.state.details;
    this.setState({ loading: true });
    const res = await editUser(user, id);
    if (res.status === "success") {
      this.setState({ loading: false });
      Swal.fire("success", local.userEdited).then(() => {
        this.props.history.goBack();
      });
    } else {
      this.setState({ loading: false }, ()=> Swal.fire('Error !', getErrorMessage(res.error.error),'error'));
    }
  }
  submit = async (values: any) => {
    if (this.state.step === 1) {
      this.setState({
        [`step${this.state.step}`]: values,
        step: this.state.step + 1,
      } as any);
    } else if (this.state.step === 3) {
      const user = this.prepareUser(values);
      if (this.props.edit) {
        await this.editUser(user);
      } else {
        await this.createUser(user);
      }
    } else {
      this.setState({
        step: 3,
      });
    }
  };

  getUserInfo(): UserInfo {
    const user = this.state.step1;
    return {
      name: user.name.trim(),
      username: user.username.trim(),
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
    };
  }

  componentWillUnmount() {
    initialStep2.roles = [];
    initialStep2.branches = [];
    initialStep3.mainRoleId = "";
    initialStep3.mainRoleId = "";
    initialStep3.manager = "";
  }
  renderStepOne(): any {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.step1}
        onSubmit={this.submit}
        validationSchema={
          this.props.edit
            ? editUserValidationStepOne
            : userCreationValidationStepOne
        }
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <UserDataForm
            {...formikProps}
            edit={this.props.edit}
            _id = {this.props.edit? this.props.history.location.state.details : ""}
            username = {this.state.username}
            nationalId= {this.state.nationalId}
            cancel={() => this.cancel()}
          />
        )}
      </Formik>
    );
  }
  renderStepTwo(): any {
    return (
      <UserRolesAndPermissionsFrom
        values={this.state.step2}
        handleSubmit={this.submit}
        userRolesOptions={this.state.rolesLabeled}
        userBranchesOptions={this.state.branchesLabeled}
        previousStep={() => this.previousStep(2)}
      />
    );
  }
  renderStepThree(): any {
    const w = this.state.step2.roles;
    const l = this.state.step2.branches;
    const labeldBranches: Array<{ label: string; value: string }> = [];
    this.state.step2.branches?.forEach((item) => {
      return labeldBranches.push({
        label: item.branchName,
        value: item._id,
      });
    });
    return (
      <UserManagerForm
        values={this.state.step3}
        roles={this.state.step2.roles}
        branches={labeldBranches}
        previousStep={() => this.previousStep(3)}
        handleSubmit={this.submit}
      />
    );
  }
  renderSteps() {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne();
      case 2:
        return this.renderStepTwo();
      case 3:
        return this.renderStepThree();
      default:
        return null;
    }
  }
  render() {
    return (
      <>
        <Loader type="fullscreen" open={this.state.loading} />
				<div className="container">
        <Card>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Wizard
              currentStepNumber={this.state.step - 1}
              stepsDescription={[
                local.userBasicStep1,
                local.userRolesStep2,
                local.userStep3,
              ]}
            />

            <Card.Body>
              {this.renderSteps()}
            </Card.Body>
          </div>
        </Card>
				</div>
      </>
    );
  }
}

export default withRouter(UserCreation);
