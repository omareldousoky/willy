import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormCheck from 'react-bootstrap/FormCheck';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import AsyncSelect from 'react-select/async';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { Loader } from '../../../Shared/Components/Loader';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import Search from '../../../Shared/Components/Search/search';
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { assignLeadToLO } from '../../Services/APIs/Leads/assignLeadToLO';
import { getDateAndTime } from '../../Services/getRenderDate';
import { search } from '../../../Shared/redux/search/actions';
import { loading } from '../../../Shared/redux/loading/actions';
import local from '../../../Shared/Assets/ar.json';

interface Props {
  history: Array<any>;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
  setLoading: (data) => void;
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
  checkAll: boolean;
  selectedCustomers: Array<any>;
  openModal: boolean;
  selectedLO: any;
  loanOfficers: Array<any>;
}

class AssignLoanOfficer extends Component<Props, State>{
  mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      tabs: [
        {
          icon: 'users',
          header: local.roles,
          desc: local.rolesDesc,
          path: '/halan-integration/leads',
        },
        {
          icon: 'exchange',
          header: local.changeRepresentative,
          desc: local.changeOfficerForMoreThanOneCustomer,
          path: '/halan-integration/exchange',
        }
      ],
      size: 10,
      from: 0,
      checkAll: false,
      selectedCustomers: [],
      openModal: false,
      selectedLO: {},
      loanOfficers: [],
    }
    this.mappers = [
      {
        title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
        key: 'selected',
        render: data => <FormCheck
          type="checkbox"
          checked={Boolean(this.state.selectedCustomers.find(customer => customer.uuid === data.uuid))}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.uuid
      },
      {
        title: local.customerName,
        sortable: true,
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
        render: data => data.branch
      },
      {
        title: local.representative,
        key: "representative",
        render: data => data.representativeName
      },
      {
        title: local.creationDate,
        sortable: true,
        key: "createdAt",
        render: data => data.createdAt ? getDateAndTime(data.createdAt) : ''
      },
      {
        title: '',
        key: 'actions',
        render: data => <> <img style={{ cursor: 'pointer', marginLeft: 20 }} alt={"view"} src={require('../../Assets/editIcon.svg')} onClick={() => this.props.history.push("/customers/edit-customer", { id: data._id })}></img>
          <img style={{ cursor: 'pointer' }} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push("/customers/view-customer", { id: data._id })}></img></>
      }
    ]
  }

  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'lead' });
  }
  getLeadsCustomers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'lead' });
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedCustomers: this.props.data })
    } else this.setState({ checkAll: false, selectedCustomers: [] })
  }
  addRemoveItemFromChecked(selectedCustomer: any) {
    if (this.state.selectedCustomers.findIndex(customer => customer._id === selectedCustomer._id) > -1) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(customer => customer._id !== selectedCustomer._id),
      })
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, selectedCustomer],
      })
    }
  }
  getLoanOfficers = async (input: string) => {
    const res = await searchLoanOfficer({ from: 0, size: 1000, name: input });
    if (res.status === "success") {
      this.setState({ loanOfficers: res.body.data })
      return res.body.data.filter(loanOfficer => loanOfficer.branches.includes(this.state.selectedCustomers[0].branchId));
    } else {
      this.setState({ loanOfficers: [] })
      return [];
    }
  }
  async submit() {
    this.props.setLoading(true);
    const res = await assignLeadToLO(this.state.selectedCustomers[0].phoneNumber, this.state.selectedLO._id, this.state.selectedCustomers[0].uuid);
    if (res.status === "success") {
      this.props.setLoading(false);
      this.setState({ openModal: false })
      Swal.fire("", `${local.doneMoving} ${this.state.selectedCustomers.length + " " + local.customerSuccess}`, "success")
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
          active={this.state.tabs.map(item => { return item.icon }).indexOf('exchange')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.customers}</Card.Title>
                <span className="text-muted">{local.noOfCustomers + ` (${this.props.totalCount})`}</span>
              </div>
              <div>
                <Button
                  onClick={() => this.setState({ openModal: true })}
                  disabled={!Boolean(this.state.selectedCustomers.length)}
                  className="big-button"
                  style={{ marginLeft: 20 }}
                >
                  {local.assignOrChangeLoanOfficer}{" "}
                  <span className="fa fa-exchange-alt"></span>
                </Button>
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
                  this.setState({ [key]: number } as any, () => this.getLeadsCustomers());
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(AssignLoanOfficer));