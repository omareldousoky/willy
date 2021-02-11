import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import Search from '../../../Shared/Components/Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageAccountsArray } from './manageAccountsInitials';
import Swal from 'sweetalert2';
import { getErrorMessage } from "../../../Shared/Services/utils";
import { getCookie } from '../../../Shared/Services/getCookie';
import { getBranch } from '../../Services/APIs/Branch/getBranch';
interface State {
  size: number;
  from: number;
  manageAccountTabs: any[];
  branchId: string;
  branch: object;
}
interface Props {
  history: any;
  data: any;
  error: string;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => Promise<void>;
  setSearchFilters: (data) => void;
}

class BranchesList extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      manageAccountTabs: [],
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
      branch:{},

    }
    this.mappers = [
      {
        title: local.branchCode,
        key: "branchCode",
        render: data => data.branchCode
      },
      {
        title: local.oneBranch,
        key: "name",
        sortable: true,
        render: data =>  data.name
      },
      {
        title: local.governorate,
        key: "governorate",
        sortable: true,
        render: data =>  data.governorate

      },
      {
        title: local.creationDate,
        key: "createdAt",
        sortable: true,
        render: data => data.created? getDateAndTime(data.created.at) : ''
      },
      {
        title: '',
        key: "actions",
        render: data => <>
          <img style={{ cursor: 'pointer', marginLeft: 20 }} alt={"view"} src={require('../../Assets/view.svg')}
            onClick={() => { this.props.history.push({ pathname: "/manage-accounts/branches/branch-details", state: { details: data._id } }) }}></img>
         <Can I='createBranch' a='branch'><img style={{ cursor: 'pointer' }} alt={"edit"} src={require('../../Assets/editIcon.svg')}
            onClick={() => { this.props.history.push({ pathname: "/manage-accounts/branches/edit-branch", state: { details: data._id } }) }}></img> </Can> 
        </>
      },
    ]
  }
  componentDidMount() {
    if(this.state.branchId==='hq'){
    this.props.search({ size: this.state.size, from: this.state.from, url: 'branch' }).then(()=>{
      if(this.props.error)
      Swal.fire("Error !",getErrorMessage(this.props.error),"error")
    }
    );
  } else {
    this.getBranchByID();
  }
    this.setState({
      manageAccountTabs: manageAccountsArray()
    })
  }
  getBranches() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'branch', branchId: this.state.branchId !== 'hq' ? this.state.branchId : '' }).then(()=>{
      if(this.props.error)
      Swal.fire("Error !",getErrorMessage(this.props.error),"error")
    }
    );
  }
  async getBranchByID(){
      const res = await getBranch(this.state.branchId);
      if(res.status=='success'){
        if(res.body?.data)
        this.setState({branch: res.body.data})
      }
  }
  componentWillUnmount(){
    this.props.setSearchFilters({})
    this.props.search({url: 'clearData'})
  }
  render() {
    return (
      <div>
        (<HeaderWithCards
          header={local.manageAccounts}
          array={this.state.manageAccountTabs}
          active={this.state.manageAccountTabs.map(item => { return item.icon }).indexOf('branches')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.branches}</Card.Title>
                <span className="text-muted">{local.noOfBranches + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
              </div>
              <div>
                <Can I='createBranch' a='branch'><Button onClick={() => { this.props.history.push("/manage-accounts/branches/new-branch") }} className="big-button" style={{ marginLeft: 20 }}>{local.createNewBranch}</Button></Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            {this.state.branchId === 'hq' && <Search
              searchKeys={['keyword', 'dateFromTo']} 
              dropDownKeys={['name', 'code']} 
              searchPlaceholder={local.searchByBranchNameOrCode}
              url="branch"
              setFrom= {(from) => this.setState({from: from})}
             from={this.state.from} 
             size={this.state.size} />
            }
            {
              (this.state.branchId !=='hq' && this.state.branch ) &&
              <DynamicTable
              totalCount={1}
              mappers={this.mappers}
              pagination={false}
              data={[this.state.branch]}
            />
            }
            {this.props.data &&
              <DynamicTable
                url="branch"
                from={this.state.from} 
                size={this.state.size}
                totalCount={ this.props.totalCount}
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
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(BranchesList));