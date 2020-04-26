import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getCookie } from '../../Services/getCookie';
import { Loader } from '../../../Shared/Components/Loader';
import { searchApplication } from '../../Services/APIs/loanApplication/searchApplication';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';

interface State {
  data: any;
  size: number;
  from: number;
  searchKeyWord: string;
  selectedRole: string;
  selectedEmployment: string;
  selectedBranch: string;
  dateFrom: string;
  dateTo: string;
  loading: boolean;
}
const mappers = [
  {
    title: "Customer Name",
    key: "customerName",
    render: data => data.application.customer.customerName
  },
  {
    title: "Status",
    key: "status",
    render: data => data.application.status
  },
  {
    title: "Customer Name",
    key: "customerName",
    render: data => data.application.customer.customerName
  },
]

class UsersList extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      size: 5,
      from: 0,
      searchKeyWord: '',
      selectedRole: '',
      selectedEmployment: '',
      selectedBranch: '',
      dateFrom: '',
      dateTo: '',
      loading: false,
    }
  }
  componentDidMount() {
    this.getUsers()
  }

  async getUsers() {
    this.setState({ loading: true })
    const branchId = JSON.parse(getCookie('branches'))[0]
    const res = await searchApplication({ size: this.state.size, from: this.state.from, branchId: branchId });
    if (res.status === "success") {
      this.setState({
        data: res.body.applications,
        loading: false
      })
    } else {
      console.log("error")
      this.setState({ loading: false })
    }
  }
  submit = (values) => {
    console.log(values)
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.users}</Card.Title>
                <span className="text-muted">{local.noOfUsers}</span>
              </div>
              <div>
                <Button className="big-button" style={{ marginLeft: 20 }}>new user</Button>
                <Button variant="outline-primary" className="big-button">download pdf</Button>
              </div>
            </div>
            <hr className="dashed-line" />
            <Formik
              initialValues={this.state}
              onSubmit={this.submit}
              // validationSchema={customerCreationValidationStepTwo}
              validateOnBlur
              validateOnChange>
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <div className="users-search">
                    <InputGroup style={{ direction: 'ltr', marginLeft: 20, flex: 1 }}>
                      <Form.Control
                        type="text"
                        name="searchKeyWord"
                        data-qc="searchKeyWord"
                        onChange={formikProps.handleChange}
                        style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                        placeholder={local.userSearchPlaceholder}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                    <div className="dropdown-container" style={{ flex: 1, alignItems: 'center' }}>
                      <p className="dropdown-label" style={{ alignSelf: 'normal', marginLeft: 20, width: 300 }}>{local.creationDate}</p>
                      <span>{local.from}</span>
                      <Form.Control
                        style={{ marginLeft: 20, border: 'none' }}
                        type="date"
                        name="dateFrom"
                        data-qc="dateFrom"
                        onChange={formikProps.handleChange}
                      >
                      </Form.Control>
                      <span>{local.to}</span>
                      <Form.Control
                        style={{ marginRight: 20, border: 'none' }}
                        type="date"
                        name="dateTo"
                        data-qc="dateTo"
                        min={formikProps.values.dateFrom}
                        onChange={formikProps.handleChange}
                        disabled={!Boolean(formikProps.values.dateFrom)}
                      >
                      </Form.Control>
                    </div>
                  </div>
                </Form>
              }
            </Formik>
            <div className="users-search">
              <div style={{ flex: 2, display: 'flex', marginLeft: 20 }}>
                <div className="dropdown-container" style={{ flex: 1, marginLeft: 20 }}>
                  <p className="dropdown-label">{local.onlyRoles}</p>
                  <Form.Control as="select" className="dropdown-select" data-qc="roles" onChange={(event) => { }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </Form.Control>
                </div>
                <div className="dropdown-container" style={{ flex: 1 }}>
                  <p className="dropdown-label">{local.employment}</p>
                  <Form.Control as="select" className="dropdown-select" data-qc="employment" onChange={(event) => { }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </Form.Control>
                </div>
              </div>
              <div className="dropdown-container" style={{ flex: 2 }}>
                <p className="dropdown-label">{local.oneBranch}</p>
                <Form.Control as="select" className="dropdown-select" data-qc="branch" onChange={(event) => { }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </Form.Control>
              </div>
            </div>
            <DynamicTable
              mappers={mappers}
              pagination={true}
              data={this.state.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getUsers());
              }}
            />
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default UsersList;