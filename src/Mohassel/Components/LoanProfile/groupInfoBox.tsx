import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import {
  CardNavBar,
  Tab,
} from '../../../Shared/Components/HeaderWithCards/cardNavbar'
import InfoBox from '../userInfoBox'
import { Customer } from '../../../Shared/Models/Customer'

interface Props {
  group: any
  getIscore?: Function
  iScores?: any
  status?: string
}
interface Member {
  customer: Customer
  type: string
}
interface State {
  tabsArray: Array<Tab>
  activeTab: string
  activeCustomer: Member
  group: Array<Member>
}
class GroupInfoBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      tabsArray: [],
      activeTab: '0',
      activeCustomer: {
        customer: {},
        type: '',
      },
      group: [],
    }
  }

  componentDidMount() {
    const group: Member[] = []
    this.props.group.individualsInGroup.forEach((member) =>
      group.push({ customer: member.customer, type: member.type })
    )
    const tabsArray: Tab[] = []
    group.forEach((member, i) =>
      tabsArray.push({
        header: member.customer.customerName,
        stringKey: i.toString(),
      })
    )
    this.setState({
      tabsArray,
      group,
      activeCustomer: group[0],
    })
  }

  render() {
    return (
      <div
        style={{
          textAlign: 'right',
          backgroundColor: '#f7fff2',
          padding: 15,
          border: '1px solid #e5e5e5',
          width: '100%',
        }}
      >
        <h5>{local.mainGroupInfo}</h5>
        <CardNavBar
          array={this.state.tabsArray}
          active={this.state.activeTab}
          selectTab={(index: number) =>
            this.setState((prevState) => ({
              activeCustomer: prevState.group[index],
              activeTab: index.toString(),
            }))
          }
        />
        <div style={{ padding: 20 }}>
          <InfoBox
            noHeader
            values={this.state.activeCustomer.customer}
            getIscore={(data) =>
              this.props.getIscore && this.props.getIscore(data)
            }
            iScores={this.props.iScores}
            status={this.props.status}
            leader={this.state.activeCustomer.type === 'leader'}
          />
        </div>
      </div>
    )
  }
}
export default GroupInfoBox
