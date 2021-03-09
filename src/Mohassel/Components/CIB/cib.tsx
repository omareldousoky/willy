import React, { Component, ReactNode } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import Form from 'react-bootstrap/Form'
import { Formik } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { BranchesDropDown } from '../dropDowns/allDropDowns';
import { cibReport } from '../../Services/APIs/loanApplication/cibReport';
import Table from 'react-bootstrap/Table';
import { downloadTxtFile } from './textFiles';
import Swal from 'sweetalert2';
import { changeSourceFund } from '../../Services/APIs/loanApplication/changeSourceFund';
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import { manageLoansArray } from '../LoanList/manageLoansInitials'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { getErrorMessage } from '../../../Shared/Services/utils'

interface CibLoan {
  loanId: string
  principal: string
  loanBranch: string
  customerNationalId: string
  customerKey: string
  gender: string
  customerName: string
  customerBirthDate: string
  iscore: string
  activeLoans: string
  numInst: string
}
interface State {
  size: number
  from: number
  selectedCustomers: Array<string>
  loading: boolean
  fromDate: string
  toDate: string
  keyword: string
  data: Array<CibLoan>
  filteredData: Array<CibLoan>
  filteredBranch: string
  principalSelectedSum: number
  manageLoansTabs: any[]
}

class CIB extends Component<Props, State> {
  mappers: {
    title: string | ReactNode
    key: string
    sortable?: boolean
    render: (data: any) => ReactNode
  }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      selectedCustomers: [],
      loading: false,
      fromDate: '',
      toDate: '',
      keyword: '',
      data: [],
      filteredData: [],
      filteredBranch: '',
      principalSelectedSum: 0,
      manageLoansTabs: [],
    }
    this.mappers = [
      {
        title: <FormCheck type="checkbox" onChange={(e) => this.checkAll(e)} />,
        key: 'selected',
        render: (data) => (
          <FormCheck
            type="checkbox"
            checked={this.state.selectedCustomers.includes(data.loanId)}
            onChange={() => this.addRemoveItemFromChecked(data)}
          />
        ),
      },
      {
        title: local.customerCode,
        key: 'customerCode',
        render: (data) => Number(data.customerKey),
      },
      {
        title: local.customerName,
        key: 'name',
        sortable: true,
        render: (data) => data.customerName,
      },
      {
        title: local.principal,
        key: 'principal',
        render: (data) => data.principal,
      },
      {
        title: local.noOfInstallments,
        key: 'numInst',
        render: (data) => data.numInst,
      },
    ]
  }

  componentDidMount() {
    this.setState({ manageLoansTabs: manageLoansArray() })
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
      default:
        return null
    }
  }

  handleSearch = async (values) => {
    this.setState({ loading: true })
    const res = await cibReport({
      startDate: new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf(),
      endDate: new Date(values.toDate).setHours(23, 59, 59, 59).valueOf(),
    })
    if (res.status === 'success') {
      this.setState({
        data: res.body.loans ? res.body.loans : [],
        filteredData: res.body.loans ? res.body.loans : [],
        loading: false,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  getArrayOfNumbers() {
    const totalPages: Array<number> = []
    for (
      let index = 0;
      index <
      Math.ceil(
        this.state[
          this.state.keyword || this.state.filteredBranch
            ? 'filteredData'
            : 'data'
        ].length / this.state.size
      );
      index = +1
    ) {
      totalPages.push(index)
    }
    return totalPages
  }

  addRemoveItemFromChecked(loan: CibLoan) {
    if (
      this.state.selectedCustomers.findIndex(
        (selectedCustomerLoanId) => selectedCustomerLoanId === loan.loanId
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedCustomers: prevState.selectedCustomers.filter(
          (el) => el !== loan.loanId
        ),
        principalSelectedSum:
          prevState.principalSelectedSum - Number(loan.principal),
      }))
    } else {
      this.setState((prevState) => ({
        selectedCustomers: [...prevState.selectedCustomers, loan.loanId],
        principalSelectedSum:
          prevState.principalSelectedSum + Number(loan.principal),
      }))
    }
  }

  async submit() {
    this.setState({ loading: true })
    const obj = {
      fundSource: 'cib',
      applicationIds: this.state.selectedCustomers,
      returnDetails: true,
      approvalDate: new Date().valueOf(),
    }
    const res = await changeSourceFund(obj)
    if (res.status === 'success') {
      this.setState({
        selectedCustomers: [],
        loading: false,
        principalSelectedSum: 0,
        data: [],
        filteredData: [],
      })
      Swal.fire('', local.changeSourceFundSuccess, 'success').then(() =>
        downloadTxtFile(res.body.loans, false, 0)
      )
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState((prevState) => ({
        selectedCustomers: prevState.data.map((el) => el.loanId),
        principalSelectedSum: prevState.data.reduce(
          (a, b) => a + (Number(b.principal) || 0),
          0
        ),
      }))
    } else this.setState({ selectedCustomers: [], principalSelectedSum: 0 })
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.cib}
          array={this.state.manageLoansTabs}
          active={this.state.manageLoansTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('cib')}
        />
        <Card className="main-card">
          <Loader type="fullsection" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.cib}
                </Card.Title>
                <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                  {local.noOfSelectedLoans}{' '}
                  <span
                    style={{ fontWeight: 'bold', color: '#7dc356' }}
                  >{` (${this.state.selectedCustomers.length})`}</span>
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {local.loansSelectedAmount}{' '}
                  <span
                    style={{ fontWeight: 'bold', color: '#7dc356' }}
                  >{` (${this.state.principalSelectedSum})`}</span>
                </span>
              </div>
              <Button
                onClick={() => this.submit()}
                disabled={!this.state.selectedCustomers.length}
                className="big-button"
              >
                {' '}
                {local.changeFund}
                <span
                  className="fa fa-exchange-alt"
                  style={{ verticalAlign: 'middle', marginRight: 10 }}
                />
              </Button>
            </div>
            <hr className="dashed-line" />
            <Formik
              enableReinitialize
              initialValues={this.state}
              onSubmit={this.handleSearch}
              // validationSchema={}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form
                  onSubmit={formikProps.handleSubmit}
                  style={{ padding: '10px 30px 26px 30px' }}
                >
                  <Row>
                    <Col sm={6}>
                      <InputGroup>
                        <InputGroup.Append>
                          <InputGroup.Text className="bg-white border-left-0">
                            <span className="fa fa-search fa-rotate-90" />
                          </InputGroup.Text>
                        </InputGroup.Append>
                        <FormControl
                          type="text"
                          name="keyword"
                          data-qc="searchKeyword"
                          className="border-right-0"
                          onChange={(e) => {
                            this.setState((prevState) => ({
                              keyword: e.currentTarget.value,
                              filteredData: prevState.data.filter((el) =>
                                el.customerName.includes(e.currentTarget.value)
                              ),
                            }))
                            formikProps.setFieldValue(
                              'keyword',
                              e.currentTarget.value
                            )
                          }}
                          placeholder={local.name}
                          value={formikProps.values.keyword}
                        />
                      </InputGroup>
                    </Col>
                    <Col sm={6}>
                      <div
                        className="dropdown-container"
                        style={{ flex: 1, alignItems: 'center' }}
                      >
                        <p
                          className="dropdown-label"
                          style={{
                            alignSelf: 'normal',
                            marginLeft: 20,
                            width: 400,
                          }}
                        >
                          {local.issuanceDate}
                        </p>
                        <span>{local.from}</span>
                        <Form.Control
                          required
                          style={{ marginLeft: 20, border: 'none' }}
                          type="date"
                          name="fromDate"
                          data-qc="fromDate"
                          value={formikProps.values.fromDate}
                          onChange={(e) => {
                            formikProps.setFieldValue(
                              'fromDate',
                              e.currentTarget.value
                            )
                            if (e.currentTarget.value === '')
                              formikProps.setFieldValue('toDate', '')
                          }}
                        />
                        <span>{local.to}</span>
                        <Form.Control
                          required
                          style={{ marginRight: 20, border: 'none' }}
                          type="date"
                          name="toDate"
                          data-qc="toDate"
                          value={formikProps.values.toDate}
                          min={formikProps.values.fromDate}
                          onChange={formikProps.handleChange}
                          disabled={!formikProps.values.fromDate}
                        />
                      </div>
                    </Col>
                    <Col sm={6} style={{ marginTop: 20 }}>
                      <BranchesDropDown
                        onSelectBranch={(branch) => {
                          formikProps.setFieldValue('branchId', branch._id)
                          this.setState((prevState) => ({
                            filteredBranch: branch._id,
                            filteredData: prevState.data.filter(
                              (item) => item.loanBranch === branch._id
                            ),
                          }))
                        }}
                      />
                    </Col>

                    <Col className="d-flex">
                      <Button
                        className="ml-auto"
                        type="submit"
                        style={{ width: 180, height: 50, marginTop: 20 }}
                      >
                        {local.search}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
            {this.state.data.length ? (
              <Table striped hover style={{ textAlign: 'right' }}>
                <thead>
                  <tr>
                    {this.mappers?.map((mapper, index: number) => {
                      return (
                        <th
                          style={mapper.sortable ? { cursor: 'pointer' } : {}}
                          key={index}
                        >
                          {mapper.title}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state[
                    this.state.keyword || this.state.filteredBranch
                      ? 'filteredData'
                      : 'data'
                  ]
                    .slice(
                      this.state.from * this.state.size,
                      this.state.from * this.state.size + this.state.size
                    )
                    .map((item, index: number) => {
                      return (
                        <tr key={index}>
                          {this.mappers?.map((mapper, mapperIndex: number) => {
                            return (
                              <td key={mapperIndex}>{mapper.render(item)}</td>
                            )
                          })}
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
            ) : (
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <img
                  alt="no-data-found"
                  src={require('../../../Shared/Assets/no-results-found.svg')}
                />
                <h4>{local.noResultsFound}</h4>
              </div>
            )}
            {this.state[
              this.state.keyword || this.state.filteredBranch
                ? 'filteredData'
                : 'data'
            ].length ? (
              <div
                className="footer-container"
                style={{ marginBottom: 20, marginRight: 30 }}
              >
                <div className="dropdown-container">
                  <p className="dropdown-label">{local.show}</p>
                  <Form.Control
                    as="select"
                    className="dropdown-select"
                    onChange={(event) => {
                      this.setState({ size: Number(event.currentTarget.value) })
                    }}
                  >
                    <option value={10} data-qc={10}>
                      10
                    </option>
                    <option value={25} data-qc={25}>
                      25
                    </option>
                    <option value={50} data-qc={50}>
                      50
                    </option>
                    <option value={100} data-qc={100}>
                      100
                    </option>
                  </Form.Control>
                </div>
                <div className="pagination-container">
                  <div
                    className={
                      this.state.from === 0
                        ? 'pagination-next-prev-disabled'
                        : 'pagination-next-prev-enabled'
                    }
                    onClick={() => {
                      if (this.state.from !== 0) {
                        this.setState((prevState) => ({
                          from: prevState.from - 1,
                        }))
                      }
                    }}
                  >
                    {local.previous}
                  </div>
                  <div className="pagination-numbers">
                    {this.getArrayOfNumbers().map((number) => {
                      return (
                        <div
                          key={number}
                          className={
                            this.state.from === number
                              ? 'pagination-number-active'
                              : 'pagination-number-inactive'
                          }
                          onClick={() => {
                            this.setState({ from: number })
                          }}
                        >
                          <p>{number + 1}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div
                    className={
                      this.state.from + 1 !==
                      Math.ceil(
                        this.state[
                          this.state.keyword || this.state.filteredBranch
                            ? 'filteredData'
                            : 'data'
                        ].length / this.state.size
                      )
                        ? 'pagination-next-prev-enabled'
                        : 'pagination-next-prev-disabled'
                    }
                    onClick={() => {
                      if (
                        this.state.from + 1 !==
                        Math.ceil(
                          this.state[
                            this.state.keyword || this.state.filteredBranch
                              ? 'filteredData'
                              : 'data'
                          ].length / this.state.size
                        )
                      ) {
                        this.setState((prevState) => ({
                          from: prevState.from + 1,
                        }))
                      }
                    }}
                  >
                    {local.next}
                  </div>
                </div>
              </div>
            ) : null}
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default CIB
