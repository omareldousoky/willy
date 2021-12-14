import React, { ReactNode, useState } from 'react'
import CardBT from 'react-bootstrap/Card'
import { RouteComponentProps } from 'react-router-dom'
import * as local from 'Shared/Assets/ar.json'
import HeaderWithCards, {
  Tab,
} from 'Shared/Components/HeaderWithCards/headerWithCards'
import CIB from '../CIB'
import CibToTasaheel from './cibToTasaheel'
import {
  manageLoansArray,
  handleSourceOfFundTabs,
} from '../LoanList/manageLoansInitials'
import { Card } from '../ManageAccounts/manageAccountsInitials'
import CibPortfolioSecuritization from './cibPortfolioSecuritization'

const SourceOfFundHome: React.FC<RouteComponentProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>('tasaheelToCib')
  const [manageLoansHeader] = useState<Card[]>(manageLoansArray())
  const [tabs] = useState<Tab[]>(handleSourceOfFundTabs())

  const renderTab = (): ReactNode => {
    switch (activeTab) {
      case 'tasaheelToCib': {
        return <CIB />
      }
      case 'cibToTasaheel': {
        return <CibToTasaheel {...props} />
      }
      case 'cibPortfolioSecuritization': {
        return <CibPortfolioSecuritization source="tasaheel" />
      }
      case 'fromCibPortToTasaheel': {
        return <CibPortfolioSecuritization source="cib" />
      }
      default:
        return null
    }
  }

  return (
    <>
      <HeaderWithCards
        header={local.changeSourceOfFund}
        array={manageLoansHeader}
        active={manageLoansHeader.findIndex(
          (t) => t.icon === 'change-source-of-fund'
        )}
      />
      <CardBT>
        <HeaderWithCards
          array={tabs}
          active={tabs.findIndex((t) => t.stringKey === activeTab)}
          selectTab={(tab: string) => {
            setActiveTab(tab)
          }}
        />
        {renderTab()}
      </CardBT>
    </>
  )
}

export default SourceOfFundHome
