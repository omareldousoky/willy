import React, { Component } from "react";
import { Formik, FormikProps, FormikValues } from "formik";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import * as local from "../../Assets/ar.json";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import {
  search,
  searchFilters,
  issuedLoansSearchFilters,
} from "../../redux/search/actions";
import { BranchesDropDown } from "../../../Mohassel/Components/dropDowns/allDropDowns";
import {
  getFullCustomerKey,
  parseJwt,
  timeToDateyyymmdd,
} from "../../../Shared/Services/utils";
import { getCookie } from "../../Services/getCookie";
import { getGovernorates } from "../../../Mohassel/Services/APIs/configApis/config";
import { loading } from "../../redux/loading/actions";
import { getActionsList } from "../../../Mohassel/Services/APIs/ActionLogs/getActionsList";
import Swal from "sweetalert2";
import Can from "../../../Mohassel/config/Can";

interface InitialFormikState {
  name?: string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  governorate?: string;
  status?: string;
  action?: string;
  branchId?: string;
  isDoubtful?: boolean;
  isWrittenOff?: boolean;
  printed?: boolean;
  lastDates?: 'day' | 'week' | 'month' | '';
  type?: string;
}
interface Props {
  size: number;
  from: number;
  url: string;
  roleId?: string;
  searchPlaceholder?: string;
  datePlaceholder?: string;
  hqBranchIdRequest?: string;
  status?: string;
  fundSource?: string;
  searchKeys: Array<string>;
  dropDownKeys?: Array<string>;
  issuedLoansSearchFilters: any;
  chosenStatus?: string;
  setFrom?: (from: number) => void;
  search: (data) => void;
  searchFilters: (data) => void;
  setIssuedLoansSearchFilters: (data) => void;
  setLoading: (data) => void;
  submitClassName?: string;
}
interface State {
  governorates: Array<any>;
  dropDownValue: string;
  actionsList: Array<string>;
}
class Search extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      governorates: [],
      dropDownValue: this.props.url === "actionLogs" ? "authorName" : "name",
      actionsList: [],
    };
  }
  componentDidMount() {
    if (this.props.url === "customer" && !this.props.dropDownKeys?.includes('commercialRegisterNumber')) {
      this.getGov();
    } else if (this.props.url === "actionLogs") {
      this.getActionsList();
    }
  }
  async getGov() {
    this.props.setLoading(true);
    const res = await getGovernorates();
    if (res.status === "success") {
      this.setState({ governorates: res.body.governorates });
      this.props.setLoading(false);
    } else {
      this.props.setLoading(false);
      console.log("Error getting governorates");
    }
  }
  async getActionsList() {
    this.props.setLoading(true);
    const res = await getActionsList();
    if (res.status === "success") {
      this.setState({ actionsList: res.body.data });
      this.props.setLoading(false);
    } else {
      this.props.setLoading(false);
      console.log("Error getting  actionsLogs list"); // log for purpose
    }
  }
  submit = async (values) => {
    let obj = {
      ...values,
      ...{ from: this.props.from },
      [this.state.dropDownValue]: values.keyword,
    };
    delete obj.keyword;
    const { url } = this.props;
    if (obj.hasOwnProperty("fromDate"))
      obj.fromDate = new Date(obj.fromDate).setHours(0, 0, 0, 0).valueOf();
    if (obj.hasOwnProperty("toDate"))
      obj.toDate = new Date(obj.toDate).setHours(23, 59, 59, 59).valueOf();
    if (this.props.roleId) obj.roleId = this.props.roleId;
    obj.from = 0;
    if (obj.key) obj.key = isNaN(Number(obj.key)) ? 10 : Number(obj.key);
    if (obj.code) obj.code = isNaN(Number(obj.code)) ? 10 : Number(obj.code);
    if (obj.customerKey) obj.customerKey = Number(obj.customerKey);
    if (obj.customerCode) obj.customerCode = Number(obj.customerCode);
    if (obj.customerShortenedCode) {
      if (url === "customer")
        obj.key = Number(
          getFullCustomerKey(obj.customerShortenedCode) || undefined
        );
      if (url === "application" || url === "loan" || url === "defaultingCustomers")
        obj.customerKey = Number(
          getFullCustomerKey(obj.customerShortenedCode) || undefined
        );
    }
    if (url === "loan" && obj.sort !== "issueDate") {
      obj.sort = "issueDate";
    }
    if (this.props.status) obj.status = this.props.status;
    if (this.props.fundSource) obj.fundSource = this.props.fundSource;
    if (url === "loan") this.props.setIssuedLoansSearchFilters(obj);
    if (
      url === "application" &&
      !obj.status &&
      this.props.searchKeys.includes("review-application")
    ) {
      obj.status = "reviewed";
    }
    if (url === "supervisionsGroups") {
      obj.status = this.props.chosenStatus;
    }

    if (obj.lastDates) {
      const fromDate = new Date()

      if (obj.lastDates === 'month') {
        fromDate.setMonth(fromDate.getMonth() - 1)
      } else {
        const subtractBy = obj.lastDates === 'day' ? 1 : 7
        fromDate.setDate(fromDate.getDate() - subtractBy)
      }

      obj.fromDate = fromDate.valueOf()
      obj.toDate = new Date().valueOf()
    }

    if(!['application', 'loan'].includes(url)) { delete obj.type } else { obj.type = obj.type ?  obj.type : 'micro' }
    if (url === 'customer')
      obj.customerType = this.props.dropDownKeys?.includes('commercialRegisterNumber')
        ? 'company'
        : 'individual'
    obj = this.removeEmptyArg(obj);
    this.props.setFrom ? this.props.setFrom(0) : null;
    this.props.searchFilters(obj);
    this.props.search({
      ...obj,
      from: 0,
      size: this.props.size,
      url,
      branchId: this.props.hqBranchIdRequest
        ? this.props.hqBranchIdRequest
        : values.branchId,
    });
  };
  removeEmptyArg(obj) {
    Object.keys(obj).forEach((el) => {
      if (obj[el] === "" || obj[el] === undefined) {
        delete obj[el];
      }
    });
    return obj;
  }
  getInitialState() {
    const initialState: InitialFormikState = {};
    this.props.searchKeys.forEach((searchkey) => {
      switch (searchkey) {
        case "dateFromTo":
          initialState.fromDate =
            this.props.url === "loan"
              ? timeToDateyyymmdd(this.props.issuedLoansSearchFilters.fromDate)
              : "";
          initialState.toDate =
            this.props.url === "loan"
              ? timeToDateyyymmdd(this.props.issuedLoansSearchFilters.toDate)
              : "";
        case "keyword":
          initialState.keyword =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters[this.state.dropDownValue]
              : "";
        case "governorate":
          initialState.governorate = "";
        case "status":
          initialState.status =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters.status
              : "";
        case "branch":
          initialState.branchId =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters.branchId
              : "";
        case "status-application":
          initialState.status =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters.status
              : "";
        case "review-application":
          initialState.status =
            this.props.url === "application"
              ? this.props.issuedLoansSearchFilters.status
              : "";
        case "doubtful":
          initialState.isDoubtful =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters.isDoubtful
              : false;
        case "writtenOff":
          initialState.isWrittenOff =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters.isWrittenOff
              : false;
        case "printed":
          initialState.printed = false;
        case "lastDates":
          initialState.lastDates = '';
        case "sme":
          initialState.type =
            this.props.url === "loan"
              ? this.props.issuedLoansSearchFilters.type
              : 'micro';
      }
    });
    return initialState;
  }
  viewBranchDropdown() {
    const token = getCookie("token");
    const tokenData = parseJwt(token);
    if (this.props.hqBranchIdRequest) return false;
    if (this.props.url === "application") {
      if (tokenData?.requireBranch === false) return true;
      else return false;
    } else return true;
  }

  getArValue(key: string) {
    const arDropDownValue = {
      name: local.name,
      nationalId: local.nationalId,
      key: local.code,
      code: local.partialCode,
      authorName: local.employeeName,
      customerKey: local.customerCode,
      customerCode: local.customerPartialCode,
      userName: local.username,
      hrCode: local.hrCode,
      customerShortenedCode: local.customerShortenedCode,
      businessName: local.companyName,
      taxCardNumber: local.taxCardNumber,
      commercialRegisterNumber: local.commercialRegisterNumber,
      default: "",
    };
    return arDropDownValue[key];
  }
  statusDropdown(formikProps: FormikProps<FormikValues>, index: number, array: { value: string; text: string; permission?: string; key?: string }[], field?: string, label?: string) {
    return (
      <Col key={index} sm={6} style={{ marginTop: (index < 2 ? 0 : 20) }}>
        <div className="dropdown-container">
          <p className="dropdown-label">{label || local.status}</p>
          <Form.Control
            as="select"
            className="dropdown-select"
            data-qc="status"
            value={field ? formikProps.values[field] : formikProps.values.status}
            onChange={(e) => {
                formikProps.setFieldValue(
                  (field ? field : "status"),
                  e.currentTarget.value
                );
            }}
          >
            {array.map(option => {
              {
                if(option.permission && option.key) {
                  return <Can I={option.permission} a={option.key}>
                  <option key={option.value} value={option.value} data-qc={option.text}>{option.text}</option>
                </Can>
                } else {
                  return <option key={option.value} value={option.value} data-qc={option.text}>{option.text}</option>
                }
              }
            })}
          </Form.Control>
        </div>
      </Col>
    )
  }
  render() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.getInitialState()}
        onSubmit={this.submit}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => (
          <Form
            onSubmit={formikProps.handleSubmit}
            style={{ padding: "10px 30px 26px 30px" }}
          >
            <Row>
              {this.props.searchKeys.map((searchKey, index) => {
                if (searchKey === "keyword") {
                  return (
                    <Col key={index} sm={6}>
                      <InputGroup>
                        {this.props.dropDownKeys &&
                          this.props.dropDownKeys.length ? (
                            <DropdownButton
                              as={InputGroup.Append}
                              variant="outline-secondary"
                              color="black"
                              title={this.getArValue(this.state.dropDownValue)}
                              id="input-group-dropdown-2"
                              data-qc="search-dropdown"
                            >
                              {this.props.dropDownKeys.map((key, index) => (
                                <Dropdown.Item
                                  key={index}
                                  data-qc={key}
                                  onClick={() => {
                                    this.setState({ dropDownValue: key });
                                    formikProps.setFieldValue("keyword", "");
                                  }}
                                >
                                  {this.getArValue(key)}
                                </Dropdown.Item>
                              ))}
                            </DropdownButton>
                          ) : null}
                        <FormControl
                          type="text"
                          name="keyword"
                          data-qc="searchKeyword"
                          onChange={formikProps.handleChange}
                          placeholder={this.props.searchPlaceholder}
                          value={formikProps.values.keyword}
                        />
                      </InputGroup>
                    </Col>
                  );
                }
                if (searchKey === "dateFromTo") {
                  return (
                    <Col key={index} sm={6} className="d-flex align-items-center">
                      <div
                        className="dropdown-container"
                        style={{ flex: 1, alignItems: "center" }}
                      >
                        <p className="dropdown-label text-nowrap border-0 align-self-stretch mr-2">
                          {this.props.datePlaceholder
                            ? this.props.datePlaceholder
                            : local.creationDate}
                        </p>
                        <span>{local.from}</span>
                        <Form.Control
                          className="border-0"
                          type="date"
                          name="fromDate"
                          data-qc="fromDate"
                          value={formikProps.values.fromDate}
                          onChange={(e) => {
                            formikProps.setFieldValue(
                              "fromDate",
                              e.currentTarget.value
                            );
                            if (e.currentTarget.value === "")
                              formikProps.setFieldValue("toDate", "");
                          }}
                          disabled={!!formikProps.values.lastDates}
                        ></Form.Control>
                        <span className="mr-1">{local.to}</span>
                        <Form.Control
                          className="border-0"
                          type="date"
                          name="toDate"
                          data-qc="toDate"
                          value={formikProps.values.toDate}
                          min={formikProps.values.fromDate}
                          onChange={formikProps.handleChange}
                          disabled={!formikProps.values.fromDate || !!formikProps.values.lastDates}
                        ></Form.Control>
                      </div>
                    </Col>
                  );
                }
                if (searchKey === "governorate") {
                  return (
                    <Col key={index} sm={6}>
                      <div
                        className="dropdown-container"
                        style={{ marginTop: 20 }}
                      >
                        <p className="dropdown-label">{local.governorate}</p>
                        <Form.Control
                          as="select"
                          name="governorate"
                          className="dropdown-select"
                          data-qc="governorate"
                          onChange={formikProps.handleChange}
                        >
                          <option value="" data-qc="all">
                            {local.all}
                          </option>
                          {this.state.governorates.map((governorate, index) => {
                            return (
                              <option
                                key={index}
                                value={governorate.governorateName.ar}
                                data-qc={governorate.governorateName.ar}
                              >
                                {governorate.governorateName.ar}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </div>
                    </Col>
                  );
                }
                if (searchKey === "employment") {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.employment}</p>
                        <Form.Control
                          as="select"
                          className="dropdown-select"
                          data-qc="employment"
                          onChange={formikProps.handleChange}
                        >
                          <option value={5} data-qc={5}>
                            5
                          </option>
                          <option value={10} data-qc={10}>
                            10
                          </option>
                        </Form.Control>
                      </div>
                    </Col>
                  );
                }
                if (searchKey === "status") {
                  return this.statusDropdown(formikProps, index, [
                    { value: "", text: local.all },
                    { value: "paid", text: local.paid },
                    { value: "issued", text: local.issued },
                    { value: "pending", text: local.pending }
                  ])
                }
                if (searchKey === "status-application") {
                  return this.statusDropdown(formikProps, index, [
                    { value: "", text: local.all },
                    { value: "underReview", text: local.underReview },
                    { value: "reviewed", text: local.reviewed },
                    { value: "secondReview", text: local.secondReviewed },
                    { value: "thirdReview", text: local.thirdReviewed },
                    { value: "approved", text: local.approved },
                    { value: "created", text: local.created },
                    { value: "rejected", text: local.rejected },
                    { value: "canceled", text: local.cancelled }
                  ])
                }
                if (searchKey === "review-application") {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.status}</p>
                        <Form.Control
                          as="select"
                          className="dropdown-select"
                          data-qc="status"
                          value={
                            formikProps.values.status
                              ? formikProps.values.status
                              : "reviewed"
                          }
                          onChange={(e) => {
                            formikProps.setFieldValue(
                              "status",
                              e.currentTarget.value
                            );
                          }}
                        >
                          <option value="reviewed" data-qc="reviewed">
                            {local.reviewed}
                          </option>
                          <Can I="thirdReview" a="application">
                            <option
                              value="secondReview"
                              data-qc="secondReviewed"
                            >
                              {local.secondReviewed}
                            </option>
                          </Can>
                        </Form.Control>
                      </div>
                    </Col>
                  );
                }
                if (searchKey === 'lastDates') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.lastDates}</p>
                        <Form.Control
                          as="select"
                          className="dropdown-select"
                          data-qc="lastDates"
                          value={formikProps.values.lastDates}
                          onChange={(e) => {
                            formikProps.setFieldValue(
                              'lastDates',
                              e.currentTarget.value
                            )

                            formikProps.setFieldValue('fromDate', '')
                            formikProps.setFieldValue('toDate', '')
                          }}
                        >
                          {[
                            { value: '', text: local.all },
                            { value: 'day', text: local.lastDay },
                            { value: 'week', text: local.lastWeek},
                            { value: 'month', text: local.lastMonth },
                          ].map(({ value, text }) => (
                            <option key={value} value={value} data-qc={value}>
                              {text}
                            </option>
                          ))}
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if (searchKey === "clearance-status") {
                  return this.statusDropdown(formikProps, index, [
                    { value: "", text: local.all },
                    { value: "underReview", text: local.underReview },
                    { value: "approved", text: local.approved },
                    { value: "rejected", text: local.rejected }
                  ])
                }
                if (searchKey === "leads-status") {
                  return this.statusDropdown(formikProps, index, [
                    { value: "", text: local.all },
                    { value: "submitted", text: local.submitted },
                    { value: "approved", text: local.approved },
                    { value: "rejected", text: local.rejected }
                  ])
                }
                if (searchKey === "defaultingCustomerStatus") {
                  return this.statusDropdown(formikProps, index, [
                    { value: "", text: local.all },
                    { value: "branchManagerReview", text: local.branchManagerReview, permission: 'branchManagerReview', key: 'legal' },
                    { value: "areaSupervisorReview", text: local.areaSupervisorReview, permission: 'areaSupervisorReview', key: 'legal' },
                    { value: "areaManagerReview", text: local.areaManagerReview, permission: 'areaManagerReview', key: 'legal' },
                    { value: "financialManagerReview", text: local.financialManagerReview, permission: 'financialManagerReview', key: 'legal' },
                  ], 'reviewer', local.reviewStatus)
                }
                if (searchKey === "branch" && this.viewBranchDropdown()) {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <BranchesDropDown
                        value={formikProps.values.branchId}
                        onSelectBranch={(branch) => {
                          formikProps.setFieldValue("branchId", branch._id);
                        }}
                      />
                    </Col>
                  );
                }
                if (searchKey === "actions") {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.transaction}</p>
                        <Form.Control
                          as="select"
                          className="dropdown-select"
                          data-qc="actions"
                          value={formikProps.values.action}
                          onChange={(e) => {
                            formikProps.setFieldValue("action", [
                              e.currentTarget.value,
                            ]);
                          }}
                        >
                          <option value="" data-qc="all">
                            {local.all}
                          </option>
                          {this.state.actionsList.map((action, index) => {
                            return (
                              <option
                                key={index}
                                value={action}
                                data-qc={action}
                              >
                                {action}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </div>
                    </Col>
                  );
                }
                if (searchKey === "doubtful") {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <Form.Group className="row-nowrap" controlId="doubtful">
                        <Form.Check
                          type="checkbox"
                          name="isDoubtful"
                          data-qc="isDoubtfulCheck"
                          checked={formikProps.values.isDoubtful}
                          onChange={(e) =>
                            formikProps.setFieldValue(
                              "isDoubtful",
                              e.currentTarget.checked
                            )
                          }
                          label={local.doubtfulLoans}
                          disabled={formikProps.values.isWrittenOff}
                        />
                      </Form.Group>
                    </Col>
                  );
                }
                if (searchKey === "writtenOff") {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <Form.Group className="row-nowrap" controlId="writtenOff">
                        <Form.Check
                          type="checkbox"
                          name="isWrittenOff"
                          data-qc="isWrittenOffCheck"
                          checked={formikProps.values.isWrittenOff}
                          onChange={(e) =>
                            formikProps.setFieldValue(
                              "isWrittenOff",
                              e.currentTarget.checked
                            )
                          }
                          label={local.writtenOffLoans}
                          disabled={formikProps.values.isDoubtful}
                        />
                      </Form.Group>
                    </Col>
                  );
                }
                if (searchKey === "printed") {
                  return (
                    <Col key={index} sm={3} style={{ marginTop: 20 }}>
                      <Form.Group className="row-nowrap" controlId="writtenOff">
                        <Form.Check
                          type="checkbox"
                          name="printed"
                          data-qc="printedCheck"
                          checked={formikProps.values.printed}
                          onChange={(e) =>
                            formikProps.setFieldValue(
                              "printed",
                              e.currentTarget.checked
                            )
                          }
                          label={local.printed}
                        />
                      </Form.Group>
                    </Col>
                  );
                }
                if (searchKey === 'legal-status') {
                  return this.statusDropdown(formikProps, index, [
                    { value: '', text: local.all },
                    {
                      value: 'firstCourtSession',
                      text: local.firstCourtSession,
                    },
                    {
                      value: 'oppositionSession',
                      text: local.oppositionSession,
                    },
                    {
                      value: 'misdemeanorAppealSession',
                      text: local.misdemeanorAppealSession,
                    },
                    {
                      value: 'oppositionAppealSession',
                      text: local.oppositionAppealSession,
                    },
                    {
                      value: 'financialManagerReview',
                      text: local.financialManagerReview,
                    },
                  ], undefined, local.judgementStatus)
                }
                if (searchKey === "sme") {
                  return (
                    <Col key={index} sm={3} style={{ marginTop: 20 }}>
                      <Form.Group className="row-nowrap" controlId="sme">
                        <Form.Check
                          type="checkbox"
                          name="sme"
                          data-qc="sme"
                          checked={formikProps.values.type === 'sme'}
                          onChange={(e) =>
                            formikProps.setFieldValue(
                              "type",
                              e.currentTarget.checked ? 'sme' : 'micro'
                            )
                          }
                          label='sme'
                        />
                      </Form.Group>
                    </Col>
                  );
                }
              })}

              <Col className="d-flex">
                <Button
                  type="submit"
                  className={`ml-auto ${this.props.submitClassName || ""}`}
                  style={{ width: 180, height: 50, marginTop: 20 }}
                  disabled={
                    formikProps.values.fromDate
                      ? !Boolean(
                        formikProps.values.fromDate &&
                        formikProps.values.toDate
                      )
                      : false
                  }
                >
                  {local.search}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    issuedLoansSearchFilters: state.issuedLoansSearchFilters,
  };
};
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    searchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
    setIssuedLoansSearchFilters: (data) =>
    dispatch(issuedLoansSearchFilters(data)),
  };
};

export default connect(mapStateToProps, addSearchToProps)(Search);
