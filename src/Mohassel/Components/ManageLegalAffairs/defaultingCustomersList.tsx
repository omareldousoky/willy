import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import HeaderWithCards, {
  Tab,
} from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from './manageLegalAffairsInitials'
import {
  getErrorMessage,
  timeToArabicDate,
} from '../../../Shared/Services/utils'
import { Customer } from '../../../Shared/Services/interfaces'
import { searchLoan } from '../../Services/APIs/Loan/searchLoan'
import { Application } from '../LoanApplication/loanApplicationStates'
import {
  addCustomerToDefaultingList,
  deleteCustomerDefaultedLoan,
  fetchReviewedDefaultingCustomers,
  reviewCustomerDefaultedLoan,
} from '../../../Shared/Services/APIs/LegalAffairs/defaultingCustomers'
import ability from '../../config/ability'
import DefaultingCustomersPdfTemplate, {
  ReportDefaultedCustomer,
} from '../pdfTemplates/defaultingCustomers/DefaultingCustomers'
import { LtsIcon } from '../../../Shared/Components'
import { searchCustomer } from '../../../Shared/Services/APIs/customer/searchCustomer'
import { ProductType } from '../LegalWarnings/types'
import CustomerSearch from '../../../Shared/Components/CustomerSearch'
import { PDF } from '../../../Shared/Components/PdfList/types'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'

interface Review {
  at: number
  by: string
  notes: string
  userName: string
}

export interface ManagerReviews {
  branchManagerReview?: Review
  areaManagerReview?: Review
  areaSupervisorReview?: Review
  financialManagerReview?: Review
}
export interface DefaultedCustomer extends ManagerReviews {
  _id: string
  updated: { at: number; by: string }
  created: { at: number; by: string }
  status: string
  nationalId: string
  loanId: string
  loanKey: string
  customerType: string
  customerName: string
  customerId: string
  customerKey: number
  customerBranchId?: string
}

export interface ReviewedDefaultingCustomer {
  customerKey: string
  customerName: string
  customerType: string
  loanKey: string
  loanIssueDate: string
  customerAddress: string
  installmentAmount: number
  overdueInstallmentCount: number
  unpaidInstallmentCount: number
  unpaidInstallmentAmount: number
  branchName: string
  branchId: string
}

export interface ReviewedDefaultingCustomersReq {
  status: string
  branches: string
  startDate: number
  endDate: number
}
interface Props extends RouteComponentProps {
  data: DefaultedCustomer[]
  error: string
  totalCount: number
  loading: boolean
  searchFilters: {
    reviewer?: string
  }
  search: (data) => Promise<void>
  setLoading: (data) => void
  setSearchFilters: (data) => void
  branchId?: string
  withHeader: boolean
}
interface State {
  size: number
  from: number
  checkAll: boolean
  showModal: boolean
  showLogs: boolean
  manageLegalAffairsTabs: Tab[]
  selectedEntries: DefaultedCustomer[]
  customerSearchResults: { results: Array<Customer>; empty: boolean }
  loanSearchResults: { application: Application; id: string }[]
  defaultingCustomersReport: ReviewedDefaultingCustomer[]
  selectedCustomer: Customer
  modalLoader: boolean
  loading: boolean
  rowToView: DefaultedCustomer
  showReportsModal: boolean
  productType: ProductType
}
const rowToViewInit = {
  _id: '',
  updated: { at: 0, by: '' },
  created: { at: 0, by: '' },
  status: '',
  nationalId: '',
  loanId: '',
  loanKey: '',
  customerType: '',
  customerName: '',
  customerId: '',
  customerKey: 0,
}

class DefaultingCustomersList extends Component<Props, State> {
  mappers: {
    title: (() => void) | string
    key: string
    sortable?: boolean
    render: (data: DefaultedCustomer) => void
  }[]

  loanMappers: {
    title: string
    key: string
    sortable?: boolean
    render: (data: { id: string; application: Application }) => void
  }[]

