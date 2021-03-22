import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import { CardNavBar } from "../HeaderWithCards/cardNavbar";

import { FieldProps } from "../Profile/types";
import { InfoBoxProps } from "./types";

export const InfoBox = ({ info, title, boxColor }: InfoBoxProps) => {
  const [activeTabTitle, setActiveTabTitle] = useState<string>("0");
  const [currentTab, setCurrentTab] = useState<FieldProps[]>(info[0]);

  const typeOfInfoBox = info.length > 1 ? "multiTabs" : "oneTab";

  useEffect(() => setCurrentTab(info[0]), [info]);

  const getInfoRows = (info: FieldProps[], numberOfFieldsPerRow = 3) => {
    const infoRows = [
      ...Array(Math.ceil(info.length / numberOfFieldsPerRow)),
    ].map((row, index) =>
      info.slice(
        index * numberOfFieldsPerRow,
        index * numberOfFieldsPerRow + numberOfFieldsPerRow
      )
    );
    return infoRows;
  };

  const getTabs = (info: FieldProps[][]) => {
    return info.map((tab, index) => {
      const { fieldData } = tab[0];
      return {
        header: typeof fieldData === "string" ? fieldData : `Tab ${index}`,
        stringKey: index.toString(),
      };
    });
  };

  return (
    <div
      style={{
        backgroundColor: boxColor,
        padding: 15,
        border: "1px solid #e5e5e5",
        width: "100%",
      }}
    >
      {title && <h5>{title}</h5>}
      {typeOfInfoBox === "multiTabs" && (
        <CardNavBar
          array={getTabs(info)}
          active={activeTabTitle}
          selectTab={(index: number) => {
            setCurrentTab(info[index]);
            setActiveTabTitle(index.toString());
          }}
        />
      )}
      <div style={{ padding: 20 }}>
        {getInfoRows(currentTab).map((rowOfFields, index) => (
          <Form.Row key={index}>
            {rowOfFields.map((field, index) => {
              const { fieldTitle, fieldData, showFieldCondition } = field;
              return (
                showFieldCondition && (
                  <Form.Group
                    key={index}
                    as={Col}
                    md="4"
                    className="d-flex flex-column"
                  >
                    <Form.Label style={{ color: "#6e6e6e" }}>
                      {fieldTitle}
                    </Form.Label>
                    <Form.Label>{fieldData} </Form.Label>
                  </Form.Group>
                )
              );
            })}
          </Form.Row>
        ))}
      </div>
    </div>
  );
};

InfoBox.defaultProps = {
  boxColor: "#f7fff2",
  title: "",
  loading: false,
};
