import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormCheck from 'react-bootstrap/FormCheck'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Loader } from '../../../Shared/Components/Loader'
import { getBranches } from '../../../Shared/Services/APIs/Branch/getBranches'
import * as local from '../../../Shared/Assets/ar.json'
import { UserDateValues } from './userDetailsInterfaces'
import { searchLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import { LoanOfficer } from '../../../Shared/Services/interfaces'
import { Customer } from '../../../Shared/Models/Customer'
import {
  beneficiaryType,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { theme } from '../../../Shared/theme'
import { Pagination } from '../../../Shared/Components/Common/Pagination'
import Can from '../../../Shared/config/Can'
import { LoanOfficersDropDown } from '../../../Shared/Components/dropDowns/allDropDowns'
import { moveCustomerToOfficer } from '../../../Shared/Services/APIs/customer/moveCustomerToOfficer'
import { searchCustomer } from '../../../Shared/Services/APIs/customer/searchCustomer'
import { LtsIcon } from '../../../Shared/Components'

interface Props {
  id: string
  name: string
  user: UserDateValues
}

interface Branch {
  _id: string
  name: string
}
interface State {
  customers: Array<Customer>
  selectedCustomers: Array<Customer>
  totalCustomers: number
  size: number
  from: number
  loading: boolean
  openModal: boolean
  selectedLO?: { name: string; _id: string }
  filterCustomers: string
  branches: Array<Branch>
  moveToBranch: any
  currentOfficerBranch: Branch
  moveMissing: boolean
  loanOfficerSelectLoader: boolean
  loanOfficerSelectOptions: Array<LoanOfficer>
  checkAll: boolean
}
class CustomersForUser extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      size: 10,
      from: 0,
      selectedCustomers: [],
      totalCustomers: 0,
      loading: false,
      openModal: false,
      filterCustomers: '',
      branches: [],
      moveToBranch: this.props.user.branchesObjects
        ? this.props.user.branchesObjects[0]
        : { _id: '', name: '' },
      moveMissing: false,
      loanOfficerSelectLoader: false,
      loanOfficerSelectOptions: [],
      currentOfficerBranch: this.props.user.branchesObjects
        ? this.props.user.branchesObjects[0]
        : { _id: '', name: '' },
      checkAll: false,
    }
    this.getBranches()
  }

  componentDidMount() {
    this.getCustomersForUser()
  }

  async getBranches() {
    const branches = await getBranches()
    if (branches.status === 'success') {
      this.setState(
        {
          branches: branches.body.data.data,
          loading: false,
        },
        () => this.getLoanOfficers('')
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(branches.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  // eslint-disable-next-line consistent-return
  async getCustomersForUser(name?: string) {
    this.setState({ loading: true })
    if (
      !this.props.user.branchesObjects[0]._id &&
      !this.state.currentOfficerBranch
    )
      return Swal.fire({
        title: local.errorTitle,
        text: local.chooseBranch,
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    const res = await searchCustomer({
      name,
      size: this.state.size,
      from: this.state.from,
      representativeId: this.props.id,
      branchId:
        this.state.currentOfficerBranch?._id ||
        this.props.user.branchesObjects[0]._id,
    })
    if (res.status === 'success') {
      this.setState({
        totalCustomers: res.body.totalCount ? res.body.totalCount : 0,
        customers: res.body.data,
        loading: false,
      })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
  }

  getLoanOfficers = async (searchKeyWord) => {
    this.setState({
      loanOfficerSelectLoader: true,
      loanOfficerSelectOptions: [],
      selectedLO: undefined,
    })
    if (this.state.moveToBranch && this.state.moveToBranch._id) {
      const res = await searchLoanOfficer({
        from: 0,
        size: 1000,
        name: searchKeyWord,
        status: 'active',
        branchId: this.state.moveToBranch._id,
      })
      if (res.status === 'success') {
        this.setState({
          loanOfficerSelectLoader: false,
          loanOfficerSelectOptions: res.body.data,
        })
      } else {
        this.setState(
          { loanOfficerSelectLoader: false, loanOfficerSelectOptions: [] },
          () =>
            Swal.fire({
              title: local.errorTitle,
              text: getErrorMessage(res.error.error),
              icon: 'error',
              confirmButtonText: local.confirmationText,
            })
        )
      }
    }
  }

  async submit() {
    this.setState({ loading: true, openModal: false })
    const moveToBranchId = this.state.moveToBranch?._id || ''
    const currentOfficerBranchId = this.state.currentOfficerBranch?._id
    const data: {
      user: string
      newUser: string | undefined
      customers: Array<string | undefined>
      branchId: string
      [k: string]: any
    } = {
      user: this.props.id,
      newUser: this.state.selectedLO ? this.state.selectedLO._id : '',
      customers: this.state.selectedCustomers.map((customer) => customer._id),
      branchId: moveToBranchId === currentOfficerBranchId ? '' : moveToBranchId,
    }
    if (this.state.moveMissing === true) {
      data.moveMissing = true
    }
    const res = await moveCustomerToOfficer(data)
    if (res.status === 'success') {
      this.setState({ loading: false })
      Swal.fire({
        text: `${local.doneMoving} ${
          this.state.moveMissing
            ? local.customersSuccess
            : this.state.selectedCustomers.length + ' ' + local.customerSuccess
        }`,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => {
        this.setState(
          {
            openModal: false,
            moveMissing: false,
            selectedCustomers: [],
            checkAll: false,
          },
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
      this.setState({
        loading: false,
        selectedCustomers: [],
        checkAll: false,
      })
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState((prevState) => ({
        checkAll: true,
        selectedCustomers: prevState.customers.filter(
          (customer) => customer.blocked?.isBlocked !== true
        ),
      }))
    } else this.setState({ checkAll: false, selectedCustomers: [] })
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
      this.setState((prevState) => ({
        selectedCustomers: [...prevState.selectedCustomers, customer],
      }))
    }
  }

  render() {
    return (
      <>
        <div className="d-flex justify-content-between m-3">
          <Loader open={this.state.loading} type="fullsection" />
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  this.setState({ openModal: true })
                }}
                disabled={!this.state.selectedCustomers.length}
                className="mr-4"
              >
                {local.changeRepresentative}
                <span className="fa fa-exchange-alt" />
              </Button>
            </Can>
          </div>
        </div>
        <InputGroup style={{ direction: 'ltr', margin: '20px 0' }}>
          <Form.Control
            value={this.state.filterCustomers}
            style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
            placeholder={local.searchByName}
            onChange={(e) => {
              this.setState({ filterCustomers: e.currentTarget.value })
            }}
            onKeyPress={async (event) => {
              if (event.key === 'Enter') {
                this.getCustomersForUser(this.state.filterCustomers)
              }
            }}
          />
          <InputGroup.Append>
            <InputGroup.Text style={{ background: '#fff' }}>
              <LtsIcon name="search" />
            </InputGroup.Text>
          </InputGroup.Append>
          <Col sm={12} dir="rtl" className="p-0 mt-3">
            <Select
              placeholder={local.chooseBranch}
              name="currentOfficerBranch"
              data-qc="currentOfficerBranch"
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              value={this.state.currentOfficerBranch}
              enableReinitialize={false}
              onChange={(event) => {
                if (event) {
                  const newBranch: Branch = event as Branch
                  if (
                    this.state.currentOfficerBranch?._id &&
                    newBranch._id !== this.state.currentOfficerBranch._id
                  )
                    this.setState(
                      { currentOfficerBranch: event as Branch },
                      () => this.getCustomersForUser()
                    )
                }
              }}
              type="text"
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option._id}
              options={this.props.user.branchesObjects}
              defaultValue={this.props.user.branchesObjects[0]}
            />
          </Col>
        </InputGroup>
        {this.state.totalCustomers > 0 ? (
          <Table striped hover style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th>
                  <FormCheck
                    style={{ marginRight: '-14px' }}
                    type="checkbox"
                    onChange={(e) => this.checkAll(e)}
                    checked={this.state.checkAll}
                  />
                </th>
                <th>{local.customerCode}</th>
                <th>{local.customerName}</th>
                <th>{local.representative}</th>
                <th>{local.customerType}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map((customer, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Row>
                        <FormCheck
                          type="checkbox"
                          checked={this.state.selectedCustomers.includes(
                            customer
                          )}
                          onChange={() =>
                            this.addRemoveItemFromChecked(customer)
                          }
                          disabled={customer.blocked?.isBlocked === true}
                        />
                        {customer.blocked?.isBlocked === true ? (
                          <span style={{ color: '#d51b1b' }}>
                            {local.theCustomerIsBlocked}
                          </span>
                        ) : null}
                      </Row>
                    </td>
                    <td>{customer.key}</td>
                    <td>{customer.customerName}</td>
                    <td>{this.props.name}</td>
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
          onHide={() => this.setState({ openModal: false, moveMissing: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: ' 0 auto' }}>
              {local.chooseRepresentative}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ padding: '10px 40px' }}>
              <Form.Label className="data-label">
                {local.chooseBranch}
              </Form.Label>
              <Col sm={12}>
                <Select
                  placeholder={local.chooseBranch}
                  name="moveToBranch"
                  data-qc="moveToBranch"
                  value={this.state.moveToBranch}
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  enableReinitialize={false}
                  onChange={(event) => {
                    if (!event)
                      this.setState(
                        { moveToBranch: event, selectedLO: event },
                        () => this.getLoanOfficers('')
                      )
                    else
                      this.setState({ moveToBranch: event }, () =>
                        this.getLoanOfficers('')
                      )
                  }}
                  type="text"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  options={this.state.branches}
                  isClearable
                />
              </Col>
            </Row>
            <Row style={{ padding: '10px 40px' }}>
              <Form.Label className="data-label">
                {local.chooseLoanOfficer}
              </Form.Label>
              <Col sm={12}>
                <LoanOfficersDropDown
                  onSelectLoanOfficer={(LO) => {
                    if (LO)
                      this.setState({
                        selectedLO: LO as { name: string; _id: string },
                      })
                    else this.setState({ selectedLO: undefined })
                  }}
                  value={this.state.selectedLO}
                  loanOfficerSelectLoader={this.state.loanOfficerSelectLoader}
                  loanOfficerSelectOptions={this.state.loanOfficerSelectOptions}
                />
              </Col>
            </Row>
            <Row style={{ padding: '10px 40px', justifyContent: 'center' }}>
              <Col sm={3}>
                <Button
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => this.submit()}
                  disabled={
                    (this.state.selectedLO
                      ? !this.state.selectedLO._id
                      : true) || this.state.moveToBranch === null
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
    )
  }
}
export default CustomersForUser
