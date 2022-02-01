import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import { manageAccountsArray } from './manageAccountsInitials'
import {
  getDateAndTime,
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'
import { LtsIcon } from '../../../Shared/Components'
import Can from '../../../Shared/config/Can'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { setUserActivation } from '../../../Shared/Services/APIs/Users/userActivation'

interface Props extends RouteComponentProps {
  data: any
  error: string
  totalCount: number
  loading: boolean
  searchFilters: any
  statusCode: string
  search: (data) => Promise<void>
  setLoading: (data) => void
  setSearchFilters: (data) => void
  branchId?: string
  withHeader: boolean
}
interface State {
  size: number
  from: number
  manageAccountTabs: any[]
}

class UsersList extends Component<Props, State> {
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
      manageAccountTabs: [],
    }
    this.mappers = [
      {
        title: local.username,
        key: 'username',
        sortable: true,
        render: (data) => data.username,
      },
      {
        title: local.code,
        key: 'userCode',
        render: (data) => data.loanOfficerKey,
      },
      {
        title: local.name,
        key: 'name',
        render: (data) => data.name,
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) => data.nationalId,
      },
      {
        title: local.hrCode,
        key: 'hrCode',
        render: (data) => data.hrCode,
      },
      {
        title: local.employment,
        key: 'employment',
        render: (data) =>
          data.hiringDate ? timeToDateyyymmdd(data.hiringDate) : '',
      },
      {
        title: local.creationDate,
        key: 'createdAt',
        sortable: true,
        render: (data) =>
          data.created?.at ? getDateAndTime(data.created.at) : '',
      },
      {
        title: '',
        key: 'actions',
        render: (data) => this.renderIcons(data),
      },
    ]
  }

  componentDidMount() {
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'user',
        branchId: this.props.branchId,
      })
      .then(() => {
        if (this.props.error)
          Swal.fire({
            title: local.errorTitle,
            text: getErrorMessage(this.props.error),
            icon: 'error',
            confirmButtonText: local.confirmationText,
          })
      })
    this.setState({
      manageAccountTabs: manageAccountsArray(),
    })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  async handleActivationClick(data: any) {
    const req = {
      id: data._id,
      status: data.status === 'active' ? 'inactive' : 'active',
    }
    this.props.setLoading(true)

    const res = await setUserActivation(req)
    if (res.status === 'success') {
      this.props.setLoading(false)
      Swal.fire({
        text: `${data.username}  ${req.status} `,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => this.getUsers())
    } else {
      this.props.setLoading(false)
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
  }

  async getUsers() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'user',
        branchId: this.props.branchId,
      })
      .then(() => {
        if (this.props.error)
          Swal.fire({
            title: local.errorTitle,
            text: getErrorMessage(this.props.error),
            icon: 'error',
            confirmButtonText: local.confirmationText,
          })
      })
  }

  renderIcons(data: any) {
    return (
      <>
        <Can I="userActivation" a="user">
          <span
            className="icon"
            onClick={() => this.handleActivationClick(data)}
          >
            {data.status === 'active' && (
              <LtsIcon
                name="deactivate-user"
                color="#7dc255"
                tooltipText={local.deactivate}
              />
            )}
            {data.status === 'inactive' && local.activate}
          </span>
        </Can>
        <Can I="updateUser" a="user">
          <span
            className="icon"
            onClick={() => {
              this.props.history.push({
                pathname: '/manage-accounts/users/edit-user',
                state: { details: data._id },
              })
            }}
          >
            <LtsIcon name="edit" color="#7dc255" tooltipText={local.edit} />
          </span>
        </Can>

        <span
          className="icon"
          onClick={() => {
            this.props.history.push({
              pathname: '/manage-accounts/users/user-details',
              state: { details: data._id },
            })
          }}
        >
          <LtsIcon name="view" color="#7dc255" tooltipText={local.view} />
        </span>
      </>
    )
  }

  render() {
    return (
      <div>
        {this.props.withHeader && (
          <HeaderWithCards
            header={local.manageAccounts}
            array={this.state.manageAccountTabs}
            active={1}
          />
        )}
        <Card className="m-4">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body className="p-0">
            <div className="d-flex justify-content-between m-3">
              <div className="d-flex align-items-center">
                <Card.Title className="mr-4 mb-0">{local.users}</Card.Title>
                <span>
                  {local.noOfUsers +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
              <div>
                <Can I="createUser" a="user">
                  <Button
                    className="mr-4 big-button"
                    onClick={() =>
                      this.props.history.push('/manage-accounts/users/new-user')
                    }
                  >
                    {local.createNewUser}
                  </Button>
                </Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo']}
              dropDownKeys={['name', 'nationalId', 'key', 'userName', 'hrCode']}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              setFrom={(from) => this.setState({ from })}
              url="user"
              from={this.state.from}
              size={this.state.size}
              hqBranchIdRequest={this.props.branchId}
            />

            <DynamicTable
              url="user"
              from={this.state.from}
              size={this.state.size}
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getUsers())
              }}
            />
          </Card.Body>
        </Card>
      </div>
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
    statusCode: state.search.status,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(mapStateToProps, addSearchToProps)(withRouter(UsersList))
