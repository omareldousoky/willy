import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

import Card from 'react-bootstrap/Card'

import { Loader } from '../../../Shared/Components/Loader'

import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import * as local from '../../../Shared/Assets/ar.json'
import {
  timeToDateyyymmdd,
  beneficiaryType,
  getErrorMessage,
  getFullCustomerKey,
} from '../../../Shared/Services/utils'

import { ActionsIconGroup } from '../../../Shared/Components'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import ability from '../../../Shared/config/ability'
import { getApplication } from '../../../Shared/Services/APIs/loanApplication/getApplication'
import TotalWrittenChecksPDF from '../PDF/totalWrittenChecks/totalWrittenChecks'

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
      loading: false,
      selectedApplicationToPrint: {},
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

  renderActions(data) {
    return [
      {
        actionTitle: local.uploadDocuments,
        actionIcon: 'download',
        actionPermission: ability.can('addingDocuments', 'application'),
        actionOnClick: () =>
          this.props.history.push('/edit-loan-profile', {
            id: data.application._id,
            sme: this.props.location.state?.sme,
          }),
        style: {
          transform: `rotate(180deg)`,
        },
      },
      {
        actionTitle: local.downloadDocuments,
        actionIcon: 'download',
        actionPermission: data.application.status === 'created',
        actionOnClick: () => this.getApplicationById(data.application._id),
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
        <Card className="main-card print-none">
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
