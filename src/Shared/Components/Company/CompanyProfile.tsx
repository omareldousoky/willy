import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useHistory, useLocation } from "react-router";
import { useDispatch, connect } from "react-redux";

import { Container } from "react-bootstrap";

import { Loader } from "../Loader";
import { InfoBox, Profile } from "../../Components";

import local from "../../Assets/ar.json";
import ability from "../../../Mohassel/config/ability";
import { getCustomerByID } from "../../../Mohassel/Services/APIs/Customer-Creation/getCustomer";
import { getIscoreCached } from "../../../Mohassel/Services/APIs/iScore/iScore";
import { getErrorMessage } from "../../Services/utils";
import { getDateAndTime } from "../../../Mohassel/Services/getRenderDate";

import { FieldProps, TabDataProps } from "../Profile/types";
import { Tab } from "../../../Mohassel/Components/HeaderWithCards/cardNavbar";
import { Customer } from "../../Services/interfaces";
import { Score } from "../../../Mohassel/Components/CustomerCreation/customerProfile";

export interface CompanyProfileProps {
  data: any;
}
export const Company = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, changeActiveTab] = useState("documents");
  const [company, setCompany] = useState<Customer>();
  const [score, setScore] = useState<Score>();
  const [mainInfo, setMainInfo] = useState<FieldProps[][]>([]);
  const location = useLocation();
  const history = useHistory();

  const {
    viewCompany,
    edit,
    documents,
    companyName,
    companyCode,
    taxCardNumber,
    commercialRegisterNumber,
    creationDate,
    governorate,
    businessActivity,
    businessSpeciality,
  } = local;
  const getCachediScores = async (id) => {
    setIsLoading(true);
    const iScores = await getIscoreCached({ nationalIds: [id] });
    if (iScores.status === "success") {
      setScore(iScores.body.data[0]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Swal.fire("Error !", getErrorMessage(iScores.error.error), "error");
    }
  };

  const getCompanyDetails = async () => {
    setIsLoading(true);
    const res = await getCustomerByID(location.state.id);
    if (res.status === "success") {
      await setCompany(res.body);
      setIsLoading(false);
      if (ability.can("viewIscore", "customer"))
        await getCachediScores(res.body.nationalId);
        // await getGuaranteeedLoans(res.body);
        // await getGeoArea(res.body.geoAreaId, res.body.branchId);
    } else {
      setIsLoading(false);
      Swal.fire("Error !", getErrorMessage(res.error.error), "error");
    }
  };
  const setCompanyFields = () => {
    if (company) {
      setMainInfo([
        [
          {
            fieldTitle: companyName,
            fieldData: company.customerName || "",
            showFieldCondition: true,
          },
          {
            fieldTitle: companyCode,
            fieldData: company.code || "",
            showFieldCondition: true,
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
            fieldTitle: governorate,
            fieldData: company.governorate || "",
            showFieldCondition: true,
          },
          {
            fieldTitle: creationDate,
            fieldData:
              (company.created?.at && getDateAndTime(company.created?.at)) ||
              "",
            showFieldCondition: true,
          },
          {
            fieldTitle: businessActivity,
            fieldData: company.businessActivity || "",
            showFieldCondition: true,
          },
          {
            fieldTitle: local.businessSpeciality,
            fieldData: company?.businessSpeciality || "",
            showFieldCondition: true,
          },
        ],
      ]);
    }
  };
  useEffect(() => {
    getCompanyDetails();
  }, []);
  useEffect(() => {
    company && setCompanyFields();
  }, [company]);

  const tabsData: TabDataProps = {
    documents: [
      {
        fieldTitle: "company id",
        fieldData: location.state.id,
        showFieldCondition: true,
      },
    ],
  };
  const tabs: Array<Tab> = [
    {
      header: documents,
      stringKey: "documents",
    },
  ];
  return (
    <Container>
      <Loader type="fullscreen" open={isLoading} />
      <div className="print-none">
        {company && (
          <div className="">
            <h3>{viewCompany}</h3>
            {mainInfo.length > 0 && <InfoBox info={mainInfo} />}
            <Profile
              loading={isLoading}
              backButtonText={viewCompany}
              editText={edit}
              editPermission={
                ability.can("updateCustomer", "customer") ||
                ability.can("updateNationalId", "customer")
              }
              editOnClick={() =>
                history.push("/companies/edit-company", {
                  id: location.state.id,
                })
              }
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={(stringKey) => changeActiveTab(stringKey)}
              tabsData={tabsData}
            />
          </div>
        )}
      </div>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
  };
};

export const CompanyProfile = connect(mapStateToProps)(Company);
