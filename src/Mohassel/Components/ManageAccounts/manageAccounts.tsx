import React, { Component } from 'react';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import UsersList from './usersList';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';

interface Tab {
  icon: string;
  header: string;
  desc?: string;
}
interface State {
  activeTab: number;
  tabsArray: Array<Tab>;
  loading: boolean;
}
class ManageAccounts extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      tabsArray: [
        {
          icon: 'roles',
          header: local.roles,
          desc: local.rolesDesc,
        },
        {
          icon: 'users',
          header: local.users,
          desc: local.usersDesc,
        },
        {
          icon: 'branches',
          header: local.branches,
          desc: local.branchesDesc,
        },
      ],
      loading: false,
    }
  }
  renderContent(){
    switch(this.state.activeTab){
      case 1 :
        return <UsersList/>
    }
  }
  render() {
    return (
      <>
        <HeaderWithCards
          header={local.manageAccounts}
          array={this.state.tabsArray}
          active={this.state.activeTab}
          selectTab={(index: number) => this.setState({ activeTab: index })}
        />
        <Loader type="fullscreen" open={this.state.loading} />
        {this.renderContent()}
      </>
    )
  }

}

export default ManageAccounts;