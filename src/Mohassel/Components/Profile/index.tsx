import React from "react";

//Components
import { Loader } from "../../../Shared/Components/Loader";
import BackButton from "../BackButton/back-button";
import { CardNavBar } from "../HeaderWithCards/cardNavbar";
import DocumentsUpload from "../CustomerCreation/documentsUpload";
import DeathCertificate from '../CustomerCreation/deathCertificate';
import { CustomerCategorization } from '../../Components';

//Bootstrap Components
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { ProfileProps } from "./types";


export const Profile = ({
  loading,
  backButtonText,
  editText,
  editPermission,
  editOnClick,
  tabs,
  activeTab,
  setActiveTab,
  tabsData,
}: ProfileProps) => {
  return (
    <>
      <Loader open={loading} type="fullscreen" />
      <div className="rowContainer print-none" style={{ paddingLeft: 30 }}>
        <BackButton title={backButtonText} className="print-none" />
        {editPermission && (
          <div
            className="print-none"
            style={{ cursor: "pointer" }}
            onClick={editOnClick}
          >
            <img
              className={"iconImage"}
              alt={"edit"}
              src={require("../../Assets/editIcon.svg")}
            />
            {editText}
          </div>
        )}
      </div>
      <Card style={{ marginTop: 10 }} className="print-none">
        <CardNavBar
          array={tabs}
          active={activeTab}
          selectTab={(stringKey: string) => setActiveTab(stringKey)}
        />
        <Card.Body>
          {(activeTab === "mainInfo" ||
            activeTab === "workInfo" ||
            activeTab === "differentInfo" )&& (
              <Table
                striped
                bordered
                style={{ textAlign: "right" }}
                className="horizontal-table"
              >

                <tbody>
                  {tabsData[activeTab].map((field, index) => {
                    const { fieldTitle, fieldData, showFieldCondition } = field;
                    return (
                      showFieldCondition && (
                        <tr key={index}>
                          <td style={field.fieldTitleStyle ?? field.fieldTitleStyle}>{fieldTitle}</td>
                          <td style={field.fieldDataStyle ?? field.fieldDataStyle}>{fieldData}</td>
                        </tr>
                      )
                    );
                  })}
                </tbody>
              </Table>
            )}
          {activeTab === "customerScore" &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData,showFieldCondition } = field;
              return (
                Array.isArray(fieldData) && showFieldCondition &&(
                  <CustomerCategorization key={index} ratings={fieldData} />
                )
              );
            })}
          {activeTab === "documents" &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData , showFieldCondition} = field;
              return (
                typeof fieldData === "string" && showFieldCondition && (
                  <DocumentsUpload
                  key={index}
                    customerId={fieldData}
                    edit={false}
                    view={true}
                  />
                )
              );
            })}
          {activeTab === "reports" &&
            tabsData[activeTab].map((field) => {
              const { fieldData, showFieldCondition } = field;
              return showFieldCondition && React.isValidElement(fieldData) && fieldData;
            })}
          {activeTab === "deathCertificate" &&
            tabsData[activeTab].map((field, index) => {
              const { fieldData, showFieldCondition } = field;
              return (
                typeof fieldData === "string" && showFieldCondition &&(
                  <DeathCertificate
                  key={index}
                    edit={true}
                    view={false}
                    customerId={fieldData}
                  />)
              );
            })}
        </Card.Body>
      </Card>
    </>
  );
};
