import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import CIBReports from './cibReports'
import MonthlyQuarterlyReports from './monthlyQuarterlyReports'
import * as local from '../../../Shared/Assets/ar.json'
import { CardNavBar, Tab } from '../HeaderWithCards/cardNavbar'
import Reports from './reports'
import IscoreReports from './iscoreReports'
import OracleIntegration from './oracleIntegration'
import OperationsReports from './operationsReports'
import { TasaheelReports } from './TasaheelReports/TasaheelReports'
import LaundryReports from './laundryReports'
import OfficersProductivityReports from './officersProductivityReports'

interface State {
  activeTab: string
  tabsArray: Array<Tab>
}
class ReportsHome extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'financialReports',
      tabsArray: [
        {
          header: local.paymentsReports,
          stringKey: 'financialReports',
        },
        {
          header: local.iScoreReports,
          stringKey: 'iScoreReports',
          permission: 'downloadIscoreFile',
          permissionKey: 'report',
        },
        {
          header: local.cib,
          stringKey: 'cibTPAYReport',
          permission: 'cibScreen',
          permissionKey: 'report',
        },
        {
          header: local.operationsReports,
          stringKey: 'operationsReports',
        },
        // {
        //     header: local.oracleIntegration,
        //     stringKey: 'oracleIntegration',
        //     permission: 'summarizeTransactions',
        //     permissionKey: 'oracleIntegration'
        // },
        {
          header: local.monthlyQuarterlyReports,
          stringKey: 'monthlyQuarterlyReports',
        },
        {
          header: local.tasaheelReports,
          stringKey: 'tasaheelReports',
        },
        {
          header: local.laundryReports,
          stringKey: 'laundryReports',
        },
        {
          header: local.officersProductivityReport,
          stringKey: 'officersProductivityReports',
          permission: 'officersProductivityReport',
        },
      ],
    }
  }

  handleOptionChange = (changeEvent) => {
    this.setState({
      activeTab: changeEvent.target.value,
    })
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'financialReports':
        return <Reports />
      case 'iScoreReports':
        return <IscoreReports />
      case 'cibTPAYReport':
        return <CIBReports />
      case 'oracleIntegration':
        return <OracleIntegration />
      case 'operationsReports':
        return <OperationsReports />
      case 'monthlyQuarterlyReports':
        return <MonthlyQuarterlyReports />
      case 'tasaheelReports':
        return <TasaheelReports />
      case 'laundryReports':
        return <LaundryReports />
      case 'officersProductivityReports':
        return <OfficersProductivityReports />
      default:
        return null
    }
  }

  render() {
    return (
      <Card>
        <div className="print-none">
          <CardNavBar
            array={this.state.tabsArray}
            active={this.state.activeTab}
            selectTab={(index: string) => this.setState({ activeTab: index })}
          />
        </div>
        <div>{this.renderContent()}</div>
      </Card>
    )
  }
}

export default ReportsHome
