import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import BulkClosing from './BulkClosing/bulkClosing'
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
            header={local.bulkClosing}
            array={this.state.tabsArray}
            active={this.state.tabsArray
              .map((item) => {
                return item.icon
              })
              .indexOf('roles')}
          />
        )}

        <BulkClosing />
      </>
    )
  }
}
export default FinancialClosing
