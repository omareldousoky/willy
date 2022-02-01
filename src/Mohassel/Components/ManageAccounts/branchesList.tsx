import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import Can from '../../config/Can'
import * as local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageAccountsArray } from './manageAccountsInitials'
import { getErrorMessage, getDateAndTime } from '../../../Shared/Services/utils'
import { getCookie } from '../../../Shared/Services/getCookie'
import {
  BranchDetailsResponse,
  getBranch,
} from '../../../Shared/Services/APIs/Branch/getBranch'
import { LtsIcon } from '../../../Shared/Components'

interface State {
  size: number
  from: number
  manageAccountTabs: any[]
  branchId: string
  branch: object
}
interface Props extends RouteComponentProps {
  data: any
  error: string
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
}

class BranchesList extends Component<Props, State> {
  mappers: {
    title: string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      manageAccountTabs: [],
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
      branch: {},
    }
    this.mappers = [
      {
        title: local.branchCode,
        key: 'branchCode',
        render: (data) => data.branchCode,
      },
      {
        title: local.oneBranch,
        key: 'name',
        sortable: true,
        render: (data) => data.name,
      },
      {
        title: local.governorate,
        key: 'governorate',
        sortable: true,
        render: (data) => data.governorate,
      },
      {
        title: local.creationDate,
        key: 'createdAt',
        sortable: true,
        render: (data) => (data.created ? getDateAndTime(data.created.at) : ''),
      },
      {
        title: '',
        key: 'actions',
        render: (data) => (
          <>
            <Button
              variant="default"
              onClick={() =>
                this.props.history.push({
                  pathname: '/manage-accounts/branches/branch-details',
                  state: { details: data._id },
                })
              }
            >
              <LtsIcon name="view" />
            </Button>
            <Can I="createBranch" a="branch">
              <Button
                variant="default"
                onClick={() =>
                  this.props.history.push({
                    pathname: '/manage-accounts/branches/edit-branch',
                    state: { details: data._id },
                  })
                }
              >
                <LtsIcon name="edit" />
              </Button>
            </Can>
          </>
        ),
      },
    ]
  }

  componentDidMount() {
    if (this.state.branchId === 'hq') {
      this.props
        .search({ size: this.state.size, from: this.state.from, url: 'branch' })
        .then(() => {
          if (this.props.error)
            Swal.fire({
              title: local.errorTitle,
              text: getErrorMessage(this.props.error),
              icon: 'error',
              confirmButtonText: local.confirmationText,
            })
        })
    } else {
      this.getBranchByID()
    }
    this.setState({
      manageAccountTabs: manageAccountsArray(),
    })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
    this.props.search({ url: 'clearData' })
  }

  getBranches() {
    this.props
      .search({
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'branch',
        branchId: this.state.branchId !== 'hq' ? this.state.branchId : '',
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

  async getBranchByID() {
    const res = await getBranch(this.state.branchId)
    if (res.status === 'success') {
      if ((res.body as BranchDetailsResponse)?.data)
        this.setState({ branch: (res.body as BranchDetailsResponse).data })
    }
  }

  render() {
    return (
      <div>
        <HeaderWithCards
          header={local.manageAccounts}
          array={this.state.manageAccountTabs}
          active={this.state.manageAccountTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('branches')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.branches}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfBranches +
                    ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                </span>
              </div>
              <div>
                <Can I="createBranch" a="branch">
                  <Button
                    onClick={() => {
                      this.props.history.push(
                        '/manage-accounts/branches/new-branch'
                      )
                    }}
                    className="big-button"
                  >
                    {local.createNewBranch}
                  </Button>
                </Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            {this.state.branchId === 'hq' && (
              <Search
                searchKeys={['keyword', 'dateFromTo']}
                dropDownKeys={['name', 'code']}
                searchPlaceholder={local.searchByBranchNameOrCode}
                url="branch"
                setFrom={(from) => this.setState({ from })}
                from={this.state.from}
                size={this.state.size}
              />
            )}
            {this.state.branchId !== 'hq' && this.state.branch && (
              <DynamicTable
                totalCount={1}
                mappers={this.mappers}
                pagination={false}
                data={[this.state.branch]}
              />
            )}
            {this.props.data && (
              <DynamicTable
                url="branch"
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination
                data={this.props.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () =>
                    this.getBranches()
                  )
                }}
              />
            )}
          </Card.Body>
        </Card>
      </div>
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
)(withRouter(BranchesList))
