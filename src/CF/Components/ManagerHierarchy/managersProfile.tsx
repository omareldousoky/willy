import React, { Component, CSSProperties } from 'react'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Swal from 'sweetalert2'
import ManagersCreation from 'Shared/Components/managersCreation/ManagersCreation'
import { Loader } from 'Shared/Components/Loader'
import * as local from 'Shared/Assets/ar.json'
import { CardNavBar, Tab } from 'Shared/Components/HeaderWithCards/cardNavbar'
import Can from 'Shared/config/Can'
import { theme } from 'Shared/theme'

import { getErrorMessage } from '../../../Shared/Services/utils'
import { getManagerHierarchy } from '../../../Mohassel/Services/APIs/ManagerHierarchy/getManagerHierarchy'

import ability from '../../../Shared/config/ability'
import { ManagerProfileProps, ManagerProfileState } from './types'
import { BranchBasicsCard } from './branchBasicsCard'

const header: CSSProperties = {
  textAlign: 'right',
  fontSize: '14px',
  width: '15%',
  color: theme.colors.lightGrayText,
}
const cell: CSSProperties = {
  textAlign: 'right',
  padding: '10px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.colors.blackText,
}

class ManagerProfile extends Component<
  ManagerProfileProps,
  ManagerProfileState
> {
  constructor(props: ManagerProfileProps) {
    super(props)
    this.state = {
      activeTab: 'mainInfo',
      loading: false,
      tabsArray: [
        {
          header: local.managers,
          stringKey: 'mainInfo',
        },
      ],
      data: {
        branchManager: { id: '', name: '' },
        branchId: '',
        operationsManager: { id: '', name: '' },
        areaManager: { id: '', name: '' },
        areaSupervisor: { id: '', name: '' },
        centerManager: { id: '', name: '' },
      },
    }
  }

  componentDidMount() {
    this.getManagers()
    const tabsToRender: Array<Tab> = [
      {
        header: local.managers,
        stringKey: 'mainInfo',
      },
    ]

    if (ability.can('updateBranchManagersHierarchy', 'branch')) {
      tabsToRender.push({
        header: local.editManagers,
        stringKey: 'editManagers',
      })
    }
    this.setState({
      tabsArray: tabsToRender,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeTab !== prevState.activeTab) {
      this.getManagers()
    }
  }

  async getManagers() {
    this.setState({ loading: true })
    const res = await getManagerHierarchy(this.props.branchId)
    if (res.status === 'success') {
      this.setState({
        data: res.body.data,
      })
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
    this.setState({ loading: false })
  }

  renderMainInfo() {
    return this.state.data ? (
      <Table striped bordered hover>
        <tbody style={{ padding: '2rem 0' }}>
          <tr style={{ height: '50px' }}>
            <td style={header}>{local.operationsManager}</td>
            <td style={cell}>{this.state.data?.operationsManager?.name}</td>
          </tr>
          <tr style={{ height: '50px' }}>
            <td style={header}>{local.districtManager}</td>
            <td style={cell}>{this.state.data?.areaManager?.name}</td>
          </tr>
          <tr style={{ height: '50px' }}>
            <td style={header}>{local.districtSupervisor}</td>
            <td style={cell}>{this.state.data?.areaSupervisor?.name}</td>
          </tr>
          <tr style={{ height: '50px' }}>
            <td style={header}>{local.centerManager}</td>
            <td style={cell}>{this.state.data?.centerManager?.name}</td>
          </tr>
          <tr style={{ height: '50px' }}>
            <td style={header}>{local.branchManager}</td>
            <td style={cell}>{this.state.data?.branchManager?.name}</td>
          </tr>
        </tbody>
      </Table>
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

  renderEditManager() {
    return (
      <Can I="updateBranchManagersHierarchy" a="branch">
        <ManagersCreation branchId={this.props.branchId} />
      </Can>
    )
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'mainInfo':
        return this.renderMainInfo()
      case 'editManagers':
        return this.renderEditManager()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Loader open={this.state.loading} type="fullscreen" />
        <BranchBasicsCard
          name={this.props.name}
          branchCode={this.props.branchCode}
          createdAt={this.props.createdAt}
          status={this.props.status}
        />
        <Card>
          <CardNavBar
            array={this.state.tabsArray}
            active={this.state.activeTab}
            selectTab={(stringKey: string) => {
              this.setState({ activeTab: stringKey })
            }}
          />
          <Card.Body>{this.renderContent()}</Card.Body>
        </Card>
      </>
    )
  }
}

export default ManagerProfile
