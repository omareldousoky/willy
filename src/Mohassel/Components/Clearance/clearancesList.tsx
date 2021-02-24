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
import ClearancePaper from './clearancePaper';
import { FormCheck } from 'react-bootstrap';
import { changeClearancePrintStatus, ChangeClearancePrintStatusRequest } from '../../Services/APIs/clearance/changeClearancePrintStatus';
import { loading } from '../../../Shared/redux/loading/actions';

interface State {
  size: number;
  from: number;
  branchId: string;
  searchKey: string[];
  print: boolean;
  selectedClearances: any[];
  checkAll: boolean;
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
  setLoading: (data) => void;
}
class ClearancesList extends Component<Props, State> {
  mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      branchId: JSON.parse(getCookie('ltsbranch'))._id,
      searchKey: ['keyword', 'dateFromTo', 'clearance-status', 'printed'],
      print: false,
      selectedClearances: [],
      checkAll: false,
    }
    this.mappers = [
      {
        title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
        key: 'selected',
        render: data => data.status === 'approved'&& <FormCheck
          type="checkbox"
          checked={Boolean(this.state.selectedClearances.find(clearance => clearance._id === data._id))}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.oneBranch,
        key: "branchName",
        render: data => data.branchName
      },
      {

        title: local.bankName,
        key: "bankName",
        render: data => data.bankName,
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
        title: local.printed,
        key: "printed",
        render: data => data.printed ? <img alt="printed" src={require('../../Assets/check-circle.svg')} /> : <img alt="printed" src={require('../../Assets/times-circle.svg')} />
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
        render: data => <table style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <td className="icon-td"><Can I= "getClearance" a="application"><img style={{cursor: 'pointer'}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push("/clearances/clearance-profile", { id: data._id })}></img></Can></td>
          <td className="icon-td">{data.status === 'underReview' ? <Can I="editClearance" a="application"><img style={{ cursor: 'pointer', marginLeft: 20 }} alt={"edit"} src={require('../../Assets/editIcon.svg')} onClick={() => this.props.history.push("/clearances/edit-clearance", { clearance: { id: data._id } })} /></Can> : null}</td>
          <td className="icon-td">{data.status !== "approved" ? <Can I="reviewClearance" a="application"><span style={{ cursor: 'pointer', marginLeft: 20, color: '#7dc356', textDecoration: 'underline' }} onClick={() => this.props.history.push("/clearances/review-clearance", { clearance: { id: data._id } })}>{local.reviewClearance}</span></Can> : null}</td>
        </table>
      },
    ]
  }

  addRemoveItemFromChecked(clearance) {
    if (this.state.selectedClearances.findIndex(clearanceItem => clearanceItem._id == clearance._id) > -1) {
      this.setState({
        selectedClearances: this.state.selectedClearances.filter(el => el._id !== clearance._id),
      })
    } else {
      this.setState({
        selectedClearances: [...this.state.selectedClearances, clearance],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedClearances: this.props.data.filter((clearance)=> clearance.status ==='approved') })
    } else this.setState({ checkAll: false, selectedClearances: [] })
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'clearance', branchId: this.state.branchId !== 'hq' ? this.state.branchId : '' }).then(() => {
      if (this.props.error) {
        Swal.fire("error", getErrorMessage(this.props.error), "error")
      }
      if (this.state.branchId === 'hq') {
        this.setState({ searchKey: ['keyword', 'dateFromTo', 'branch', 'clearance-status', 'printed'] });
      }
    })
  }
  getClearances() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'clearance', branchId: this.state.branchId !== 'hq' ? this.state.branchId : '' }).then(() => {
      if (this.props.error) {
        Swal.fire("error", getErrorMessage(this.props.error), "error")
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
  componentWillUnmount(){
    this.props.setSearchFilters({});
  }
  async print() {
    this.props.setLoading(true)
    const selectedCLearances = this.state.selectedClearances.map(el => el._id)
    const req: ChangeClearancePrintStatusRequest = {ids: selectedCLearances}
    const res = await changeClearancePrintStatus(req)
    if(res.status === "success") {
      this.props.setLoading(false);
      this.setState({ print: true }, () => window.print())
      this.getClearances()
      this.setState({selectedClearances: []})
    } else {
      this.props.setLoading(false);
    }
  }
  render() {
    return (
      <>
        <div className="print-none">
          <Card className="main-card">
            <Loader type="fullsection" open={this.props.loading} />
            <Card.Body style={{ padding: 0 }}>
              <div className="custom-card-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.clearances}</Card.Title>
                  <span className="text-muted">{local.noOfClearances + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
                </div>
                  <Button onClick={() => { this.print() }}
                  disabled={(this.state.selectedClearances.length > 0 ? false: true) as boolean}
                  className="big-button"
                  style={{ marginLeft: 20, height: 70 }}
                > {local.downloadPDF}
                </Button>
              </div>
              <hr className="dashed-line" />
              {this.state.branchId == 'hq' ?
                <Search
                  searchKeys={this.state.searchKey}
                  dropDownKeys={['name', 'customerKey']}
                  url="clearance"
                  from={this.state.from}
                  size={this.state.size}
                  datePlaceholder={local.registrationDate}
                  searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                />
                :
                <Search
                  searchKeys={this.state.searchKey}
                  dropDownKeys={['name', 'customerKey']}
                  url="clearance"
                  from={this.state.from}
                  size={this.state.size}
                  datePlaceholder={local.registrationDate}
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
                  url="clearance"
                  changeNumber={(key: string, number: number) => {
                    this.setState({ [key]: number } as any, () => this.getClearances());
                  }}
                />
              }
            </Card.Body>
          </Card>
        </div>
        {this.state.print && <ClearancePaper approvedClearancesList={this.state.selectedClearances} />}
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(ClearancesList));