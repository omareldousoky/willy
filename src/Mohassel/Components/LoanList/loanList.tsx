import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import { timeToDateyyymmdd, beneficiaryType } from '../../Services/utils';

interface Props {
  history: Array<any>;
  data: any;
  branchId: string;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
};
interface State {
  size: number;
  from: number;
}

class LoanList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      size: 5,
      from: 0,
    }
    this.mappers = [
      {
        title: local.customerType,
        key: "customerType",
        render: data => beneficiaryType(data.application.product.beneficiaryType)
      },
      {
        title: local.customerName,
        key: "customerName",
        render: data => <div>{data.application.customer.customerName}</div>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.application.customer.code
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.loanIssuanceDate,
        key: "loanIssuanceDate",
        render: data => data.application.issueDate ? timeToDateyyymmdd(data.application.issueDate) : ''
      },
      {
        title: local.status,
        key: "status",
        render: data => this.getStatus(data.application.status)
      },
      {
        title: '',
        key: "action",
        render: data => <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/track-loan-applications/loan-profile', { id: data.application._id })} className="fa fa-eye icon"></span>
      },
    ]
  }
  componentDidMount() {
    this.getLoans()
  }
  componentWillUnmount() {
    this.props.setSearchFilters({})
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
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'loan' ,branchId: this.props.branchId});
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.issuedLoans}</Card.Title>
                <span className="text-muted">{local.noOfIssuedLoans + ` (${this.props.totalCount})`}</span>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search searchKeys={['keyword', 'dateFromTo', 'status', 'branch']} dropDownKeys={['name', 'nationalId', 'code']} url="loan" from={this.state.from} size={this.state.size} hqBranchIdRequest = {this.props.branchId} />
            <DynamicTable
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
      </>
    )
  }
}

const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    setSearchFilters: data => dispatch(searchFilters(data)),
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(LoanList));