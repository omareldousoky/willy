import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FormCheck from 'react-bootstrap/FormCheck'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import Select from 'react-select'

import { connect } from 'react-redux'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import './managerHierarchy.scss'
import Search from '../../../Shared/Components/Search/search'

import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'

import { getErrorMessage } from '../../../Shared/Services/utils'
import { getCookie } from '../../../Shared/Services/getCookie'

import { theme } from '../../../Shared/theme'
import ability from '../../config/ability'
import { approveOfficersGroups } from '../../Services/APIs/ManagerHierarchy/approveOfficersGroups'
import { unApproveOfficersGroups } from '../../Services/APIs/ManagerHierarchy/unApproveOfficersGroups'
import { loading } from '../../../Shared/redux/loading/actions'
import { SupervisionGroupsListProps, SupervisionGroupsListState } from './types'
import { ActionsIconGroup } from '../../../Shared/Components'
import { GroupsByBranch } from '../../../Shared/Services/interfaces'

class SupervisionGroupsList extends Component<
  SupervisionGroupsListProps,
  SupervisionGroupsListState
> {
  mappers: {
    title: (() => void) | string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props: SupervisionGroupsListProps) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
      searchKey: [''],
      selectedGroups: [],
      checkAll: false,
      options: [{ label: local.getSupervisionGroups, value: '' }],
      chosenStatus: '',
      officersModal: false,
    }
    this.mappers = [
      {
        title: () => (
          <FormCheck
            type="checkbox"
            onChange={(e) => this.checkAll(e)}
            checked={this.state.checkAll}
          />
        ),
        key: 'selected',
        render: (data) =>
          data.status === this.state.chosenStatus && (
            <FormCheck
              type="checkbox"
              checked={Boolean(
                this.state.selectedGroups.find((group) => group.id === data.id)
              )}
              onChange={() => this.addRemoveItemFromChecked(data)}
            />
          ),
      },
      {
        title: local.oneBranch,
        key: 'branch',
        render: (data) => data?.branch?.name,
      },
      {
        title: local.groupManager,
        key: 'leader',
        render: (data) => data?.leader?.name,
      },
      {
        title: local.status,
        key: 'status',
        render: (data) => this.getStatus(data.status),
      },
      {
        title: local.loanOfficerOrCoordinator,
        key: 'officers',
        render: (data) =>
          data.officers && (
            <ActionsIconGroup
              currentId={data.id}
              actions={[
                {
                  actionTitle: local.loanOfficerOrCoordinator,
                  actionIcon: 'customers',
                  actionPermission: true,
                  actionOnClick: () => {
                    this.setState({
                      officersModal: true,
                      currentGroup: data as GroupsByBranch,
                    })
                  },
                },
              ]}
            />
          ),
      },
    ]
  }

  componentDidMount() {
    const selectOptions = [{ label: local.getSupervisionGroups, value: '' }]
    if (ability.can('approveOfficersGroup', 'branch'))
      selectOptions.push({
        label: local.approveSuperVisionGroups,
        value: 'pending',
      })
    if (ability.can('unApproveOfficersGroup', 'branch'))
      selectOptions.push({
        label: local.unApproveSuperVisionGroups,
        value: 'approved',
      })
    this.setState({ options: selectOptions })
    this.props
      .search({
        size: this.state.size,
        from: this.state.from,
        url: 'supervisionsGroups',
        branchId: this.state.branchId !== 'hq' ? this.state.branchId : '',
        status: this.state.chosenStatus,
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
        if (this.state.branchId === 'hq') {
          this.setState({ searchKey: ['branch'] })
        }
      })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getStatus(status: string) {
    switch (status) {
      case 'pending':
        return (
          <div
            className="status-chip outline under-review"
            style={{ width: '100px' }}
          >
            {local.pending}
          </div>
        )
      case 'approved':
        return (
          <div
            className="status-chip outline approved"
            style={{ width: '100px' }}
          >
            {local.approved}
          </div>
        )
      default:
        return null
    }
  }

  getSupervisionsGroups() {
    const searchObj = {
      ...this.props.searchFilters,
      size: this.state.size,
      from: this.state.from,
      url: 'supervisionsGroups',
      status: this.state.chosenStatus,
    }
    this.props.search(searchObj).then(() => {
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

  selectState = (event) => {
    this.setState(
      {
        chosenStatus: event.value,
        from: 0,
      },
      () => {
        if (this.state.branchId !== 'hq') {
          this.props.search({
            ...this.props.searchFilters,
            size: this.state.size,
            from: this.state.from,
            url: 'supervisionsGroups',
            status: this.state.chosenStatus,
            branchId: this.state.branchId,
          })
        } else {
          this.props.search({
            ...this.props.searchFilters,
            size: this.state.size,
            from: this.state.from,
            url: 'supervisionsGroups',
            status: this.state.chosenStatus,
          })
        }
      }
    )
    // const branch = this.state.branchId !== 'hq' ? this.state.branchId : ''
  }

  submit = () => {
    const branchesGroupIds = this.prepareSubmit()
    if (this.state.chosenStatus === 'pending') {
      this.approveOfficers(branchesGroupIds)
    } else if (this.state.chosenStatus === 'approved') {
      this.unApproveOfficers(branchesGroupIds)
    }
  }

  prepareSubmit() {
    const selectedGroupsMap: Map<string, string[]> = new Map()
    this.state.selectedGroups.map((group) => {
      if (selectedGroupsMap.has(group.branchId)) {
        selectedGroupsMap.get(group.branchId)?.push(group.id)
      } else {
        selectedGroupsMap.set(group.branchId, [group.id])
      }
    })
    const branchesGroupIds: {
      branchId: string
      groupIds: string[]
    }[] = []
    selectedGroupsMap.forEach((value, key) => {
      branchesGroupIds.push({
        branchId: key,
        groupIds: value,
      })
    })
    return branchesGroupIds
  }

  addRemoveItemFromChecked(group) {
    if (
      this.state.selectedGroups.findIndex(
        (groupItem) => groupItem.id === group.id
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedGroups: prevState.selectedGroups.filter(
          (el) => el.id !== group.id
        ),
      }))
    } else {
      this.setState((prevState) => ({
        selectedGroups: [...prevState.selectedGroups, group],
      }))
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState((prevState) => ({
        checkAll: true,
        selectedGroups: this.props.data.filter(
          (group) => group.status === prevState.chosenStatus
        ),
      }))
    } else this.setState({ checkAll: false, selectedGroups: [] })
  }

  async approveOfficers(branchesGroupIds) {
    this.props.setLoading(true)
    const res = await approveOfficersGroups({ branchesGroupIds })
    if (res.status === 'success') {
      this.props.setLoading(false)
      Swal.fire({
        title: local.success,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => window.location.reload())
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

  async unApproveOfficers(branchesGroupIds) {
    this.props.setLoading(true)
    const res = await unApproveOfficersGroups({ branchesGroupIds })
    if (res.status === 'success') {
      this.props.setLoading(false)
      Swal.fire({
        title: local.success,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => window.location.reload())
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

  render() {
    return (
      <>
        <div className="print-none">
          <Card className="main-card">
            <Loader type="fullsection" open={this.props.loading} />
            <Card.Body style={{ padding: 0 }}>
              <div className="custom-card-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                    {local.levelsOfSupervision}
                  </Card.Title>
                  <span className="text-muted">
                    {local.noOfSupervisionGroups +
                      ` (${this.props.totalCount ? this.props.totalCount : 0})`}
                  </span>
                </div>
                {this.state.chosenStatus && (
                  <Button
                    onClick={this.submit}
                    disabled={!this.state.selectedGroups.length}
                    className="big-button"
                    style={{ marginLeft: 20, height: 70 }}
                  >
                    {this.state.chosenStatus === 'pending'
                      ? local.approveSuperVisionGroups
                      : local.unApproveSuperVisionGroups}
                  </Button>
                )}
              </div>
              <hr className="dashed-line" />
              <>
                <Col sm={6}>
                  <Form.Label
                    as={Row}
                    style={{
                      fontWeight: 'bolder',
                      margin: '9px',
                    }}
                  >
                    {local.chooseOperationType}
                  </Form.Label>
                  <Select
                    styles={theme.selectStyleWithBorder}
                    theme={theme.selectTheme}
                    placeholder={local.chooseOperationType}
                    onChange={(event) => {
                      this.selectState(event)
                    }}
                    options={this.state.options}
                  />
                </Col>
                {this.state.branchId === 'hq' ? (
                  <Search
                    searchKeys={this.state.searchKey}
                    url="supervisionsGroups"
                    from={this.state.from}
                    size={this.state.size}
                    chosenStatus={this.state.chosenStatus}
                    searchPlaceholder={
                      local.searchByBranchNameOrNationalIdOrCode
                    }
                  />
                ) : (
                  <Search
                    searchKeys={this.state.searchKey}
                    url="supervisionsGroups"
                    from={this.state.from}
                    size={this.state.size}
                    chosenStatus={this.state.chosenStatus}
                    searchPlaceholder={
                      local.searchByBranchNameOrNationalIdOrCode
                    }
                    hqBranchIdRequest={this.state.branchId}
                  />
                )}
                {this.props.data && (
                  <DynamicTable
                    from={this.state.from}
                    size={this.state.size}
                    totalCount={this.props.totalCount}
                    mappers={this.mappers}
                    pagination
                    data={this.props.data}
                    url="supervisionsGroups"
                    changeNumber={(key: string, number: number) => {
                      this.setState({ [key]: number } as any, () =>
                        this.getSupervisionsGroups()
                      )
                    }}
                  />
                )}
              </>
            </Card.Body>
          </Card>
        </div>
        <Modal show={this.state.officersModal} size="lg">
          <Modal.Header>{local.loanOfficerOrCoordinator}</Modal.Header>
          <Modal.Body>
            <div>
              <h4>{local.groupLeaderName}</h4>
              <p>{this.state.currentGroup?.leader.name}</p>
            </div>
            <Table striped bordered>
              <thead>
                <th className="border-0">{local.loanOfficerOrCoordinator}</th>
              </thead>
              <tbody>
                {this.state.currentGroup?.officers?.map((officer, index) => (
                  <tr key={index} className="border-0">
                    <td className="text-break">{officer.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                this.setState({ officersModal: false, currentGroup: undefined })
              }}
            >
              {local.cancel}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
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

export default connect(mapStateToProps, addSearchToProps)(SupervisionGroupsList)
