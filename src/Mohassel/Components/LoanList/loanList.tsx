import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getCookie } from '../../Services/getCookie';
import { Loader } from '../../../Shared/Components/Loader';
import { searchLoan } from '../../Services/APIs/Loan/searchLoan';
import * as local from '../../../Shared/Assets/ar.json';
import './styles.scss';

interface Props {
  history: Array<any>;
};
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

class LoanList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
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
    this.mappers = [
      {
        title: local.customerName ,
        key: "customerName",
        render: data => <div onClick={() => this.props.history.push('/loan-profile', { id: data.application._id })}>{data.application.customer.customerName}</div>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.application.customer._id
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.representative,
        key: "representative",
        render: data => ""
      },
      {
        title: local.loanIssuanceDate,
        key: "loanIssuanceDate",
        render: data => new Date(data.application.issueDate).toISOString().slice(0,10)
      },
    ]
  }
  componentDidMount() {
    this.getLoans()
  }

  async getLoans() {
    this.setState({ loading: true })
    const branchId = JSON.parse(getCookie('branches'))[0]
    const res = await searchLoan({ size: this.state.size, from: this.state.from, branchId: branchId });
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
            <div className="custom-card-body">
              <div className="dropdown-container" style={{ flex: 2, marginLeft: 20 }}>
                <p className="dropdown-label">{local.oneBranch}</p>
                <Form.Control as="select" className="dropdown-select" data-qc="branch">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </Form.Control>
              </div>
              <div className="dropdown-container" style={{ flex: 2 }}>
                <p className="dropdown-label">{local.representative}</p>
                <Form.Control as="select" className="dropdown-select" data-qc="representative">
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
                this.setState({ [key]: number } as any, () => this.getLoans());
              }}
            />
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default withRouter(LoanList);