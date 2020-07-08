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
import { customFilterOption } from "../../Services/utils";
import Container from "react-bootstrap/Container";

interface Props {
  values: RolesBranchesValues;
  userRolesOptions: Array<object>;
  userBranchesOptions: Array<object>;
  handleSubmit: any;
  previousStep: any;
  hasBranch: boolean;
}
interface State {
  hasBranch: boolean;
  showRolesError: boolean;
  showBranchesError: boolean;
  roles: Array<object>;
  branches: Array<object>;
}
class UserRolesAndPermissionsFrom extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasBranch: this.props.hasBranch,
      showBranchesError: false,
      showRolesError: false,
      roles: [],
      branches: [],
    };
  }

  isHasBranch(roles): boolean {
    let rolesState = false;
    roles.map((role, index) => {
      if (role.hasBranch === true) {
        rolesState = true;
        return;
      }
    });
    return rolesState;
  }
  handleChange(list) {
    this.props.values.branches = list;
    if (this.state.hasBranch && list.length === 0) {
      this.setState({ showBranchesError: true, branches: [] });
    } else {
      this.setState({ showBranchesError: false, branches: list });
    }
  }

  render() {
    console.log(this.state.branches, this.props.values.branches);
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
              this.setState({
                hasBranch: this.isHasBranch(event),
                showRolesError: !event ? true : false,
              });

              this.setState(event);
              this.props.values.roles = event;
              if (!this.state.hasBranch || !event) {
                this.props.values.branches = [];
              }

              this.setState({ showBranchesError: !this.isHasBranch(event) });
            }}
            value={this.props.values.roles}
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
              selected={this.state.branches}
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
                (this.props.values.branches?.length === 0 &&
                  this.state.hasBranch) ||
                this.state.showBranchesError
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
