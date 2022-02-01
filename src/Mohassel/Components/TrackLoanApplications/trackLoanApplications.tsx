import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

import { Loader } from '../../../Shared/Components/Loader'
import ReviewedApplicationsPDF from '../pdfTemplates/reviewedApplications/reviewedApplications'
import Can from '../../config/Can'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import * as local from '../../../Shared/Assets/ar.json'
import {
  timeToDateyyymmdd,
  beneficiaryType,
  parseJwt,
  getErrorMessage,
  downloadFile,
  iscoreStatusColor,
  getFullCustomerKey,
  iscoreBank,
} from '../../../Shared/Services/utils'
import {
  BranchDetailsResponse,
  getBranch,
} from '../../../Shared/Services/APIs/Branch/getBranch'
import { getCookie } from '../../../Shared/Services/getCookie'
import { getReviewedApplications } from '../../Services/APIs/Reports/reviewedApplications'
import {
  manageApplicationsArray,
  manageSMEApplicationsArray,
} from './manageApplicationInitials'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { LoanApplicationReportRequest } from '../../Services/interfaces'
import { ActionsIconGroup } from '../../../Shared/Components'
import ability from '../../config/ability'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import {
  getSMECachedIscore,
  getIscoreCached,
} from '../../../Shared/Services/APIs/iScore'
import { Score } from '../../../Shared/Models/Customer'

interface Product {
  productName: string
  loanNature: string
  beneficiaryType: string
}
interface Customer {
  customerName: string
}
interface Application {
  product: Product
  customer: Customer
  entryDate: number
  principal: number
  status: string
}
interface State {
  print: boolean
  size: number
  from: number
  branchDetails: any
  reviewedResults: any
  iScoreModal: boolean
  iScoreCustomers: any
  loading: boolean
  selectedBranch: string
}
interface Props
  extends RouteComponentProps<
    {},
    {},
    { sme?: boolean; id?: string; action?: string }
  > {
  data: any
  error: string
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
  branchId?: string
  sme?: boolean
}
class TrackLoanApplications extends Component<Props, State> {
  mappers: TableMapperItem[]

