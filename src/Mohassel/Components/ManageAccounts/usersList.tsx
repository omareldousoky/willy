import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import { setUserActivation } from '../../Services/APIs/Users/userActivation';
import Search from '../../../Shared/Components/Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { loading } from '../../../Shared/redux/loading/actions';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageAccountsArray } from './manageAccountsInitials';
import { getErrorMessage, timeToDateyyymmdd } from "../../../Shared/Services/utils";

interface Props {
  history: any;
  data: any;
  error: string;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  statusCode: string;
  search: (data) => Promise<void>;
  setLoading: (data) => void;
  setSearchFilters: (data) => void;
  branchId?: string;
  withHeader: boolean;
};
interface State {
  size: number;
  from: number;
  manageAccountTabs: any[];
}

class UsersList extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      manageAccountTabs:[],
    }
    this.mappers = [
      {
        title: local.username,
        key: "username",
        sortable: true,
        render: data => data.username
      },
      {
        title: local.code,
        key: "userCode",
        render: data => data.loanOfficerKey
      },
      {
        title: local.name,
        key: "name",
        render: data => data.name
      },
      {
        title: local.nationalId,
        key: "nationalId",
        render: data => data.nationalId
      },
      {
        title: local.hrCode,
        key: "hrCode",
        render: data => data.hrCode
      },
      {
        title: local.employment,
        key: "employment",
        render: data => data.hiringDate? timeToDateyyymmdd(data.hiringDate): ''
      },
      {
        title: local.creationDate,
        key: "createdAt",
        sortable: true,
        render: data => data.created?.at ? getDateAndTime(data.created.at) : ''
      },
      {
        title: '',
        key: "actions",
        render: (data) => this.renderIcons(data)
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'user', branchId: this.props.branchId }).then(()=>{
      if(this.props.error)
      Swal.fire("Error !",getErrorMessage(this.props.error),"error")
    })
    this.setState({
      manageAccountTabs: manageAccountsArray()
    })   
  }

  async handleActivationClick(data: any) {
    const req = { id: data._id, status: data.status === "active" ? "inactive" : "active" }
    this.props.setLoading(true);

    const res = await setUserActivation(req);
    if (res.status === 'success') {
      this.props.setLoading(false);
      Swal.fire("", `${data.username}  ${req.status} `, 'success').then(() => this.getUsers())
    } else {
      this.props.setLoading(false);
      Swal.fire("Error !",getErrorMessage(res.error.error),"error");
    }

  }
  renderIcons(data: any) {
    return (
      <>
        <img style={{cursor: 'pointer', marginLeft: 20}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => { this.props.history.push({ pathname: "/manage-accounts/users/user-details", state: { details: data._id } }) }} ></img>
        <Can I="updateUser" a="user"><img style={{cursor: 'pointer', marginLeft: 20}} alt={"edit"} src={require('../../Assets/editIcon.svg')} onClick={() => { this.props.history.push({ pathname: "/manage-accounts/users/edit-user", state: { details: data._id } }) }} ></img></Can>
        <Can I="userActivation" a="user"><span  className='fa icon' onClick={() => this.handleActivationClick(data)}> {data.status === "active" && <img alt={"deactive"} src={require('../../Assets/deactivate-user.svg')} />} {data.status === "inactive" && local.activate} </span></Can>
      </>
    );
  }
  async getUsers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'user', branchId: this.props.branchId }).then(()=>{
      if(this.props.error)
      Swal.fire("Error !",getErrorMessage(this.props.error),"error")
    }
    );
  }
  render() {
    return (
      <div>
        {this.props.withHeader &&
     <HeaderWithCards
      header={local.manageAccounts}
      array = {this.state.manageAccountTabs}
      active = {this.state.manageAccountTabs.map(item => {return item.icon}).indexOf('users')}
        /> }
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.users}</Card.Title>
                <span className="text-muted">{local.noOfUsers + ` (${this.props.totalCount? this.props.totalCount : 0})`}</span>
              </div>
              <div>
                <Can I='createUser' a='user'><Button className="big-button" style={{ marginLeft: 20 }} onClick={() => this.props.history.push('/manage-accounts/users/new-user')}>{local.createNewUser}</Button></Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Search 
            searchKeys={['keyword', 'dateFromTo']} 
            dropDownKeys={['name', 'nationalId', 'key', 'userName' , 'hrCode']} 
            searchPlaceholder = {local.searchByBranchNameOrNationalIdOrCode}
            setFrom= {(from) => this.setState({from: from})}
            url="user" from={this.state.from} size={this.state.size} 
            hqBranchIdRequest={this.props.branchId} />

            <DynamicTable
              url="user" from={this.state.from} size={this.state.size} 
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getUsers());
              }}
            />
          </Card.Body>
        </Card>
      </div>
    )
  }
}

const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    setLoading: data => dispatch(loading(data)),
    setSearchFilters: data => dispatch(searchFilters(data)),
  };
};
const mapStateToProps = state => {
  return {
    data: state.search.data,
    statusCode: state.search.status,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(UsersList));