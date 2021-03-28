import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import LtsClosing from './LtsClosing/ltsClosing'
import HeaderWithCards,{Tab} from '../HeaderWithCards/headerWithCards'
import { financialClosingArray } from './financialClosingInitials'

interface State {
  tabsArray: Array<Tab>;
}
interface Props {
  withHeader: boolean;
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
              .indexOf('roles')}
          />
        )}

        <LtsClosing />
      </>
    )
  }
}
export default FinancialClosing
