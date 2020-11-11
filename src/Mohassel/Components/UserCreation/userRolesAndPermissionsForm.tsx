import React, { Component } from "react";
import "./userCreation.scss";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as local from "../../../Shared/Assets/ar.json";
import Select from "react-select";
import { theme } from "../../../theme";
import { RolesBranchesValues } from "./userCreationinterfaces";
import DualBox from "../DualListBox/dualListBox";
import { customFilterOption } from '../../../Shared/Services/utils';
import Container from "react-bootstrap/Container";

interface Props {
  values: RolesBranchesValues;
  userRolesOptions: Array<object>;
  userBranchesOptions: Array<object>;
  handleSubmit: any;
  previousStep: any;
}
interface State {
  hasBranch: boolean;
  showRolesError: boolean;
  showBranchesError: boolean;
  roles: Array<object>;
  branches: Array<object>;
  key: string;
}
class UserRolesAndPermissionsFrom extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasBranch: false,
      showBranchesError: false,
      showRolesError: false,
      roles: [],
      branches: [],
      key: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.values.roles !== state.roles && state.key !== "updated") {
      let rolesState = false;
      props.values.roles?.map((role, index) => {
        if (role.hasBranch === true) {
          rolesState = true;
          return;
        }
      });
      return {
        roles: props.values.roles,
        branches: props.values.branches,
        hasBranch: rolesState,
        key: "updated",
      };
    }
    return null;
  }
  isHasBranch(roles): boolean {
    let rolesState = false;
    roles?.map((role, index) => {
      if (role.hasBranch === true) {
        rolesState = true;
        return;
      }
    });
    return rolesState;
  }
  handleChange(list) {
    this.props.values.branches = list;
    this.setState({ branches: list });
    if (this.state.hasBranch && list.length === 0) {
      this.setState({ showBranchesError: true });
    } else {
      this.setState({ showBranchesError: false });
    }
  }

  render() {
    return (
      <Container className="user-role-form">
        <Form.Group className={"user-role-group"} controlId="roles">
          <Form.Label className={"user-role-label"}>
            {local.selectUserPermission}
          </Form.Label>
          <Select
            styles={theme.selectStyle}
            isMulti
            isSearchable={true}
            filterOption={customFilterOption}
            placeholder={
              <span style={{ width: "100%", padding: "5px", margin: "5px" }}>
                <img
                  style={{ float: "right" }}
                  alt="search-icon"
                  src={require("../../Assets/searchIcon.svg")}
                />{" "}
                {local.searchByUserRole}
              </span>
            }
            name="roles"
            data-qc="roles"
            onChange={(event: any) => {
              this.props.values.roles = event;
              const check = this.isHasBranch(event);
              this.setState({
                hasBranch: check,
                showRolesError: !event ? true : false,
              });
              this.props.values.roles = event;
              this.setState({ roles: event });

              if (!this.state.hasBranch || !event) {
                this.props.values.branches = [];
                this.setState({ branches: [] });
              }

              this.setState({
                showBranchesError: check && !this.props.values.branches,
              });
            }}
            value={this.state.roles}
            options={this.props.userRolesOptions}
          />
          {this.state.showRolesError && (
            <div style={{ color: "red", fontSize: "15px", margin: "10px" }}>
              {local.rolesIsRequired}
            </div>
          )}
        </Form.Group>
        {this.state.hasBranch && (
          <Form.Group className={"user-role-group"} controlId={"branches"}>
            <Form.Label className={"user-role-label"}>
              {local.branch}
            </Form.Label>
            {this.state.showBranchesError && (
              <div style={{ color: "red", fontSize: "15px", margin: "10px" }}>
                {local.branchIsRquired}
              </div>
            )}
            <DualBox
              labelKey={"branchName"}
              filterKey={"noKey"}
              selected={this.props.values.branches}
              onChange={(list) => {
                this.handleChange(list);
              }}
              rightHeader={local.allBranches}
              leftHeader={local.selectedBranches}
              options={this.props.userBranchesOptions}
            />
          </Form.Group>
        )}
        <Form.Group as={Row}>
          <Col>
            <Button
              className={"btn-cancel-prev"}
              style={{ width: "60%" }}
              data-qc="previous"
              onClick={() => {
                this.props.previousStep(this.props.values);
              }}
            >
              {local.previous}
            </Button>
          </Col>
          <Col>
            <Button
              disabled={
                this.state.showRolesError ||
                this.state.showBranchesError ||
                (this.state.hasBranch &&
                  this.props.values.branches?.length === 0)
              }
              className={"btn-submit-next"}
              style={{ float: "left", width: "60%" }}
              type="button"
              onClick={this.props.handleSubmit}
              data-qc="submit"
            >
              {local.next}
            </Button>
          </Col>
        </Form.Group>
      </Container>
    );
  }
}

export default UserRolesAndPermissionsFrom;
