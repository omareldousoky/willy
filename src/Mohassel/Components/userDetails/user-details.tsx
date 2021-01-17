import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import BackButton from "../BackButton/back-button";
import * as local from "../../../Shared/Assets/ar.json";
import Card from "react-bootstrap/Card";
import "./userDetails.scss";
import UserDetailsView from "./userDetailsView";
import { getUserDetails } from "../../Services/APIs/Users/userDetails";
import { UserDateValues } from "./userDetailsInterfaces";
import Swal from "sweetalert2";
import { Loader } from "../../../Shared/Components/Loader";
import { theme } from "../../../theme";
import UserRolesView from "./userRolesView";
import { setUserActivation } from "../../Services/APIs/Users/userActivation";
import CustomersForUser from "./customersForUser";
import { CardNavBar, Tab } from "../HeaderWithCards/cardNavbar";
import Can from "../../config/Can";
import ability from "../../config/ability";
interface Props {
  history: any;
}
interface State {
  activeTab: string;
  isLoading: boolean;
  data: UserDateValues;
  tabsArray: Array<Tab>;
}
class UserDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: "userDetails",
      isLoading: false,
      tabsArray: [],
      data: {
        updated: { by: "", at: 0 },
        created: { by: "", at: 0 },
        username: "",
        name: "",
        nationalId: "",
        nationalIdIssueDate: 0,
        gender: "",
        birthDate: 0,
        branches: [],
        roles: [],
        _id: "",
        hiringDate: 0,
        hrCode: "",
        mobilePhoneNumber: "",
        mainBranchId: "",
        status: "",
        branchesObjects: [{ _id: "", name: "" }]
      }
    };
  }
  async handleActivationClick() {
    const id = this.props.history.location.state.details;
    const req = {
      id,
      status: this.state.data.status === "active" ? "inactive" : "active"
    };
    this.setState({ isLoading: true });

    const res = await setUserActivation(req);
    if (res.status === "success") {
      await this.getUserDetails();
      Swal.fire("success", `${this.state.data.username} is ${req.status} now`);
    } else {
      this.setState({ isLoading: false });
      Swal.fire("error");
    }
  }
  setUserDetails(data: any): UserDateValues {
    const user: UserDateValues = data.user;
    user.branches = data.branches?.map(branch => {
      return branch.name;
    });
    user.branchesObjects = data.branches ? data.branches : [];
    user.roles = data.roles;
    return user;
  }
  async getUserDetails() {
    const _id = this.props.history.location.state.details;
    const res = await getUserDetails(_id);
    const user = this.setUserDetails(res.body);
    if (res.status === "success") {
      this.setState({
        data: user,
        isLoading: false
      });
    } else {
      this.setState({ isLoading: false });
      Swal.fire("error", local.userDetialsError);
    }
  }
  componentDidMount() {
    const tabsToRender = [
      {
        header: local.userBasicData,
        stringKey: "userDetails"
      },
      {
        header: local.userRoles,
        stringKey: "userRoles"
      }
    ];
    if (ability.can("moveOfficerCustomers", "user")) {
      tabsToRender.push({
        header: local.customers,
        stringKey: "customersForUser"
      });
    }
    this.setState(
      {
        isLoading: true,
        tabsArray: tabsToRender
      },
      () => this.getUserDetails()
    );
  }
  renderICons() {
    const id = this.props.history.location.state.details;
    return (
      <div className={"rowContainer"}>
        <Can I="updateUser" a="user">
          <span className={"fa icon"}>
            <div
              className={"iconConatiner fa icon"}
              onClick={() => {
                this.props.history.push({
                  pathname: "/manage-accounts/users/edit-user",
                  state: { details: id }
                });
              }}
            >
              <img
                className={"iconImage"}
                alt={"edit"}
                src={require("../../Assets/editIcon.svg")}
              />
              {local.edit}
            </div>
          </span>
        </Can>
        <Can I="userActivation" a="user">
          <span className={"fa icon"}>
            <div
              onClick={async () => this.handleActivationClick()}
              className={"iconConatiner "}
            >
              {this.state.data.status === "active" && (
                <img
                  className={"iconImage"}
                  alt={"deactive"}
                  src={require("../../Assets/deactivate-user.svg")}
                />
              )}
              {this.state.data.status === "active"
                ? local.deactivate
                : local.activate}
            </div>
          </span>
        </Can>
      </div>
    );
  }
  renderTabs(): any {
    switch (this.state.activeTab) {
      case "userDetails":
        return <UserDetailsView data={this.state.data} />;
      case "userRoles":
        return <UserRolesView roles={this.state.data.roles} />;
      case "customersForUser":
        return (
          <Can I="moveOfficerCustomers" a="user">
            <CustomersForUser
              id={this.state.data._id}
              name={this.state.data.name}
              user={this.state.data}
            />
          </Can>
        );
      default:
        return null;
    }
  }
  render() {
    return (
      <>
        <div className={"rowContainer"}>
          <BackButton title={local.userDetails} />
          {this.renderICons()}
        </div>
        <Card className="card">
          <Loader type="fullsection" open={this.state.isLoading} />
          <CardNavBar
            header={"here"}
            array={this.state.tabsArray}
            active={this.state.activeTab}
            selectTab={(index: string) => this.setState({ activeTab: index })}
          />
          <Card.Body>{this.renderTabs()}</Card.Body>
        </Card>
      </>
    );
  }
}

export default withRouter(UserDetails);
