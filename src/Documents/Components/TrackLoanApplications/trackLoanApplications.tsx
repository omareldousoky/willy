import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Search from '../../../Shared/Components/Search/search'
import TotalWrittenChecksPDF from '../PDF/totalWrittenChecks/totalWrittenChecks'
import Can from '../../../Mohassel/config/Can'
import { getApplication } from '../../../Shared/Services/APIs/loanApplication/getApplication'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import {
  timeToDateyyymmdd,
  beneficiaryType,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import * as local from '../../../Shared/Assets/ar.json'

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
interface LoanItem {
  id: string
  branchId: string
  application: Application
}
interface State {
  print: boolean
  size: number
  from: number
  loading: boolean
  selectedApplicationToPrint: any
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
}
class TrackLoanApplications extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      print: false,
      size: 10,
      from: 0,
      loading: false,
      selectedApplicationToPrint: {},
    }
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
          Swal.fire('', getErrorMessage(this.props.error), 'error')
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
            Swal.fire('', getErrorMessage(this.props.error), 'error')
        })
    }
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  mappers() {
    const isSme = this.props.location?.state?.sme

    return [
      {
        title: local.customerType,
        key: 'customerType',
        render: (data) =>
          beneficiaryType(data.application.product.beneficiaryType),
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
          data.application.product.beneficiaryType === 'individual' ? (
            data.application.customer.customerName
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map((member) =>
                member.type === 'leader' ? (
                  <span key={member.customer._id}>
                    {member.customer.customerName}
                  </span>
                ) : null
              )}
            </div>
          ),
      },
      ...(isSme
        ? [
            {
              title: local.commercialRegisterNumber,
              key: 'commercialRegisterNumber',
              render: (data) =>
                data.application.customer.commercialRegisterNumber,
            },
            {
              title: local.taxCardNumber,
              key: 'taxCardNumber',
              render: (data) => data.application.customer.taxCardNumber,
            },
          ]
        : [
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
          ]),
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
        render: (data) => this.renderIcons(data),
      },
    ]
  }

  getApplications() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'application',
        branchId: this.props.branchId || this.props.searchFilters.branchId,
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
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

  async getApplicationById(id: string) {
    this.setState({ loading: true })
    const res = await getApplication(id)
    if (res.status === 'success') {
      this.setState(
        { loading: false, selectedApplicationToPrint: res.body, print: true },
        () => window.print()
      )
    } else {
      this.setState({ loading: false })
    }
  }

  renderIcons(data) {
    if (
      !(
        data.application.status === 'paid' ||
        data.application.status === 'canceled' ||
        data.application.status === 'rejected'
      )
    ) {
      return (
        <>
          <Can I="addingDocuments" a="application">
            <img
              style={{ cursor: 'pointer', marginLeft: 20 }}
              alt="edit"
              src={require('../../../Shared/Assets/upload.svg')}
              onClick={() =>
                this.props.history.push('/edit-loan-profile', {
                  id: data.application._id,
                  sme: !!this.props.location.state?.sme,
                })
              }
            />
          </Can>
          {data.application.status === 'created' && (
            <img
              style={{ cursor: 'pointer', marginLeft: 20 }}
              alt="edit"
              src={require('../../../Shared/Assets/downloadIcon.svg')}
              onClick={() => this.getApplicationById(data.application._id)}
            />
          )}
        </>
      )
    }
    return null
  }

  render() {
    return (
      <>
        <Card className="print-none" style={{ margin: '20px 50px' }}>
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
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo', 'status-application']}
              dropDownKeys={[
                'name',
                'key',
                'customerKey',
                'customerCode',
                'customerShortenedCode',
                ...(this.props.location.state?.sme
                  ? ['taxCardNumber', 'commercialRegisterNumber']
                  : ['nationalId']),
              ]}
              url="application"
              from={this.state.from}
              size={this.state.size}
              setFrom={(from) => this.setState({ from })}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              hqBranchIdRequest={this.props.branchId}
            />
            <DynamicTable
              url="application"
              from={this.state.from}
              size={this.state.size}
              totalCount={this.props.totalCount}
              mappers={this.mappers()}
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
        {this.state.print && (
          <TotalWrittenChecksPDF data={this.state.selectedApplicationToPrint} />
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