  reportsPDF: PDF = {
    key: 'defaultingCustomers',
    local: 'تقرير العملاء المتأخرون',
    inputs: ['defaultingCustomerStatus', 'branches', 'dateFromTo'],
    permission: '',
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      checkAll: false,
      showModal: false,
      showLogs: false,
      manageLegalAffairsTabs: [],
      selectedEntries: [],
      customerSearchResults: { results: [], empty: false },
      loanSearchResults: [],
      defaultingCustomersReport: [],
      selectedCustomer: {},
      modalLoader: false,
      loading: false,
      rowToView: rowToViewInit,
      showReportsModal: false,
      productType: 'micro',
    }
    this.mappers = [
      {
        title: () => (
          <FormCheck
            type="checkbox"
            onChange={(e) => this.checkAll(e)}
            checked={this.state.checkAll}
            disabled={
              !this.props.searchFilters.reviewer ||
              this.props.searchFilters.reviewer === 'underReview'
            }
          />
        ),
        key: 'selected',
        render: (data) => (
          <FormCheck
            type="checkbox"
            checked={Boolean(
              this.state.selectedEntries.find(
                (application) => application._id === data._id
              )
            )}
            onChange={() => this.addRemoveItemFromChecked(data)}
            disabled={
              !this.props.searchFilters.reviewer ||
              this.props.searchFilters.reviewer === 'underReview'
            }
          />
        ),
      },
      {
        title: local.code,
        key: 'customerKey',
        render: (data) =>
          ability.can('getCustomer', 'customer') ? (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.props.history.push(
                  data.customerType === 'company' ||
                    data.customerType === 'companyGuarantor'
                    ? '/company/view-company'
                    : '/customers/view-customer',
                  {
                    id: data.customerId,
                  }
                )
              }
            >
              {data.customerKey}
            </span>
          ) : (
            data.customerKey
          ),
      },
      {
        title: local.customerName,
        key: 'customerName',
        render: (data) => data.customerName,
      },
      {
        title: local.customerType,
        key: 'customerType',
        render: (data) => local[data.customerType],
      },
      {
        title: local.loanCode,
        key: 'loanId',
        render: (data) =>
          ability.can('getIssuedLoan', 'application') ||
          ability.can('branchIssuedLoan', 'application') ? (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.props.history.push('/loans/loan-profile', {
                  id: data.loanId,
                  sme:
                    data.customerType === 'company' ||
                    data.customerType === 'companyGuarantor' ||
                    data.customerType === 'entitledToSign',
                })
              }
            >
              {data.loanKey}
            </span>
          ) : (
            data.loanKey
          ),
      },
      {
        title: local.date,
        key: 'creationDate',
        render: (data) =>
          data.created?.at ? timeToArabicDate(data.created.at, true) : '',
      },
      {
        title: local.status,
        key: 'status',
        render: (data) => local[data.status],
      },
      {
        title: '',
        key: 'actions',
        render: (data) => this.renderIcons(data),
      },
    ]
    this.loanMappers = [
      {
        title: local.customerCode,
        key: 'customerCode',
        render: () => this.state.selectedCustomer.key || '',
      },
      {
        title: local.loanCode,
        key: 'LoanKey',
        render: (data) => data.application.loanApplicationKey || '',
      },
      {
        title: local.principal,
        key: 'principal',
        render: (data) => data.application.principal || 0,
      },
      {
        title: '',
        key: 'action',
        render: (data) => (
          <Button onClick={() => this.defaultCustomerLoan(data.id)}>
            {local.choose}
          </Button>
        ),
      },
    ]
  }

  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'defaultingCustomers',
        branchId: this.props.branchId,
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
      })
    this.setState({
      manageLegalAffairsTabs: manageLegalAffairsArray(),
    })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  handleSearch = async (key, query) => {
    this.setState({ modalLoader: true })
    const results = await searchCustomer({
      from: 0,
      size: 1000,
      [key]: query,
      customerType: this.state.productType === 'sme' ? 'company' : 'individual',
    })
    if (results.status === 'success') {
      if (results.body.data.length > 0) {
        this.setState({
          modalLoader: false,
          customerSearchResults: { results: results.body.data, empty: false },
        })
      } else {
        this.setState({
          modalLoader: false,
          customerSearchResults: { results: results.body.data, empty: true },
        })
      }
    } else {
      this.setState({ modalLoader: false })
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
    }
  }

  async handlePrintReport(values: any) {
    const { defaultingCustomerStatus, branches, fromDate, toDate } = values
    const printReportReq: ReviewedDefaultingCustomersReq = {
      status: defaultingCustomerStatus ?? '',
      branches:
        branches.length === 1 && branches[0]._id === ''
          ? []
          : branches.map((branch) => branch._id),
      startDate: new Date(fromDate).setHours(0, 0, 0, 0).valueOf(),
      endDate: new Date(toDate).setHours(23, 59, 59, 999).valueOf(),
    }

    this.setState({
      loading: true,
      showReportsModal: false,
    })

    const printReportRes: {
      status: string
      body?: { result: ReviewedDefaultingCustomer[] }
      error?: any
    } = await fetchReviewedDefaultingCustomers(printReportReq)

    const defaultingCustomersReport = printReportRes.body?.result ?? []

    if (printReportRes.status === 'success') {
      this.setState({ defaultingCustomersReport, loading: false }, () => {
        window.print()
      })
    } else {
      this.setState({
        loading: false,
      })
      Swal.fire('Error !', getErrorMessage(printReportRes.error.error), 'error')
    }
  }

  getRecordAgeInDays(date: number) {
    return (
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  async getDefaultingCustomers() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'defaultingCustomers',
        branchId: this.props.branchId,
      })
      .then(() => {
        this.setState({
          selectedEntries: [],
          checkAll: false,
        })
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
      })
  }

  addRemoveItemFromChecked(selectedEntry: DefaultedCustomer) {
    if (
      this.state.selectedEntries.findIndex(
        (customer) => customer._id === selectedEntry._id
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedEntries: prevState.selectedEntries.filter(
          (customer) => customer._id !== selectedEntry._id
        ),
      }))
    } else {
      this.setState((prevState) => ({
        selectedEntries: [...prevState.selectedEntries, selectedEntry],
      }))
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedEntries: this.props.data })
    } else this.setState({ checkAll: false, selectedEntries: [] })
  }

  async findLoans(customer: Customer) {
    this.setState({ modalLoader: true, selectedCustomer: customer })
    const results = await searchLoan({
      from: 0,
      size: 1000,
      customerKey: customer.key,
      type:
        this.state.productType === 'smeIndividual'
          ? 'sme'
          : this.state.productType,
    })
    if (results.status === 'success') {
      this.setState({
        modalLoader: false,
        loanSearchResults: results.body.applications.filter(
          (loan) =>
            loan.application.status &&
            ['pending', 'issued', 'paid'].includes(loan.application.status)
        ),
        productType: 'micro',
      })
    } else {
      this.setState({ modalLoader: false, productType: 'micro' })
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
    }
  }

  async defaultCustomerLoan(loanId: string) {
    if (this.state.selectedCustomer._id) {
      this.setState({ modalLoader: true })
      const results = await addCustomerToDefaultingList({
        customerId: this.state.selectedCustomer._id,
        loanId,
      })
      if (results.status === 'success') {
        this.setState(
          {
            modalLoader: false,
            showModal: false,
            selectedCustomer: {},
            customerSearchResults: { results: [], empty: false },
            loanSearchResults: [],
            productType: 'micro',
          },
          () => {
            this.wait(2000)
            this.getDefaultingCustomers()
          }
        )
        Swal.fire('', local.customerAddedToDefaultiingListSuccess, 'success')
      } else {
        this.setState({ modalLoader: false })
        Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      }
    }
  }

  async reviewDefaultedLoan(ids: string[], type: string) {
    const { value: text } = await Swal.fire({
      title: `${local[type]}${
        ids.length > 1 ? ids.length + ' ' + local.loans : ''
      }`,
      input: 'textarea',
      inputPlaceholder: local.writeNotes,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.review,
      cancelButtonText: local.cancel,
      inputValidator: (value) => {
        if (!value) {
          return local.required
        }
        if (value.length > 200) {
          return local.maxLength200
        }
        return ''
      },
    })
    if (text) {
      Swal.fire({
        title: local.areYouSure,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.review,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        if (result.value) {
          this.setState({ loading: true })
          const res = await reviewCustomerDefaultedLoan({
            ids,
            notes: text,
            type,
          })
          if (res.status === 'success') {
            this.setState({ loading: false })
            Swal.fire('', local.defaultingReviewSuccess, 'success').then(() => {
              this.wait(2000)
              this.getDefaultingCustomers()
            })
          } else {
            this.setState({ loading: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        }
      })
    }
  }

  bulkAction(action: string) {
    const ids = this.state.selectedEntries.map((entry) => entry._id)
    action === 'review' &&
      this.props.searchFilters.reviewer &&
      this.reviewDefaultedLoan(ids, this.props.searchFilters.reviewer)
    action === 'delete' && this.deleteDefaultedLoanEntry(ids)
  }

  deleteDefaultedLoanEntry(ids: string[]) {
    Swal.fire({
      title: local.areYouSure,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.delete,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      if (result.value) {
        this.setState({ loading: true })
        const res = await deleteCustomerDefaultedLoan({ ids })
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire('', local.defaultedLoanDeleteSuccess, 'success').then(
            () => {
              this.wait(2000)
              this.getDefaultingCustomers()
            }
          )
        } else {
          this.setState({ loading: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      }
    })
  }

  showLogs(row: DefaultedCustomer) {
    this.setState({
      showLogs: true,
      rowToView: row,
    })
  }

  wait(ms) {
    const start = new Date().getTime()
    let end = start
    while (end < start + ms) {
      end = new Date().getTime()
    }
  }

  renderLogRow(key: string) {
    return (
      <tr>
        <td>{timeToArabicDate(this.state.rowToView[key].at, true)}</td>
        <td>{local[key]}</td>
        <td>{this.state.rowToView[key].userName}</td>
        <td style={{ wordBreak: 'break-word' }}>
          {this.state.rowToView[key].notes}
        </td>
      </tr>
    )
  }

  renderIcons(data: DefaultedCustomer) {
    const daysSince = this.getRecordAgeInDays(data.created?.at)
    return (
      <>
        {(data.branchManagerReview ||
          data.areaManagerReview ||
          data.areaSupervisorReview ||
          data.financialManagerReview) && (
          <Button
            variant="default"
            onClick={() => this.showLogs(data)}
            title={local.logs}
          >
            <LtsIcon name="view" />
          </Button>
        )}
        {daysSince < 3 && data.status === 'underReview' && (
          <Can I="branchManagerReview" a="legal">
            <Button
              variant="default"
              onClick={() =>
                this.reviewDefaultedLoan([data._id], 'branchManagerReview')
              }
              title={local.branchManagerReview}
            >
              <LtsIcon name="check-circle" />
            </Button>
            <Button
              variant="default"
              onClick={() => this.deleteDefaultedLoanEntry([data._id])}
              title={local.delete}
            >
              <LtsIcon name="trash" />
            </Button>
          </Can>
        )}
        {daysSince < 6 &&
          (data.status === 'branchManagerReview' ||
            (daysSince >= 3 && data.status === 'underReview')) && (
            <Can I="areaSupervisorReview" a="legal">
              <Button
                variant="default"
                onClick={() =>
                  this.reviewDefaultedLoan([data._id], 'areaSupervisorReview')
                }
                title={local.areaSupervisorReview}
              >
                <LtsIcon name="check-circle" />
              </Button>
              <Button
                variant="default"
                onClick={() => this.deleteDefaultedLoanEntry([data._id])}
                title={local.delete}
              >
                <LtsIcon name="trash" />
              </Button>
            </Can>
          )}
        {daysSince < 9 &&
          (data.status === 'areaSupervisorReview' ||
            (daysSince >= 6 &&
              (data.status === 'branchManagerReview' ||
                data.status === 'underReview'))) && (
            <Can I="areaManagerReview" a="legal">
              <Button
                variant="default"
                onClick={() =>
                  this.reviewDefaultedLoan([data._id], 'areaManagerReview')
                }
                title={local.areaManagerReview}
              >
                <LtsIcon name="check-circle" />
              </Button>
              <Button
                variant="default"
                onClick={() => this.deleteDefaultedLoanEntry([data._id])}
                title={local.delete}
              >
                <LtsIcon name="trash" />
              </Button>
            </Can>
          )}
        {daysSince < 15 &&
          (data.status === 'areaManagerReview' ||
            (daysSince >= 9 &&
              (data.status === 'areaSupervisorReview' ||
                data.status === 'branchManagerReview' ||
                data.status === 'underReview'))) && (
            <Can I="financialManagerReview" a="legal">
              <Button
                variant="default"
                onClick={() =>
                  this.reviewDefaultedLoan([data._id], 'financialManagerReview')
                }
                title={local.financialManagerReview}
              >
                <LtsIcon name="check-circle" />
              </Button>
              <Button
                variant="default"
                onClick={() => this.deleteDefaultedLoanEntry([data._id])}
                title={local.delete}
              >
                <LtsIcon name="trash" />
              </Button>
            </Can>
          )}
        {daysSince >= 15 && data.status !== 'financialManagerReview' && (
          <Can I="deleteDefaultingCustomer" a="legal">
            <Button
              variant="default"
              onClick={() => this.deleteDefaultedLoanEntry([data._id])}
              title={local.delete}
            >
              <LtsIcon name="trash" />
            </Button>
          </Can>
        )}
      </>
    )
  }

  render() {
    return (
      <>
        <div className="print-none">
          <HeaderWithCards
            header={local.legalAffairs}
            array={this.state.manageLegalAffairsTabs}
            active={this.state.manageLegalAffairsTabs
              .map((item) => {
                return item.icon
              })
              .indexOf('loan-uses')}
          />
          <Card className="main-card">
            <Loader
              type="fullscreen"
              open={this.props.loading || this.state.loading}
            />
            <Card.Body style={{ padding: 0 }}>
              <div className="custom-card-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                    {local.lateCustomers}
                  </Card.Title>
                  <span className="text-muted">
                    {local.noOfUsers +
                      ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                  </span>
                </div>
                <div className="d-flex w-50 justify-content-end">
                  <Can I="addDefaultingCustomer" a="legal">
                    <Button
                      className="big-button"
                      style={{ marginLeft: 10 }}
                      onClick={() =>
                        this.setState({
                          showModal: true,
                        })
                      }
                    >
                      {local.addCustomerToLateCustomers}
                    </Button>
                  </Can>
                  {(ability.can('branchManagerReview', 'legal') ||
                    ability.can('areaSupervisorReview', 'legal') ||
                    ability.can('areaManagerReview', 'legal') ||
                    ability.can('financialManagerReview', 'legal')) && (
                    <>
                      <Button
                        className="big-button"
                        style={{ marginLeft: 10 }}
                        disabled={this.state.selectedEntries.length === 0}
                        onClick={() => this.bulkAction('review')}
                      >
                        {local.reviewAll}
                      </Button>
                      <Button
                        className="big-button"
                        style={{ marginLeft: 10 }}
                        disabled={this.state.selectedEntries.length === 0}
                        onClick={() => this.bulkAction('delete')}
                      >
                        {local.deleteAll}
                      </Button>
                      <Can I="reviewedDefaultingCustomer" a="report">
                        <Button
                          className="big-button"
                          onClick={() =>
                            this.setState({ showReportsModal: true })
                          }
                        >
                          {local.downloadPDF}
                        </Button>
                      </Can>
                    </>
                  )}
                </div>
              </div>
              <hr className="dashed-line" />
              <Search
                searchKeys={['keyword', 'defaultingCustomerStatus']}
                dropDownKeys={[
                  'name',
                  'key',
                  'customerKey',
                  'customerShortenedCode',
                ]}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                setFrom={(from) => this.setState({ from })}
                url="defaultingCustomers"
                from={this.state.from}
                size={this.state.size}
                hqBranchIdRequest={this.props.branchId}
              />

              <DynamicTable
                url="defaultingCustomers"
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination
                data={this.props.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () =>
                    this.getDefaultingCustomers()
                  )
                }}
              />
            </Card.Body>
          </Card>
          <Modal show={this.state.showModal} size="lg">
            <Modal.Header>
              <Modal.Title>{local.addCustomerToLateCustomers}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Loader type="fullsection" open={this.state.modalLoader} />
              {Object.keys(this.state.selectedCustomer).length === 0 ? (
                <>
                  <div className="d-flex w-100">
                    <Form.Label>{local.productName}</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      value={this.state.productType}
                      onChange={(event) =>
                        this.setState({
                          productType: event.target.value as ProductType,
                        })
                      }
                    >
                      <option value="micro">
                        قرض فردي - جماعي - ضمان | لقروض ميكرو
                      </option>
                      <option value="nano"> قرض و ضمان لقروض نانو</option>
                      <option value="sme">شركات او ضمان من نوع شركات</option>
                      <option value="smeIndividual">
                        من لهم حق التوقيع او ضمان فردي للشركات
                      </option>
                    </Form.Control>
                  </div>

                  {this.state.productType && (
                    <CustomerSearch
                      source="loanApplication"
                      style={{ width: '100%' }}
                      handleSearch={(key, query) =>
                        this.handleSearch(key, query)
                      }
                      selectedCustomer={this.state.selectedCustomer}
                      searchResults={this.state.customerSearchResults}
                      selectCustomer={(customer) => this.findLoans(customer)}
                      sme={this.state.productType === 'sme'}
                    />
                  )}
                </>
              ) : (
                <DynamicTable
                  totalCount={0}
                  pagination={false}
                  data={this.state.loanSearchResults}
                  mappers={this.loanMappers}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  this.setState({
                    showModal: false,
                    selectedCustomer: {},
                    customerSearchResults: { results: [], empty: false },
                    loanSearchResults: [],
                  })
                }
              >
                {local.cancel}
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.showLogs} size="lg">
            <Modal.Header>
              <Modal.Title>{local.logs}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table>
                <thead>
                  <tr>
                    <th>{local.reviewDate}</th>
                    <th>{local.reviewStatus}</th>
                    <th>{local.doneBy}</th>
                    <th>{local.comments}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rowToView.branchManagerReview &&
                    this.renderLogRow('branchManagerReview')}
                  {this.state.rowToView.areaManagerReview &&
                    this.renderLogRow('areaManagerReview')}
                  {this.state.rowToView.areaSupervisorReview &&
                    this.renderLogRow('areaSupervisorReview')}
                  {this.state.rowToView.financialManagerReview &&
                    this.renderLogRow('financialManagerReview')}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  this.setState({
                    showLogs: false,
                    rowToView: rowToViewInit,
                  })
                }
              >
                {local.cancel}
              </Button>
            </Modal.Footer>
          </Modal>
          {this.state.showReportsModal && (
            <ReportsModal
              pdf={this.reportsPDF}
              show={this.state.showReportsModal}
              hideModal={() => this.setState({ showReportsModal: false })}
              submit={(values) => this.handlePrintReport(values)}
            />
          )}
        </div>
        <DefaultingCustomersPdfTemplate
          customers={
            this.state.defaultingCustomersReport as ReportDefaultedCustomer[]
          }
        />
      </>
    )
  }
}

const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setLoading: (data) => dispatch(loading(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(DefaultingCustomersList))
