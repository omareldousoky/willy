import React, { Component } from 'react'
import { getCookie } from '../../Services/getCookie';
import Search from '../Search/search';
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import FormCheck from "react-bootstrap/FormCheck";
import InputGroup from "react-bootstrap/InputGroup";
import { searchLoanOfficer } from "../../Services/APIs/LoanOfficers/searchLoanOfficer";
import { parseJwt } from '../../Services/utils';
import { Loader } from '../../../Shared/Components/Loader';
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import * as local from "../../../Shared/Assets/ar.json";
import { LoanOfficersDropDown } from "../dropDowns/allDropDowns";
import Swal from "sweetalert2";
import Pagination from "../pagination/pagination";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Can from "../../config/Can";
import { searchCustomer } from "../../Services/APIs/Customer-Creation/searchCustomer";
import { moveCustomerToOfficer } from "../../Services/APIs/Customer-Creation/moveCustomerToOfficer";
import { manageCustomersArray } from '../CustomerCreation/manageCustomersInitial';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
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
    openModal: boolean;
    selectedLO: { _id?: string; name?: string } | undefined;
    newSelectedLO: { _id?: string; name?: string } | undefined;
    filterCustomers: string;
    LoanOfficerSelectLoader: boolean;
    moveMissing: boolean;
    LoanOfficerSelectOptions: Array<any>;
    activeLoanOfficerSelectOptions: Array<any>;
    loading: boolean;
    manageCustomersTabs: any[];

}

