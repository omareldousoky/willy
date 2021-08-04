import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import {
  issuedLoansSearchFilters,
  search,
  searchFilters,
} from '../../../Shared/redux/search/actions'
import {
  timeToDateyyymmdd,
  beneficiaryType,
  getErrorMessage,
  getFullCustomerKey,
  removeEmptyArg,
} from '../../../Shared/Services/utils'
import { manageLoansArray, manageSMELoansArray } from './manageLoansInitials'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { ActionsIconGroup } from '../../../Shared/Components'

interface Props
  extends RouteComponentProps<{}, {}, { sme?: boolean; id?: string }> {
  data: any
  error: string
  branchId: string
  fromBranch?: boolean
  totalCount: number
  loading: boolean
  searchFilters: any
  issuedLoansSearchFilters: any
  search: (data) => Promise<void>
  setIssuedLoanSearchFilters: (data) => void
  setSearchFilters: (data) => void
}
interface State {
  size: number
  from: number
}

class LoanList extends Component<Props, State> {
  mappers: {
    title: string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
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
        title: local.loanCode,
        key: 'loanCode',
        render: (data) => data.application.loanApplicationKey,
      },
      {
        title: local.customerName,
        key: 'name',
        sortable: true,
        render: (data) => (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              this.props.history.push('/loans/loan-profile', {
                id: data.application._id,
              })
            }
          >
            {data.application.product.beneficiaryType === 'individual' &&
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
            )}
          </div>
        ),
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) => (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              this.props.history.push('/loans/loan-profile', {
                id: data.application._id,
              })
            }
          >
            {data.application.product.beneficiaryType === 'individual' ? (
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
        title: local.loanIssuanceDate,
        key: 'issueDate',
        sortable: true,
        render: (data) =>
          data.application.issueDate
            ? timeToDateyyymmdd(data.application.issueDate)
            : '',
      },
      {
        title: local.status,
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
    let searchFiltersQuery = {}
    if (
      (this.props.location.state?.sme &&
        this.props.issuedLoansSearchFilters.type === 'sme') ||
      (!this.props.location.state?.sme &&
        this.props.issuedLoansSearchFilters.type !== 'sme')
    ) {
      searchFiltersQuery = this.props.issuedLoansSearchFilters
    } else {
      this.props.setIssuedLoanSearchFilters({})
    }

    const productType =
      this.props.location.state && this.props.location.state.sme
        ? 'sme'
        : this.props.issuedLoansSearchFilters.type
        ? this.props.issuedLoansSearchFilters.type
        : 'micro'

    let query = {
      ...searchFiltersQuery,
      size: this.state.size,
      from: this.state.from,
      url: 'loan',
      sort: 'issueDate',
      type: productType,
    }

    query = removeEmptyArg(query)
    this.props.setIssuedLoanSearchFilters({
      type: productType,
    })
    this.props.search(query).then(() => {
      if (this.props.error)
        Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.location.state && prevProps.location.state.sme) !==
      (this.props.location.state && this.props.location.state.sme)
    ) {
      this.props.setIssuedLoanSearchFilters({
        type:
          this.props.location.state && this.props.location.state.sme
            ? 'sme'
            : 'micro',
      })
      let query = {
        size: this.state.size,
        from: this.state.from,
        url: 'loan',
        sort: 'issueDate',
        type:
          this.props.location.state && this.props.location.state.sme
            ? 'sme'
            : 'micro',
      }
      query = removeEmptyArg(query)
      this.props.search(query).then(() => {
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
      })
    }
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getStatus(status: string) {
    switch (status) {
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'issued':
        return <div className="status-chip unpaid">{local.issued}</div>
      case 'pending':
        return <div className="status-chip pending">{local.pending}</div>
      case 'canceled':
        return <div className="status-chip canceled">{local.cancelled}</div>
      default:
        return null
    }
  }

  async getLoans() {
    const { error, fromBranch, branchId } = this.props
    const { customerShortenedCode, customerKey } = this.props.searchFilters
    const { size, from } = this.state
    const modifiedSearchFilters = {
      ...this.props.searchFilters,
      customerKey: customerShortenedCode
        ? getFullCustomerKey(customerShortenedCode)
        : customerKey || undefined,
    }
    const query = {
      ...modifiedSearchFilters,
      ...this.props.issuedLoansSearchFilters,
      branchId: fromBranch ? branchId : this.props.searchFilters.branchId,
      size,
      from,
      url: 'loan',
      sort: 'issueDate',
    }
    if (query.key === '') delete query.key
    this.props.search(query).then(() => {
      if (error) Swal.fire('Error !', getErrorMessage(error), 'error')
    })
  }

  renderActions(data) {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',

        actionPermission: true,
        actionOnClick: () =>
          this.props.history.push('/loans/loan-profile', {
            id: data.application._id,
          }),
      },
    ]
  }

  render() {
    const smePermission =
      (this.props.location.state && this.props.location.state.sme) || false
    const manageLoansTabs = smePermission
      ? manageSMELoansArray()
      : manageLoansArray()
    const searchKeys = [
      'keyword',
      'dateFromTo',
      'status',
      'branch',
      'doubtful',
      'writtenOff',
    ]
    const dropDownKeys = [
      'name',
      'key',
      'customerKey',
      'customerCode',
      'customerShortenedCode',
    ]
    const filteredMappers = smePermission
      ? this.mappers.filter((mapper) => mapper.key !== 'nationalId')
      : this.mappers
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
      searchKeys.splice(4, 0, 'loanType')
    }
    return (
      <>
        <HeaderWithCards
          header={local.issuedLoans}
          array={manageLoansTabs}
          active={manageLoansTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('issued-loans')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.issuedLoans}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfIssuedLoans +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={searchKeys}
              dropDownKeys={dropDownKeys}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              setFrom={(from) => this.setState({ from })}
              datePlaceholder={local.issuanceDate}
              url="loan"
              from={this.state.from}
              size={this.state.size}
              submitClassName="mt-0"
              hqBranchIdRequest={this.props.branchId}
              sme={this.props.location.state && this.props.location.state.sme}
            />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="loan"
              totalCount={this.props.totalCount}
              mappers={filteredMappers}
              pagination
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getLoans())
              }}
            />
          </Card.Body>
        </Card>
      </>
    )
  }
}

const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setIssuedLoanSearchFilters: (data) =>
      dispatch(issuedLoansSearchFilters(data)),
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
    issuedLoansSearchFilters: state.issuedLoansSearchFilters,
  }
}

export default connect(mapStateToProps, addSearchToProps)(withRouter(LoanList))
