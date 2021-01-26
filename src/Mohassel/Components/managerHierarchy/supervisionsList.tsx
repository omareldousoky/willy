import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import './managerHierarchy.scss'
import Search from '../../../Shared/Components/Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { getCookie } from '../../../Shared/Services/getCookie';
import { Col, Form, FormCheck, Row } from 'react-bootstrap';
import Select from 'react-select';
import { theme } from '../../../theme';
import ability from '../../config/ability';
import { GroupsByBranch } from '../../../Shared/Services/interfaces';
import { approveOfficersGroups } from '../../Services/APIs/ManagerHierarchy/approveOfficersGroups';
import { unApproveOfficersGroups } from '../../Services/APIs/ManagerHierarchy/unApproveOfficersGroups';
import { loading } from '../../../Shared/redux/loading/actions';
interface State {
  size: number;
  from: number;
  branchId: string;
  searchKey: string[];
  options:  {
    label: string;
    value: string;
  }[];
  print: boolean;
  selectedGroups: GroupsByBranch[];
  checkAll: boolean;
  chosenStatus: string;
}
interface Props {
  data: GroupsByBranch[];
  totalCount: number;
  loading: boolean;
  searchFilters: object;
  error: string;
  search: (data) => Promise<void>;
  setSearchFilters: (data) => void;
  setLoading: (data) => void;
}
interface BranchId{
  branchId: string;
}
interface GroupIds{
  groupIds: string[];
}
class SupervisionGroupsList extends Component<Props, State> {
  mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
      searchKey: [''],
      print: false,
      selectedGroups: [],
      checkAll: false,
      options:[{label:local.getSupervisionGroups,value:'' }],
      chosenStatus: '',
    }
    this.mappers = [
      {
        title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
        key: 'selected',
        render: data => data.status ===  this.state.chosenStatus && <FormCheck
          type="checkbox"
          checked={Boolean(this.state.selectedGroups.find(group => group.id === data.id))}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.oneBranch,
        key: 'branch',
        render: data =>  data?.branch?.name,

      },
      {
        title: local.groupManager,
        key: 'leader',
        render: data => data?.leader?.name
      },
      {
        title: local.status,
        key:'status',
        render: data => this.getStatus(data.status)
      },
      {
        title: local.loanOfficerOrCoordinator,
        key: 'officers',
        render: data =>  data.officers&& <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexFlow:'wrap'}}>
        {data.officers?.map((officer, i) => {
            return (
             officer?.name && <div
                    key={i}
                    className={'labelBtn'}
                    style={{ flex: "1 0 21%", flexGrow: 1,maxWidth:'16rem', overflowY: "scroll"}}
                    >
                    {officer.name}
                </div>
            )
        }
        )}
    </div>
      }
    ]
  }

  addRemoveItemFromChecked(group) {
    if (this.state.selectedGroups.findIndex(groupItem => groupItem.id == group.id) > -1) {
      this.setState({
        selectedGroups: this.state.selectedGroups.filter(el => el.id !== group.id),
      })
    } else {
      this.setState({
        selectedGroups: [...this.state.selectedGroups, group],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedGroups: this.props.data.filter((group)=> group.status ===this.state.chosenStatus) })
    } else this.setState({ checkAll: false, selectedGroups: [] })
  }
  componentDidMount() {
    const selectOptions =[{label:local.getSupervisionGroups, value:''}]
    if (ability.can('approveOfficersGroup', 'branch'))
      selectOptions.push({
        label: local.approveSuperVisionGroups,
        value: 'pending'
      });
    if (ability.can('unApproveOfficersGroup', 'branch'))
      selectOptions.push({
        label: local.unApproveSuperVisionGroups,
        value: 'approved'
      })
      this.setState({options: selectOptions})
    this.props.search({ size: this.state.size, from: this.state.from, url: 'supervisionsGroups', branchId: this.state.branchId !== 'hq' ? this.state.branchId : '', status:this.state.chosenStatus }).then(() => {
      if (this.props.error) {
        Swal.fire("error", getErrorMessage(this.props.error), "error")
      }
      if (this.state.branchId === 'hq') {
        this.setState({ searchKey: ['branch'] });
      }
    })
  }
  getSupervisionsGroups() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'supervisionsGroups',status: this.state.chosenStatus ,branchId: this.state.branchId !== 'hq' ? this.state.branchId : '' }).then(() => {
      if (this.props.error) {
        Swal.fire("error", getErrorMessage(this.props.error), "error")
      }
    });
  }
  getStatus(status: string) {
    switch (status) {
      case 'pending':
        return <div className="status-chip outline under-review" style={{width:'100px'}}>{local.pending}</div>
      case 'approved':
        return <div className="status-chip outline approved" style={{width:'100px'}}>{local.approved}</div>
      default: return null;
    }
  }
  prepareSubmit(){
    const selectedGroupsMap: Map<string, string[]> = new Map();
    this.state.selectedGroups.map((group)=>{
          if(selectedGroupsMap.has(group.branchId)){
             selectedGroupsMap.get(group.branchId)?.push(group.id)
          } else{
            selectedGroupsMap.set(group.branchId,[group.id]);
          }
    })
    const branchesGroupIds: {
      branchId: string;
      groupIds: string[];
    }[] = [];
    selectedGroupsMap.forEach((value, key) => {  
         branchesGroupIds.push({
           branchId: key,
          groupIds: value
         })
  });
    return branchesGroupIds;
  }
  componentWillUnmount(){
    this.props.setSearchFilters({});
  }
  selectState = (event) =>{
    this.setState({
      chosenStatus: event.value
    })
    const branch= this.state.branchId !== 'hq' ? this.state.branchId : ''
    if( this.state.branchId !== 'hq')
    this.props.search({...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'supervisionsGroups', status: event.value, branchId: this.state.branchId })
    else{
      this.props.search({...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'supervisionsGroups', status: event.value})
    }
  }
  submit= () =>{
      const branchesGroupIds = this.prepareSubmit();
      if(this.state.chosenStatus==='pending'){
        this.approveOfficers(branchesGroupIds)
      } else if(this.state.chosenStatus==='approved'){
        this.unApproveOfficers(branchesGroupIds)
      }
  }
  async approveOfficers(branchesGroupIds) {
    this.props.setLoading(true);
    const res = await approveOfficersGroups({ branchesGroupIds })
    if (res.status === 'success') {
      this.props.setLoading(false);
        Swal.fire('Success', '', 'success').then(() => window.location.reload())
    } else {
      this.props.setLoading(false);
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
    }
}
async unApproveOfficers(branchesGroupIds) {
  this.props.setLoading(true);
  const res = await unApproveOfficersGroups({branchesGroupIds})
  if (res.status === 'success') {
    this.props.setLoading(false);
      Swal.fire('Success', '', 'success').then(() => window.location.reload())
  } else {
    this.props.setLoading(false);
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
  }
}
  render() {
    return (
      <>
        <div className="print-none">
          <Card style={{ margin: '20px 50px' }}>
            <Loader type="fullsection" open={this.props.loading} />
            <Card.Body style={{ padding: 0 }}>
              <div className="custom-card-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.levelsOfSupervision}</Card.Title>
                  <span className="text-muted">{local.noOfSupervisionGroups + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
                </div>
              {this.state.chosenStatus &&  <Button onClick={this.submit}
                disabled={!Boolean(this.state.selectedGroups.length)}
                className="big-button"
                style={{ marginLeft: 20, height: 70 }}
              > {this.state.chosenStatus=='pending'? local.approveSuperVisionGroups : local.unApproveSuperVisionGroups}
              </Button>
              }
              </div>
              <hr className="dashed-line" />
              <>
              <Col sm={6}>
                <Form.Label as={Row} style={{fontWeight:'bolder', textAlign:"right",margin:'9px'}}>{local.chooseOperationType}</Form.Label>
                <Select
                    styles={theme.selectStyle}
                    placeholder={local.chooseOperationType}
                    onChange={(event)=>{
                     this.selectState(event);
                    }}
                    options={this.state.options}
                 /></Col>
              {this.state.branchId == 'hq' ?
                <Search
                  searchKeys={this.state.searchKey}
                  url="supervisionsGroups"
                  from={this.state.from}
                  size={this.state.size}
                  chosenStatus={this.state.chosenStatus}
                  searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                />
                :
                <Search
                  searchKeys={this.state.searchKey}
                  url="supervisionsGroups"
                  from={this.state.from}
                  size={this.state.size}
                  chosenStatus={this.state.chosenStatus}
                  searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                  hqBranchIdRequest={this.state.branchId}
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
                  url="supervisionsGroups"
                  changeNumber={(key: string, number: number) => {
                    this.setState({ [key]: number } as any, () => this.getSupervisionsGroups());
                  }}
                />
              }
              </>
            </Card.Body>
          </Card>
        </div>
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
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(SupervisionGroupsList));