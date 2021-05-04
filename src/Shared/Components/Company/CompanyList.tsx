import React, { useState, useEffect } from "react";
import * as local from "../../Assets/ar.json";
import ability from "../../../Mohassel/config/ability";
import { useHistory } from "react-router";
import { useDispatch, connect } from "react-redux";
import { search, searchFilters } from "../../redux/search/actions";
import Swal from "sweetalert2";
import {
  getErrorMessage,
  getFullCustomerKey,
} from "../../Services/utils";
import { getDateAndTime } from "../../../Mohassel/Services/getRenderDate";
import { manageCustomersArray } from "../../../Mohassel/Components/CustomerCreation/manageCustomersInitial";
import { Card as CardType } from "../../../Mohassel/Components/ManageAccounts/manageAccountsInitials";
import HeaderWithCards from "../../../Mohassel/Components/HeaderWithCards/headerWithCards";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DynamicTable from "../DynamicTable/dynamicTable";
import Can from "../../../Mohassel/config/Can";
import Search from "../Search/search";
import { Loader } from "../Loader";

import { CompanyListProps, TableMapperItem } from "./types";
import { Actions } from "../ActionsIconGroup/types";
import { ActionsIconGroup } from "../../Components";

const List = ({
  branchId,
  currentSearchFilters,
  data,
  error,
  loading,
  totalCount,
}: CompanyListProps) => {
  const [openActionsId, setOpenActionsId] = useState<string>("");
  const [manageCompaniesTab, setManageCompaniesTab] = useState<CardType[]>([]);
  const [from, setFrom] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const {
    actions,
    companies,
    companyCode,
    companyName,
    commercialRegisterNumber,
    creationDate,
    editCompany,
    governorate,
    newCompany,
    noOfCompanies,
    searchCompanyList,
    taxCardNumber,
    viewCompany,
  } = local;

  const history = useHistory();
  const dispatch = useDispatch();

  const getCompanies = async () => {
    const { customerShortenedCode, key } = currentSearchFilters;
    dispatch(
      search({
        ...currentSearchFilters,
        key: !!customerShortenedCode
          ? getFullCustomerKey(customerShortenedCode)
          : key || undefined,
        size,
        from,
        url: "customer",
        branchId,
        customerType: 'company'
      })
    );
    if (error) Swal.fire("error", getErrorMessage(error), "error");
  };

  useEffect(() => {
    getCompanies()
  }, [branchId, from, size]);
  
  useEffect(() => {
    dispatch(searchFilters({}))
    dispatch(
      search({
        size,
        from,
        url: 'customer',
        branchId,
        customerType: 'company',
      })
    )
    if (error) Swal.fire('error', getErrorMessage(error), 'error')
  }, []);
  const companyActions: Actions[] = [
    {
      actionTitle: editCompany,
      actionIcon: 'editIcon',

      actionPermission:
        ability.can("updateCustomer", "customer") ||
        ability.can("updateNationalId", "customer"),
      actionOnClick: (id) =>
        history.push("/company/edit-company", { id }),
    },
    {
      actionTitle: viewCompany,
      actionIcon: 'view',

      actionPermission: ability.can("getCustomer", "customer"),
      actionOnClick: (id) =>
        history.push("/company/view-company", { id }),
    },
  ];
  const tableMapper: TableMapperItem[] = [
    {
      title: companyCode,
      key: "customerCode",
      render: (data) => data.key,
    },
    {
      title: companyName,
      sortable: true,
      key: "name",
      render: (data) => data.businessName,
    },
    {
      title: taxCardNumber,
      key: "TaxCardNumber",
      render: (data) => data.taxCardNumber,
    },
    {
      title: commercialRegisterNumber,
      key: "CommercialRegisterNumber",
      render: (data) => data.commercialRegisterNumber,
    },
    {
      title: creationDate,
      sortable: true,
      key: "createdAt",
      render: (data) =>
        data.created?.at ? getDateAndTime(data.created?.at) : "",
    },
    {
      title: actions,
      key: "actions",
      // eslint-disable-next-line react/display-name
      render: (data) => (
        <ActionsIconGroup
          currentCustomerId={data._id}
          actions={companyActions}
        />
      ),
    },
  ];

  return (
    <>
      {/* <HeaderWithCards
        header={companies}
        array={manageCompaniesTab}
        active={1}
      /> */}
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {companies}
              </Card.Title>
              <span className="text-muted">
                {noOfCompanies + ` (${totalCount ? totalCount : 0})`}
              </span>
            </div>
            <div>
              <Can I="createCustomer" a="customer">
                <Button
                  onClick={() => {
                    history.push("/company/new-company");
                  }}
                  className="big-button"
                >
                  {newCompany}
                </Button>
              </Can>
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={["keyword", "dateFromTo"]}
            dropDownKeys={[
              'businessName',
              'taxCardNumber',
              'commercialRegisterNumber',
              "key",
              "code",
              "customerShortenedCode",
            ]}
            searchPlaceholder={searchCompanyList}
            url="customer"
            from={from}
            size={size}
            setFrom={(from) => setFrom(from)}
            hqBranchIdRequest={branchId}
          />
          <DynamicTable
            from={from}
            size={size}
            totalCount={totalCount}
            mappers={tableMapper}
            pagination={true}
            data={data}
            url="customer"
            changeNumber={(key: string, number: number) => {
              if (key === 'size') setSize(number)
              if (key === 'from') setFrom(number)
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};


const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    currentSearchFilters: state.searchFilters,
  };
};

export const CompanyList = connect(mapStateToProps)(List);
