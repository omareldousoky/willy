import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import Search from '../../../Shared/Components/Search/search'
import { downloadTxtFile } from './textFiles'
import { changeSourceFund } from '../../../Shared/Services/APIs/loanApplication/changeSourceFund'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import { CIBProps, CIBState } from './types'
import { CibLoan } from '../../Models/CIB'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import { loading } from '../../../Shared/redux/loading/actions'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'

class CIB extends Component<CIBProps, CIBState> {
  mappers: TableMapperItem[]

  constructor(props) {
    super(props)
    this.state = {
      size: 25,
      from: 0,
      principalSelectedSum: 0,
    }
    this.mappers = [
      {
        title: () => (
          <FormCheck type="checkbox" onChange={(e) => this.checkAll(e)} />
        ),
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
    this.props.search({ url: 'clearData' })
  }

  handleSearch = async () => {
    const {
      branchId,
      customerName,
      startDate,
      endDate,
    } = this.props.searchFilters
    if (!startDate || !endDate) return

    const name = (customerName || '').trim()
    const request = {
      startDate,
      endDate,
      offset: this.state.from,
      size: this.state.size,
      branchId: branchId || '',
      customerName: name,
      url: 'cib',
    }
    this.props.search(request)
  }

  addRemoveItemFromChecked(loan: CibLoan) {
    if (
      this.state?.selectedLoans &&
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
    const request = {
      fundSource: 'cib',
      applicationIds: this.state.selectedLoans,
      returnDetails: true,
      approvalDate: new Date().valueOf(),
    }

    const res = await changeSourceFund(request)
    if (res.status === 'success') {
      this.setState({
        selectedLoans: undefined,
        principalSelectedSum: 0,
        from: 0,
      })
      Swal.fire('', local.changeSourceFundSuccess, 'success').then(() => {
        downloadTxtFile(res.body.loans, false, 0)
        this.handleSearch()
      })
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({
        selectedLoans: this.props.loans?.map((el) => el.loanId),
        principalSelectedSum:
          this.props.loans?.reduce(
            (a, b) => a + (Number(b.principal) || 0),
            0
          ) || 0,
      })
    } else this.setState({ selectedLoans: undefined, principalSelectedSum: 0 })
  }

  render() {
    return (
      <>
        <Card className="main-card">
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body className="p-0">
            <div className="custom-card-header">
              <div className="d-flex align-items-center">
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {`${local.from} ${local.tasaheel} ${local.to} ${local.cib}`}
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
            <Search
              searchKeys={['keyword', 'dateFromTo', 'branch']}
              datePlaceholder={local.issuanceDate}
              searchPlaceholder={local.name}
              url="cib"
              from={this.state.from}
              size={this.state.size}
              setFrom={(from) => this.setState({ from })}
              resetSelectedItems={() =>
                this.setState({ selectedLoans: undefined })
              }
            />

            <DynamicTable
              pagination
              customPagination={{
                size: this.state.size,
                pagesList: [10, 25, 50, 100, 500],
              }}
              from={this.state.from}
              size={this.state.size}
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              data={this.props.loans}
              url="cib"
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () =>
                  this.handleSearch()
                )
              }}
            />
          </Card.Body>
        </Card>
      </>
    )
  }
}

const addSearchToProps = (dispatch) => {
  return {
    search: (request) => dispatch(search(request)),
    setSearchFilters: (filters) => dispatch(searchFilters(filters)),
    setLoading: (isLoading) => dispatch(loading(isLoading)),
  }
}

const mapStateToProps = (state) => {
  return {
    loans: state.search.loans,
    totalCount: state.search.totalCount,
    searchFilters: state.searchFilters,
    loading: state.loading,
  }
}

export default connect(mapStateToProps, addSearchToProps)(CIB)
