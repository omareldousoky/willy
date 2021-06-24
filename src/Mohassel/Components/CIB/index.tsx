import React, { Component, ReactNode } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import Table from 'react-bootstrap/Table'
import Swal from 'sweetalert2'
import { cibReport } from '../../Services/APIs/loanApplication/cibReport'
import { downloadTxtFile } from './textFiles'
import { changeSourceFund } from '../../Services/APIs/loanApplication/changeSourceFund'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import { manageLoansArray } from '../LoanList/manageLoansInitials'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { Pagination } from '../Common/Pagination'
import { SearchForm } from './SearchForm'
import { SearchFormValues } from './types'
import { CibLoan, CibLoanResponse } from '../../Models/CIB'

interface State {
  size: number
  from: number
  selectedLoans?: string[]
  loading: boolean
  data?: CibLoanResponse
  principalSelectedSum: number
  manageLoansTabs: any[]
  searchFormValues: SearchFormValues
}

class CIB extends Component<{}, State> {
  mappers: {
    title: string | ReactNode
    key: string
    sortable?: boolean
    render: (data: any) => ReactNode
  }[]

  constructor(props) {
    super(props)
    this.state = {
      size: 25,
      from: 0,
      loading: false,
      searchFormValues: {
        branchId: '',
        customerName: '',
      },
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
            checked={this.state?.selectedLoans?.includes(data.loanId)}
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

  handleSearch = async (values: SearchFormValues) => {
    const { fromDate, toDate, branchId, customerName } = values
    if (!fromDate || !toDate) return
    this.setState({ loading: true })

    const name = (customerName || '').trim()
    const res = await cibReport({
      startDate: new Date(fromDate).setHours(0, 0, 0, 0).valueOf(),
      endDate: new Date(toDate).setHours(23, 59, 59, 59).valueOf(),
      offset: this.state.from,
      size: this.state.size,
      branchId,
      customerName: name,
    })
    if (res.status === 'success') {
      this.setState({ loading: false })

      this.setState({
        data: res.body,
      })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire(
          'Error !',
          getErrorMessage(res.error.error || 'error'),
          'error'
        )
      )
    }
  }

  addRemoveItemFromChecked(loan: CibLoan) {
    if (!this.state.selectedLoans) return
    if (
      this.state.selectedLoans.findIndex(
        (selectedCustomerLoanId) => selectedCustomerLoanId === loan.loanId
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedLoans: prevState?.selectedLoans?.filter(
          (el) => el !== loan.loanId
        ),
        principalSelectedSum:
          prevState.principalSelectedSum - Number(loan.principal),
      }))
    } else {
      this.setState((prevState) => ({
        selectedLoans: [...(prevState?.selectedLoans || []), loan.loanId],
        principalSelectedSum:
          prevState.principalSelectedSum + Number(loan.principal),
      }))
    }
  }

  async submit() {
    if (!this.state.selectedLoans) return
    this.setState({ loading: true })
    const obj = {
      fundSource: 'cib',
      applicationIds: this.state.selectedLoans,
      returnDetails: true,
      approvalDate: new Date().valueOf(),
    }
    const res = await changeSourceFund(obj)
    if (res.status === 'success') {
      this.setState({
        selectedLoans: undefined,
        loading: false,
        principalSelectedSum: 0,
        data: undefined,
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
        selectedLoans: prevState.data?.loans?.map((el) => el.loanId),
        principalSelectedSum:
          prevState?.data?.loans?.reduce(
            (a, b) => a + (Number(b.principal) || 0),
            0
          ) || 0,
      }))
    } else this.setState({ selectedLoans: undefined, principalSelectedSum: 0 })
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
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.cib}
                </Card.Title>
                <span className="font-weight-bold" style={{ marginLeft: 10 }}>
                  {local.noOfSelectedLoans}
                  <span
                    className="font-weight-bold"
                    style={{ color: '#7dc356' }}
                  >{` (${this.state?.selectedLoans?.length || 0})`}</span>
                </span>
                <span className="font-weight-bold">
                  {local.loansSelectedAmount}
                  <span
                    className="font-weight-bold"
                    style={{ color: '#7dc356' }}
                  >{` (${this.state.principalSelectedSum})`}</span>
                </span>
              </div>
              <Button
                onClick={() => this.submit()}
                disabled={!this.state?.selectedLoans?.length}
                className="big-button"
              >
                {local.changeFund}
                <span
                  className="fa fa-exchange-alt"
                  style={{ verticalAlign: 'middle', marginRight: 10 }}
                />
              </Button>
            </div>
            <hr className="dashed-line" />
            <SearchForm
              handleSearch={this.handleSearch}
              initialValues={this.state.searchFormValues}
              setSearchFormValues={(newValues: Partial<SearchFormValues>) =>
                this.setState((prevState) => ({
                  searchFormValues: {
                    ...prevState.searchFormValues,
                    ...newValues,
                  },
                }))
              }
            />
            {this.state?.data?.loans?.length ? (
              <Table striped hover>
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
                  {this.state?.data?.loans?.map((item, index: number) => {
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
              <div className="text-center">
                <img
                  alt="no-data-found"
                  src={require('../../../Shared/Assets/no-results-found.svg')}
                />
                {this.state.data && (
                  <p className="img-title">{local.noResultsFound}</p>
                )}
              </div>
            )}
            {this.state.data ? (
              <Pagination
                totalCount={this.state.data.totalCount}
                dataLength={this.state.size}
                paginationArr={[25, 50, 100, 500]}
                updatePagination={(key: string, number: number) => {
                  this.setState(
                    ({ [key]: number } as unknown) as Pick<State, keyof State>,
                    () => this.handleSearch(this.state.searchFormValues)
                  )
                }}
              />
            ) : null}
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default CIB
