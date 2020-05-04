import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getCookie } from '../../Services/getCookie';
import { Loader } from '../../../Shared/Components/Loader';
import { searchUsers } from '../../Services/APIs/Users/searchUsers';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';

interface Props {
  history: Array<string>;
};
interface State {
  data: any;
  size: number;
  from: number;
  searchKeyword: string;
  selectedRole: string;
  selectedEmployment: string;
  selectedBranch: string;
  dateFrom: string;
  dateTo: string;
  loading: boolean;
}

class UsersList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      size: 5,
      from: 0,
      searchKeyword: '',
      selectedRole: '',
      selectedEmployment: '',
      selectedBranch: '',
      dateFrom: '',
      dateTo: '',
      loading: false,
    }
    this.mappers = [
      {
        title: local.username,
        key: "username",
        render: data => data.username
      },
      {
        title: local.name,
        key: "name",
        render: data => data.name
      },
      {
        title: local.employment,
        key: "employment",
        render: data => "employment"
      },
      {
        title: local.createdBy,
        key: "createdBy",
        render: data => "createdBy"
      },
      {
        title: local.creationDate,
        key: "creationDate",
        render: data => "creationDate"
      },
      {
        title: '',
        key: "actions",
        render: data => <><span className='fa fa-eye icon'></span> <span className='fa fa-pencil-alt icon'></span></>
      },
    ]
  }
  componentDidMount() {
    this.getUsers()
  }

  async getUsers() {
    this.setState({ loading: true })
    const branchId = JSON.parse(getCookie('branches'))[0]
    const res = await searchUsers({ size: this.state.size, from: this.state.from, branchId: branchId });
    if (res.status === "success") {
      this.setState({
        data: res.body.data,
        loading: false
      })
    } else {
      console.log("error")
      this.setState({ loading: false })
    }
  }
  submit = async (values) => {
    this.setState({ loading: true })
    let obj = {}
    const branchId = JSON.parse(getCookie('branches'));
    if (values.dateFrom === "" && values.dateTo === "") {
      obj = {
        branchId: branchId[0],
        size: this.state.size,
        from: this.state.from,
      }
    } else {
      obj = {
        branchId: branchId[0],
        fromDate: new Date(values.dateFrom).setHours(0, 0, 0, 0).valueOf(),
        toDate: new Date(values.dateTo).setHours(23, 59, 59, 59).valueOf(),
        size: this.state.size,
        from: this.state.from,
      }
    }
    if (isNaN(Number(values.searchKeyword))) obj = { ...obj, name: values.searchKeyword }
    else obj = { ...obj, nationalId: values.searchKeyword }
    const res = await searchUsers(obj);
    if (res.status === "success") {
      this.setState({
        loading: false,
        data: res.body.data
      })
    } else {
      this.setState({ loading: false });
      Swal.fire('', local.searchError, 'error');
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
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.users}</Card.Title>
                <span className="text-muted">{local.noOfUsers}</span>
              </div>
              <div>
                <Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/new-user')}>new user</Button>
                <Button variant="outline-primary" className="big-button">download pdf</Button>
              </div>
            </div>
            <hr className="dashed-line" />
            <Formik
              initialValues={this.state}
              onSubmit={this.submit}
              // validationSchema={}
              validateOnBlur
              validateOnChange>
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <div className="custom-card-body">
                    <InputGroup style={{ direction: 'ltr', marginLeft: 20, flex: 1 }}>
                      <Form.Control
                        type="text"
                        name="searchKeyword"
                        data-qc="searchKeyword"
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
            <div className="custom-card-body">
              <div style={{ flex: 2, display: 'flex', marginLeft: 20 }}>
                <div className="dropdown-container" style={{ flex: 1, marginLeft: 20 }}>
                  <p className="dropdown-label">{local.onlyRoles}</p>
                  <Form.Control as="select" className="dropdown-select" data-qc="roles">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </Form.Control>
                </div>
                <div className="dropdown-container" style={{ flex: 1 }}>
                  <p className="dropdown-label">{local.employment}</p>
                  <Form.Control as="select" className="dropdown-select" data-qc="employment">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </Form.Control>
                </div>
              </div>
              <div className="dropdown-container" style={{ flex: 2 }}>
                <p className="dropdown-label">{local.oneBranch}</p>
                <Form.Control as="select" className="dropdown-select" data-qc="branch">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </Form.Control>
              </div>
            </div>
            <DynamicTable
              mappers={this.mappers}
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

export default withRouter(UsersList);