import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import LaundryReports from 'Shared/Components/Reports/laundryReports'
import OfficersProductivityReports from 'Shared/Components/Reports/officersProductivityReports'
import * as local from 'Shared/Assets/ar.json'
import { CardNavBar, Tab } from 'Shared/Components/HeaderWithCards/cardNavbar'
import CIBReports from './cibReports'
import FinancialReports from './financialReports'
import IscoreReports from './IscoreReports'
import OracleIntegration from './oracleIntegration'
import OperationsReports from './operationsReports'
import { TasaheelReports } from './TasaheelReports/TasaheelReports'

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
          permission: [
            'downloadIscoreFile',
            'createIscoreFile',
            'generateIscoreReport',
          ],
          permissionKey: 'report',
        },
        {
          header: local.cib,
          stringKey: 'cibTPAYReport',
          permission: ['cibScreen', 'getCibPortfolioSecuritization'],
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
        return <FinancialReports />
      case 'iScoreReports':
        return <IscoreReports />
      case 'cibTPAYReport':
        return <CIBReports />
      case 'oracleIntegration':
        return <OracleIntegration />
      case 'operationsReports':
        return <OperationsReports />
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
