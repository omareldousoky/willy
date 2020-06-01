import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import {BranchesDropDown} from '../dropDowns/allDropDowns';
import Can from '../../config/Can';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
// import './styles.scss';

interface State {
  data: any;
  size: number;
  from: number;
  searchKeyWord: string;
  dateFrom: string;
  dateTo: string;
  totalCount: number;
  loading: boolean;
  selectedBranch: any;
}
interface Props {
  history: any;
}
class CustomersList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      size: 5,
      from: 0,
      searchKeyWord: '',
      dateFrom: '',
      dateTo: '',
      totalCount: 0,
      loading: false,
      selectedBranch: {}
    }
    this.mappers = [
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.customerCode
      },
      {
        title: local.customerName,
        key: "customerName",
        render: data => data.customerName
      },
      {
        title: local.governorate,
        key: "governorate",
        render: data => data.governorate
      },
      {
        title: local.oneBranch,
        key: "oneBranch",
        render: data => data.branchId
      },
      {
        title: local.createdBy,
        key: "creationDate",
        render: data => data.created?.by
      },
      {
        title: local.creationDate,
        key: "creationDate",
        render: data => getDateAndTime(data.created?.at)
      },
      {
        title: '',
        key: "actions",//<span className='fa fa-eye icon'></span>
        render: data => <>  <Can I='updateCustomer' a='customer'><span className='fa fa-pencil-alt icon' onClick={()=> this.props.history.push("/edit-customer", { id: data._id })}></span></Can></>
      },
    ]
  }
  componentDidMount() {
    this.getCustomers();
  }

  async getCustomers() {
    this.setState({ loading: true })
    const res = await searchCustomer({ size: this.state.size, from: this.state.from });
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
        name: values.searchKeyWord
      }
    } else {
      obj = {
        fromDate: new Date(values.dateFrom).setHours(this.state.from, 0, 0, 0).valueOf(),
        toDate: new Date(values.dateTo).setHours(23, 59, 59, 59).valueOf(),
        size: this.state.size,
        from: 0,
        name: values.searchKeyWord
      }
    }
    const res = await searchCustomer(obj);
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
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.customers}</Card.Title>
                <span className="text-muted">{local.noOfCustomers + ` (${this.state.totalCount})`}</span>
              </div>
              <div>
              <Can I='createCustomer' a='customer'><Button onClick={() => { this.props.history.push("/new-customer") }} className="big-button" style={{ marginLeft: 20 }}>{local.newCustomer}</Button></Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Formik
              enableReinitialize
              initialValues={this.state}
              onSubmit={this.submit}
              // validationSchema={}
              validateOnBlur
              validateOnChange>
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit}>
                  <div className="custom-card-body">
                    <InputGroup style={{ direction: 'ltr', flex: 1, marginLeft: 20 }}>
                      <Form.Control
                        type="text"
                        name="searchKeyWord"
                        data-qc="searchKeyWord"
                        onChange={formikProps.handleChange}
                        style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                        placeholder={local.searchByNameOrNationalId}
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
                        value={formikProps.values.dateFrom}
                        onChange={(e)=> {
                          formikProps.setFieldValue("dateFrom",e.currentTarget.value);
                          if(e.currentTarget.value === "") formikProps.setFieldValue("dateTo", "")
                        }}
                      >
                      </Form.Control>
                      <span>{local.to}</span>
                      <Form.Control
                        style={{ marginRight: 20, border: 'none' }}
                        type="date"
                        name="dateTo"
                        data-qc="dateTo"
                        value={formikProps.values.dateTo}
                        min={formikProps.values.dateFrom}
                        onChange={formikProps.handleChange}
                        disabled={!Boolean(formikProps.values.dateFrom)}
                      >
                      </Form.Control>
                    </div>
                  </div>
                  <div className="custom-card-body">
                    <div style={{ display: 'flex', marginLeft: 20, flex: 1 }}>
                      <div className="dropdown-container" style={{ flex: 1, marginLeft: 20 }}>
                        <p className="dropdown-label">{local.governorate}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="employment">
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                        </Form.Control>
                      </div>
                      {/* <BranchesDropDown onSelectBranch={(branch) => {this.setState({selectedBranch: branch}); console.log(branch)}}/> */}
                    </div>
                  </div>

                </Form>
              }
            </Formik>
            {this.state.data &&
              <DynamicTable
                totalCount={this.state.totalCount}
                mappers={this.mappers}
                pagination={true}
                data={this.state.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () => this.getCustomers());
                }}
              />
            }
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default withRouter(CustomersList);