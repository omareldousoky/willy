import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Loader } from "../../../Shared/Components/Loader";
import * as local from "../../../Shared/Assets/ar.json";
import { getBranches } from "../../Services/APIs/Branch/getBranches";
import Swal from "sweetalert2";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getGeoAreasByBranch } from "../../Services/APIs/GeoAreas/getGeoAreas";
import { addGeoArea } from "../../Services/APIs/GeoAreas/addGeoArea";
import { updateGeoArea } from "../../Services/APIs/GeoAreas/updateGeoArea";
import { Branch } from "../../../Shared/redux/auth/types";
import { manageToolsArray } from "../Tools/manageToolsInitials";
import HeaderWithCards from "../HeaderWithCards/headerWithCards";
import Card from "react-bootstrap/Card";
import { getErrorMessage } from "../../../Shared/Services/utils";
import { customStyles, ReactSelectTheme } from "../dropDowns/allDropDowns";

interface GeoArea {
  name: string;
  disabledUi: boolean;
  _id: string;
  active: boolean;
}
interface State {
  loading: boolean;
  showModal: boolean;
  filterGeoAreas: string;
  temp: Array<string>;
  branches: Array<any>;
  branchAreas: Array<GeoArea>;
  branch: Branch;
  manageToolsTabs: any[];
}
class GeoAreas extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showModal: false,
      filterGeoAreas: "",
      temp: [],
      branches: [],
      branchAreas: [],
      branch: {
        name: "",
        _id: "",
      },
      manageToolsTabs: [],
    };
  }
  async componentDidMount() {
    this.getBranches();
    this.setState({ manageToolsTabs: manageToolsArray() });
  }
  addBranchArea() {
    if (!this.state.branchAreas.some((branchArea) => branchArea.name === "")) {
      this.setState({
        filterGeoAreas: "",
        branchAreas: [
          ...this.state.branchAreas,
          { name: "", disabledUi: false, _id: "", active: true },
        ],
        temp: [...this.state.temp, ""],
      });
    }
  }
  handleChangeInput(
    event: React.ChangeEvent<HTMLInputElement>,
    area: any,
    key
  ) {
    if (key === "name") {
      this.setState({
        branchAreas: this.state.branchAreas.map((branchArea) =>
          branchArea._id === area._id
            ? { ...branchArea, name: event.currentTarget.value }
            : branchArea
        ),
      });
    } else if (key === "active") {
      this.setState({
        branchAreas: this.state.branchAreas.map((branchArea) =>
          branchArea._id === area._id
            ? { ...branchArea, active: !branchArea.active }
            : branchArea
        ),
      });
    }
  }
  handleKeyDown(event: React.KeyboardEvent, branchArea) {
    if (event.key === "Enter") {
      this.toggleClick(branchArea, true);
    }
  }
  async toggleClick(branchArea: any, submit: boolean) {
    const areaToggled = this.state.branchAreas.filter(
      (area) => area._id === branchArea._id
    )[0];
    if (areaToggled.disabledUi === false && areaToggled.name.trim() !== "") {
      if (areaToggled._id === "") {
        //New
        this.setState({ loading: true });
        const res = await addGeoArea({
          name: areaToggled.name,
          branchId: this.state.branch._id,
          active: true,
        });
        if (res.status === "success") {
          this.setState(
            {
              // branchAreas: this.state.branchAreas.map((branchArea) => branchArea._ === index ? { ...branchArea, disabledUi: !branchArea.disabledUi } : branchArea),
              loading: false,
            },
            () => this.getBranchAreas()
          );
        } else
          this.setState({ loading: false }, () =>
            Swal.fire("Error !", getErrorMessage(res.error.error), "error")
          );
      } else {
        //Edit
        this.setState({ loading: true });
        const res = await updateGeoArea(areaToggled._id, {
          name: areaToggled.name,
          active: areaToggled.active,
          branchId: this.state.branch._id,
        });
        if (res.status === "success") {
          this.setState(
            {
              branchAreas: this.state.branchAreas.map((branchArea) =>
                branchArea._id === areaToggled._id
                  ? { ...branchArea, disabledUi: !branchArea.disabledUi }
                  : branchArea
              ),
              loading: false,
            },
            () => this.getBranchAreas()
          );
        } else
          this.setState({ loading: false }, () =>
            Swal.fire("Error !", getErrorMessage(res.error.error), "error")
          );
      }
    } else if (!submit) {
      this.setState({
        branchAreas: this.state.branchAreas.map((branchArea) =>
          branchArea._id === areaToggled._id
            ? { ...branchArea, disabledUi: !branchArea.disabledUi }
            : branchArea
        ),
      });
    }
  }
  async getBranches() {
    this.setState({ loading: true });
    const branches = await getBranches();
    if (branches.status === "success") {
      this.setState({
        branches: branches.body.data.data,
        loading: false,
      });
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire("Error !", getErrorMessage(branches.error.error), "error")
      );
    }
  }
  async getBranchAreas() {
    this.setState({ loading: true, branchAreas: [] });
    const branchAreas = await getGeoAreasByBranch(this.state.branch._id);
    if (branchAreas.status === "success") {
      const areas = branchAreas.body.data
        ? branchAreas.body.data.map((area) => ({ ...area, disabledUi: true }))
        : [];
      this.setState({
        branchAreas: areas,
        loading: false,
      });
    } else {
      this.setState(
        {
          loading: false,
        },
        () =>
          Swal.fire(
            "Error !",
            getErrorMessage(branchAreas.error.error),
            "error"
          )
      );
    }
  }
  render() {
    return (
      <>
        <HeaderWithCards
          header={local.branchAreas}
          array={this.state.manageToolsTabs}
          active={this.state.manageToolsTabs
            .map((item) => {
              return item.icon;
            })
            .indexOf("branchAreas")}
        />
        <Card>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            <Form.Group
              as={Row}
              controlId="branch"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              <Form.Label style={{ textAlign: "right" }} column sm={4}>
                {local.branch}
              </Form.Label>
              <Col sm={6}>
                <Select
                  name="branch"
                  data-qc="branch"
                  value={this.state.branch}
                  enableReinitialize={false}
                  onChange={(event: any) => {
                    this.setState({ branch: event }, () =>
                      this.getBranchAreas()
                    );
                  }}
                  type="text"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  options={this.state.branches}
                  theme={ReactSelectTheme}
                />
              </Col>
            </Form.Group>
            {this.state.branch._id.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  onClick={() => this.addBranchArea()}
                  style={{
                    margin: "auto 20px",
                    color: "#7dc356",
                    cursor: "pointer",
                  }}
                >
                  <img alt="addArea" src={require("../../Assets/plus.svg")} />
                </span>
                {this.state.branchAreas.length > 0 && (
                  <Form.Control
                    type="text"
                    data-qc="filterGeoAreas"
                    placeholder={local.search}
                    maxLength={100}
                    value={this.state.filterGeoAreas}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      this.setState({ filterGeoAreas: e.currentTarget.value })
                    }
                  />
                )}
              </div>
            )}
          </div>
          <ListGroup
            style={{ textAlign: "right", width: "30%", margin: "30px 0" }}
          >
            <Loader type="fullscreen" open={this.state.loading} />
            {this.state.branchAreas
              .filter((branchArea) =>
                branchArea.name
                  .toLocaleLowerCase()
                  .includes(this.state.filterGeoAreas.toLocaleLowerCase())
              )
              .map((branchArea, index) => {
                return (
                  <ListGroup.Item
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Group style={{ margin: "0px 0px 0px 20px" }}>
                      <Form.Control
                        type="text"
                        data-qc="branchAreaInput"
                        maxLength={100}
                        title={branchArea.name}
                        value={branchArea.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          this.handleChangeInput(e, branchArea, "name")
                        }
                        onKeyDown={(e: React.KeyboardEvent) =>
                          this.handleKeyDown(e, branchArea)
                        }
                        disabled={branchArea.disabledUi}
                        style={
                          branchArea.disabledUi
                            ? { background: "none", border: "none" }
                            : {}
                        }
                        isInvalid={
                          this.state.branchAreas[index].name.trim() === ""
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {local.required}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {branchArea.disabledUi ? (
                      <span style={{ marginLeft: 20 }}>
                        <img
                          src={
                            branchArea.active
                              ? require("../../Assets/check-circle.svg")
                              : require("../../Assets/times-circle.svg")
                          }
                        />
                      </span>
                    ) : (
                      <>
                        {branchArea._id.length > 0 && (
                          <Form.Check
                            type="checkbox"
                            data-qc={`activate${index}`}
                            label={local.active}
                            className="checkbox-label"
                            checked={
                              this.state.branchAreas.filter(
                                (area) => area._id === branchArea._id
                              )[0].active
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, branchArea, "active")
                            }
                          />
                        )}
                      </>
                    )}
                    <span
                      onClick={() =>
                        branchArea.disabledUi
                          ? this.toggleClick(branchArea, false)
                          : this.toggleClick(branchArea, true)
                      }
                      style={{
                        color: "#7dc356",
                        cursor: "pointer",
                        marginLeft: 20,
                      }}
                      data-qc="editSaveIcon"
                    >
                      <img
                        alt={branchArea.disabledUi ? "edit" : "save"}
                        src={
                          branchArea.disabledUi
                            ? require("../../Assets/editIcon.svg")
                            : require("../../Assets/save.svg")
                        }
                      />
                    </span>
                  </ListGroup.Item>
                );
              })
              .reverse()}
          </ListGroup>
        </Card>
      </>
    );
  }
}

export default GeoAreas;
