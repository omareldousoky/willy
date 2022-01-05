import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import { Loader } from 'Shared/Components/Loader'
import DynamicTable from 'Shared/Components/DynamicTable/dynamicTable'
import Search from 'Shared/Components/Search/search'
import { search, searchFilters } from 'Shared/redux/search/actions'
import * as local from 'Shared/Assets/ar.json'
import { getErrorMessage, getDateAndTime } from 'Shared/Services/utils'

interface State {
  size: number
  from: number
}

interface Props {
  data: any
  error: string
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
}
class ActionLogs extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      size: 5,
      from: 0,
    }
    this.mappers = [
      {
        title: local.timeAndDate,
        key: 'timeAndDate',
        render: (data) => (data.trace?.at ? getDateAndTime(data.trace.at) : ''),
      },
      {
        title: local.employee,
        key: 'employee',
        render: (data) => (data.trace?.userName ? data.trace.userName : ''),
      },
      {
        title: local.transaction,
        key: 'transaction',
        render: (data) => (data.action ? data.action : ''),
      },
    ]
  }

  componentDidMount() {
    this.getActionLogs()
  }

  getActionLogs() {
    this.props
      .search({
        ...this.props.searchFilters,
        from: this.state.from,
        size: this.state.size,
        url: 'actionLogs',
      })
      .then(() => {
        if (this.props.error)
          Swal.fire('error', getErrorMessage(this.props.error), 'error')
      })
  }

  render() {
    return (
      <>
        <Card>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.logs}
                </Card.Title>
                <span className="text-muted">
                  {local.nOfActionLogs +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
            </div>
          </Card.Body>
          <Search
            searchKeys={['keyword', 'dateFromTo', 'actions']}
            dropDownKeys={['authorName']}
            url="actionLogs"
            setFrom={(from) => this.setState({ from })}
            from={this.state.from}
            size={this.state.size}
            datePlaceholder={local.transactionDate}
            searchPlaceholder={local.searchByEmp}
          />

          <DynamicTable
            totalCount={this.props.totalCount}
            mappers={this.mappers}
            pagination
            data={this.props.data}
            changeNumber={(key: string, number: number) => {
              this.setState({ [key]: number } as any, () =>
                this.getActionLogs()
              )
            }}
          />
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

export default connect(mapStateToProps, addSearchToProps)(ActionLogs)
