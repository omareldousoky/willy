import React, { Component } from 'react';
import {HeaderWithCards, Tab} from '../HeaderWithCards/headerWithCards';
import UsersList from './usersList';
import BranchesList from './branchesList';
import RolesList from './rolesList';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';


interface State {
  activeTab: number;
  tabsArray: Array<Tab>;
  loading: boolean;
}
class ManageAccounts extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
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
      case 0 : 
        return <RolesList/>
      case 1 :
        return <UsersList/>
      case 2 :
        return <BranchesList/>
      default: 
        return <RolesList/>
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