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
import { timeToDateyyymmdd, beneficiaryType, parseJwt } from '../../Services/utils';
import { getBranch } from '../../Services/APIs/Branch/getBranch';
import { getCookie } from '../../Services/getCookie';

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
  branchDetails: any;
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
      branchDetails: {}
    }
    this.mappers = [
      {
        title: local.customerType,
        key: "customerType",
        render: data => beneficiaryType(data.application.product.beneficiaryType)
      },
      {
        title: local.applicationCode,
        key: "applicationCode",
        render: data => data.application.applicationCode
      },
      {
        title: local.customerName,
        key: "customerName",
        render: data => data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.customerName}</span> : null)}
          </div>
      },
      {
        title: local.nationalId,
        key: "nationalId",
        render: data => data.application.product.beneficiaryType === 'individual' ? data.application.customer.nationalId :
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.application.group?.individualsInGroup.map(member => member.type === 'leader'? <span key={member.customer._id}>{member.customer.nationalId}</span>: null)}
        </div>
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.loanCreationDate,
        key: "loanCreationDate",
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
        render: data => <img style={{cursor: 'pointer'}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push('/track-loan-applications/loan-profile', { id: data.application._id })}></img>
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'application', branchId: this.props.branchId });
  }
  getApplications() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'application', branchId: this.props.branchId });
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
      case 'canceled':
        return <div className="status-chip outline canceled">{local.cancelled}</div>
      default: return null;
    }
  }
  async getBranchData() {
    const token = getCookie('token');
    const details = parseJwt(token)
    const res = await getBranch(details.branch);
    if (res.status === 'success') {
      this.setState({ branchDetails: res.body.data, print: true }, () => window.print()) 
    } else console.log('error getting branch details')
  }
  render() {
    const reviewedResults = (this.props.data) ? this.props.data.filter(result => result.application.status === "reviewed") : [];
    return (
      <>
        <Card className="print-none" style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.loanApplications}</Card.Title>
                <span className="text-muted">{local.noOfApplications + ` (${this.props.totalCount? this.props.totalCount : 0})`}</span>
              </div>
              <div>
                {<Can I='assignProductToCustomer' a='application'><Button onClick={() => this.props.history.push('/track-loan-applications/new-loan-application', { id: '', action: 'under_review' })}>{local.createLoanApplication}</Button></Can>}
                <Button disabled={reviewedResults.length === 0} style={{ marginRight: 10 }} onClick={() => { this.getBranchData() }}>{local.downloadPDF}</Button>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search 
            searchKeys={['keyword', 'dateFromTo', 'branch', 'status-application']} 
            dropDownKeys={['name', 'nationalId', 'code']} 
            url="application" 
            from={this.state.from} 
            size={this.state.size} 
            searchPlaceholder = {local.searchByBranchNameOrNationalIdOrCode}
            hqBranchIdRequest={this.props.branchId} />
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
        {this.state.print && <ReviewedApplicationsPDF data={reviewedResults} branchDetails={this.state.branchDetails} />}
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