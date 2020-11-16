import React, { Component } from "react";
import Select from "react-select";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./userCreation.scss";
import * as local from "../../../Shared/Assets/ar.json";
import { theme } from "../../../theme";
import { customFilterOption } from '../../../Shared/Services/utils';
import { MainChoosesValues } from "./userCreationinterfaces";
import Button from "react-bootstrap/Button";
import { searchUsers } from "../../Services/APIs/Users/searchUsers";
import { Loader } from "../../../Shared/Components/Loader";

interface Props {
  roles: any[];
  branches: Array<{ label: string; value: string }>;
  values: MainChoosesValues;
  handleSubmit: any;
  previousStep: any;
}
interface State {
  mainBranchId: string;
  mainRoleId: string;
  managersList: any[];
  showMainRoleError: boolean;
  showMainBranchError: boolean;
  hasManager: boolean;
  hasBranch: boolean;
  manager: string;
  key: string;
  loading: boolean;
}
class UserManagerForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mainBranchId: "",
      mainRoleId: "",
      managersList: [],
      manager: "",
      showMainRoleError: false,
      showMainBranchError: false,
      hasManager: false,
      hasBranch: false,
      key: "",
      loading: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const role = props.roles.find(
      (item) => item.value === props.values.mainRoleId
    );
    const branch = props.branches.find(
      (item) => item.value === props.values.mainBranchId
    );
    if (
      props.values.mainRoleId !== state.mainRoleId &&
      state.key !== "updated"
    ) {
      return {
        mainRoleId: role?.value,
        mainBranchId: branch?.value,
        manager:
          role?.value === props.values.mainRoleId ? props.values.manager : "",
        hasBranch: role?.hasBranch,
        hasManager: props.values.manager || role?.managerRole ? true : false,
        key: "updated",
      };
    }
    return null;
  }

  componentDidMount() {
    const role = this.props.roles.find(
      (item) => item.value === this.props.values.mainRoleId && item.managerRole
    );
    if (role) this.getMangersList(role.managerRole);
  }
  async getMangersList(managerRoleId: string) {
    if (managerRoleId) {
      const obj = {
        status: "active",
        roleId: managerRoleId,
        from: 0,
        size: 1000,
      };
      this.setState({ loading: true });
      const res = await searchUsers(obj);
      const users: any[] = [];
      res.body.data.map((user: any) => {
        users.push({
          label: user.name,
          value: user._id,
        });
      });

      this.setState({ managersList: users, loading: false });
    }
  }
  render() {
    return (
      <Container className="user-role-form">
        <Form.Group className={"user-role-group"} controlId="mainRole">
          <Form.Label className={"user-role-label"}>
            {`${local.chooseMainRole} *`}
          </Form.Label>
          <Select
            styles={theme.selectStyle}
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
            name="mainRole"
            data-qc="mainRole"
            onBlur={() => {
              this.setState({ showMainRoleError: !this.state.mainRoleId });
            }}
            onFocus={() => {
              this.setState({ showMainRoleError: !this.state.mainRoleId });
            }}
            onChange={async (event: any) => {
              this.props.values.mainRoleId = event.value;
              if (event.managerRole) {
                await this.getMangersList(event.managerRole);
              }
              this.setState({
                showMainRoleError: !event,
                mainRoleId: event.value,
                hasBranch: event.hasBranch,
                hasManager: event.managerRole ? true : false,
              });
              if (!event.hasBranch) {
                (this.props.values.mainBranchId = ""),
                  this.setState({ mainBranchId: "" });
              }
            }}
            value={this.props.roles.find(
              (item) => item.value === this.state.mainRoleId
            )}
            options={this.props.roles}
          />
          {this.state.showMainRoleError && (
            <div style={{ color: "red", fontSize: "15px", margin: "10px" }}>
              {local.required}
            </div>
          )}
        </Form.Group>
        {this.props.branches?.length > 0 && this.state.hasBranch && (
          <Form.Group className={"user-role-group"} controlId="mainBranch">
            <Form.Label className={"user-role-label"}>
              {`${local.chooseMainBranch} *`}
            </Form.Label>
            <Select
              styles={theme.selectStyle}
              isSearchable={true}
              filterOption={customFilterOption}
              placeholder={
                <span style={{ width: "100%", padding: "5px", margin: "5px" }}>
                  <img
                    style={{ float: "right" }}
                    alt="search-icon"
                    src={require("../../Assets/searchIcon.svg")}
                  />{" "}
                  {local.searchByBranch}
                </span>
              }
              name="mainBranch"
              data-qc="mainBranch"
              onChange={(event: any) => {
                this.props.values.mainBranchId = event.value;
                this.setState({
                  mainBranchId: event.value,
                  showMainBranchError:
                    !event.value && this.props.branches?.length > 0,
                });
              }}
              onBlur={() => {
                this.setState({
                  showMainBranchError:
                    !this.state.mainBranchId && this.props.branches?.length > 0,
                });
              }}
              onFocus={() => {
                this.setState({
                  showMainBranchError:
                    !this.state.mainBranchId && this.props.branches?.length > 0,
                });
              }}
              value={this.props.branches?.find(
                (item) => item.value === this.state.mainBranchId
              )}
              options={this.props.branches}
            />
            {this.state.showMainBranchError && (
              <div style={{ color: "red", fontSize: "15px", margin: "10px" }}>
                {local.required}
              </div>
            )}
          </Form.Group>
        )}
        {this.state.hasManager && (
          <>
            <Loader open={this.state.loading} type="fullsection" />
            <Form.Group className={"user-role-group"} controlId="manager">
              <Form.Label className={"user-role-label"}>
                {local.chooseManager}
              </Form.Label>
              <Select
                styles={theme.selectStyle}
                isSearchable={true}
                filterOption={customFilterOption}
                placeholder={
                  <span
                    style={{ width: "100%", padding: "5px", margin: "5px" }}
                  >
                    <img
                      style={{ float: "right" }}
                      alt="search-icon"
                      src={require("../../Assets/searchIcon.svg")}
                    />{" "}
                    {local.searchByName}
                  </span>
                }
                name="manager"
                data-qc="manager"
                onChange={(event: any) => {
                  this.props.values.manager = event.value;
                  this.setState({ manager: event.value });
                }}
                value={this.state.managersList?.find(
                  (item) => item.value === this.state.manager
                )}
                options={this.state.managersList}
              />
            </Form.Group>
          </>
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
              className={"btn-submit-next"}
              disabled={
                !this.state.mainRoleId ||
                (!this.state.mainBranchId && this.state.hasBranch)
              }
              style={{ float: "left", width: "60%" }}
              type="button"
              onClick={this.props.handleSubmit}
              data-qc="submit"
            >
              {local.submit}
            </Button>
          </Col>
        </Form.Group>
      </Container>
    );
  }
}

export default UserManagerForm;
