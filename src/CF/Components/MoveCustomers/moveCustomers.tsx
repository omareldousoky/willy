import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import FormCheck from 'react-bootstrap/FormCheck'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ValueType } from 'react-select'
import { getCookie } from '../../../Shared/Services/getCookie'
import { searchLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import {
  beneficiaryType,
  getErrorMessage,
  parseJwt,
} from '../../../Shared/Services/utils'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import {
  DropDownOption,
  LoanOfficersDropDown,
} from '../../../Shared/Components/dropDowns/allDropDowns'
import Can from '../../../Shared/config/Can'
import { manageCustomersArray } from '../CustomerCreation/manageCustomersInitial'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { Customer } from '../../../Shared/Models/Customer'
import { Pagination } from '../../../Shared/Components/Common/Pagination'
import { searchCustomer } from '../../../Shared/Services/APIs/customer/searchCustomer'
import { moveCustomerToOfficer } from '../../../Shared/Services/APIs/customer/moveCustomerToOfficer'
import { LtsIcon } from '../../../Shared/Components'

interface State {
  customers: Array<Customer>
  selectedCustomers: Array<Customer>
  totalCustomers: number
  size: number
  from: number
  openModal: boolean
  selectedLO?: { _id: string; name: string }
  newSelectedLO?: { _id: string; name: string }
  filterCustomers: string
  LoanOfficerSelectLoader: boolean
  moveMissing: boolean
  LoanOfficerSelectOptions: Array<any>
  activeLoanOfficerSelectOptions: Array<any>
  loading: boolean
  manageCustomersTabs: any[]
}

class MoveCustomers extends Component<{ isCompany?: false }, State> {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      selectedCustomers: [],
      totalCustomers: 0,
      size: 10,
      from: 0,
      loading: false,
      filterCustomers: '',
      openModal: false,
      moveMissing: false,
      LoanOfficerSelectLoader: false,
      LoanOfficerSelectOptions: [],
      activeLoanOfficerSelectOptions: [],
      manageCustomersTabs: [],
    }
  }

  componentDidMount() {
    this.setState({ LoanOfficerSelectLoader: true })
    this.getLoanOfficers('')
    this.setState({ manageCustomersTabs: manageCustomersArray() })
  }

  async getLoanOfficers(searchKeyWord: string) {
    const token = getCookie('token')
    const tokenData = parseJwt(token)
    const res = await searchLoanOfficer({
      name: searchKeyWord,
      from: this.state.from,
      size: 1000,
      branchId: tokenData.branch,
    })
    if (res.status === 'success') {
      this.setState({
        LoanOfficerSelectLoader: false,
        LoanOfficerSelectOptions: res.body.data,
      })
    } else {
      this.setState(
        {
          LoanOfficerSelectLoader: false,
          LoanOfficerSelectOptions: [],
        },
        () => Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
    const activeRes = await searchLoanOfficer({
      name: searchKeyWord,
      from: this.state.from,
      size: 1000,
      branchId: tokenData.branch,
      status: 'active',
    })
    if (activeRes.status === 'success') {
      this.setState({
        activeLoanOfficerSelectOptions: activeRes.body.data,
      })
    } else {
      this.setState(
        {
          activeLoanOfficerSelectOptions: [],
        },
        () =>
          Swal.fire('Error !', getErrorMessage(activeRes.error.error), 'error')
      )
    }
  }

  async getCustomersForUser(name?: string) {
    this.setState({ loading: true })
    const res = await searchCustomer({
      name,
      size: this.state.size,
      from: this.state.from,
      representativeId: this.state.selectedLO?._id,
      customerType: this.props.isCompany ? 'company' : 'individual',
    })
    if (res.status === 'success') {
      this.setState({
        totalCustomers: res.body.totalCount ? res.body.totalCount : 0,
        customers: res.body.data,
        loading: false,
      })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  addRemoveItemFromChecked(customer: Customer) {
    if (
      this.state.selectedCustomers.findIndex(
        (selectedCustomer) => selectedCustomer._id === customer._id
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedCustomers: prevState.selectedCustomers.filter(
          (el) => el._id !== customer._id
        ),
      }))
    } else {
      this.setState(
        (prevState) =>
          ({
            selectedCustomers: [...prevState.selectedCustomers, customer],
          } as any)
      )
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState((prevState) => ({
        selectedCustomers: prevState.customers.filter(
          (customer) => customer.blocked?.isBlocked !== true
        ),
      }))
    } else this.setState({ selectedCustomers: [] })
  }

  async submit() {
    this.setState({ loading: true, openModal: false })
    const res = await this.moveCustomers()
    if (res.status === 'success') {
      this.setState({
        loading: false,
        newSelectedLO: undefined,
        filterCustomers: '',
      })
      Swal.fire(
        '',
        `${local.doneMoving} ${
          this.state.moveMissing
            ? local.customersSuccess
            : this.state.selectedCustomers.length + ' ' + local.customerSuccess
        }`,
        'success'
      ).then(() => {
        this.setState(
          { openModal: false, moveMissing: false, selectedCustomers: [] },
          () => this.getCustomersForUser()
        )
      })
    } else if (res.error && res.error.error === 'move_missing_customers') {
      this.setState({ loading: false }, () => {
        Swal.fire({
          title: '',
          text: local.thisUserIsAssignedToOtherCustomers,
          icon: 'warning',
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: local.submit,
          cancelButtonText: local.cancel,
        }).then((value) => {
          if (value.value) {
            this.setState({ loading: false, moveMissing: true }, () =>
              this.submit()
            )
          }
        })
      })
    } else {
      this.setState({ loading: false }, () => {
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      })
    }
  }

  async moveCustomers() {
    const data = {
      user: this.state.selectedLO?._id,
      newUser: this.state.newSelectedLO?._id,
      customers: this.state.selectedCustomers.map((customer) => customer._id),
      moveMissing: this.state.moveMissing,
    }
    return moveCustomerToOfficer(data)
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={this.props.isCompany ? local.companies : local.customers}
          array={this.state.manageCustomersTabs}
          active={1}
        />
        <Card className="main-card">
          <Card.Body>
            <>
              <Form.Group className="data-group p-0" id="currentLoanOfficer">
                <Form.Label className="data-label">
                  {local.chooseCurrentLoanOfficer}
                </Form.Label>
                <LoanOfficersDropDown
                  id="currentLoanSelect"
                  onSelectLoanOfficer={(LO) => {
                    if (LO)
                      this.setState(
                        { selectedLO: LO as { name: string; _id: string } },
                        () => this.getCustomersForUser()
                      )
                    else this.setState({ selectedLO: undefined })
                  }}
                  value={this.state.selectedLO as ValueType<DropDownOption>}
                  loanOfficerSelectLoader={this.state.LoanOfficerSelectLoader}
                  loanOfficerSelectOptions={this.state.LoanOfficerSelectOptions}
                />
              </Form.Group>
              {this.state.selectedLO?._id && (
                <>
                  <div className="d-flex mb-3">
                    <Loader open={this.state.loading} type="fullsection" />
                    <Col className="p-0 d-flex align-items-center">
                      <Card.Title className="mb-0">
                        {this.props.isCompany
                          ? local.companies
                          : local.customers}
                      </Card.Title>
                      <span className="text-muted pl-4">
                        {this.props.isCompany
                          ? local.noOfCompanies
                          : local.noOfCustomers}
                        {` (${this.state.totalCustomers})`}
                      </span>
                    </Col>
                    <div>
                      <Can I="changeOfficer" a="customer">
                        <Button
                          onClick={() => {
                            this.setState({ openModal: true })
                          }}
                          disabled={!this.state.selectedCustomers.length}
                          className="big-btn"
                        >
                          {local.changeRepresentative}
                          <span className="fa fa-exchange-alt" />
                        </Button>
                      </Can>
                    </div>
                  </div>
                  <InputGroup className="mb-3">
                    <InputGroup.Append>
                      <InputGroup.Text className="bg-white">
                        <LtsIcon name="search" />
                      </InputGroup.Text>
                    </InputGroup.Append>
                    <Form.Control
                      value={this.state.filterCustomers}
                      placeholder={local.searchByName}
                      onChange={(e) => {
                        this.setState({
                          filterCustomers: e.currentTarget.value,
                        })
                      }}
                      onKeyPress={async (event) => {
                        if (event.key === 'Enter') {
                          this.getCustomersForUser(this.state.filterCustomers)
                        }
                      }}
                    />
                  </InputGroup>
                  {this.state.totalCustomers > 0 ? (
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>
                            <FormCheck
                              type="checkbox"
                              onChange={(e) => this.checkAll(e)}
                              checked={
                                this.state.selectedCustomers.length ===
                                this.state.customers.filter(
                                  (customer) => !customer.blocked?.isBlocked
                                ).length
                              }
                            />
                          </th>
                          <th>{local.customerCode}</th>
                          <th>{local.customerName}</th>
                          <th>{local.representative}</th>
                          <th />
                          <th>{local.customerType}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.customers.map((customer, index) => {
                          return (
                            <tr
                              key={index}
                              className={
                                customer?.blocked?.isBlocked
                                  ? 'text-danger'
                                  : ''
                              }
                            >
                              <td>
                                <FormCheck
                                  type="checkbox"
                                  checked={this.state.selectedCustomers.includes(
                                    customer
                                  )}
                                  onChange={() =>
                                    this.addRemoveItemFromChecked(customer)
                                  }
                                  disabled={customer.blocked?.isBlocked}
                                />
                              </td>
                              <td>{customer.key}</td>
                              <td>{customer.customerName}</td>
                              <td>{this.state.selectedLO?.name}</td>
                              <td>
                                {customer.blocked?.isBlocked
                                  ? local.theCustomerIsBlocked
                                  : ''}
                              </td>
                              <td>
                                {customer.customerType &&
                                  beneficiaryType(customer.customerType)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  ) : (
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                      <img
                        alt="no-data-found"
                        src={require('../../../Shared/Assets/no-results-found.svg')}
                      />
                      <h4>{local.noResultsFound}</h4>
                    </div>
                  )}
                  <Modal
                    size="lg"
                    show={this.state.openModal}
                    centered
                    onHide={() =>
                      this.setState({ openModal: false, moveMissing: false })
                    }
                  >
                    <Modal.Header>
                      <Modal.Title className="m-auto">
                        {local.chooseRepresentative}
                      </Modal.Title>
                      <button
                        type="button"
                        className="mr-0 pr-0 close"
                        onClick={() =>
                          this.setState({
                            openModal: false,
                            moveMissing: false,
                          })
                        }
                      >
                        <span aria-hidden="true">×</span>
                        <span className="sr-only">Close</span>
                      </button>
                    </Modal.Header>
                    <Modal.Body>
                      <Col>
                        <Form.Label className="data-label">
                          {local.chooseLoanOfficer}
                        </Form.Label>
                        <Col sm={12} className="px-0">
                          <LoanOfficersDropDown
                            id="newLoanOfficerSelect"
                            onSelectLoanOfficer={(LO) => {
                              if (LO)
                                this.setState({
                                  newSelectedLO: LO as {
                                    name: string
                                    _id: string
                                  },
                                })
                              else this.setState({ newSelectedLO: undefined })
                            }}
                            value={
                              this.state
                                .newSelectedLO as ValueType<DropDownOption>
                            }
                            loanOfficerSelectLoader={
                              this.state.LoanOfficerSelectLoader
                            }
                            loanOfficerSelectOptions={this.state.activeLoanOfficerSelectOptions.filter(
                              (LO) => LO !== this.state.selectedLO
                            )}
                          />
                        </Col>
                        <Button
                          className="mt-4 w-100"
                          onClick={() => this.submit()}
                          disabled={false}
                          variant="primary"
                        >
                          {local.submit}
                        </Button>
                      </Col>
                    </Modal.Body>
                  </Modal>
                  <Pagination
                    totalCount={this.state.totalCustomers}
                    size={this.state.customers.length}
                    from={this.state.from}
                    paginationArr={[10, 100, 500, 1000]}
                    updatePagination={(key: string, number: number) => {
                      this.setState({ [key]: number } as any, () =>
                        this.getCustomersForUser()
                      )
                    }}
                  />
                </>
              )}
            </>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default MoveCustomers
