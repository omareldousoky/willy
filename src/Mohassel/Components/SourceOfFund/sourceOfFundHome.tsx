import React, { ReactNode, useState } from 'react'
import { CardNavBar, Tab } from 'Shared/Components/HeaderWithCards/cardNavbar'
import CardBT from 'react-bootstrap/Card'
import { RouteComponentProps } from 'react-router-dom'
import CIB from '../CIB'
import SourceOfFund from './sourceOfFund'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { manageLoansArray } from '../LoanList/manageLoansInitials'
import ability from '../../config/ability'
import { Card } from '../ManageAccounts/manageAccountsInitials'

const tabsTemplate = [
  {
    header: local.fromTasaheelToCib,
    stringKey: 'tasaheelToCib',
    permission: 'cibScreen',
    permissionKey: 'report',
  },
  {
    header: local.fromCibToTasaheel,
    stringKey: 'cibToTasaheel',
    permission: 'cibScreen',
    permissionKey: 'report',
  },
]

const SourceOfFundHome: React.FC<RouteComponentProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>('tasaheelToCib')
  const [manageLoansHeader] = useState<Card[]>(manageLoansArray())
  const [tabs] = useState<Tab[]>(() => {
    const canTabs: Tab[] = []
    tabsTemplate.forEach(
      (t) => ability.can(t.permission, t.permissionKey) && canTabs.push(t)
    )
    return canTabs
  })

  const renderTab = (): ReactNode => {
    switch (activeTab) {
      case 'tasaheelToCib': {
        return <CIB />
      }
      case 'cibToTasaheel': {
        return <SourceOfFund {...props} />
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
        active={manageLoansHeader
          .map((item) => {
            return item.icon
          })
          .indexOf('change-source-of-fund')}
      />
      <CardBT>
        <CardNavBar
          array={tabs}
          active={activeTab}
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
