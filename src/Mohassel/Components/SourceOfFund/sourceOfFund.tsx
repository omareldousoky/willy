import React, { Component } from 'react';
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
import Swal from 'sweetalert2';

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
interface State {
  size: number;
  from: number;
  openModal: boolean;
  selectedCustomers: Array<string>;
  selectedFund: string;
}

class SourceOfFund extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      openModal: false,
      selectedCustomers: [],
      selectedFund: ''
    }
    this.mappers = [
      {
        title: '',
        key: 'selected',
        render: data => <FormCheck
          type="checkbox"
          checked={this.state.selectedCustomers.includes(data.id)}
          onChange={() => this.addRemoveItemFromChecked(data.id)}
        ></FormCheck>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.application.product.beneficiaryType === 'individual' ? data.application.customer.key :
          data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? member.customer.key : null)
      },
      {
        title: local.customerName,
        key: "name",
        sortable: true,
        render: data => <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
          {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.customerName}</span> : null)}
            </div>)
          }
        </div>
      },
      {
        title: local.fundSource,
        key: "fundSource",
        render: data => this.getSourceOfFund(data.application.fundSource)
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.loanIssuanceDate,
        key: "issueDate",
        sortable: true,
        render: data => data.application.issueDate ? timeToDateyyymmdd(data.application.issueDate) : ''
      },
      {
        title: local.principal,
        key: "principal",
        render: data => data.application.principal
      },
      {
        title: local.status,
        key: "status",
        sortable: true,
        render: data => this.getStatus(data.application.status)
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'loan', sort: "issueDate", status: "issued" });
  }
  getSourceOfFund(SourceOfFund: string) {
    switch (SourceOfFund) {
      case 'tasaheel': return local.tasaheel;
      case 'cib': return local.cib;
      default: return '';
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
      default: return null;
    }
  }
  addRemoveItemFromChecked(customerId: string) {
    if (this.state.selectedCustomers.findIndex(selectedCustomerId => selectedCustomerId === customerId) > -1) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(el => el !== customerId),
      });
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, customerId],
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
  componentWillUnmount() {
    this.props.setSearchFilters({})
  }
  async submit() {
    this.setState({ openModal: false, selectedFund: '', selectedCustomers: [] })
    this.props.setLoading(true);
    const obj = {
      fundSource: this.state.selectedFund,
      applicationIds: this.state.selectedCustomers,
      returnDetails: false
    }
    const res = await changeSourceFund(obj);
    if (res.status === "success") {
      this.props.setLoading(false);
      Swal.fire("", local.changeSourceFundSuccess, "success").then(() => this.getLoans());
    } else this.props.setLoading(false);
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.changeSourceOfFund}</Card.Title>
                <span className="text-muted">{local.noOfSelectedLoans + ` (${this.state.selectedCustomers.length})`}</span>
              </div>
              <Button onClick={() => { this.setState({ openModal: true }) }}
                disabled={!Boolean(this.state.selectedCustomers.length)}
                className="big-button"
                style={{ marginLeft: 20 }}
              > {local.changeFund}
                <span className="fa fa-exchange-alt" style={{ verticalAlign: 'middle', marginRight: 10 }}></span>
              </Button>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo', 'branch']}
              dropDownKeys={['name', 'nationalId', 'key']}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              datePlaceholder={local.issuanceDate}
              url="loan"
              from={this.state.from}
              size={this.state.size}
              status="issued"
              hqBranchIdRequest={this.props.branchId} />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="loan"
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getLoans());
              }}
            />
          </Card.Body>
        </Card>
        <Modal show={this.state.openModal} backdrop="static">
          <Modal.Header style={{ padding: '20px 30px' }}>
            <Modal.Title>{local.chooseSourceOfFund}</Modal.Title>
            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ openModal: false })}>X</div>
          </Modal.Header>
          <Modal.Body style={{ padding: '20px 60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Form.Control as="select" data-qc="change-fund"
                style={{ marginLeft: 20 }} onChange={(e) => this.setState({ selectedFund: e.currentTarget.value })} value={this.state.selectedFund}
              >
                <option value="" data-qc=""></option>
                <option value="tasaheel" data-qc="tasaheel">{local.tasaheel}</option>
              </Form.Control>
              <Button className="big-button" data-qc="submit" onClick={() => this.submit()} disabled={this.state.selectedFund === ""}>{local.submit}</Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    setSearchFilters: data => dispatch(searchFilters(data)),
    setLoading: data => dispatch(loading(data))
  };
};
const mapStateToProps = state => {
  return {
    data: state.search.applications,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(SourceOfFund));