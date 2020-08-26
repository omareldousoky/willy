import React, { Component, ReactNode } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import { timeToDateyyymmdd, beneficiaryType, iscoreDate } from '../../Services/utils';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Can from '../../config/Can';
import FormCheck from 'react-bootstrap/FormCheck';
import Form from 'react-bootstrap/Form';
import { loading } from '../../redux/loading/actions';
import { changeSourceFund } from '../../Services/APIs/loanApplication/changeSourceFund';
import { Formik } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { BranchesDropDown } from '../dropDowns/allDropDowns';
import { cibReport } from '../../Services/APIs/loanApplication/cibReport';
import Table from 'react-bootstrap/Table';

interface Props {
  history: Array<any>;
  data: any;
  branchId: string;
  fromBranch?: boolean;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
  setLoading: (data) => void;
};
interface CibLoan {
  loanId: string;
  principal: string;
  loanBranch: string;
  customerNationalId: string;
  customerKey: string;
  gender: string;
  customerName: string;
  customerBirthDate: string;
  iscore: string;
  activeLoans: string;
  numInst: string;
}
interface State {
  size: number;
  from: number;
  selectedCustomers: Array<string>;
  loading: boolean;
  fromDate: string;
  toDate: string;
  keyword: string;
  data: Array<CibLoan>;
  principalSelectedSum: number;
}

