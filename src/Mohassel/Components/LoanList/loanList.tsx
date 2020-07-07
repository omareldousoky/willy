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
import store from '../../redux/store';

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
        title: local.loanCode,
        key: "loanCode",
        render: data => data.application.loanApplicationCode
      },
      {
        title: local.customerName,
        key: "customerName",
        render: data => <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
          {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map(member => member.type === 'leader'? <span key={member.customer._id}>{member.customer.customerName}</span>: null)}
            </div>)
          }
        </div>
      },
      {
        title: local.nationalId,
        key: "nationalId",
        render: data => <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
          {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.nationalId :
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map(member => member.type === 'leader'? <span key={member.customer._id}>{member.customer.nationalId}</span>: null)}
            </div>)
          }
        </div>
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
        render: data => <img style={{cursor: 'pointer'}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}></img>
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'loan', sort:"issueDate" });
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

  async getLoans() {
     let query = {};
     if(this.props.fromBranch){
       query = {size: this.state.size, from: this.state.from, url: 'loan', branchId: this.props.branchId, sort:"issueDate" , ...this.props.searchFilters}
     } else {
      query = {size: this.state.size, from: this.state.from, url: 'loan', sort:"issueDate" , ...this.props.searchFilters}
     }
    this.props.search(query);
  }
  componentWillUnmount() {
    this.props.setSearchFilters({})
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
                <span className="text-muted">{local.noOfIssuedLoans + ` (${this.props.totalCount? this.props.totalCount : 0})`}</span>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search 
            searchKeys={['keyword', 'dateFromTo', 'status', 'branch']} 
            dropDownKeys={['name', 'nationalId', 'code']}
            searchPlaceholder = {local.searchByBranchNameOrNationalIdOrCode}
            datePlaceholder={local.issuanceDate}
             url="loan" 
             from={this.state.from} 
             size={this.state.size} 
             hqBranchIdRequest={this.props.branchId} />
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