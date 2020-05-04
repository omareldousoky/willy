import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../Shared/Components/Loader';
import DropDownList from '../DropDownList/dropDownList';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';

interface State {
  data: any;
  activeRole: number;
  loading: boolean;
}

class RolesList extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      data: [1, 2, 3],
      loading: false,
      activeRole: -1,
    }
  }
  componentDidMount() {
    document.body.addEventListener('click', () => this.resetActiveRole());
    this.getRoles();
  }
  resetActiveRole() {
    this.setState({ activeRole: -1 });
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', () => this.resetActiveRole());
  }

  async getRoles() {
    // this.setState({ loading: true })
    // const branchId = JSON.parse(getCookie('branches'))[0]
    // const res = await searchApplication({ size: this.state.size, from: this.state.from, branchId: branchId });
    // if (res.status === "success") {
    //   this.setState({
    //     data: res.body.applications,
    //     loading: false
    //   })
    // } else {
    //   console.log("error")
    //   this.setState({ loading: false })
    // }
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
                <span className="text-muted">{local.noOfRoles}</span>
              </div>
              <div>
                <Button className="big-button" style={{ marginLeft: 20 }}>new role</Button>
              </div>
            </div>
            {this.state.data.map((el, index) => {
              return (
                <Card style={{ margin: '20px 50px' }} key={index}>
                  <Card.Body>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h5 style={{ marginLeft: 50 }}>#{index + 1}</h5>
                        <div style={{ marginLeft: 150 }}>
                          <span className="text-muted">{local.roleName}</span>
                          <h6>hello</h6>
                        </div>
                        <div>
                          <span className="text-muted">{local.permissions}</span>
                          <h6>hello</h6>
                        </div>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{cursor: 'pointer'}} className="fa fa-ellipsis-h" onClick={() => this.setState({ activeRole: index })}></span>
                        {this.state.activeRole === index ? <DropDownList array={[
                          { icon: 'fa fa-eye', name: local.view },
                          { icon: 'fa fa-pencil-alt', name: local.edit },
                          { icon: 'fa fa-ban', name: local.disable },
                        ]} /> : null}
                      </div>
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

export default RolesList;