class CIB extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => ReactNode }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      size: 5,
      from: 0,
      selectedCustomers: [],
      loading: false,
      fromDate: '',
      toDate: '',
      keyword: '',
      data: [],
      principalSelectedSum: 0,
    }
    this.mappers = [
      {
        title: '',
        key: 'selected',
        render: data => <FormCheck
          type="checkbox"
          checked={this.state.selectedCustomers.includes(data.loanId)}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => Number(data.customerKey)
        // data.application.product.beneficiaryType === 'individual' ? data.application.customer.key :
        //   data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? member.customer.key : null)
      },
      {
        title: local.customerName,
        key: "name",
        sortable: true,
        render: data => data.customerName
        // <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
        //   {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
        //     <div style={{ display: 'flex', flexDirection: 'column' }}>
        //       {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.customerName}</span> : null)}
        //     </div>)
        //   }
        // </div>
      },
      // {
      //   title: local.productName,
      //   key: "productName",
      //   render: data => data.application.product.productName
      // },
      // {
      //   title: local.loanIssuanceDate,
      //   key: "issueDate",
      //   sortable: true,
      //   render: data => data.application.issueDate ? timeToDateyyymmdd(data.application.issueDate) : ''
      // },
      {
        title: local.principal,
        key: "principal",
        render: data => data.principal
      },
      {
        title: local.noOfInstallments,
        key: "numInst",
        render: data => data.numInst
      }
      // {
      //   title: local.status,
      //   key: "status",
      //   sortable: true,
      //   render: data => this.getStatus(data.application.status)
      // },
    ]
  }

  getStatus(status: string) {
    switch (status) {
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'issued':
        return <div className="status-chip unpaid">{local.issued}</div>
      case 'pending':
        return <div className="status-chip pending">{local.pending}</div>
      case 'canceled':
        return <div className="status-chip canceled">{local.cancelled}</div>
      default: return null;
    }
  }
  addRemoveItemFromChecked(loan: CibLoan) {
    if (this.state.selectedCustomers.findIndex(selectedCustomerLoanId => selectedCustomerLoanId === loan.loanId) > -1) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(el => el !== loan.loanId),
        principalSelectedSum: this.state.principalSelectedSum - Number(loan.principal)
      });
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, loan.loanId],
        principalSelectedSum: this.state.principalSelectedSum + Number(loan.principal)
      });
    }
  }
  async getLoans() {
    let query = {};
    if (this.props.fromBranch) {
      query = { ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'loan', branchId: this.props.branchId, sort: "issueDate", status: "issued" }
    } else {
      query = { ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'loan', sort: "issueDate", status: "issued" }
    }
    this.props.search(query);
  }
  handleSearch = async (values) => {
    this.setState({
      data: [
        {
          "loanId": "5f35de741569254885561f65",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "26411120103588",
          "customerKey": "110010012072.0",
          "gender": "female",
          "customerName": "سهير محمود احمد احمد",
          "customerBirthDate": "NaT",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "12"
        },
        {
          "loanId": "5f35de801569254885562d9b",
          "principal": "20000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "27710140103381",
          "customerKey": "110020001089.0",
          "gender": "female",
          "customerName": "نجوي ابراهيم فرحات ابراهيم",
          "customerBirthDate": "1977-10-14 00:00:00",
          "iscore": "###",
          "activeLoans": "3",
          "numInst": "20"
        },
        {
          "loanId": "5f35de931569254885566b8b",
          "principal": "5000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "27001252401324",
          "customerKey": "110030005293.0",
          "gender": "female",
          "customerName": "فايزه احمدرشدي عثمان عبدالله",
          "customerBirthDate": "1970-01-25 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "10"
        },
        {
          "loanId": "5f35de931569254885566d15",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "28112052404141",
          "customerKey": "110030005882.0",
          "gender": "female",
          "customerName": "صابرين عبدالرحمن محمد عبدالرحمن",
          "customerBirthDate": "1981-12-05 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "15"
        },
        {
          "loanId": "5f35de741569254885561f65",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "26411120103588",
          "customerKey": "110010012072.0",
          "gender": "female",
          "customerName": "سهير محمود احمد احمد",
          "customerBirthDate": "NaT",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "12"
        },
        {
          "loanId": "5f35de801569254885562d9b",
          "principal": "20000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "27710140103381",
          "customerKey": "110020001089.0",
          "gender": "female",
          "customerName": "نجوي ابراهيم فرحات ابراهيم",
          "customerBirthDate": "1977-10-14 00:00:00",
          "iscore": "###",
          "activeLoans": "3",
          "numInst": "20"
        },
        {
          "loanId": "5f35de931569254885566b8b",
          "principal": "5000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "27001252401324",
          "customerKey": "110030005293.0",
          "gender": "female",
          "customerName": "فايزه احمدرشدي عثمان عبدالله",
          "customerBirthDate": "1970-01-25 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "10"
        },
        {
          "loanId": "5f35de931569254885566d15",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "28112052404141",
          "customerKey": "110030005882.0",
          "gender": "female",
          "customerName": "صابرين عبدالرحمن محمد عبدالرحمن",
          "customerBirthDate": "1981-12-05 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "15"
        }, {
          "loanId": "5f35de741569254885561f65",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "26411120103588",
          "customerKey": "110010012072.0",
          "gender": "female",
          "customerName": "سهير محمود احمد احمد",
          "customerBirthDate": "NaT",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "12"
        },
        {
          "loanId": "5f35de801569254885562d9b",
          "principal": "20000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "27710140103381",
          "customerKey": "110020001089.0",
          "gender": "female",
          "customerName": "نجوي ابراهيم فرحات ابراهيم",
          "customerBirthDate": "1977-10-14 00:00:00",
          "iscore": "###",
          "activeLoans": "3",
          "numInst": "20"
        },
        {
          "loanId": "5f35de931569254885566b8b",
          "principal": "5000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "27001252401324",
          "customerKey": "110030005293.0",
          "gender": "female",
          "customerName": "فايزه احمدرشدي عثمان عبدالله",
          "customerBirthDate": "1970-01-25 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "10"
        },
        {
          "loanId": "5f35de931569254885566d15",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "28112052404141",
          "customerKey": "110030005882.0",
          "gender": "female",
          "customerName": "صابرين عبدالرحمن محمد عبدالرحمن",
          "customerBirthDate": "1981-12-05 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "15"
        }, {
          "loanId": "5f35de741569254885561f65",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "26411120103588",
          "customerKey": "110010012072.0",
          "gender": "female",
          "customerName": "سهير محمود احمد احمد",
          "customerBirthDate": "NaT",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "12"
        },
        {
          "loanId": "5f35de801569254885562d9b",
          "principal": "20000.0",
          "loanBranch": "5effe4a25ca43661b65b6357",
          "customerNationalId": "27710140103381",
          "customerKey": "110020001089.0",
          "gender": "female",
          "customerName": "نجوي ابراهيم فرحات ابراهيم",
          "customerBirthDate": "1977-10-14 00:00:00",
          "iscore": "###",
          "activeLoans": "3",
          "numInst": "20"
        },
        {
          "loanId": "5f35de931569254885566b8b",
          "principal": "5000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "27001252401324",
          "customerKey": "110030005293.0",
          "gender": "female",
          "customerName": "فايزه احمدرشدي عثمان عبدالله",
          "customerBirthDate": "1970-01-25 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "10"
        },
        {
          "loanId": "5f35de931569254885566d15",
          "principal": "15000.0",
          "loanBranch": "5effe4a25ca43661b65b6322",
          "customerNationalId": "28112052404141",
          "customerKey": "110030005882.0",
          "gender": "female",
          "customerName": "صابرين عبدالرحمن محمد عبدالرحمن",
          "customerBirthDate": "1981-12-05 00:00:00",
          "iscore": "unavailable",
          "activeLoans": "unavailable",
          "numInst": "15"
        }
      ]
    })
    const res = await cibReport({ startDate: new Date(values.fromDate).valueOf(), endDate: new Date(values.toDate).valueOf() })
    if (res.status === "success") {

    }
  }
  async submit() {
    this.setState({ loading: true });
    const obj = {
      fundSource: 'cib',
      applicationIds: this.state.selectedCustomers,
      returnDetails: true
    }
    const res = await changeSourceFund(obj);
    if (res.status === "success") {
      console.log(res.body);
      this.setState({ selectedCustomers: [], loading: false })
      this.getLoans();
    } else this.setState({ loading: false });

  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.cib}</Card.Title>
                <span style={{ fontWeight: 'bold', marginLeft: 10 }}>{local.noOfSelectedLoans} <span style={{ fontWeight: 'bold', color: '#7dc356' }}>{` (${this.state.selectedCustomers.length})`}</span></span>
                <span style={{ fontWeight: 'bold' }}>{local.loansSelectedAmount} <span style={{ fontWeight: 'bold', color: '#7dc356' }}>{` (${this.state.principalSelectedSum})`}</span></span>
              </div>
              <Button onClick={() => this.submit()}
                disabled={!Boolean(this.state.selectedCustomers.length)}
                className="big-button"
                style={{ marginLeft: 20 }}
              > {local.downloadPDF}
              </Button>
            </div>
            <hr className="dashed-line" />
            <Formik
              enableReinitialize
              initialValues={this.state}
              onSubmit={this.handleSearch}
              // validationSchema={}
              validateOnBlur
              validateOnChange>
              {(formikProps) =>
                <Form onSubmit={formikProps.handleSubmit} style={{ padding: '10px 30px 26px 30px' }}>
                  <Row>
                    <Col sm={6}>
                      <InputGroup style={{ direction: 'ltr' }}>
                        <FormControl
                          type="text"
                          name="keyword"
                          data-qc="searchKeyword"
                          onChange={formikProps.handleChange}
                          style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                          placeholder={local.name}
                          value={formikProps.values.keyword}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                        </InputGroup.Append>
                        {/* {this.props.dropDownKeys && this.props.dropDownKeys.length ?
                          <DropdownButton
                            as={InputGroup.Append}
                            variant="outline-secondary"
                            title={this.getArValue(this.state.dropDownValue)}
                            id="input-group-dropdown-2"
                            data-qc="search-dropdown"
                          >
                            {this.props.dropDownKeys.map((key, index) =>
                              <Dropdown.Item data-qc={key} onClick={() => this.setState({ dropDownValue: key })}>{this.getArValue(key)}</Dropdown.Item>
                            )}
                          </DropdownButton>
                          : null} */}
                      </InputGroup>
                    </Col>
                    <Col sm={6}>
                      <div className="dropdown-container" style={{ flex: 1, alignItems: 'center' }}>
                        <p className="dropdown-label" style={{ alignSelf: 'normal', marginLeft: 20, width: 400 }}>{local.issuanceDate}</p>
                        <span>{local.from}</span>
                        <Form.Control
                          style={{ marginLeft: 20, border: 'none' }}
                          type="date"
                          name="fromDate"
                          data-qc="fromDate"
                          value={formikProps.values.fromDate}
                          onChange={(e) => {
                            formikProps.setFieldValue("fromDate", e.currentTarget.value);
                            if (e.currentTarget.value === "") formikProps.setFieldValue("toDate", "")
                          }}
                        >
                        </Form.Control>
                        <span>{local.to}</span>
                        <Form.Control
                          style={{ marginRight: 20, border: 'none' }}
                          type="date"
                          name="toDate"
                          data-qc="toDate"
                          value={formikProps.values.toDate}
                          min={formikProps.values.fromDate}
                          onChange={formikProps.handleChange}
                          disabled={!Boolean(formikProps.values.fromDate)}
                        >
                        </Form.Control>
                      </div>
                    </Col>
                    <Col sm={6} style={{ marginTop: 20 }}>
                      <BranchesDropDown onSelectBranch={(branch) => { formikProps.setFieldValue('branchId', branch._id) }} />
                    </Col>

                    <Col>
                      <Button type="submit" style={{ width: 180, height: 50, marginTop: 20 }}>{local.search}</Button>
                    </Col>
                  </Row>
                </Form>
              }
            </Formik>
            {this.state.data.length ?
              <Table striped hover style={{ textAlign: 'right' }}>
                <thead>
                  <tr>
                    {this.mappers?.map((mapper, index: number) => {
                      return (
                        <th style={mapper.sortable ? { cursor: 'pointer' } : {}} key={index}>
                          {mapper.title}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.slice((this.state.from * this.state.size), ((this.state.from * this.state.size) + this.state.size))
                    .map((item, index: number) => {
                      return (
                        <tr key={index}>
                          {this.mappers?.map((mapper, index: number) => {
                            return (
                              <td key={index}>
                                {mapper.render(item)}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
              :
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <img alt='no-data-found' src={require('../../Assets/no-results-found.svg')} />
                <h4>{local.noResultsFound}</h4>
              </div>
            }
            {/* <DynamicTable
                from={this.state.from}
                size={this.state.size}
                url="loan"
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination={true}
                data={this.state.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () => this.getLoans());
                }}
              /> */}
            <div className="footer-container" style={{ marginBottom: 20, marginRight: 30 }}>
              <div className="dropdown-container">
                <p className="dropdown-label">{local.show}</p>
                <Form.Control as="select" className="dropdown-select" onChange={(event) => {
                  this.setState({size: Number(event.currentTarget.value)}
                  props.changeNumber && props.changeNumber('size', Number(event.currentTarget.value))
                  props.changeNumber && props.changeNumber('from', 0)
                  changePage(0)
                }}>
                  <option value={10} data-qc={10}>10</option>
                  <option value={25} data-qc={25}>25</option>
                  <option value={50} data-qc={50}>50</option>
                  <option value={100} data-qc={100}>100</option>
                </Form.Control>
              </div>
              <div className="pagination-container">
                <div className={page === 0 ? "pagination-next-prev-disabled" : "pagination-next-prev-enabled"}
                  onClick={() => {
                    if (page !== 0) {
                      changePage(page - 1);
                      props.changeNumber && props.changeNumber('from', (page * rowsPerPage - rowsPerPage));
                    }
                  }}>{local.previous}</div>
                <div className="pagination-numbers">
                  {getArrayOfNumbers().map(number => {
                    return (
                      <div key={number}
                        className={page === number - 1 ? "pagination-number-active" : "pagination-number-inactive"}
                        onClick={() => {
                          changePage(number - 1);
                          props.changeNumber && props.changeNumber('from', (number - 1) * rowsPerPage)
                        }}>
                        <p>{number}</p>
                      </div>
                    )
                  })}
                </div>
                <div className={page + 1 !== Math.ceil(props.totalCount / rowsPerPage) ? "pagination-next-prev-enabled" : "pagination-next-prev-disabled"}
                  onClick={() => {
                    if (page + 1 !== Math.ceil(props.totalCount / rowsPerPage)) {
                      changePage(page + 1);
                      props.changeNumber && props.changeNumber('from', (page * rowsPerPage + rowsPerPage));
                    }
                  }}>{local.next}</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </>
    )
  }
}



export default withRouter(CIB);