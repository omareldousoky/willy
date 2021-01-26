import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import Can from '../../config/Can';
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
import { OfficersGroup } from '../../../Shared/Services/interfaces';

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
  selectedGroups: any[];
  checkAll: boolean;
  chosenStatus: string;
}
interface Props {
  data: OfficersGroup[];
  totalCount: number;
  loading: boolean;
  searchFilters: object;
  error: string;
  search: (data) => Promise<void>;
  setSearchFilters: (data) => void;
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
          checked={Boolean(this.state.selectedGroups.find(group => group._id === data._id))}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.groupManager,
        key: 'leader',
        render: data => data?.leader?.name
      },
      {
        title: local.loanOfficerOrCoordinator,
        key: 'officers',
        render: data =>  data.officers&& <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexFlow: 'row wrap'}}>
        {data.officers?.map((officer, i) => {
            return (
             officer?.name && <div
                    key={i}
                    className={'labelBtn'}
                    >
                    {officer.name}
                </div>
            )
        }
        )}
    </div>
      },
      {
        title: local.status,
        key:'status',
        render: data => this.getStatus(data.status)
      }
    ]
  }

  addRemoveItemFromChecked(group) {
    if (this.state.selectedGroups.findIndex(groupItem => groupItem._id == group._id) > -1) {
      this.setState({
        selectedGroups: this.state.selectedGroups.filter(el => el._id !== group._id),
      })
    } else {
      this.setState({
        selectedGroups: [...this.state.selectedGroups, group],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedGroups: this.props.data.filter((group)=> group.status ==='pending') })
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
  componentWillUnmount(){
    this.props.setSearchFilters({});
  }
  selectState = (event) =>{
    this.setState({
      chosenStatus: event.value
    })
    this.props.search({...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'supervisionsGroups', branchId: this.state.branchId !== 'hq' ? this.state.branchId : '', status: event.value})
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
                  searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                />
                :
                <Search
                  searchKeys={this.state.searchKey}
                  url="supervisionsGroups"
                  from={this.state.from}
                  size={this.state.size}
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