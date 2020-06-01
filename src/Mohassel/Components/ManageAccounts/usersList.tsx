import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import { searchUsers } from '../../Services/APIs/Users/searchUsers';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import './styles.scss';
import { setUserActivation } from '../../Services/APIs/Users/userActivation';

interface Props {
  history: any;
};
interface State {
  data: any;
  size: number;
  from: number;
  searchKeyword: string;
  selectedRole: string;
  selectedEmployment: string;
  dateFrom: string;
  dateTo: string;
  totalCount: number;
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
      dateFrom: '',
      dateTo: '',
      totalCount: 0,
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
      // {
      //   title: local.employment,
      //   key: "employment",
      //   render: data => "employment"
      // },
      {
        title: local.createdBy,
        key: "createdBy",
        render: data => data.created.by
      },
      {
        title: local.creationDate,
        key: "creationDate",
        render: data => data.created.at ? getDateAndTime(data.created.at) : ''
      },
      {
        title: '',
        key: "actions",
        render: (data) => this.renderIcons(data)
      },
    ]
  }
  componentDidMount() {
    this.getUsers()
  }
  async handleActivationClick(data: any) {
    const req = { id: data._id, status: data.status === "active" ? "inactive" : "active" }
    this.setState({ loading: true });

    const res = await setUserActivation(req);
    if (res.status === 'success') {
      this.setState({ loading: false });
      Swal.fire("", `${data.username}  ${req.status} `, 'success').then(() => this.getUsers())
    } else {
      this.setState({ loading: false })
      Swal.fire("error");
    }

  }
  renderIcons(data: any) {
    return (
      <>
        <span onClick={() => { this.props.history.push({ pathname: "/user-details", state: { details: data._id } }) }} className='fa fa-eye icon'></span>
        <span onClick={() => { this.props.history.push({ pathname: "/edit-user", state: { details: data._id } }) }} className='fa fa-pencil-alt icon'></span>
        <span  className='fa icon' onClick={() => this.handleActivationClick(data)}> {data.status === "active" && <img alt={"deactive"} src={require('../../Assets/deactivate-user.svg')} />} {data.status === "inactive" && local.activate} </span> </>
    );
  }
  async getUsers() {
    this.setState({ loading: true })
    const res = await searchUsers({ size: this.state.size, from: this.state.from, sort: "createdAt", order: "desc" });
    if (res.status === "success") {
      this.setState({
        data: res.body.data,
        totalCount: res.body.totalCount,
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
    if (values.dateFrom === "" && values.dateTo === "") {
      obj = {
        size: this.state.size,
        from: this.state.from,
        username: values.searchKeyword
      }
    } else {
      obj = {
        fromDate: new Date(values.dateFrom).setHours(0, 0, 0, 0).valueOf(),
        toDate: new Date(values.dateTo).setHours(23, 59, 59, 59).valueOf(),
        size: this.state.size,
        from: this.state.from,
        username: values.searchKeyword
      }
    }
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
                <span className="text-muted">{local.noOfUsers + ` (${this.state.totalCount})`}</span>
              </div>
              <div>
                <Can I='createUser' a='user'><Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/new-user')}>{local.createNewUser}</Button></Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
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
                    <InputGroup style={{ direction: 'ltr', flex: 1 }}>
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

                  </div>
                  <div className="custom-card-body">
                    <div style={{ display: 'flex', marginLeft: 20, flex: 1 }}>
                      <div className="dropdown-container" style={{ flex: 1 }}>
                        <p className="dropdown-label">{local.employment}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="employment">
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                        </Form.Control>
                      </div>
                    </div>
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
            <DynamicTable
              totalCount={this.state.totalCount}
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