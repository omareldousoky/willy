import React, { useState, useEffect } from "react";
import Select from "react-select";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./userCreation.scss";
import * as local from "../../../Shared/Assets/ar.json";
import { theme } from "../../../theme";
import { customFilterOption } from "../../Services/utils";
import { MainChoosesValues } from "./userCreationinterfaces";
import Button from "react-bootstrap/Button";
import { searchUsers } from "../../Services/APIs/Users/searchUsers";

interface Props {
  roles: any[];
  branches: Array<{ label: string; value: string }>;
  values: MainChoosesValues;
  handleSubmit: any;
  previousStep: any;
}
const UserManagerForm = (props: Props) => {
  const mainRoleValue = () => {
    return props.roles.find((item) => item.value === props.values.mainRoleId);
  };
  const mainBranchValue = () => {
    return props.branches?.find(
      (item) => item.value === props.values.mainBranchId
    );
  };

  const [mainBranchId, setMainBranchId] = useState(mainBranchValue);
  const [mainRoleId, setMainRoleId] = useState(mainRoleValue);
  const [manager, setMangerId] = useState(props.values.manager);
  const [managersList, setMangersList] = useState<Array<any>>([]);
  const [showMainRoleError, setShowMainRoleError] = useState(false);
  const [showMainBranchError, setShowMainBranchError] = useState(false);

  console.log("props", props);
  console.log("states", mainRoleId, mainBranchId);
  const mangerRoleValue = () => {
    return props.roles.find(
      (item) => item.value === mainRoleId && item.managerRole
    );
  };
  const getMangersList = async (managerRoleId: string) => {
    if (managerRoleId) {
      const obj = {
        status: "active",
        roleId: managerRoleId,
        from: 0,
        size: 1000,
      };
      const res = await searchUsers(obj);
      const users: any[] = [];
      res.body.data.map((user: any) => {
        users.push({
          label: user.name,
          value: user._id,
        });
      });
      setMangersList(users);
    }
  };
  useEffect(() => {
    const role = mangerRoleValue();
    getMangersList(role?.managerRole);
  }, [mainRoleId]);
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
            setShowMainRoleError(!mainRoleId);
          }}
          onFocus={() => {
            setShowMainRoleError(!mainRoleId);
          }}
          onChange={(event: any) => {
            props.values.mainRoleId = event.value;
            setMainRoleId(event.value);
            setShowMainRoleError(!event);
          }}
          value={mainRoleValue()}
          options={props.roles}
        />
        {showMainRoleError && (
          <div style={{ color: "red", fontSize: "15px", margin: "10px" }}>
            {local.required}
          </div>
        )}
      </Form.Group>
      {props.branches?.length > 0 && (
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
              props.values.mainBranchId = event.value;
              setMainBranchId(event.value);
              setShowMainBranchError(
                !event.value && props.branches?.length > 0
              );
            }}
            onBlur={() => {
              setShowMainBranchError(
                !mainBranchId && props.branches?.length > 0
              );
            }}
            onFocus={() => {
              setShowMainBranchError(
                !mainBranchId && props.branches?.length > 0
              );
            }}
            value={mainBranchValue()}
            options={props.branches}
          />
          {showMainBranchError && (
            <div style={{ color: "red", fontSize: "15px", margin: "10px" }}>
              {local.required}
            </div>
          )}
        </Form.Group>
      )}
      {managersList?.length > 0 && (
        <Form.Group className={"user-role-group"} controlId="manager">
          <Form.Label className={"user-role-label"}>
            {local.chooseManager}
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
                {local.searchByName}
              </span>
            }
            name="manager"
            data-qc="manager"
            onChange={(event: any) => {
              props.values.manager = event.value;
              setMangerId(event.value);
            }}
            value={managersList?.find(
              (item) => item.value === props.values.manager
            )}
            options={managersList}
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
              props.previousStep(props.values);
            }}
          >
            {local.previous}
          </Button>
        </Col>
        <Col>
          <Button
            className={"btn-submit-next"}
            disabled={
              !mainRoleId || (!mainBranchId && props.branches.length > 0)
            }
            style={{ float: "left", width: "60%" }}
            type="button"
            onClick={props.handleSubmit}
            data-qc="submit"
          >
            {local.submit}
          </Button>
        </Col>
      </Form.Group>
    </Container>
  );
};

export default UserManagerForm;
