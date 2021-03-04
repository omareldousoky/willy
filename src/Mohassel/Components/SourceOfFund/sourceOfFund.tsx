import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import {
  timeToDateyyymmdd,
  getErrorMessage,
} from '../../../Shared/Services/utils'
import { loading } from '../../../Shared/redux/loading/actions'
import { changeSourceFund } from '../../Services/APIs/loanApplication/changeSourceFund'
import { cibExtractions } from '../../Services/APIs/loanApplication/cibExtractions'
import { downloadTxtFile } from '../CIB/textFiles'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLoansArray } from '../LoanList/manageLoansInitials'

interface Props {
  history: Array<any>
  data: any
  branchId: string
  fromBranch?: boolean
  totalCount: number
  loading: boolean
  searchFilters: any
  search: (data) => void
  setSearchFilters: (data) => void
  setLoading: (data) => void
}
interface State {
  size: number
  from: number
  openModal: string
  selectedCustomers: Array<string>
  selectedFund: string
  oldFilesDate: string
  manageLoansTabs: any[]
}

class SourceOfFund extends Component<Props, State> {
  mappers: {
    title: string
    key: string
    sortable?: boolean
    render: (data: any) => void
  }[]

  constructor(props: Props) {
    super(props)
    this.state = {
      size: 10,
      from: 0,
      openModal: '',
      selectedCustomers: [],
      selectedFund: '',
      oldFilesDate: '',
      manageLoansTabs: [],
    }
    this.mappers = [
      {
        title: '',
        key: 'selected',
        render: (data) => (
          <FormCheck
            type="checkbox"
            checked={this.state.selectedCustomers.includes(data.id)}
            onChange={() => this.addRemoveItemFromChecked(data.id)}
          />
        ),
      },
      {
        title: local.customerCode,
        key: 'customerCode',
        render: (data) =>
          data.application.product.beneficiaryType === 'individual'
            ? data.application.customer.key
            : data.application.group?.individualsInGroup.map((member) =>
                member.type === 'leader' ? member.customer.key : null
              ),
      },
      {
        title: local.customerName,
        key: 'name',
        sortable: true,
        render: (data) => (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              this.props.history.push('/loans/loan-profile', {
                id: data.application._id,
              })
            }
          >
            {data.application.product.beneficiaryType === 'individual' ? (
              data.application.customer.customerName
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.application.group?.individualsInGroup.map((member) =>
                  member.type === 'leader' ? (
                    <span key={member.customer._id}>
                      {member.customer.customerName}
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        title: local.fundSource,
        key: 'fundSource',
        render: (data) => this.getSourceOfFund(data.application.fundSource),
      },
      {
        title: local.productName,
        key: 'productName',
        render: (data) => data.application.product.productName,
      },
      {
        title: local.loanIssuanceDate,
        key: 'issueDate',
        sortable: true,
        render: (data) =>
          data.application.issueDate
            ? timeToDateyyymmdd(data.application.issueDate)
            : '',
      },
      {
        title: local.principal,
        key: 'principal',
        render: (data) => data.application.principal,
      },
      {
        title: local.status,
        key: 'status',
        sortable: true,
        render: (data) => this.getStatus(data.application.status),
      },
    ]
  }

  componentDidMount() {
    this.props.search({
      size: this.state.size,
      from: this.state.from,
      url: 'loan',
      sort: 'issueDate',
      status: 'issued',
      fundSource: 'cib',
    })
    this.setState({ manageLoansTabs: manageLoansArray() })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getSourceOfFund(sourceOfFund: string) {
    switch (sourceOfFund) {
      case 'tasaheel':
        return local.tasaheel
      case 'cib':
        return local.cib
      default:
        return ''
    }
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

  async getOldFiles() {
    this.setState({ openModal: '', oldFilesDate: '' })
    this.props.setLoading(true)
    const date = new Date(this.state.oldFilesDate).valueOf()
    const res = await cibExtractions(date)
    if (res.status === 'success') {
      this.props.setLoading(false)
      downloadTxtFile(res.body.loans, false, date)
    } else {
      this.props.setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  async getLoans() {
    let query = {}
    if (this.props.fromBranch) {
      query = {
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'loan',
        branchId: this.props.branchId,
        sort: 'issueDate',
        status: 'issued',
        fundSource: 'cib',
      }
    } else {
      query = {
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'loan',
        sort: 'issueDate',
        status: 'issued',
        fundSource: 'cib',
      }
    }
    this.props.search(query)
  }

  addRemoveItemFromChecked(customerId: string) {
    if (
      this.state.selectedCustomers.findIndex(
        (selectedCustomerId) => selectedCustomerId === customerId
      ) > -1
    ) {
      this.setState((prevState) => ({
        selectedCustomers: prevState.selectedCustomers.filter(
          (el) => el !== customerId
        ),
      }))
    } else {
      this.setState((prevState) => ({
        selectedCustomers: [...prevState.selectedCustomers, customerId],
      }))
    }
  }

  async submit() {
    this.setState({ openModal: '', selectedFund: '', selectedCustomers: [] })
    this.props.setLoading(true)
    const obj = {
      fundSource: this.state.selectedFund,
      applicationIds: this.state.selectedCustomers,
      returnDetails: false,
      approvalDate: new Date().valueOf(),
    }
    const res = await changeSourceFund(obj)
    if (res.status === 'success') {
      this.props.setLoading(false)
      Swal.fire('', local.changeSourceFundSuccess, 'success').then(() =>
        this.getLoans()
      )
    } else {
      this.props.setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.changeSourceOfFund}
          array={this.state.manageLoansTabs}
          active={this.state.manageLoansTabs
            .map((item) => {
              return item.icon
            })
            .indexOf('changeSourceOfFund')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.changeSourceOfFund}
                </Card.Title>
                <span className="text-muted">
                  {local.noOfSelectedLoans +
                    ` (${this.state.selectedCustomers.length})`}
                </span>
              </div>
              <div>
                <Button
                  onClick={() => {
                    this.setState({ openModal: 'downloadOldFiles' })
                  }}
                  className="big-button"
                  style={{ marginLeft: 20 }}
                >
                  {' '}
                  {local.downloadOldFiles}
                  <span
                    className="fa fa-download-alt"
                    style={{ verticalAlign: 'middle', marginRight: 10 }}
                  />
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ openModal: 'changeFund' })
                  }}
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
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo', 'branch']}
              dropDownKeys={[
                'name',
                'nationalId',
                'key',
                'code',
                'customerKey',
              ]}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              datePlaceholder={local.issuanceDate}
              url="loan"
              from={this.state.from}
              size={this.state.size}
              status="issued"
              fundSource="cib"
              hqBranchIdRequest={this.props.branchId}
            />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="loan"
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getLoans())
              }}
            />
          </Card.Body>
        </Card>
        <Modal show={this.state.openModal === 'changeFund'} backdrop="static">
          <Modal.Header style={{ padding: '20px 30px' }}>
            <Modal.Title>{local.chooseSourceOfFund}</Modal.Title>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ openModal: '' })}
            >
              X
            </div>
          </Modal.Header>
          <Modal.Body style={{ padding: '20px 60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Form.Control
                as="select"
                data-qc="change-fund"
                style={{ marginLeft: 20 }}
                onChange={(e) =>
                  this.setState({ selectedFund: e.currentTarget.value })
                }
                value={this.state.selectedFund}
              >
                <option value="" data-qc="" />
                <option value="tasaheel" data-qc="tasaheel">
                  {local.tasaheel}
                </option>
              </Form.Control>
              <Button
                className="big-button"
                data-qc="submit"
                onClick={() => this.submit()}
                disabled={this.state.selectedFund === ''}
              >
                {local.submit}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.openModal === 'downloadOldFiles'}
          backdrop="static"
        >
          <Modal.Header style={{ padding: '20px 30px' }}>
            <Modal.Title>{local.dateOfFile}</Modal.Title>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ openModal: '' })}
            >
              X
            </div>
          </Modal.Header>
          <Modal.Body style={{ padding: '20px 60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Form.Control
                type="date"
                data-qc="download-old-files"
                style={{ marginLeft: 20 }}
                onChange={(e) =>
                  this.setState({ oldFilesDate: e.currentTarget.value })
                }
              />
              <Button
                className="big-button"
                data-qc="submit"
                onClick={() => this.getOldFiles()}
                disabled={this.state.oldFilesDate === ''}
              >
                {local.submit}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.applications,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(
  mapStateToProps,
  addSearchToProps
)(withRouter(SourceOfFund))