  constructor(props) {
    super(props)
    this.state = {
      print: false,
      size: 10,
      from: 0,
      branchDetails: {},
      reviewedResults: [],
      iScoreModal: false,
      iScoreCustomers: [],
      loading: false,
      selectedBranch: getCookie('ltsbranch')
        ? JSON.parse(getCookie('ltsbranch'))._id
        : '',
    }
    this.mappers = [
      {
        title: local.customerType,
        key: 'customerType',
        render: (data) =>
          beneficiaryType(
            data.application.customer.customerType === 'company'
              ? 'company'
              : data.application.product.beneficiaryType
          ),
      },
      {
        title: local.applicationCode,
        key: 'applicationCode',
        render: (data) => data.application.applicationKey,
      },
      {
        title: local.customerName,
        key: 'name',
        sortable: true,
        render: (data) =>
          data.application.product.beneficiaryType === 'individual' &&
          ['micro', 'nano'].includes(data.application.product.type) ? (
            data.application.customer.customerName
          ) : data.application.product.beneficiaryType === 'individual' &&
            data.application.product.type === 'sme' ? (
            data.application.customer.businessName
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup?.map((member) =>
                member.type === 'leader' ? (
                  <span key={member.customer._id}>
                    {member.customer.customerName}
                  </span>
                ) : null
              )}
            </div>
          ),
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) =>
          data.application.product.beneficiaryType === 'individual' ? (
            data.application.customer.nationalId
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map((member) =>
                member.type === 'leader' ? (
                  <span key={member.customer._id}>
                    {member.customer.nationalId}
                  </span>
                ) : null
              )}
            </div>
          ),
      },
      {
        title: local.productName,
        key: 'productName',
        render: (data) => data.application.product.productName,
      },
      {
        title: local.loanCreationDate,
        key: 'createdAt',
        sortable: true,
        render: (data) => timeToDateyyymmdd(data.application.entryDate),
      },
      {
        title: local.loanStatus,
        key: 'status',
        sortable: true,
        render: (data) => this.getStatus(data.application.status),
      },
      {
        title: '',
        key: 'action',
        render: (data) => (
          <ActionsIconGroup
            currentId={data._id}
            actions={this.renderActions(data)}
          />
        ),
      },
    ]
  }

  componentDidMount() {
    this.props.setSearchFilters({
      type:
        this.props.location.state && this.props.location.state.sme
          ? 'sme'
          : 'micro',
    })
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'application',
        branchId: this.props.branchId,
        type:
          this.props.location.state && this.props.location.state.sme
            ? 'sme'
            : 'micro',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire({
            confirmButtonText: local.confirmationText,
            text: getErrorMessage(this.props.error),
            icon: 'error',
          })
      })
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.location.state && prevProps.location.state.sme) !==
      (this.props.location.state && this.props.location.state.sme)
    ) {
      this.props.setSearchFilters({
        type:
          this.props.location.state && this.props.location.state.sme
            ? 'sme'
            : 'micro',
      })
      this.props
        .search({
          size: this.state.size,
          from: this.state.from,
          url: 'application',
          branchId: this.props.branchId,
          type:
            this.props.location.state && this.props.location.state.sme
              ? 'sme'
              : 'micro',
        })
        .then(() => {
          if (this.props.error)
            Swal.fire({
              confirmButtonText: local.confirmationText,
              text: getErrorMessage(this.props.error),
              icon: 'error',
            })
        })
    }
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  async getCachediScores(application) {
    const smeCheck = this.props.searchFilters.type === 'sme'
    this.setState({ iScoreModal: true })
    const ids: string[] = []
    if (application.product.beneficiaryType === 'group') {
      application.group.individualsInGroup.forEach((member) =>
        ids.push(member.customer.nationalId)
      )
    } else {
      ids.push(
        smeCheck
          ? `${application.customer.governorate}-${application.customer.commercialRegisterNumber}`
          : application.customer.nationalId
      )
    }
    const obj: { nationalIds: string[]; date?: Date } = {
      nationalIds: ids,
    }
    if (
      [
        'approved',
        'created',
        'issued',
        'rejected',
        'paid',
        'pending',
        'canceled',
      ].includes(application.status)
    ) {
      obj.date =
        application.status === 'approved'
          ? application.approvalDate
          : application.status === 'created'
          ? application.creationDate
          : ['issued', 'pending'].includes(application.status)
          ? application.issueDate
          : application.status === 'rejected'
          ? application.rejectionDate
          : ['paid', 'canceled'].includes(application.status)
          ? application.updated.at
          : 0
      // paid & canceled => updated.at, pending,issued =>issuedDate
    }
    this.setState({ loading: true })
    const iScores = smeCheck
      ? await getSMECachedIscore({ ids, date: obj.date })
      : await getIscoreCached(obj)
    if (iScores.status === 'success') {
      const customers: Score[] = []
      iScores.body.data.forEach((score: Score) => {
        const customer = {
          customerName:
            application.product.beneficiaryType === 'group'
              ? application.group.individualsInGroup.filter(
                  (member) => member.customer.nationalId === score.nationalId
                )[0].customer.customerName
              : application.customer.customerName ||
                application.customer.businessName,
          iscore: score.iscore,
          nationalId: score.nationalId,
          id: score.id,
          url: score.url,
          bankCodes: score.bankCodes || [],
        }
        customers.push(customer)
      })
      this.setState({ iScoreCustomers: customers, loading: false })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          confirmButtonText: local.confirmationText,
          text: getErrorMessage(iScores.error.error),
          icon: 'error',
        })
      )
    }
  }

  getApplications() {
    // eslint-disable-next-line no-shadow
    const { searchFilters, search, error, branchId } = this.props
    const { customerShortenedCode, customerKey } = searchFilters
    const { size, from } = this.state
    search({
      ...searchFilters,
      customerKey: customerShortenedCode
        ? getFullCustomerKey(customerShortenedCode)
        : customerKey || undefined,
      size,
      from,
      url: 'application',
      branchId: branchId || searchFilters.branchId,
    }).then(() => {
      if (error)
        Swal.fire({
          confirmButtonText: local.confirmationText,
          text: getErrorMessage(error),
          icon: 'error',
        })
    })
  }

  getStatus(status: string) {
    switch (status) {
      case 'underReview':
        return (
          <div className="status-chip outline under-review">
            {local.underReview}
          </div>
        )
      case 'created':
        return (
          <div className="status-chip outline created">{local.created}</div>
        )
      case 'reviewed':
        return (
          <div className="status-chip outline reviewed">{local.reviewed}</div>
        )
      case 'secondReview':
        return (
          <div className="status-chip outline second-review">
            {local.secondReviewed}
          </div>
        )
      case 'thirdReview':
        return (
          <div className="status-chip outline third-review">
            {local.thirdReviewed}
          </div>
        )
      case 'approved':
        return (
          <div className="status-chip outline approved">{local.approved}</div>
        )
      case 'rejected':
        return (
          <div className="status-chip outline rejected">{local.rejected}</div>
        )
      case 'canceled':
        return (
          <div className="status-chip outline canceled">{local.cancelled}</div>
        )
      default:
        return null
    }
  }

  async getBranchData(id) {
    const res = await getBranch(id)
    if (res.status === 'success') {
      this.setState({
        branchDetails: (res.body as BranchDetailsResponse)?.data,
      })
    } else console.log('Error getting branch data')
  }

  async getReviewedData() {
    const token = getCookie('token')
    const details = parseJwt(token)
    const hasBranch = details.branch.length > 0
    if (hasBranch) {
      this.getBranchData(details.branch)
    }
    const filters = this.props.searchFilters
    const isSme = this.props.searchFilters.type === 'sme'

    const obj: LoanApplicationReportRequest = {
      startDate: filters.fromDate,
      endDate: filters.toDate,
      loanStatus: filters.status ? [filters.status] : [],
      branch: hasBranch ? details.branch : filters.branchId || '',
      loanType: isSme ? 'sme' : 'micro',
    }
    this.setState({ loading: true })
    const res = await getReviewedApplications(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire({
          title: local.errorTitle,
          confirmButtonText: local.confirmationText,
          text: local.noResults,
          icon: 'error',
        })
      } else {
        this.setState(
          { reviewedResults: res.body.result, loading: false },
          () => {
            this.setState({ print: true }, () => window.print())
          }
        )
      }
    } else {
      this.setState({ loading: false })
      console.log('error getting branch details')
    }
  }

  checkFilters() {
    if (
      this.props.searchFilters.fromDate &&
      !Number.isNaN(this.props.searchFilters.fromDate) &&
      this.props.searchFilters.toDate &&
      !Number.isNaN(this.props.searchFilters.toDate)
    ) {
      if (
        this.props.searchFilters.status &&
        ['created', 'rejected', 'canceled'].includes(
          this.props.searchFilters.status
        )
      ) {
        return true
      }
      return false
    }
    return true
  }

  renderActions(data) {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',

        actionPermission: true,
        actionOnClick: () =>
          this.props.history.push('/track-loan-applications/loan-profile', {
            id: data.application._id,
            sme: this.props.location.state?.sme,
          }),
      },
      {
        actionTitle: `${local.view} iScore`,
        actionIcon: 'i-score',

        actionPermission: ability.can('viewIscore', 'customer'),
        actionOnClick: () => this.getCachediScores(data.application),
      },
    ]
  }

  render() {
    const smePermission =
      (this.props.location.state && this.props.location.state.sme) || false
    const searchKeys = ['keyword', 'dateFromTo', 'branch', 'status-application']
    const filteredMappers = smePermission
      ? this.mappers.filter((mapper) => mapper.key !== 'nationalId')
      : this.mappers
    const dropDownKeys = [
      'name',
      'key',
      'customerKey',
      'customerCode',
      'customerShortenedCode',
    ]
    const manageApplicationsTabs = smePermission
      ? manageSMEApplicationsArray()
      : manageApplicationsArray()
    if (smePermission) {
      filteredMappers.splice(3, 0, {
        title: local.commercialRegisterNumber,
        key: 'commercialRegisterNumber',
        render: (data) => data.application.customer.commercialRegisterNumber,
      })
      filteredMappers.splice(4, 0, {
        title: local.taxCardNumber,
        key: 'taxCardNumber',
        render: (data) => data.application.customer.taxCardNumber,
      })
      dropDownKeys.push('taxCardNumber', 'commercialRegisterNumber')
    } else {
      dropDownKeys.push('nationalId')
      searchKeys.push('loanType')
    }
    return (
      <>
        <div className="print-none">
          <HeaderWithCards
            header={local.loanApplications}
            array={manageApplicationsTabs}
            active={manageApplicationsTabs
              .map((item) => {
                return item.icon
              })
              .indexOf('applications')}
          />
          <Card className="main-card">
            <Loader
              type="fullsection"
              open={this.props.loading || this.state.loading}
            />
            <Card.Body style={{ padding: 0 }}>
              <div className="custom-card-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                    {local.loanApplications}
                  </Card.Title>
                  <span className="text-muted">
                    {local.noOfApplications +
                      ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                  </span>
                </div>
                <div>
                  {this.state.selectedBranch !== 'hq' && (
                    <Can I="assignProductToCustomer" a="application">
                      <Button
                        onClick={() =>
                          this.props.history.push(
                            '/track-loan-applications/new-loan-application',
                            {
                              id: '',
                              action: 'under_review',
                              sme: smePermission,
                            }
                          )
                        }
                      >
                        {local.createLoanApplication}
                      </Button>
                    </Can>
                  )}
                  <Can I="loansReviewed" a="report">
                    <Button
                      style={{ marginRight: 10 }}
                      disabled={this.checkFilters()}
                      onClick={() => {
                        this.getReviewedData()
                      }}
                    >
                      {local.downloadPDF}
                    </Button>
                  </Can>
                </div>
              </div>
              <hr className="dashed-line" />
              <Search
                searchKeys={searchKeys}
                dropDownKeys={dropDownKeys}
                url="application"
                from={this.state.from}
                size={this.state.size}
                setFrom={(from) => this.setState({ from })}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                hqBranchIdRequest={this.props.branchId}
                sme={this.props.location.state && this.props.location.state.sme}
              />
              <DynamicTable
                url="application"
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={filteredMappers}
                pagination
                data={this.props.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () =>
                    this.getApplications()
                  )
                }}
              />
            </Card.Body>
          </Card>
          <Modal show={this.state.iScoreModal} backdrop="static" size="lg">
            <Modal.Header>
              <Modal.Title>iScore</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Loader type="fullsection" open={this.state.loading} />
              <Table style={{ textAlign: 'right' }}>
                <thead>
                  <tr>
                    <td>{local.customer}</td>
                    <td>
                      {smePermission
                        ? local.commercialRegisterNumber
                        : local.nationalId}
                    </td>
                    <td>{local.value}</td>
                    <td>{local.bankName}</td>
                    <td />
                    <td>{local.downloadPDF}</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.iScoreCustomers.map((customer: Score) => (
                    <tr key={customer.nationalId || customer.id}>
                      <td>{customer.customerName}</td>
                      <td>
                        {smePermission ? customer.id : customer.nationalId}
                      </td>
                      <td
                        style={{
                          color: iscoreStatusColor(customer.iscore).color,
                        }}
                      >
                        {customer.iscore}
                      </td>
                      {customer.bankCodes &&
                        customer.bankCodes.length > 0 &&
                        customer.bankCodes.map((code) => (
                          <td key={code}>{iscoreBank(code)}</td>
                        ))}
                      <td>{iscoreStatusColor(customer.iscore).status}</td>
                      <td>
                        {customer.url && (
                          <span
                            style={{ cursor: 'pointer' }}
                            title="iScore"
                            className="fa fa-download"
                            onClick={() => {
                              downloadFile(customer.url)
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  this.setState({ iScoreModal: false, iScoreCustomers: [] })
                }
              >
                {local.cancel}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {this.state.print && (
          <ReviewedApplicationsPDF
            isSme={this.props.searchFilters.type === 'sme'}
            data={this.state.reviewedResults}
            branchDetails={this.state.branchDetails}
          />
        )}
      </>
    )
  }
}

const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.applications,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(TrackLoanApplications))
