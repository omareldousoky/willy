import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import LtsClosing from './LtsClosing/ltsClosing'
import HeaderWithCards, {
  Tab,
} from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { financialClosingArray } from './financialClosingInitials'

interface State {
  tabsArray: Array<Tab>
}
interface Props {
  withHeader: boolean
}
class FinancialClosing extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      tabsArray: [],
    }
  }

  componentDidMount() {
    this.setState({
      tabsArray: financialClosingArray(),
    })
  }

  render() {
    return (
      <>
        {this.props.withHeader && (
          <HeaderWithCards
            header={local.ltsClosing}
            array={this.state.tabsArray}
            active={this.state.tabsArray
              .map((item) => {
                return item.icon
              })
              .indexOf('assignProductToBranch')}
          />
        )}

        <LtsClosing />
      </>
    )
  }
}
export default FinancialClosing
