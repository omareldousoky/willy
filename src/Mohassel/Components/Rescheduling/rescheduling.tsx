import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import PostponeInstallments from './postponeInstallments'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'
import TraditionalLoanRescheduling from './traditionalLoanRescheduling'
import FreeRescheduling from './freeRescheduling'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import Can from '../../config/Can'
import PostponeHalfInstallment from './postponeHalfInstallment'

interface Props {
  test: boolean
  application: any
}
interface State {
  activeTab: string
}

interface Mapper {
  title: string
  key: string
  render: (data: any) => any
}

const tabsArray = [
  {
    header: local.postponeInstallments,
    stringKey: 'postponeInstallment',
    permission: 'pushInstallment',
    permissionKey: 'application',
  },
  {
    header: local.postponeHalfInstallment,
    stringKey: 'postponeHalfInstallment',
    permission: 'pushInstallment',
    permissionKey: 'application',
  },
  {
    header: local.traditionalRescheduling,
    stringKey: 'traditionalRescheduling',
    permission: 'traditionRescheduling',
    permissionKey: 'application',
  },
  {
    header: local.freeRescheduling,
    stringKey: 'freeRescheduling',
    permission: 'freeRescheduling',
    permissionKey: 'application',
  },
]
class Rescheduling extends Component<Props, State> {
  mappers: Mapper[]

  constructor(props: Props) {
    super(props)
    this.state = {
      activeTab: tabsArray[0].stringKey,
    }
    this.mappers = [
      {
        title: local.installmentNumber,
        key: 'id',
        render: (data) => data.id,
      },
      {
        title: local.principalInstallment,
        key: 'principalInstallment',
        render: (data) => data.principalInstallment,
      },
      {
        title: local.feesInstallment,
        key: 'feesInstallment',
        render: (data) => data.feesInstallment,
      },
      {
        title: local.installmentResponse,
        key: 'installmentResponse',
        render: (data) => data.installmentResponse,
      },
      {
        title: local.dateOfPayment,
        key: 'dateOfPayment',
        render: (data) => timeToDateyyymmdd(data.dateOfPayment),
      },
      {
        title: local.loanStatus,
        key: 'loanStatus',
        render: (data) => data.status,
      },
    ]
  }

  calculateActiveTabIndex() {
    const activeTabIndex = tabsArray.findIndex(
      ({ stringKey }) => stringKey === this.state.activeTab
    )

    return activeTabIndex > -1 ? activeTabIndex : 0
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'postponeInstallment':
        return (
          <Can I="pushInstallment" a="application">
            <PostponeInstallments
              application={this.props.application}
              test={this.props.test}
            />
          </Can>
        )
      case 'postponeHalfInstallment':
        return (
          <Can I="pushInstallment" a="application">
            <PostponeHalfInstallment
              application={this.props.application}
              test={this.props.test}
            />
          </Can>
        )
      case 'traditionalRescheduling':
        return (
          <Can I="traditionRescheduling" a="application">
            <TraditionalLoanRescheduling
              application={this.props.application}
              test={this.props.test}
            />
          </Can>
        )
      case 'freeRescheduling':
        return (
          <Can I="freeRescheduling" a="application">
            <FreeRescheduling
              application={this.props.application}
              test={this.props.test}
            />
          </Can>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <HeaderWithCards
          array={tabsArray}
          active={this.calculateActiveTabIndex()}
          selectTab={(activeTab: string) => this.setState({ activeTab })}
        />
        <div style={{ padding: 20, marginTop: 15 }}>{this.renderContent()}</div>
      </>
    )
  }
}
export default Rescheduling
