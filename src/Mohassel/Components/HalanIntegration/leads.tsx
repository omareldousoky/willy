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
}
class Leads extends Component<Props, State>{
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
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
      selectedLead: {}
    }
    this.mappers = [
      {
        title: local.leadCode,
        key: "customerCode",
        render: data => data.uuid
      },
      {
        title: local.leadName,
        sortable: true,
        key: "name",
        render: data => data.customerName
      },
      {
        title: local.governorate,
        sortable: true,
        key: "governorate",
        render: data => data.businessGovernate
      },
      {
        title: local.branchName,
        key: "branch",
        render: data => data.branch
      },
      {
        title: local.representative,
        key: "representative",
        render: data => data.representativeName
      },
      {
        title: local.phoneNumber,
        key: "phoneNumber",
        render: data => data.phoneNumber
      },
      {
        title: local.status,
        key: "status",
        render: data => data.status
      },
      {
        title: local.creationDate,
        sortable: true,
        key: "createdAt",
        render: data => data.createdAt ? getDateAndTime(data.createdAt) : ''
      },
      {
        title: local.loanOfficer,
        key: "loanOfficer",
        render: data => <div>{data.loanOfficerName} <span style={{ marginRight: 5, cursor: 'pointer' }} className="fa fa-exchange-alt" onClick={() => this.setState({ selectedLead: data, openModal: true })} /></div>
      },
      {
        title: local.actions,
        key: "actions",
        render: data =>
          <div style={{ position: 'relative' }}>
            <p className="clickable-action" onClick={() => this.setState({ openActionsId: this.state.openActionsId === data.uuid ? '' : data.uuid })}>{local.actions}</p>
            {this.state.openActionsId === data.uuid && <div className="actions-list">
              {data.status === "in-review" && <div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'rejected', '')}>{local.rejectApplication}</div>}
              {data.status === "in-review" && <div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'approved', '')}>{local.acceptApplication}</div>}
              {data.inReviewStatus !== "secondApproval" && data.status !== "approved" && data.status !== "rejected" && <div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'in-review', 'secondApproval')}>{local.acceptSecondVisit}</div>}
              <div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'in-review', 'basic')}>{local.editLead}</div>
              <div className="item" onClick={() => this.changeLeadState(data.phoneNumber, data.status, data.inReviewStatus, 'in-review', 'basic')}>{local.viewCustomerLead}</div>
            </div>}
          </div>
      },
    ]
  }

  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'lead' });
  }
  getLeadsCustomers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'lead' });
  }
  async changeLeadState(phoneNumber: string, oldState: string, oldInReviewStatus: string, newState: string, inReviewStatus: string) {
    this.props.setLoading(true);
    if (oldState === newState) {
      if (oldInReviewStatus === 'basic') {
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
      const res = await changeLeadState(phoneNumber, newState);
      if (res.status === "success") {
        this.props.setLoading(false);
        this.setState({ openActionsId: "" })
        Swal.fire('', local.changeState, 'success').then(() => this.getLeadsCustomers());
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
      return res.body.data.filter(loanOfficer => loanOfficer.branches.includes(this.state.selectedLead.branchId));
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
      Swal.fire("", `${local.doneMoving} ${local.customerSuccess}`, "success").then(() => this.setState({selectedLO: {}, selectedLead: {}}))
    } else {
      this.props.setLoading(false);
      Swal.fire("", local.errorOnMovingCustomers, "error")
    }
  }
  render() {
    return (
      <>
        <HeaderWithCards
          header={'halan integration'}
          array={this.state.tabs}
          active={this.state.tabs.map(item => { return item.icon }).indexOf('users')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.roles}</Card.Title>
                <span className="text-muted">{local.noOfRoles + ` (${this.props.totalCount})`}</span>
              </div>
              <div>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo', 'governorate', 'branch']}
              dropDownKeys={['name', 'nationalId', 'key', 'code']}
              searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
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