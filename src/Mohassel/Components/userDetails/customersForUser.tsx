import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Can from "../../config/Can";
import * as local from "../../../Shared/Assets/ar.json";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormCheck from "react-bootstrap/FormCheck";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Loader } from "../../../Shared/Components/Loader";
import { LoanOfficersDropDown } from "../dropDowns/allDropDowns";
import { searchCustomer } from "../../Services/APIs/Customer-Creation/searchCustomer";
import { moveCustomerToOfficer } from "../../Services/APIs/Customer-Creation/moveCustomerToOfficer";
import Swal from "sweetalert2";
import Pagination from "../pagination/pagination";
import { getBranches } from "../../Services/APIs/Branch/getBranches";
import Select from "react-select";
import { UserDateValues } from "./userDetailsInterfaces";

interface Props {
  id: string;
  name: string;
  user: UserDateValues;
}
interface Customer {
  customerName?: string;
  key?: number;
  _id?: string;
  branchId?: string;
}
interface State {
  customers: Array<Customer>;
  selectedCustomers: Array<Customer>;
  totalCustomers: number;
  size: number;
  from: number;
  loading: boolean;
  openModal: boolean;
  selectedLO: { _id?: string } | undefined;
  filterCustomers: string;
  branches: Array<Branch>;
  branch: any;
  moveMissing: boolean;
}
interface Branch {
  _id: string;
  name: string;
}
class CustomersForUser extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      size: 10,
      from: 0,
      selectedCustomers: [],
      totalCustomers: 0,
      loading: false,
      openModal: false,
      selectedLO: {},
      filterCustomers: "",
      branches: [],
      branch: this.props.user.branchesObjects
        ? this.props.user.branchesObjects[0]
        : null,
        moveMissing: false
    };
    this.getBranches();
  }
  async getBranches() {
    const branches = await getBranches();
    if (branches.status === "success") {
      this.setState(
        {
          branches: branches.body.data.data,
          loading: false
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("", local.searchError, "error");
    }
  }
  componentDidMount() {
    this.getCustomersForUser();
  }
  async getCustomersForUser(name?: string) {
    this.setState({ loading: true });
    const res = await searchCustomer({
      name: name,
      size: this.state.size,
      from: this.state.from,
      representativeId: this.props.id
    });
    if (res.status === "success") {
      this.setState({
        totalCustomers: res.body.totalCount ? res.body.totalCount : 0,
        customers: res.body.data,
        loading: false
      });
    } else this.setState({ loading: false });
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      // const newselectedReviewedLoans: Array<string> = this.state.customers.map(loanItem => loanItem.id);
      this.setState({ selectedCustomers: this.state.customers });
    } else this.setState({ selectedCustomers: [] });
  }
  addRemoveItemFromChecked(customer: Customer) {
    if (
      this.state.selectedCustomers.findIndex(
        selectedCustomer => selectedCustomer._id == customer._id
      ) > -1
    ) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(
          el => el._id !== customer._id
        )
      });
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, customer]
      });
    }
  }
  async submit() {
    this.setState({ loading: true, openModal: false });
    const data: {
      user: string;
      newUser: string | undefined;
      customers: Array<string | undefined>;
      [k: string]: any;
    } = {
      user: this.props.id,
      newUser: this.state.selectedLO ? this.state.selectedLO._id : "",
      customers: this.state.selectedCustomers.map(customer => customer._id)
    };
    if (this.state.branch._id !== this.props.user.branchesObjects[0]._id) {
      data.branchId = this.state.branch._id;
    }
    if(this.state.moveMissing===true ){
      data.moveMissing = true;
    }
    const res = await moveCustomerToOfficer(data);
    if (res.status === "success") {
      this.setState({ loading: false });
      Swal.fire(
        "",
        `${local.doneMoving} (${this.state.selectedCustomers.length}) ${local.customerSuccess}`,
        "success"
      ).then(() => {
        this.setState({ openModal: false, moveMissing: false  }, () => this.getCustomersForUser());
      });
    } else {
      if (res.error && res.error.error === "move_missing_customers") {
        this.setState({ loading: false }, () => {
          Swal.fire({
            title: "",
            text: "هذا العميل مربوط بعملاء اخرين سيتم نقلهم ايضا",
            icon: "warning",
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'تأكيد',
            cancelButtonText: 'إلغاء'
          }).then(value => {
            if (value.value) {
              this.setState({ loading: false, moveMissing: true }, () =>
                this.submit()
              );
            }
          });
        });
      } else this.setState({ loading: false });
    }
  }
  render() {
    return (
      <>
        <div className="custom-card-header">
          <Loader open={this.state.loading} type="fullsection" />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
              {local.customers}
            </Card.Title>
            <span className="text-muted">
              {local.noOfCustomers + ` (${this.state.totalCustomers})`}
            </span>
          </div>
          <div>
            <Can I="moveOfficerCustomers" a="user">
              <Button
                onClick={() => {
                  this.setState({ openModal: true });
                }}
                disabled={!Boolean(this.state.selectedCustomers.length)}
                className="big-button"
                style={{ marginLeft: 20 }}
              >
                {local.changeRepresentative}{" "}
                <span className="fa fa-exchange-alt"></span>
              </Button>
            </Can>
          </div>
        </div>
        <InputGroup style={{ direction: "ltr", margin: "20px 0" }}>
          <Form.Control
            value={this.state.filterCustomers}
            style={{ direction: "rtl", borderRight: 0, padding: 22 }}
            placeholder={local.searchByName}
            onChange={e => {
              this.setState({ filterCustomers: e.currentTarget.value });
            }}
            onKeyPress={async event => {
              if (event.key === "Enter") {
                this.getCustomersForUser(this.state.filterCustomers);
              }
            }}
          />
          <InputGroup.Append>
            <InputGroup.Text style={{ background: "#fff" }}>
              <span className="fa fa-search fa-rotate-90"></span>
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        {this.state.totalCustomers > 0 ? (
          <Table striped hover style={{ textAlign: "right" }}>
            <thead>
              <tr>
                <th>
                  <FormCheck
                    type="checkbox"
                    onClick={e => this.checkAll(e)}
                  ></FormCheck>
                </th>
                <th>{local.customerCode}</th>
                <th>{local.customerName}</th>
                <th>{local.representative}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map((customer, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <FormCheck
                        type="checkbox"
                        checked={this.state.selectedCustomers.includes(
                          customer
                        )}
                        onChange={() => this.addRemoveItemFromChecked(customer)}
                      ></FormCheck>
                    </td>
                    <td>{customer.key}</td>
                    <td>{customer.customerName}</td>
                    <td>{this.props.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <img
              alt="no-data-found"
              src={require("../../Assets/no-results-found.svg")}
            />
            <h4>{local.noResultsFound}</h4>
          </div>
        )}
        <Modal
          size="lg"
          show={this.state.openModal}
          centered
          onHide={() => this.setState({ openModal: false, moveMissing: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: " 0 auto" }}>
              {local.chooseRepresentative}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ padding: "10px 40px" }}>
              <Col sm={12}>
                <Select
                  placeholder={local.chooseBranch}
                  name="branch"
                  data-qc="branch"
                  value={this.state.branch}
                  enableReinitialize={false}
                  onChange={event => {
                    if (!event)
                      this.setState({ branch: event, selectedLO: event });
                    else
                      this.setState({ branch: event });
                  }}
                  type="text"
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option._id}
                  options={this.state.branches}
                  isClearable={true}
                />
              </Col>
            </Row>
            <Row style={{ padding: "10px 40px" }}>
              <Col sm={12}>
                <LoanOfficersDropDown
                  onSelectLoanOfficer={LO => {
                    if (LO) this.setState({ selectedLO: LO });
                    else this.setState({ selectedLO: {} });
                  }}
                  excludeId={this.props.id}
                  branchId={this.state.branch ? this.state.branch._id : ""}
                  sameBranch={
                    this.state.branch
                      ? this.state.branch._id ===
                        this.props.user.branchesObjects[0]._id
                      : false
                  }
                />
              </Col>
            </Row>
            <Row style={{ padding: "10px 40px", justifyContent: "center" }}>
              <Col sm={3}>
                <Button
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => this.submit()}
                  disabled={
                    (this.state.selectedLO
                      ? !Boolean(this.state.selectedLO._id)
                      : true) || this.state.branch === null
                  }
                  variant="primary"
                >
                  {local.submit}
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
        <Pagination
          totalCount={this.state.totalCustomers}
          pagination={true}
          dataLength={this.state.customers.length}
          changeNumber={(key: string, number: number) => {
            this.setState({ [key]: number } as any, () =>
              this.getCustomersForUser()
            );
          }}
        />
      </>
    );
  }
}
export default CustomersForUser;
