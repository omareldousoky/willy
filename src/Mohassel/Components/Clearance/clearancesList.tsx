import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import Can from '../../config/Can';
import Search from '../../../Shared/Components/Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getErrorMessage, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import { getCookie } from '../../../Shared/Services/getCookie';

interface State {
  size: number;
  from: number;
  branchId: string;
  searchKey: string[];
}
interface Props {
  history: any;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  error: string;
  search: (data) => Promise<void>;
  setSearchFilters: (data) => void;
}
class ClearancesList extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
      searchKey: ['keyword', 'dateFromTo'],
    }
    this.mappers = [
        {
            title: local.oneBranch,
            key: "branchName",
            render: data => data.branchName
          },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.customerKey
      },
      {
        title: local.customerName,
        key: "name",
        render: data => data.customerName
      },
      {
        title: local.customerType,
        key: "customerType",
        render: data => data.beneficiaryType === 'individual' ? local.individual : local.group
      },
      {
        title: local.registrationDate,
        key: "createdAt",
        render: data => timeToDateyyymmdd(data.registrationDate)
      },
      {
        title: local.loanStatus,
        key: 'status',
        render: data => this.getStatus(data.status)
      },
      {
        title: '',
        key: "actions",
        render: data =><Can I ="editClearance" a="application"><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={"edit"} src={require('../../Assets/editIcon.svg')} onClick={() => this.props.history.push("/customers/edit-clearance", { clearance: {id:data._id} })}></img></Can>
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'clearance' }).then(() => {
      if(this.props.error){;
        Swal.fire("error", getErrorMessage(this.props.error),"error" )
      }
      if(this.state.branchId==='hq'){
        this.setState({searchKey:['keyword', 'dateFromTo', 'branch' ]});
      }
    })
  }
  getClearances() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'clearance', branchId: this.state.branchId }).then(() => {
      if(this.props.error){;
        Swal.fire("error", getErrorMessage(this.props.error),"error" )
      }
    });
  }
  getStatus(status: string) {
    switch (status) {
      case 'underReview':
        return <div className="status-chip outline under-review">{local.underReview}</div>
      case 'approved':
        return <div className="status-chip outline approved">{local.approved}</div>
      case 'rejected':
        return <div className="status-chip outline rejected">{local.rejected}</div>
      default: return null;
    }
  }
  render() {
    return (
      <Card style={{ margin: '20px 50px' }}>
        <Loader type="fullsection" open={this.props.loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.clearances}</Card.Title>
              <span className="text-muted">{local.noOfClearances + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
            </div>
          </div>
          <hr className="dashed-line" />
          { this.state.branchId == 'hq'?
            <Search
              searchKeys ={this.state.searchKey}
              dropDownKeys={['name',  'customerKey']}
              url="clearance"
              from={this.state.from}
              size={this.state.size}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
               />
               :
               <Search
               searchKeys ={this.state.searchKey}
               dropDownKeys={['name', 'customerKey']}
               url="clearance"
               from={this.state.from}
               size={this.state.size}
               searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
               hqBranchIdRequest = {this.state.branchId}
                />
        }
          {this.props.data &&
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              url="clearance"
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getClearances());
              }}
            />
          }
        </Card.Body>
      </Card>
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
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(ClearancesList));