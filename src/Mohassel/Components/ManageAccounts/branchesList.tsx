import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageAccountsArray } from './manageAccountsInitials';
interface State {
  size: number;
  from: number;
  manageAccountTabs: any[];
}
interface Props {
  history: any;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
}

class BranchesList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 5,
      from: 0,
      manageAccountTabs: [],
    }
    this.mappers = [
      {
        title: local.branchCode,
        key: "branchCode",
        render: data => data.branchCode
      },
      {
        title: local.oneBranch,
        key: "branch",
        render: data =>  data.name
      },
      {
        title: local.governorate,
        key: "governorate",
        render: data =>  data.governorate

      },
      {
        title: local.creationDate,
        key: "creationDate",
        render: data => data.created? getDateAndTime(data.created.at) : ''
      },
      {
        title: '',
        key: "actions",
        render: data => <><span 
        onClick ={()=>{this.props.history.push({ pathname: "/manage-accounts/branches/branch-details", state: { details: data._id } })}}
        className='fa fa-eye icon'></span>
         <span
          onClick = {()=>{this.props.history.push({ pathname: "/manage-accounts/branches/edit-branch", state: { details: data._id } })}}
          className='fa fa-pencil-alt icon'></span></>
      },
    ]
  }
  componentDidMount() {
    this.getBranches();
    this.setState({
      manageAccountTabs: manageAccountsArray()
    })
  }
  getBranches() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'branch' });
  }
  render() {
    return (
      <div>
      (<HeaderWithCards
      header={local.manageAccounts}
      array = {this.state.manageAccountTabs}
      active = {this.state.manageAccountTabs.map(item => {return item.icon}).indexOf('branch')}
      />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.branches}</Card.Title>
                <span className="text-muted">{local.noOfBranches + ` (${this.props.totalCount? this.props.totalCount : 0})`}</span>
              </div>
              <div>
              <Can I='createBranch' a='branch'><Button onClick={() => { this.props.history.push("/manage-accounts/branches/new-branch") }} className="big-button" style={{ marginLeft: 20 }}>{local.createNewBranch}</Button></Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
            searchKeys={['keyword', 'dateFromTo']} 
            dropDownKeys={['name', 'code']} 
            searchPlaceholder={local.searchByBranchNameOrCode}
            url="branch"
             from={this.state.from} 
             size={this.state.size} />
            {this.props.data &&
              <DynamicTable
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination={true}
                data={this.props.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () => this.getBranches());
                }}
              />
            }
          </Card.Body>
        </Card>
      </div>
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
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(BranchesList));