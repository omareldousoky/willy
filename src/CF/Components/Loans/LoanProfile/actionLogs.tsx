import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { Loader } from '../../../../Shared/Components/Loader'
import { getApplicationLogs } from '../../../../Shared/Services/APIs/loanApplication/applicationLogs'
import DynamicTable from '../../../../Shared/Components/DynamicTable/dynamicTable'
import * as local from '../../../../Shared/Assets/ar.json'
import {
  getErrorMessage,
  getDateAndTime,
} from '../../../../Shared/Services/utils'

interface Props {
  id: string
}

interface State {
  loading: boolean
  data: any
  from: number
  size: number
  totalCount: number
}
const mappers = [
  {
    title: local.action,
    key: 'action',
    render: (data) => (data.action ? data.action : ''),
  },
  {
    title: local.author,
    key: 'authorName',
    render: (data) => (data.trace?.userName ? data.trace.userName : ''),
  },
  {
    title: local.authorId,
    key: 'authorId',
    render: (data) => (data.trace?.by ? data.trace.by : ''),
  },
  {
    title: local.createdAt,
    key: 'createdAt',
    render: (data) => (data.trace?.at ? getDateAndTime(data.trace.at) : ''),
  },
  // {
  //   title: local.customerId,
  //   key: "customerId",
  //   render: data => data.customerId
  // },
  // {
  //     title: local.customerBranchId,
  //     key: "customerBranchId",
  //     render: data => data.customerBranchId
  //   },
]
class ActionLogs extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      size: 5,
      from: 0,
      totalCount: 0,
    }
  }

  componentDidMount() {
    this.getLogs(this.props.id)
  }

  async getLogs(id) {
    this.setState({ loading: true })
    const res = await getApplicationLogs(id, this.state.size, this.state.from)
    if (res.status === 'success') {
      this.setState({
        data: res.body.data ? res.body.data : [],
        totalCount: res.body.totalCount,
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      )
    }
  }

  render() {
    return (
      <>
        <Loader type="fullsection" open={this.state.loading} />
        {this.state.data.length > 0 ? (
          <DynamicTable
            totalCount={this.state.totalCount}
            pagination
            data={this.state.data}
            mappers={mappers}
            changeNumber={(key: string, number: number) => {
              this.setState({ [key]: number } as any, () =>
                this.getLogs(this.props.id)
              )
            }}
          />
        ) : (
          <p style={{ textAlign: 'center' }}>{local.noLogsFound}</p>
        )}
      </>
    )
  }
}
export default ActionLogs
