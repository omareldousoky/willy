import React, { Component, ReactNode } from 'react'
import Card from 'react-bootstrap/Card'
import { RouteComponentProps, withRouter } from 'react-router-dom'
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
import { changeSourceFundCibPortfolio } from '../../../Shared/Services/APIs/loanApplication/changeSourceFund'
import { cibExtractions } from '../../../Shared/Services/APIs/loanApplication/cibExtractions'
import { downloadTxtFile } from '../CIB/textFiles'
import { ActionsIconGroup, LtsIcon } from '../../../Shared/Components'

interface Props extends RouteComponentProps {
  data: any
  children?: ReactNode
  branchId?: string
  fromBranch?: boolean
  totalCount: number
  loading: boolean
  searchFilters: any
  source: string
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
}

class CibPortfolioSecuritization extends Component<Props, State> {
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
        title: 'local.fundSource',
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
      {
        title: '',
        key: 'action',
        render: (data) => (
          <ActionsIconGroup
            currentId={data._id}
            actions={this.renderActions(data)}
          />
        ),
      },
    ]
  }

  componentDidMount() {
    const fundSource =
      this.props.source === 'tasaheel'
        ? 'tasaheel'
        : 'cibPortfolioSecuritization'
    this.props.search({
      size: this.state.size,
      from: this.state.from,
      url: 'loan',
      sort: 'issueDate',
      status: 'issued',
      fundSource,
      type: 'micro',
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.source !== this.props.source) {
      this.getLoans()
      this.props.setSearchFilters({})
    }
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
  }

  getSourceOfFund(sourceOfFund: string) {
    switch (sourceOfFund) {
      case 'tasaheel':
        return local.tasaheel
      case 'cibPortfolioSecuritization':
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
    const fundSource =
      this.props.source === 'tasaheel'
        ? 'tasaheel'
        : 'cibPortfolioSecuritization'
    if (this.props.fromBranch) {
      query = {
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'loan',
        branchId: this.props.branchId,
        sort: 'issueDate',
        status: 'issued',
        fundSource,
        type: 'micro',
      }
    } else {
      query = {
        ...this.props.searchFilters,
        size: this.state.size,
        from: this.state.from,
        url: 'loan',
        sort: 'issueDate',
        status: 'issued',
        fundSource,
        type: 'micro',
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
      sourceOfFund: this.state.selectedFund,
      loanIds: this.state.selectedCustomers,
    }
    const res = await changeSourceFundCibPortfolio(obj)
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

  renderActions(data) {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',

        actionPermission: true,
        actionOnClick: () =>
          this.props.history.push('/track-loan-applications/loan-profile', {
            id: data.application._id,
          }),
      },
    ]
  }

  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {`${local.from} ${
                    this.props.source === 'tasaheel'
                      ? local.tasaheel
                      : local.cibPortfolioSecuritization
                  } ${local.to} ${
                    this.props.source === 'tasaheel'
                      ? local.cibPortfolioSecuritization
                      : local.tasaheel
                  }`}
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
                  {local.downloadOldFiles}
                  <LtsIcon
                    name="download-big-file"
                    color="#fff"
                    className="pl-2 align-bottom"
                  />
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ openModal: 'changeFund' })
                  }}
                  disabled={!this.state.selectedCustomers.length}
                  className="big-button"
                >
                  {local.changeFund}
                  <LtsIcon
                    name="exchange"
                    color={`#${
                      this.state.selectedCustomers.length ? 'fff' : '343a40'
                    }`}
                    className="pl-2 align-bottom"
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
              fundSource={
                this.props.source === 'tasaheel'
                  ? 'tasaheel'
                  : 'cibPortfolioSecuritization'
              }
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
                <option
                  value={
                    this.props.source === 'tasaheel'
                      ? 'cibPortfolioSecuritization'
                      : 'tasaheel'
                  }
                  data-qc={
                    this.props.source === 'tasaheel'
                      ? 'cibPortfolioSecuritization'
                      : 'tasaheel'
                  }
                >
                  {this.props.source === 'tasaheel'
                    ? local.cibPortfolioSecuritization
                    : local.tasaheel}
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
)(withRouter(CibPortfolioSecuritization))
