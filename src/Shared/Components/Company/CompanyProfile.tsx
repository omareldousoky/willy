import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useHistory, useLocation } from "react-router";
import { connect } from "react-redux";

import { Container } from "react-bootstrap";

import { Loader } from "../Loader";
import { InfoBox, Profile } from "../../Components";

import local from "../../Assets/ar.json";
import ability from "../../../Mohassel/config/ability";
import { getCustomerByID } from "../../../Mohassel/Services/APIs/Customer-Creation/getCustomer";
import { getIscoreSME } from "../../../Mohassel/Services/APIs/iScore/iScore";
import { getErrorMessage } from "../../Services/utils";

import { FieldProps, TabDataProps } from "../Profile/types";
import { Tab } from "../../../Mohassel/Components/HeaderWithCards/cardNavbar";
import { Customer } from "../../Services/interfaces";
import { Score } from "../../../Mohassel/Components/CustomerCreation/customerProfile";
import { getCompanyInfo } from "../../Services/formatCustomersInfo";

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
    documents
  } = local;
  const getiScores = async (id) => {
    setIsLoading(true);
    const iScores = await getIscoreSME({
      idValue: id,
      name: company?.customerName,
      productId: "002",
      idSource: "901",
    });
    if (iScores.status === "success") {
      setScore(iScores?.body?.data[0]);
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
        await getiScores(res.body.taxCardNumber);
      // await getGuaranteeedLoans(res.body);
      // await getGeoArea(res.body.geoAreaId, res.body.branchId);
    } else {
      setIsLoading(false);
      Swal.fire("Error !", getErrorMessage(res.error.error), "error");
    }
  };
  const setCompanyFields = () => company && setMainInfo(getCompanyInfo(company, score));
  useEffect(() => {
    getCompanyDetails();
  }, []);
  useEffect(() => {
    company && setCompanyFields();
    company && getiScores(company.taxCardNumber);
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
              source='company'
              loading={isLoading}
              backButtonText={viewCompany}
              editText={edit}
              editPermission={
                ability.can("updateCustomer", "customer") ||
                ability.can("updateNationalId", "customer")
              }
              editOnClick={() =>
                history.push("/company/edit-company", {
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
