import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards, { Tab } from '../HeaderWithCards/headerWithCards'
import { financialClosingArray } from './financialClosingInitials'
import LtsOracleReviewing from './LtsOracleReviewing/ltsOracleReviewing'

interface State {
  tabsArray: Array<Tab>;
}
interface Props {
  withHeader: boolean;
}
class FinancialReviewing extends Component<Props, State> {
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
            header={local.oracleReports}
            array={this.state.tabsArray}
            active={this.state.tabsArray
              .map((item) => {
                return item.icon
              })
              .indexOf('bulkLoanApplicationsReview')}
          />
        )}
        <LtsOracleReviewing/>
      </>
    )
  }
}

export default FinancialReviewing
