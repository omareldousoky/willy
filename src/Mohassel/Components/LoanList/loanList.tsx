import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { BranchesDropDown } from '../dropDowns/allDropDowns';
import { Loader } from '../../../Shared/Components/Loader';
import { searchLoan } from '../../Services/APIs/Loan/searchLoan';
import Swal from 'sweetalert2';
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
  totalCount: number;
  statusFilter: string;
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
      totalCount: 0,
      statusFilter: '',
    }
    this.mappers = [
      {
        title: local.customerName,
        key: "customerName",
        render: data => <div onClick={() => this.props.history.push('/track-loan-applications/loan-profile', { id: data.application._id })}>{data.application.customer.customerName}</div>
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
        render: data => data.application.customer.representative
      },
      {
        title: local.loanIssuanceDate,
        key: "loanIssuanceDate",
        render: data => new Date(data.application.issueDate).toISOString().slice(0, 10)
      },
      {
        title: local.status,
        key: "status",
        render: data => this.getStatus(data.application.status)
      },
    ]
  }
  componentDidMount() {
    this.getLoans()
  }
  getStatus(status: string) {
    switch (status) {
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'issued':
        return <div className="status-chip unpaid">{local.issued}</div>
      default: return null;
    }
  }

  async getLoans() {
    this.setState({ loading: true })
    const res = await searchLoan({ size: this.state.size, from: this.state.from, branchId: this.state.selectedBranch });
    if (res.status === "success") {
      this.setState({
        data: res.body.applications,
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
        branchId: this.state.selectedBranch,
        name: this.state.searchKeyWord,
        status: this.state.statusFilter
      }
    } else {
      obj = {
        fromDate: new Date(values.dateFrom).setHours(this.state.from, 0, 0, 0).valueOf(),
        toDate: new Date(values.dateTo).setHours(23, 59, 59, 59).valueOf(),
        size: this.state.size,
        from: 0,
        branchId: this.state.selectedBranch,
        name: this.state.searchKeyWord,
        status: this.state.statusFilter
      }
    }
    const res = await searchLoan(obj);
    if (res.status === "success") {
      this.setState({
        loading: false,
        data: res.body.applications
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
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.issuedLoans}</Card.Title>
                <span className="text-muted">{local.noOfIssuedLoans + ` (${this.state.totalCount})`}</span>
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
                    <InputGroup style={{ direction: 'ltr', marginLeft: 20, flex: 1 }}>
                      <Form.Control
                        type="text"
                        name="searchKeyWord"
                        data-qc="searchKeyWord"
                        onChange={(e) => { this.setState({ searchKeyWord: e.currentTarget.value }); formikProps.handleChange }}
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
                        onChange={(e) => { this.setState({ dateFrom: e.currentTarget.value }); formikProps.handleChange }}
                      >
                      </Form.Control>
                      <span>{local.to}</span>
                      <Form.Control
                        style={{ marginRight: 20, border: 'none' }}
                        type="date"
                        name="dateTo"
                        data-qc="dateTo"
                        min={formikProps.values.dateFrom}
                        onChange={(e) => { this.setState({ dateTo: e.currentTarget.value }, () => this.submit(this.state)); formikProps.handleChange }}
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
                <p className="dropdown-label">{local.status}</p>
                <Form.Control as="select" className="dropdown-select" data-qc="branch" value={this.state.statusFilter} onChange={(e) => {this.setState({ statusFilter: e.currentTarget.value }, () => this.submit(this.state)) }}>
                  <option value=""></option>
                  <option value='paid'>{local.paid}</option>
                  <option value='issued'>{local.issued}</option>
                </Form.Control>
              </div>
              <BranchesDropDown onSelectBranch={(branch) => { this.setState({ selectedBranch: branch._id }, () => this.submit(this.state)) }} />
              {/* <LoanOfficersDropDown onSelectLoanOfficer={(loanOfficer: LoanOfficer)=> console.log(loanOfficer)}/> */}
            </div>
            <DynamicTable
              totalCount={this.state.totalCount}
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