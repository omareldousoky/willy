import React, { useCallback, useState } from "react";

import { timeToArabicDate } from "../../../Shared/Services/utils";
import * as local from "../../../Shared/Assets/ar.json";

import { Button, Card } from "react-bootstrap";

import HeaderWithCards, { Tab } from "../HeaderWithCards/headerWithCards";
import { Loader } from "../../../Shared/Components/Loader";
import Can from "../../config/Can";

export const TasaheelReports = () => {
  const tabsArray = [
    // {
    //   header: "التقرير الشهري",
    //   stringKey: "monthlyReport",
    //   permission: "monthlyReport",
    //   permissionKey: "reports",
    // },
    // {
    //   header: "التقرير الربع سنوي",
    //   stringKey: "quarterlyReport",
    //   permission: "quarterlyReport",
    //   permissionKey: "reports",
    // },
    {
      header: local.tasaheelRisks,
      stringKey: "tasaheelRisks",
      permission: "tasaheelRisks",
      permissionKey: "reports",
    },
    {
      header:local.loanAge,
      stringKey: "loanAge",
      permission: "loanAge",
      permissionKey: "reports",
    },
    {
      header: local.monthlyAnalysis,
      stringKey: "monthlyAnalysis",
      permission: "monthlyAnalysis",
      permissionKey: "reports",
    },
  ];
  const [activeTab, setActiveTab] = useState<Tab>(tabsArray[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeTabIndex = useCallback(() => {
    const calculatedActiveTabIndex = tabsArray.findIndex(
      ({ stringKey }) => stringKey === activeTab.stringKey
    );
    return calculatedActiveTabIndex > -1 ? calculatedActiveTabIndex : 0;
  }, [activeTab, tabsArray]);

  const requestReport = () => {};
  return (
    <div style={{ margin: "20px 50px" }}>
        <HeaderWithCards
          header=""
          array={tabsArray}
          active={activeTabIndex()}
          selectTab={(activeTabStringKey: string) =>
            setActiveTab(
              tabsArray.find((tab) => tab.stringKey === activeTabStringKey) ||
                tabsArray[0]
            )
          }
        />

      <Card className="print-none">
        <Loader type="fullscreen" open={isLoading} />
        <Card.Body>
          <div className="custom-card-header">
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
              {activeTab.header}
            </Card.Title>
            <Can I="createIscoreFile" a="report">
              <Button
                type="button"
                variant="primary"
                onClick={() => requestReport()}
              >
                {local.requestNewreport}
              </Button>
            </Can>
          </div>

        </Card.Body>
      </Card>
    </div>
  );
};
