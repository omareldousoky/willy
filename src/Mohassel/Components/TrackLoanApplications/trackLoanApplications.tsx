import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../Shared/Components/Loader';
import ReviewedApplicationsPDF from '../pdfTemplates/reviewedApplications/reviewedApplications';
import Can from '../../config/Can';
import Card from 'react-bootstrap/Card';
import DynamicTable from '../DynamicTable/dynamicTable';
import Search from '../Search/search';
import { search, searchFilters } from '../../redux/search/actions';
import { connect } from 'react-redux';
import * as local from '../../../Shared/Assets/ar.json';
import { timeToDateyyymmdd, beneficiaryType } from '../../Services/utils';

interface Product {
  productName: string;
  loanNature: string;
  beneficiaryType: string;
}
interface Customer {
  customerName: string;
}
interface Application {
  product: Product;
  customer: Customer;
  entryDate: number;
  principal: number;
  status: string;
}
interface LoanItem {
  id: string;
  branchId: string;
  application: Application;
}
interface State {
  print: boolean;
  size: number;
  from: number;
}
interface Props {
  history: any;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
  branchId?: string;
};
class TrackLoanApplications extends Component<Props, State>{
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      print: false,
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
        title: local.customerCode,
        key: "customerCode",
        render: data => Object.keys(data.application.customer).length > 0 ? data.application.customer._id : data.application.group.individualsInGroup.find(member => member.type === 'leader').customer._id
      },
      {
        title: local.customerName,
        key: "customerName",
        render: data => Object.keys(data.application.customer).length > 0 ? data.application.customer.customerName : data.application.group.individualsInGroup.find(member => member.type === 'leader').customer.customerName
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.loanIssuanceDate,
        key: "loanIssuanceDate",
        render: data => timeToDateyyymmdd(data.application.entryDate)
      },
      {
        title: local.loanStatus,
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
    this.getApplications();
  }
  componentWillUnmount() {
    this.props.setSearchFilters({})
  }
  getApplications() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'application' });
  }
  getStatus(status: string) {
    switch (status) {
      case 'underReview':
        return <div className="status-chip outline under-review">{local.underReview}</div>
      case 'created':
        return <div className="status-chip outline created">{local.created}</div>
      case 'reviewed':
        return <div className="status-chip outline reviewed">{local.reviewed}</div>
      case 'approved':
        return <div className="status-chip outline approved">{local.approved}</div>
      case 'rejected':
        return <div className="status-chip outline rejected">{local.rejected}</div>
      default: return null;
    }
  }
  render() {
    const reviewedResults = (this.props.data) ? this.props.data.filter(result => result.application.status === "reviewed") : [];
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.loanApplications}</Card.Title>
                <span className="text-muted">{local.noOfApplications + ` (${this.props.totalCount})`}</span>
              </div>
              {<Can I='assignProductToCustomer' a='application'><Button onClick={() => this.props.history.push('/new-loan-application', { id: '', action: 'under_review' })}>{local.createLoanApplication}</Button></Can>}
            </div>
            <hr className="dashed-line" />
            <Search searchKeys={['keyword', 'dateFromTo', 'branch', 'status-application']} dropDownKeys={['name', 'nationalId', 'code']} url="application" from={this.state.from} size={this.state.size} hqBranchIdRequest={this.props.branchId} />
            <DynamicTable
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getApplications());
              }}
            />
          </Card.Body>
        </Card>
        {reviewedResults.length > 0 &&
          <Button onClick={() => { this.setState({ print: true }, () => window.print()) }}>print</Button>
        }
        {this.state.print && <ReviewedApplicationsPDF data={reviewedResults} />}
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(TrackLoanApplications));