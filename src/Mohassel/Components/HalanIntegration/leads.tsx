import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { Loader } from '../../../Shared/Components/Loader';
import DynamicTable from '../DynamicTable/dynamicTable';
import Search from '../Search/search';
import Can from '../../config/Can';
import { getCookie } from '../../Services/getCookie';
import { getDateAndTime } from '../../Services/getRenderDate';
import { changeLeadState, changeInReviewLeadState } from '../../Services/APIs/Leads/changeLeadState';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { assignLeadToLO } from '../../Services/APIs/Leads/assignLeadToLO';
import { search } from '../../redux/search/actions';
import { loading } from '../../redux/loading/actions';
import local from '../../../Shared/Assets/ar.json';
import './leads.scss';


interface Props {
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  history: any;
  search: (data) => void;
  setLoading: (data) => void;
  setSearchFilters: (data) => void;
}
interface State {
  tabs: Array<{
    icon: string;
    header: string;
    desc: string;
    path: string;
  }>;
  size: number;
  from: number;
  openActionsId: string;
  openModal: boolean;
  loanOfficers: Array<any>;
  selectedLO: any;
  selectedLead: any;
  branchId: string;
}
class Leads extends Component<Props, State>{
  mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      tabs: [
        {
          icon: 'users',
          header: local.applicantsLeads,
          desc: local.createAndEditApplicantLeads,
          path: '/halan-integration/leads',
        },
      ],
      size: 10,
      from: 0,
      openActionsId: '',
      openModal: false,
      loanOfficers: [],
      selectedLO: {},
      selectedLead: {},
      branchId: ''
    }
    this.mappers = [
      // {
      //   title: local.leadCode,
      //   key: "customerCode",
      //   render: data => data.uuid
      // },
      {
        title: local.leadName,
        key: "name",
        render: data => data.customerName
      },
      {
        title: local.governorate,
        key: "governorate",
        render: data => data.businessGovernate
      },
      {
        title: local.branchName,
        key: "branch",
        render: data => data.branchName
      },
      {
        title: local.phoneNumber,
        key: "phoneNumber",
        render: data => data.phoneNumber
      },
      {
        title: local.status,
        key: "status",
        render: data => this.getLeadStatus(data.status)
      },
      {
        title: local.creationDate,
        key: "createdAt",
        render: data => data.createdAt ? getDateAndTime(data.createdAt) : ''
      },
      {
        title: () => local.loanOfficer,
        key: "loanOfficer",
        render: data => data.loanOfficerName
      },
      {
        title: () => <Can I="assignLead" a="halanuser">{local.chooseLoanOfficer}</Can>,
        key: "changeLoanOfficer",
        render: data =>
          data.status !== 'rejected' &&
          <Can I="assignLead" a="halanuser">
            <span style={{ marginRight: 5, cursor: 'pointer' }}
              className="fa fa-exchange-alt" onClick={() => this.setState({ selectedLead: data, openModal: true })} />
          </Can>
      },
      {
        title: () => <Can I="reviewLead" a="halanuser">{local.actions}</Can>,
        key: "actions",
        render: data =>
          <div style={{ position: 'relative' }}>
            <p className="clickable-action" onClick={() => this.setState({ openActionsId: this.state.openActionsId === data.uuid ? '' : data.uuid })}>{local.actions}</p>
            {this.state.openActionsId === data.uuid && <div className="actions-list">
              {data.status === "in-review" && <Can I="reviewLead" a="halanuser"><div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'rejected', '')}>{local.rejectApplication}</div></Can>}
              {data.status === "in-review" && <Can I="reviewLead" a="halanuser"><div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'approved', '')}>{local.acceptApplication}</div></Can>}
              {data.status === "submitted" && <Can I="reviewLead" a="halanuser"><div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'in-review', 'secondApproval')}>{local.acceptSecondVisit}</div></Can>}
              <Can I="leadInReviewStatus" a="halanuser">
                <div className="item"
                  onClick={() => {
                    this.changeMainState(data.phoneNumber, 'in-review', 'view', data);
                  }}>{local.viewCustomerLead}</div>
              </Can>
              <Can I="leadInReviewStatus" a="halanuser">
                <div className="item" onClick={() => this.changeMainState(data.phoneNumber, 'in-review', 'edit', data)}>{local.editLead}</div>
                </Can>
            </div>}
          </div>
      },
    ]
  }

  componentDidMount() {
    let branchId = JSON.parse(getCookie('ltsbranch'))._id;
    branchId = branchId === 'hq' ? '' : branchId;
    this.setState({ branchId })
    this.props.search({ size: this.state.size, from: this.state.from, url: 'lead', branchId: branchId });
  }
  getLeadsCustomers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'lead', branchId: this.state.branchId });
  }
  getLeadStatus(status: string) {
    switch (status) {
      case 'submitted': return local.submitted;
      case 'in-review': return local.underReview;
      case 'approved': return local.approved;
      case 'rejected': return local.rejected;
      default: return '';
    }
  }
  async changeLeadState(phoneNumber: string, oldState: string, oldInReviewStatus: string, newState: string, inReviewStatus: string) {
    Swal.fire({
      text: local.areYouSure,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.yes,
      cancelButtonText: local.cancel
    }).then(async (result) => {
      if (result.value) {
        if (oldState === newState) {
          if (oldInReviewStatus === 'basic') {
            this.props.setLoading(true);
            const inReviewStatusRes = await changeInReviewLeadState(phoneNumber, inReviewStatus);
            if (inReviewStatusRes.status === "success") {
              this.props.setLoading(false);
              this.setState({ openActionsId: "" })
              Swal.fire('', local.changeState, 'success').then(() => this.getLeadsCustomers());
            } else {
              this.props.setLoading(false);
              Swal.fire('', local.userRoleEditError, 'error');
            }
          }
        } else {
          this.changeMainState(phoneNumber, newState, '', null);
        }
      }
    })
  }
  async changeMainState(phoneNumber: string, newState: string, action: string, data) {
    this.props.setLoading(true);
    if (action && data.status !== 'submitted') {
      action === 'view' ? this.props.history.push('/halan-integration/leads/view-lead', { leadDetails: data }) : this.props.history.push('/halan-integration/leads/edit-lead', { leadDetails: data })
    } else {
      const res = await changeLeadState(phoneNumber, newState);
      if (res.status === "success") {
        this.props.setLoading(false);
        this.setState({ openActionsId: "" })
        if (action === 'view') {
          this.props.history.push('/halan-integration/leads/view-lead', { leadDetails: data })
        } else if(action === 'edit') {
          this.props.history.push('/halan-integration/leads/edit-lead', { leadDetails: data })
        } else Swal.fire('', local.changeState, 'success').then(() => this.getLeadsCustomers());
      } else {
        this.props.setLoading(false);
        Swal.fire('', local.userRoleEditError, 'error');
      }
    }

  }
  getLoanOfficers = async (input: string) => {
    const res = await searchLoanOfficer({ from: 0, size: 1000, name: input });
    if (res.status === "success") {
      this.setState({ loanOfficers: res.body.data })
      return res.body.data
        .filter(loanOfficer => loanOfficer.branches?.includes(this.state.selectedLead.branchId))
        .filter(loanOfficer => loanOfficer.status === 'active')
        .filter(loanOfficer => loanOfficer._id !== this.state.selectedLead.loanOfficerId);
    } else {
      this.setState({ loanOfficers: [] })
      return [];
    }
  }
  async submit() {
    this.props.setLoading(true);
    const res = await assignLeadToLO(this.state.selectedLead.phoneNumber, this.state.selectedLO._id, this.state.selectedLead.uuid);
    if (res.status === "success") {
      this.props.setLoading(false);
      this.setState({ openModal: false })
      Swal.fire("", `${local.doneMoving} ${local.customerSuccess}`, "success").then(() => {
        this.setState({ selectedLO: {}, selectedLead: {} });
        this.getLeadsCustomers();
      })
    } else {
      this.props.setLoading(false);
      Swal.fire("", local.errorOnMovingCustomers, "error")
    }
  }
  render() {
    return (
      <>
        <HeaderWithCards
          header={local.halan}
          array={this.state.tabs}
          active={this.state.tabs.map(item => { return item.icon }).indexOf('users')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.applicantsLeads}</Card.Title>
                <span className="text-muted">{local.noOfApplicants + ` (${this.props.totalCount})`}</span>
              </div>
              <div>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo']}
              dropDownKeys={['name']}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
              hqBranchIdRequest={this.state.branchId}
              url="lead"
              from={this.state.from}
              size={this.state.size}
            />
            {this.props.data &&
              <DynamicTable
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination={true}
                data={this.props.data}
                url="lead"
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number, openActionsId: "" } as any, () => this.getLeadsCustomers());
                }}
              />
            }
          </Card.Body>
        </Card>
        <Modal size="lg" show={this.state.openModal} onHide={() => this.setState({ openModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: " 0 auto" }}>
              {local.chooseRepresentative}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ padding: "10px 40px" }}>
              <Form.Label className="data-label">{local.chooseLoanOfficer}</Form.Label>
              <Col sm={12}>
                <AsyncSelect
                  name="employees"
                  data-qc="employees"
                  value={this.state.loanOfficers.find(loanOfficer => loanOfficer._id === this.state.selectedLO?._id)}
                  onChange={(loanOfficer) => this.setState({ selectedLO: loanOfficer })}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  loadOptions={(input) => this.getLoanOfficers(input)}
                  cacheOptions defaultOptions
                />
              </Col>
            </Row>
            <Row style={{ padding: "10px 40px", justifyContent: "center" }}>
              <Col >
                <Button
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => this.submit()}
                  disabled={false}
                  variant="primary"
                >
                  {local.submit}
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    setLoading: data => dispatch(loading(data))
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(Leads));