export class MoveCustomers extends Component<{}, State>  {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selectedCustomers: [],
            totalCustomers: 0,
            size: 10,
            from: 0,
            loading: false,
            filterCustomers: "",
            openModal: false,
            selectedLO: {},
            newSelectedLO: {},
            moveMissing: false,
            LoanOfficerSelectLoader: false,
            LoanOfficerSelectOptions: [],
            activeLoanOfficerSelectOptions: [],
            manageCustomersTabs: []
        }
    }
    componentDidMount() {
        this.setState({ LoanOfficerSelectLoader: true });
        this.getLoanOfficers("")
        this.setState({ manageCustomersTabs: manageCustomersArray() })

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
    async getLoanOfficers(searchKeyWord: string) {
        const token = getCookie('token');
        const tokenData = parseJwt(token);
        const res = await searchLoanOfficer({ name: searchKeyWord, from: this.state.from, size: 1000, branchId: tokenData.branch })
        if (res.status === "success") {
            this.setState({
                LoanOfficerSelectLoader: false,
                LoanOfficerSelectOptions: res.body.data
            })
        } else {
            this.setState({
                LoanOfficerSelectLoader: false,
                LoanOfficerSelectOptions: []
            })
        }
        const activeRes = await searchLoanOfficer({ name: searchKeyWord, from: this.state.from, size: 1000, branchId: tokenData.branch, status: 'active' })
        if (activeRes.status === "success") {
            this.setState({
                activeLoanOfficerSelectOptions: activeRes.body.data
            })
        } else {
            this.setState({
                activeLoanOfficerSelectOptions: []
            })
        }
    }

    async submit() {
        this.setState({ loading: true, openModal: false });
        const res = await this.moveCustomers();
        if (res.status === "success") {
            this.setState({ loading: false, newSelectedLO: {}, filterCustomers: "" });
            Swal.fire(
                "",
                `${local.doneMoving} ${
                this.state.moveMissing
                    ? local.customersSuccess
                    : this.state.selectedCustomers.length + " " + local.customerSuccess
                }`,
                "success"
            ).then(() => {
                this.setState(
                    { openModal: false, moveMissing: false, selectedCustomers: [] },
                    () => this.getCustomersForUser()
                );
            });
        } else if (res.error && res.error.error === "move_missing_customers") {
            this.setState({ loading: false }, () => {
                Swal.fire({
                    title: "",
                    text: local.thisUserIsAsiggnedToOtherCustomers,
                    icon: "warning",
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: local.submit,
                    cancelButtonText: local.cancel,
                }).then(value => {
                    if (value.value) {
                        this.setState({ loading: false, moveMissing: true }, () =>
                            this.submit()
                        );
                    }
                });
            });
        }
        else {
            this.setState({ loading: false }, () => {
                Swal.fire("error", local.errorOnMovingCustomers);
            })

        }
    }
    async moveCustomers() {
        const data = {
            user: this.state.selectedLO?._id,
            newUser: this.state.newSelectedLO?._id,
            customers: this.state.selectedCustomers.map(customer => customer._id),
            moveMissing: this.state.moveMissing,
        }
        return await moveCustomerToOfficer(data);
    }
    async getCustomersForUser(name?: string) {
        this.setState({ loading: true });
        const res = await searchCustomer({
            name: name,
            size: this.state.size,
            from: this.state.from,
            representativeId: this.state.selectedLO?._id,
        });
        if (res.status === "success") {
            this.setState({
                totalCustomers: res.body.totalCount ? res.body.totalCount : 0,
                customers: res.body.data,
                loading: false
            });
        } else this.setState({ loading: false });
    }
    render() {

        return (
            <>
                <HeaderWithCards
                    header={local.customers}
                    array={this.state.manageCustomersTabs}
                    active={this.state.manageCustomersTabs.map(item => { return item.icon }).indexOf('changeOfficer')}
                />
                <Card style={{ textAlign: 'right' }}>
                    <Card.Body>
                        <>
                            <Form.Group className="data-group" id="currentLoanOfficer">
                                <Form.Label className="data-label">{local.chooseCurrentLoanOfficer}</Form.Label>
                                <LoanOfficersDropDown
                                    id="currentLoanSelect"
                                    onSelectLoanOfficer={LO => {
                                        if (LO) this.setState({ selectedLO: LO }, () => this.getCustomersForUser());
                                        else this.setState({ selectedLO: {} });
                                    }}
                                    value={this.state.selectedLO}
                                    LoanOfficerSelectLoader={this.state.LoanOfficerSelectLoader}
                                    LoanOfficerSelectOptions={this.state.LoanOfficerSelectOptions}
                                />
                            </Form.Group>
                            {this.state.selectedLO?._id &&
                                <>
                                    <div className="custom-card-header">
                                        <Loader open={this.state.loading} type="fullsection" />
                                        <Row style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }} >

                                            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                                                {local.customers}
                                            </Card.Title>
                                            <span className="text-muted">
                                                {local.noOfCustomers + ` (${this.state.totalCustomers})`}
                                            </span>
                                        </Row>
                                        <div>
                                            <Can I="changeOfficer" a="customer">
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
                                                            {<td>{this.state.selectedLO?.name}</td>}
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
                                                <Form.Label className="data-label">{local.chooseLoanOfficer}</Form.Label>
                                                <Col sm={12}>
                                                    <LoanOfficersDropDown
                                                        id="newLoanOfficerSelect"
                                                        onSelectLoanOfficer={LO => {
                                                            if (LO) this.setState({ newSelectedLO: LO });
                                                            else this.setState({ newSelectedLO: {} });
                                                        }}
                                                        value={this.state.newSelectedLO}
                                                        LoanOfficerSelectLoader={this.state.LoanOfficerSelectLoader}
                                                        LoanOfficerSelectOptions={this.state.activeLoanOfficerSelectOptions.filter(LO => LO !== this.state.selectedLO)}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row style={{ padding: "10px 40px", justifyContent: "center" }}>
                                                <Col >
                                                    <Button
                                                        style={{ width: "100%", height: "100%" }}
                                                        onClick={() => this.submit()}
                                                        disabled={false}
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
                            }
                        </>
                    </Card.Body>
                </Card >
            </>
        )
    }
}

export default MoveCustomers;
