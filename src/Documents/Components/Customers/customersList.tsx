import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Search from '../../../Shared/Components/Search/search'

import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import {
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'
import { ActionsIconGroup } from '../../../Shared/Components'
import ability from '../../../Shared/config/ability'

interface State {
  size: number
  from: number
}
interface Props
  extends RouteComponentProps<{}, {}, { sme?: boolean; id: number }> {
  data: any
  totalCount: number
  loading: boolean
  searchFilters: any
  error: string
  branchId: string
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
}
class CustomersList extends Component<Props, State> {
  locationListenerUnregister: () => void

  constructor(props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
    }

    this.locationListenerUnregister = this.props.history.listen(
      (location: { state: any }) => {
        const type = location?.state?.sme ? 'company' : 'individual'
        this.getCustomers(type)
      }
    )
  }

  componentDidMount() {
    this.getCustomers()
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
    this.locationListenerUnregister()
  }

  getCustomers(type?: string) {
    const currentType = this.props.location.state?.sme
      ? 'company'
      : 'individual'

    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'customer',
        branchId: this.props.branchId,
        customerType: type || currentType,
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
  }

  dropDownKeys() {
    return this.props.location.state?.sme
      ? [
          'name',
          'taxCardNumber',
          'commercialRegisterNumber',
          'key',
          'code',
          'customerShortenedCode',
        ]
      : ['name', 'nationalId', 'key', 'code', 'customerShortenedCode']
  }

  mappers() {
    const isSme = this.props.location?.state?.sme

    return [
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
      ...(isSme
        ? [
            {
              title: local.commercialRegisterNumber,
              key: 'commercialRegisterNumber',
              render: (row) => row.commercialRegisterNumber,
            },
            {
              title: local.taxCardNumber,
              key: 'taxCardNumber',
              render: (row) => row.taxCardNumber,
            },
          ]
        : [
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
          ]),
      {
        title: local.creationDate,
        sortable: true,
        key: 'createdAt',
        render: (data) => timeToDateyyymmdd(data.created?.at),
      },
      {
        title: local.actions,
        key: 'actions',
        render: (data) => (
          <ActionsIconGroup
            currentId={data._id}
            actions={[
              {
                actionTitle: local.uploadDocuments,
                actionIcon: 'download',
                actionPermission: ability.can('updateCustomer', 'customer'),
                actionOnClick: () =>
                  this.props.history.push('/edit-customer-document', {
                    id: data._id,
                    sme: !!this.props.location.state?.sme,
                  }),
                style: {
                  transform: `rotate(180deg)`,
                },
              },
            ]}
          />
        ),
      },
    ]
  }

  render() {
    return (
      <Card style={{ margin: '20px 50px' }}>
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
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={['keyword', 'dateFromTo', 'governorate']}
            dropDownKeys={this.dropDownKeys()}
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
              mappers={this.mappers()}
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
