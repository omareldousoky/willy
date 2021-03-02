import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import Can from '../../config/Can'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'
import { getDateAndTime } from '../../Services/getRenderDate'

interface Props {
  history: any
  _id: string
  data: any
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => void
  setSearchFilters: (data) => void
}
interface State {
  size: number
  from: number
}

class RoleUsers extends Component<Props, State> {
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
        title: local.employment,
        key: 'employment',
        render: (data) =>
          data.hiringDate ? timeToDateyyymmdd(data.hiringDate) : '',
      },
      {
        title: local.creationDate,
        key: 'creationDate',
        sortable: true,
        render: (data) =>
          data.created?.at ? getDateAndTime(data.created.at) : '',
      },
      {
        title: '',
        key: 'actions',
        render: (data) => (
          <>
            <img
              style={{ cursor: 'pointer', marginLeft: 20 }}
              alt="view"
              src={require('../../Assets/view.svg')}
              onClick={() => {
                this.props.history.push({
                  pathname: '/manage-accounts/users/user-details',
                  state: { details: data._id },
                })
              }}
            />
            <Can I="createUser" a="user">
              <img
                style={{ cursor: 'pointer' }}
                alt="edit"
                src={require('../../Assets/editIcon.svg')}
                onClick={() => {
                  this.props.history.push({
                    pathname: '/manage-accounts/users/edit-user',
                    state: { details: data._id },
                  })
                }}
              />
            </Can>
          </>
        ),
      },
    ]
  }

  componentDidMount() {
    this.getUsers()
  }

  getUsers() {
    this.props.search({
      ...this.props.searchFilters,
      size: this.state.size,
      from: this.state.from,
      roleId: this.props._id,
      url: 'user',
    })
  }

  render() {
    return (
      <>
        <Card className="main-card">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.users}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfUsers}{' '}
                  {this.props.totalCount ? this.props.totalCount : 0}
                </span>
              </div>
              {/* <div>
                                <Button variant="outline-primary" className="big-button">download pdf</Button>
                            </div> */}
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo']}
              dropDownKeys={['name', 'nationalId', 'key']}
              searchPlaceholder={local.searchByNameOrNationalId}
              url="user"
              setFrom={(from) => this.setState({ from })}
              from={this.state.from}
              size={this.state.size}
              roleId={this.props._id}
            />
            <DynamicTable
              url="user"
              from={this.state.from}
              size={this.state.size}
              mappers={this.mappers}
              totalCount={this.props.totalCount}
              pagination
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getUsers())
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
    data: state.search.data,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(mapStateToProps, addSearchToProps)(withRouter(RoleUsers))
