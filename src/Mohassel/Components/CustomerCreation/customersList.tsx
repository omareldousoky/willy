import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DynamicTable from "../../../Shared/Components/DynamicTable/dynamicTable";
import Can from "../../config/Can";
import Search from "../../../Shared/Components/Search/search";
import { connect } from "react-redux";
import { search, searchFilters } from "../../../Shared/redux/search/actions";
import { getDateAndTime } from "../../Services/getRenderDate";
import { Loader } from "../../../Shared/Components/Loader";
import * as local from "../../../Shared/Assets/ar.json";
import { withRouter } from "react-router-dom";
import { blockCustomer } from "../../Services/APIs/blockCustomer/blockCustomer";
import ability from "../../config/ability";
import { manageCustomersArray } from "./manageCustomersInitial";
import HeaderWithCards from "../HeaderWithCards/headerWithCards";
import Swal from "sweetalert2";
import {
  getErrorMessage,
  getFullCustomerKey,
} from "../../../Shared/Services/utils";
import HalanLinkageModal from "./halanLinkageModal";

interface State {
  size: number;
  from: number;
  loading: boolean;
  manageCustomersTabs: any[];
  showHalanLinkageModal?: boolean;
  openActionsId: string;
}

interface SearchFilters {
  governorate?: string;
  name?: string;
  nationalId?: string;
  key?: number;
  code?: number;
  customerShortenedCode?: string; // For FE only
}

