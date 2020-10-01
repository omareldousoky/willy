import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormCheck from 'react-bootstrap/FormCheck';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { Loader } from '../../../Shared/Components/Loader';
import DynamicTable from '../DynamicTable/dynamicTable';
import Search from '../Search/search';
import { getDateAndTime } from '../../Services/getRenderDate';
import { search } from '../../redux/search/actions';
import local from '../../../Shared/Assets/ar.json';

interface Props {
  history: Array<any>;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
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
  checkAll: boolean;
  selectedCustomers: Array<any>;
  openModal: boolean;
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
    }
    this.mappers = [
      {
        title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
        key: 'selected',
        render: data => <FormCheck
          type="checkbox"
          checked={Boolean(this.state.selectedCustomers.find(customer => customer._id === data._id))}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.key
      },
      {
        title: local.customerName,
        sortable: true,
        key: "name",
        render: data => data.customerName
      },
      {
        title: local.governorate,
        sortable: true,
        key: "governorate",
        render: data => data.governorate
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
        render: data => data.created?.at ? getDateAndTime(data.created?.at) : ''
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
    this.props.search({ size: this.state.size, from: this.state.from, url: 'customer' });
  }
  getLeadsCustomers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'customer' });
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
  render() {
    return (
      <>
        <HeaderWithCards
          header={'halan integration'}
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
              url="customer"
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
                url="customer"
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () => this.getLeadsCustomers());
                }}
              />
            }
          </Card.Body>
        </Card>
      </>
    )
  }
}
const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
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