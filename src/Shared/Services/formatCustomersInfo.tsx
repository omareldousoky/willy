import React from "react";
import { Customer } from "./interfaces";

import * as local from "../Assets/ar.json";
import ability from "../../Mohassel/config/ability";
import {
  arabicGender,
  downloadFile,
  getErrorMessage,
  iscoreBank,
  iscoreStatusColor,
  timeToArabicDate,
  timeToDateyyymmdd,
} from "./utils";
import { Score } from "../../Mohassel/Components/CustomerCreation/customerProfile";
import { getDateAndTime } from "../../Mohassel/Services/getRenderDate";
import { Col, Form } from "react-bootstrap";
import Can from "../../Mohassel/config/Can";
import { FieldProps } from "../Components/Profile/types";

const {
  companyName,
  companyCode,
  taxCardNumber,
  commercialRegisterNumber,
  creationDate,
  businessSector,
  businessSpeciality,
  male,
  female,
  customerName,
  customerCode,
  gender,
  nationalId,
  groupLeaderName,
} = local;

interface IscoreInfo {
  score?: Score;
  getIscore?(customer: Customer): void;
  applicationStatus?: any;
}
interface CustomerInfo extends IscoreInfo {
  isLeader?: boolean;
  customerDetails: Customer;
}
interface CompanyInfo extends IscoreInfo {
  company: Customer;
}
const iscoreField = ({score, getIscore, applicationStatus, customerDetails}) => { 
  return (
    <>
      <Form.Label style={{ color: iscoreStatusColor(score?.iscore).color }}>
        {score?.iscore}{" "}
      </Form.Label>
      <Form.Label>{iscoreStatusColor(score?.iscore).status} </Form.Label>
      {score?.bankCodes &&
        score?.bankCodes.map((code, index) => (
          <Form.Label key={index}>{iscoreBank(code)}</Form.Label>
        ))}
      {score?.url && (
        <Col>
          <span
            style={{ cursor: "pointer", padding: 10 }}
            onClick={() => downloadFile(score?.url)}
          >
            {" "}
            <span
              className="fa fa-file-pdf-o"
              style={{ margin: "0px 0px 0px 5px" }}
            ></span>
            iScore
          </span>
        </Col>
      )}
      {applicationStatus &&
        ability.can("viewIscore", "customer") &&
        ![
          "approved",
          "created",
          "issued",
          "rejected",
          "paid",
          "pending",
          "canceled",
        ].includes(applicationStatus) &&
        getIscore && (
          <Col>
            <Can I="getIscore" a="customer">
              <span
                style={{ cursor: "pointer", padding: 10 }}
                onClick={() => getIscore(customerDetails)}
              >
                {" "}
                <span
                  className="fa fa-refresh"
                  style={{ margin: "0px 0px 0px 5px" }}
                ></span>
                iscore
              </span>
            </Can>
          </Col>
        )} 
    </>
)}
export const getCompanyInfo = ({
  company,
  score,
  getIscore,
  applicationStatus,
}: CompanyInfo) => {
  return [
      {
        fieldTitle: companyName,
        fieldData: company.businessName || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: companyCode,
        fieldData: company.key || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: "iScore",
        fieldData: iscoreField({score: score, customerDetails: company, applicationStatus: applicationStatus, getIscore: getIscore}),
        showFieldCondition: ability.can("viewIscore", "customer"),
      },
      {
        fieldTitle: taxCardNumber,
        fieldData: company.taxCardNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: commercialRegisterNumber,
        fieldData: company.commercialRegisterNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: creationDate,
        fieldData:
          (company.created?.at && getDateAndTime(company.created?.at)) || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: businessSector,
        fieldData: company.businessSector || "",
        showFieldCondition: true,
      },
  ];
};
export const getCustomerInfo = ({
  customerDetails,
  score,
  isLeader,
  getIscore,
  applicationStatus,
}: CustomerInfo) => {
  const {
    customerName,
    key,
    nationalId,
    birthDate,
    gender,
    nationalIdIssueDate,
    businessSector,
    businessActivity,
    businessSpeciality,
    permanentEmployeeCount,
    partTimeEmployeeCount,
    created,
    homePostalCode,
    customerHomeAddress,
    homePhoneNumber,
    faxNumber,
    mobilePhoneNumber,
  } = customerDetails;
  const info: FieldProps[] = [
    {
      fieldTitle: isLeader ? groupLeaderName : local.name,
      fieldData: customerName || "",
      showFieldCondition: true,
    },
    {
      fieldTitle: customerCode,
      fieldData: key || "",
      showFieldCondition: true,
    },
    {
      fieldTitle: "iScore",
      fieldData: iscoreField({ score: score, customerDetails: customerDetails, applicationStatus: applicationStatus, getIscore: getIscore}),
      showFieldCondition: !!score,
    },
    {
      fieldTitle: local.nationalId,
      fieldData: nationalId || "",
      showFieldCondition: true,
    },
    {
      fieldTitle: local.birthDate,
      fieldData: (birthDate && timeToArabicDate(birthDate, false)) || "",
      showFieldCondition: true,
    },
    {
      fieldTitle: creationDate,
      fieldData: created?.at ? timeToDateyyymmdd(created.at) : "",
      showFieldCondition: true,
    },
    {
      fieldTitle: local.gender,
      fieldData: (gender && arabicGender(gender)) || "",
      showFieldCondition: true,
    },
    {
      fieldTitle: local.nationalIdIssueDate,
      fieldData:
        (nationalIdIssueDate && timeToArabicDate(nationalIdIssueDate, false)) ||
        "",
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessSector,
      fieldData: businessSector || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessActivity,
      fieldData: businessActivity || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.businessSpeciality,
      fieldData: businessSpeciality || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.permanentEmployeeCount,
      fieldData: permanentEmployeeCount || 0,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.partTimeEmployeeCount,
      fieldData: partTimeEmployeeCount || 0,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.customerHomeAddress,
      fieldData: customerHomeAddress || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.postalCode,
      fieldData: homePostalCode || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.homePhoneNumber,
      fieldData: homePhoneNumber || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.faxNumber,
      fieldData: faxNumber || local.na,
      showFieldCondition: true,
    },
    {
      fieldTitle: local.mobilePhoneNumber,
      fieldData: mobilePhoneNumber || local.na,
      showFieldCondition: true,
    },
  ];

  return info;
};