interface Props {
  history: any;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: SearchFilters;
  error: string;
  branchId: string;
  search: (data) => Promise<void>;
  setSearchFilters: (data) => void;
}
class CustomersList extends Component<Props, State> {
  mappers: {
    title: string;
    key: string;
    sortable?: boolean;
    render: (data: any) => void;
  }[];
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      loading: false,
      manageCustomersTabs: [],
      openActionsId: "",
    };

    this.mappers = [
      {
        title: local.customerCode,
        key: "customerCode",
        render: (data) => data.key,
      },
      {
        title: local.customerName,
        sortable: true,
        key: "name",
        render: (data) => data.customerName,
      },
      {
        title: local.nationalId,
        key: "nationalId",
        render: (data) => data.nationalId,
      },
      {
        title: local.governorate,
        sortable: true,
        key: "governorate",
        render: (data) => data.governorate,
      },
      {
        title: local.creationDate,
        sortable: true,
        key: "createdAt",
        render: (data) =>
          data.created?.at ? getDateAndTime(data.created?.at) : "",
      },
      {
        title: "",
        key: "actions",
        render: (data) => (
          <div className="position-relative">
            <button
              className="btn clickable-action"
              onClick={() =>
                this.setState({
                  openActionsId:
                    this.state.openActionsId === data._id ? "" : data._id,
                })
              }
            >
              {local.actions}
            </button>
            {this.state.openActionsId === data._id && (
              <div className="actions-list">
                {(ability.can("updateCustomer", "customer") ||
                  ability.can("updateNationalId", "customer")) && (
                  <button
                    className="btn item rounded-0"
                    onClick={() => {
                      this.props.history.push("/customers/edit-customer", {
                        id: data._id,
                      });
                    }}
                  >
                    {local.editCustomer}
                  </button>
                )}
                <Can I="getCustomer" a="customer">
                  <button
                    className="btn item rounded-0"
                    onClick={() => {
                      this.props.history.push("/customers/view-customer", {
                        id: data._id,
                      });
                    }}
                  >
                    {local.viewCustomer}
                  </button>
                </Can>
                <Can I="newClearance" a="application">
                  <button
                    className="btn item rounded-0"
                    onClick={() => {
                      this.props.history.push("/customers/create-clearance", {
                        id: data._id,
                      });
                    }}
                  >
                    {local.createClearance}
                  </button>
                </Can>
                <Can I="blockAndUnblockCustomer" a="customer">
                  <button
                    className="btn item rounded-0"
                    onClick={() => this.handleActivationClick(data)}
                  >
                    {data.blocked?.isBlocked
                      ? local.unblockCustomer
                      : local.blockCustomer}
                  </button>
                </Can>
                <button
                  className="btn item rounded-0"
                  onClick={() => this.setState({ showHalanLinkageModal: true })}
                >
                  {local.halanLinkage}
                </button>
              </div>
            )}
          </div>
        ),
      },
    ];
  }
  async handleActivationClick(data) {
    const { value: text } = await Swal.fire({
      title:
        data.blocked?.isBlocked === true
          ? local.unblockReason
          : local.blockReason,
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:
        data.blocked?.isBlocked === true
          ? local.unblockCustomer
          : local.blockCustomer,
      cancelButtonText: local.cancel,
      inputValidator: (value) => {
        if (!value) {
          return local.required;
        } else return "";
      },
    });
    if (text) {
      Swal.fire({
        title: local.areYouSure,
        text:
          data.blocked?.isBlocked === true
            ? local.customerWillBeUnblocked
            : local.customerWillBeBlocked,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText:
          data.blocked?.isBlocked === true
            ? local.unblockCustomer
            : local.blockCustomer,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        if (result.value) {
          this.setState({ loading: true });
          const res = await blockCustomer(data._id, {
            toBeBlocked: data.blocked?.isBlocked === true ? false : true,
            reason: text,
          });
          if (res.status === "success") {
            this.setState({ loading: false });
            Swal.fire(
              "",
              data.blocked?.isBlocked === true
                ? local.customerUnblockedSuccessfully
                : local.customerBlockedSuccessfully,
              "success"
            ).then(() => window.location.reload());
          } else {
            this.setState({ loading: false });
            Swal.fire("", local.searchError, "error");
          }
        }
      });
    }
  }
  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: "customer",
        branchId: this.props.branchId,
      })
      .then(() => {
        if (this.props.error) {
          Swal.fire("error", getErrorMessage(this.props.error), "error");
        }
      });
    this.setState({ manageCustomersTabs: manageCustomersArray() });
  }
  getCustomers() {
    const { searchFilters, search, error, branchId } = this.props;
    const { customerShortenedCode, key } = searchFilters;
    const { size, from } = this.state;
    search({
      ...searchFilters,
      key: !!customerShortenedCode
        ? getFullCustomerKey(customerShortenedCode)
        : key || undefined,
      size,
      from,
      url: "customer",
      branchId,
    }).then(() => {
      if (error) {
        Swal.fire("error", getErrorMessage(error), "error");
      }
    });
  }
  render() {
    return (
      <>
        <HeaderWithCards
          header={local.customers}
          array={this.state.manageCustomersTabs}
          active={this.state.manageCustomersTabs
            .map((item) => {
              return item.icon;
            })
            .indexOf("customers")}
        />
        <Card style={{ margin: "20px 50px" }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.customers}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfCustomers +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
              <div>
                <Can I="createCustomer" a="customer">
                  <Button
                    onClick={() => {
                      this.props.history.push("/customers/new-customer");
                    }}
                    className="big-button"
                    style={{ marginLeft: 20 }}
                  >
                    {local.newCustomer}
                  </Button>
                </Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={["keyword", "dateFromTo", "governorate"]}
              dropDownKeys={[
                "name",
                "nationalId",
                "key",
                "code",
                "customerShortenedCode",
              ]}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              url="customer"
              from={this.state.from}
              size={this.state.size}
              setFrom={(from) => this.setState({ from: from })}
              hqBranchIdRequest={this.props.branchId}
            />
            {this.props.data && (
              <DynamicTable
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination={true}
                data={this.props.data}
                url="customer"
                changeNumber={(key: string, number: number) => {
                  this.setState(
                    { [key]: number, openActionsId: "" } as any,
                    () => this.getCustomers()
                  );
                }}
              />
            )}
          </Card.Body>
        </Card>
        {this.state.showHalanLinkageModal && this.state.openActionsId && (
          <HalanLinkageModal
            show={this.state.showHalanLinkageModal}
            hideModal={() => this.setState({ showHalanLinkageModal: false })}
            customer={
              this.props.data.filter(
                (customer) => customer._id === this.state.openActionsId
              )[0]
            }
          />
        )}
      </>
    );
  }
  componentWillUnmount() {
    this.props.setSearchFilters({});
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  };
};

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(CustomersList));
