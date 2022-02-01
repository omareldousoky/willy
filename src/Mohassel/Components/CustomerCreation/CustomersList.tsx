import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Can from '../../config/Can'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import ability from '../../config/ability'
import { manageCustomersArray } from './manageCustomersInitial'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import {
  getErrorMessage,
  getFullCustomerKey,
  getDateAndTime,
} from '../../../Shared/Services/utils'
import { ActionsIconGroup } from '../../../Shared/Components'
import { ActionWithIcon } from '../../../Shared/Models/common'

interface State {
  size: number
  from: number
  manageCustomersTabs: any[]
}

interface SearchFilters {
  governorate?: string
  name?: string
  nationalId?: string
  key?: number
  code?: number
  customerShortenedCode?: string // For FE only
}

interface Props extends RouteComponentProps {
  data: any
  totalCount: number
  loading: boolean
  searchFilters: SearchFilters
  error: string
  branchId: string
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
}
class CustomersList extends Component<Props, State> {
  mappers: {
    title: string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  customerActions: ActionWithIcon[]

  constructor(props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      manageCustomersTabs: [],
    }
    this.customerActions = [
      {
        actionTitle: local.editCustomer,
        actionIcon: 'edit',

        actionPermission:
          ability.can('updateCustomer', 'customer') ||
          ability.can('updateNationalId', 'customer'),
        actionOnClick: (id) =>
          this.props.history.push('/customers/edit-customer', { id }),
      },
      {
        actionTitle: local.viewCustomer,
        actionIcon: 'view',

        actionPermission: ability.can('getCustomer', 'customer'),
        actionOnClick: (id) =>
          this.props.history.push('/customers/view-customer', { id }),
      },
    ]

    this.mappers = [
      {
        title: local.customerCode,
        key: 'customerCode',
        render: (data) => data.key,
      },
      {
        title: local.customerName,
        sortable: true,
        key: 'name',
        render: (data) => data.customerName,
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) => data.nationalId,
      },
      {
        title: local.governorate,
        sortable: true,
        key: 'governorate',
        render: (data) => data.governorate,
      },
      {
        title: local.creationDate,
        sortable: true,
        key: 'createdAt',
        render: (data) =>
          data.created?.at ? getDateAndTime(data.created?.at) : '',
      },
      {
        title: local.actions,
        key: 'actions',
        render: (data) => (
          <ActionsIconGroup
            currentId={data._id}
            actions={this.customerActions}
          />
        ),
      },
    ]
  }

  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'customer',
        branchId: this.props.branchId,
        customerType: 'individual',
      })
      .then(() => {
        if (this.props.error) {
          Swal.fire({
            title: local.errorTitle,
            confirmButtonText: local.confirmationText,
            text: getErrorMessage(this.props.error),
            icon: 'error',
          })
        }
      })
    this.setState({ manageCustomersTabs: manageCustomersArray() })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getCustomers() {
    const { error, branchId } = this.props
    const { customerShortenedCode, key } = this.props.searchFilters
    const { size, from } = this.state
    this.props
      .search({
        ...this.props.searchFilters,
        key: customerShortenedCode
          ? getFullCustomerKey(customerShortenedCode)
          : key || undefined,
        size,
        from,
        url: 'customer',
        branchId,
        customerType: 'individual',
      })
      .then(() => {
        if (error) {
          Swal.fire({
            title: local.errorTitle,
            confirmButtonText: local.confirmationText,
            text: getErrorMessage(error),
            icon: 'error',
          })
        }
      })
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.customers}
          array={this.state.manageCustomersTabs}
          active={this.state.manageCustomersTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('customers')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.customers}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfCustomers +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
              <div>
                <Can I="createCustomer" a="customer">
                  <Button
                    onClick={() => {
                      this.props.history.push('/customers/new-customer')
                    }}
                    className="big-button"
                  >
                    {local.newCustomer}
                  </Button>
                </Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={[
                'keyword',
                'dateFromTo',
                'governorate',
                'consumerFinanceLimitStatus',
              ]}
              dropDownKeys={[
                'name',
                'nationalId',
                'key',
                'code',
                'customerShortenedCode',
                'phoneNumber',
              ]}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              url="customer"
              from={this.state.from}
              size={this.state.size}
              setFrom={(from) => this.setState({ from })}
              hqBranchIdRequest={this.props.branchId}
            />
            {this.props.data && (
              <DynamicTable
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination
                data={this.props.data}
                url="customer"
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () =>
                    this.getCustomers()
                  )
                }}
              />
            )}
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
)(withRouter(CustomersList))
