import React, { Component } from 'react'

import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'

import Swal from 'sweetalert2'
import './managerHierarchy.scss'
import { CardNavBar } from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import local from '../../../Shared/Assets/ar.json'
import { SupervisionLevelsCreation } from './supervisionLevelsCreation'
import { BranchBasicsCard } from './branchBasicsCard'
import { getOfficersGroups } from '../../Services/APIs/ManagerHierarchy/getOfficersGroups'
import SupervisionLevelsActions from './supervisionLevelsActions'
import ability from '../../config/ability'
import { Loader } from '../../../Shared/Components/Loader'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { SupervisionsProfileProps, SupervisionsProfileState } from './types'

class SupervisionsProfile extends Component<
  SupervisionsProfileProps,
  SupervisionsProfileState
> {
  constructor(props: SupervisionsProfileProps) {
    super(props)
    this.state = {
      loading: false,
      activeTab: 'supervisionDetails',
      tabsArray: [],
      data: {
        id: '',
        branchId: '',
        startDate: 0,
        groups: [],
      },
    }
  }

  componentDidMount() {
    const tabsToRender = [
      {
        header: local.levelsOfSupervision,
        stringKey: 'supervisionDetails',
      },
    ]

    if (ability.can('createOfficersGroup', 'branch'))
      tabsToRender.push({
        header: local.createSuperVisionGroups,
        stringKey: 'createSuperVisionGroups',
      })
    if (ability.can('updateOfficersGroup', 'branch'))
      tabsToRender.push({
        header: local.editSuperVisionGroups,
        stringKey: 'editSuperVisionGroups',
      })
    if (ability.can('deleteOfficersGroup', 'branch'))
      tabsToRender.push({
        header: local.deleteSuperVisionGroups,
        stringKey: 'deleteSuperVisionGroups',
      })
    if (ability.can('approveOfficersGroup', 'branch'))
      tabsToRender.push({
        header: local.approveSuperVisionGroups,
        stringKey: 'approveSuperVisionGroups',
      })
    if (ability.can('unApproveOfficersGroup', 'branch'))
      tabsToRender.push({
        header: local.unApproveSuperVisionGroups,
        stringKey: 'unApproveSuperVisionGroups',
      })
    this.setState({
      tabsArray: tabsToRender,
    })
    this.getGroups()
  }

  async getGroups() {
    this.setState({ loading: true })
    const res = await getOfficersGroups(this.props.branchId)
    if (res.status === 'success') {
      if (res.body.data)
        this.setState({
          data: res.body.data,
          loading: false,
        })
      else {
        this.setState({ loading: false })
      }
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(res.error.error),
        icon: 'error',
      })
    }
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

  renderMainInfo() {
    return this.state.data?.groups?.length ? (
      <>
        {this.state.data.groups.map((group, index) => {
          return (
            <Table striped bordered hover key={group.id}>
              <tbody
                style={{
                  padding: '2rem 0',
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
                key={index}
              >
                <tr style={{ height: '50px' }}>
                  <td className="header">{local.groupManager}</td>
                  <td>{group.leader.name}</td>
                </tr>
                <tr style={{ height: '50px' }}>
                  <td className="header">{local.loanOfficerOrCoordinator}</td>
                  <td className="cell">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        flexFlow: 'row wrap ',
                      }}
                    >
                      {group.officers?.map((officer, i) => {
                        return (
                          officer.name && (
                            <div key={i} className="labelBtn">
                              {officer.name}
                            </div>
                          )
                        )
                      })}
                    </div>
                  </td>
                </tr>
                <tr style={{ height: '50px' }}>
                  <td className="header">{local.status}</td>
                  <td className="cell">
                    {group.status ? this.getStatus(group.status) : null}
                  </td>
                </tr>
              </tbody>
            </Table>
          )
        })}
      </>
    ) : (
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <img
          alt="no-data-found"
          src={require('../../../Shared/Assets/no-results-found.svg')}
        />
        <h4>{local.noResultsFound}</h4>
      </div>
    )
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'supervisionDetails':
        return this.renderMainInfo()
      case 'createSuperVisionGroups':
        return (
          <SupervisionLevelsCreation
            branchId={this.props.branchId}
            mode="create"
          />
        )
      case 'editSuperVisionGroups':
        return (
          <SupervisionLevelsCreation
            branchId={this.props.branchId}
            mode="edit"
          />
        )
      case 'deleteSuperVisionGroups':
        return (
          <SupervisionLevelsActions
            branchId={this.props.branchId}
            mode="delete"
          />
        )
      case 'approveSuperVisionGroups':
        return (
          <SupervisionLevelsActions
            branchId={this.props.branchId}
            mode="approve"
          />
        )
      case 'unApproveSuperVisionGroups':
        return (
          <SupervisionLevelsActions
            branchId={this.props.branchId}
            mode="unapprove"
          />
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Card>
          <CardNavBar
            array={this.state.tabsArray}
            active={this.state.activeTab}
            selectTab={(stringKey: string) => {
              this.setState({ activeTab: stringKey })
            }}
          />
          <BranchBasicsCard
            name={this.props.name}
            branchCode={this.props.branchCode}
            createdAt={this.props.createdAt}
            status={this.props.status}
          />

          <Card.Body>
            <Loader open={this.state.loading} type="fullscreen" />
            {this.renderContent()}
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default SupervisionsProfile
