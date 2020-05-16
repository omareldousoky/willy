import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import { Loader } from '../../../Shared/Components/Loader';
import DropDownList from '../DropDownList/dropDownList';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';
import { getRoles } from '../../Services/APIs/Roles/roles';
import Form from 'react-bootstrap/Form';

interface Props {
  history: Array<string>;
};
interface State {
  data: any;
  activeRole: number;
  filterRoles: string;
  loading: boolean;
};

class RolesList extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      filterRoles: '',
      activeRole: -1,
    }
  }
  componentDidMount() {
    // document.body.addEventListener('click', () => this.resetActiveRole());
    this.getRoles();
  }
  resetActiveRole() {
    this.setState({ activeRole: -1 });
  }
  // componentWillUnmount() {
  //   document.body.removeEventListener('click', () => this.resetActiveRole());
  // }

  async getRoles() {
    this.setState({ loading: true })
    const res = await getRoles();
    if (res.status === "success") {
      this.setState({
        data: res.body.roles,
        loading: false
      })
    } else {
      console.log("error")
      this.setState({ loading: false })
    }
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.roles}</Card.Title>
                <span className="text-muted">{local.noOfRoles} {this.state.data.length}</span>
              </div>
              <div>
                <Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/new-role')}>{local.createNewRole}</Button>
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
                  <Card style={{ margin: '20px 50px', cursor: 'pointer' }} key={index} onClick={() => this.props.history.push(`/role-profile`, role)}>
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
      </>
    )
  }
}

export default withRouter(RolesList);