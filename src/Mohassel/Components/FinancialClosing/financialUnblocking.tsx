import React, { Component } from 'react'
import * as local from '../../../Shared/Assets/ar.json'
import HeaderWithCards, { Tab } from '../HeaderWithCards/headerWithCards'
import { financialClosingArray } from './financialClosingInitials'
import CompanyUnblocking from './CompanyUnblocking/companyUnblocking'
interface State {
    tabsArray: Array<Tab>;
  }
  interface Props {
    withHeader: boolean;
  }
 class FinancialUnblocking extends Component<Props, State> {
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
                header={local.financialBlocking}
                array={this.state.tabsArray}
                active={this.state.tabsArray
                  .map((item) => {
                    return item.icon
                  })
                  .indexOf('issuedLoans')}
              />
            )}
           <CompanyUnblocking />
          </>
        )
      }
    }

export default FinancialUnblocking
