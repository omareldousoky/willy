import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Can from '../../config/Can';
import * as local from '../../../Shared/Assets/ar.json';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import { Loader } from '../../../Shared/Components/Loader';
import { LoanOfficersDropDown } from '../dropDowns/allDropDowns';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { moveCustomerToOfficer } from '../../Services/APIs/Customer-Creation/moveCustomerToOfficer';
import Swal from 'sweetalert2';

interface Props {
  id: string;
  name: string;
}
interface Customer {
  customerName?: string;
  code?: number;
  _id?: string;
  branchId?: string;
}
interface State {
  customers: Array<Customer>;
  selectedCustomers: Array<Customer>;
  totalCustomers: number;
  loading: boolean;
  openModal: boolean;
  selectedLO: { _id?: string };
}
class CustomersForUser extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      selectedCustomers: [],
      totalCustomers: 0,
      loading: false,
      openModal: false,
      selectedLO: {}
    }
  }
  componentDidMount() {
    this.getCoustomersForUser();
  }
  async getCoustomersForUser() {
    this.setState({ loading: true })
    const res = await searchCustomer({ size: 1000, from: 0, representative: this.props.id })
    if (res.status === "success") {
      this.setState({
        totalCustomers: res.body.totalCount,
        customers: res.body.data,
        loading: false
      })
    } else this.setState({ loading: false })
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      // const newselectedReviewedLoans: Array<string> = this.state.customers.map(loanItem => loanItem.id);
      this.setState({ selectedCustomers: this.state.customers })
    } else this.setState({ selectedCustomers: [] })
  }
  addRemoveItemFromChecked(customer: Customer) {
    if (this.state.selectedCustomers.findIndex(selectedCustomer => selectedCustomer._id == customer._id) > -1) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(el => el._id !== customer._id),
      })
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, customer],
      })
    }
  }
  async submit() {
    this.setState({ loading: true, openModal: false });
    const res = await moveCustomerToOfficer({ user: this.props.id, newUser: this.state.selectedLO._id, customers: this.state.selectedCustomers.map(customer => customer._id) });
    console.log('asf', this.state)
    if (res.status === "success") {
      this.setState({ loading: false })
      Swal.fire("", `${local.doneMoving} (${this.state.selectedCustomers.length}) ${local.customerSuccess}`, "success").then(() => this.getCoustomersForUser());
    } else {
      this.setState({ loading: false })
      console.log(res);
    }
  }
  render() {
    return (
      <>
        <div className="custom-card-header">
          <Loader open={this.state.loading} type="fullsection" />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.customers}</Card.Title>
            <span className="text-muted">{local.noOfCustomers + ` (${this.state.totalCustomers})`}</span>
          </div>
          <div>
            <Can I='createCustomer' a='customer'><Button onClick={() => { this.setState({ openModal: true }) }} disabled={!Boolean(this.state.selectedCustomers.length)} className="big-button" style={{ marginLeft: 20 }}>{local.changeRepresentative} <span className="fa fa-exchange-alt"></span></Button></Can>
          </div>
        </div>
        <Table striped hover style={{ textAlign: 'right' }}>
          <thead>
            <tr>
              <th><FormCheck type='checkbox' onClick={(e) => this.checkAll(e)}></FormCheck></th>
              <th>{local.customerCode}</th>
              <th>{local.customerName}</th>
              <th>{local.branch}</th>
              <th>{local.representative}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.customers
              .map((customer, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <FormCheck type='checkbox'
                        checked={this.state.selectedCustomers.includes(customer)}
                        onChange={() => this.addRemoveItemFromChecked(customer)}>
                      </FormCheck>
                    </td>
                    <td>{customer.code}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.branchId}</td>
                    <td>{this.props.name}</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
        <Modal size="lg" show={this.state.openModal} centered onHide={() => this.setState({ openModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>{local.chooseRepresentative}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ padding: '10px 40px' }}>
              <Col sm={9}>
                <LoanOfficersDropDown onSelectLoanOfficer={(LO) => this.setState({ selectedLO: LO })} />
              </Col>
              <Col sm={3}>
                <Button style={{ width: '100%', height: '100%' }}
                  onClick={() => this.submit()}
                  disabled={!Boolean(this.state.selectedLO._id)}
                  variant="primary">{local.submit}</Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
export default CustomersForUser;