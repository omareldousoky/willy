import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import { Loader } from '../../../Shared/Components/Loader';
import DropDownList from '../DropDownList/dropDownList';
import * as local from '../../../Shared/Assets/ar.json';
import { getRoles } from '../../Services/APIs/Roles/roles';
import Can from '../../config/Can';
import Form from 'react-bootstrap/Form';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageAccountsArray } from './manageAccountsInitials';

interface Props {
  history: Array<string>;
};
interface State {
  data: any;
  activeRole: number;
  totalCount: number;
  filterRoles: string;
  loading: boolean;
  manageAccountTabs: any[];
};

class RolesList extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      totalCount: 0,
      loading: false,
      filterRoles: '',
      activeRole: -1,
      manageAccountTabs: [],
    }
  }
  componentDidMount() {
    // document.body.addEventListener('click', () => this.resetActiveRole());
    this.getRoles();
    this.setState({
      manageAccountTabs: manageAccountsArray()
    })

  }
  resetActiveRole() {
    this.setState({ activeRole: -1 });
  }

  async getRoles() {
    this.setState({ loading: true })
    const res = await getRoles();
    if (res.status === "success") {
      this.setState({
        data: res.body.roles,
        totalCount: res.body.roles.length,
        loading: false
      })
    } else {
      console.log("error")
      this.setState({ loading: false })
    }
  }
  render() {
    return (
      <div>
      <HeaderWithCards
      header={local.manageAccounts}
      array = {this.state.manageAccountTabs}
      active = {this.state.manageAccountTabs.map(item => {return item.icon}).indexOf('roles')}
      />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.roles}</Card.Title>
                <span className="text-muted">{local.noOfRoles + ` (${this.state.totalCount})`}</span>
              </div>
              <div>
              <Can I='createRoles' a='user'><Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/manage-accounts/roles/new-role')}>{local.createNewRole}</Button></Can>
              </div>
            </div>
            {this.state.data.length > 0 && <div className="d-flex flex-row justify-content-center">
              <Form.Control
                type="text"
                data-qc="filterLoanUsage"
                placeholder={local.search}
                style={{ marginBottom: 20, width: '60%' }}
                maxLength={100}
                value={this.state.filterRoles}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterRoles: e.currentTarget.value })}
              />
            </div>}
            {this.state.data.filter(loanUse => loanUse.roleName.toLocaleLowerCase().includes(this.state.filterRoles.toLocaleLowerCase()))
              .map((el, index) => {
                const role = el;
                return (
                  <Card style={{ margin: '20px 50px', cursor: 'pointer' }} key={index} onClick={() => this.props.history.push(`/manage-accounts/roles/role-profile`, role)}>
                    <Card.Body>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <h5 style={{ marginLeft: 50, minWidth: 50 }}>#{index + 1}</h5>
                          <div style={{ marginLeft: 150, minWidth: 200 }}>
                            <span className="text-muted">{local.roleName}</span>
                            <h6>{el.roleName}</h6>
                          </div>
                          <div>
                            <span className="text-muted">{local.permissions}</span>
                            <h6>{el.hasBranch ? local.branchPermissions : local.allPermissions}</h6>
                          </div>
                        </div>
                        {/* <div style={{ position: 'relative' }}>
                        <span style={{ cursor: 'pointer' }} className="fa fa-ellipsis-h" onClick={() => this.setState({ activeRole: index })}></span>
                        {this.state.activeRole === index ? <DropDownList array={[
                          { icon: 'fa fa-eye', name: local.view },
                          { icon: 'fa fa-pencil-alt', name: local.edit },
                          { icon: 'fa fa-ban', name: local.disable },
                        ]} /> : null}
                      </div> */}
                      </div>
                    </Card.Body>
                  </Card>
                )
              })}
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default withRouter(RolesList);