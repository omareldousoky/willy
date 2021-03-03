import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import {
  timeToDateyyymmdd,
  beneficiaryType,
  getErrorMessage,
  getFullCustomerKey,
} from '../../../Shared/Services/utils'
import { manageLoansArray } from './manageLoansInitials'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'

interface Props {
  history: Array<any>
  data: any
  error: string
  branchId: string
  fromBranch?: boolean
  totalCount: number
  loading: boolean
  searchFilters: any
  issuedLoansSearchFilters: any
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
}
interface State {
  size: number
  from: number
  searchKeys: any
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
      searchKeys: [
        'keyword',
        'dateFromTo',
        'status',
        'branch',
        'doubtful',
        'writtenOff',
      ],
    }
    this.mappers = [
      {
        title: local.customerType,
        key: 'customerType',
        render: (data) =>
          beneficiaryType(data.application.product.beneficiaryType),
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
            {data.application.product.beneficiaryType === 'individual' ? (
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
        render: (data) => this.renderIcons(data),
      },
    ]
  }

  componentDidMount() {
    this.props
      .search({
        ...this.props.issuedLoansSearchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'loan',
        sort: 'issueDate',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('Error !', getErrorMessage(this.props.error), 'error')
      })
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

  renderIcons(data) {
    return (
      <>
        <img
          style={{ cursor: 'pointer', marginLeft: 20 }}
          alt="view"
          src={require('../../Assets/view.svg')}
          onClick={() =>
            this.props.history.push('/loans/loan-profile', {
              id: data.application._id,
            })
          }
        />
      </>
    )
  }

  async getLoans() {
    const {
      searchFilters,
      search,
      error,
      fromBranch,
      branchId,
      issuedLoansSearchFilters,
    } = this.props
    const { customerShortenedCode, customerKey } = searchFilters
    const { size, from } = this.state
    const modifiedSearchFilters = {
      ...searchFilters,
      customerKey: customerShortenedCode
        ? getFullCustomerKey(customerShortenedCode)
        : customerKey || undefined,
    }
    const query = {
      ...modifiedSearchFilters,
      ...issuedLoansSearchFilters,
      size,
      from,
      url: 'loan',
      branchId: fromBranch ? branchId : undefined,
      sort: 'issueDate',
    }
    search(query).then(() => {
      if (error) Swal.fire('Error !', getErrorMessage(error), 'error')
    })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  render() {
    const array = manageLoansArray()
    return (
      <>
        <HeaderWithCards
          header={local.issuedLoans}
          array={array}
          active={array
            .map((item) => {
              return item.icon
            })
            .indexOf('issuedLoans')}
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
              searchKeys={this.state.searchKeys}
              dropDownKeys={[
                'name',
                'nationalId',
                'key',
                'customerKey',
                'customerCode',
                'customerShortenedCode',
              ]}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              setFrom={(from) => this.setState({ from })}
              datePlaceholder={local.issuanceDate}
              url="loan"
              from={this.state.from}
              size={this.state.size}
              submitClassName="mt-0"
              hqBranchIdRequest={this.props.branchId}
            />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="loan"
              totalCount={this.props.totalCount}
              mappers={this.mappers}
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
