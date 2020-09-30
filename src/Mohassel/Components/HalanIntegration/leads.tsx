import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { Loader } from '../../../Shared/Components/Loader';
import DynamicTable from '../DynamicTable/dynamicTable';
import Search from '../Search/search';
import { getDateAndTime } from '../../Services/getRenderDate';
import { search } from '../../redux/search/actions';
import local from '../../../Shared/Assets/ar.json';
import './leads.scss';


interface Props {
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
  openActionsId: string;
}
class Leads extends Component<Props, State>{
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      tabs: [
        {
          icon: 'users',
          header: local.roles,
          desc: local.rolesDesc,
          path: '/halan-integration/leads',
        }
      ],
      size: 10,
      from: 0,
      openActionsId: '',
    }
    this.mappers = [
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
        title: local.actions,
        key: "actions",
        render: data =>
          <div style={{ position: 'relative' }}>
            <p className="clickable-action" onClick={() => this.setState({ openActionsId: this.state.openActionsId === data._id ? '' : data._id })}>{local.actions}</p>
            {this.state.openActionsId === data._id && <div className="actions-list">
              <div className="item">{local.rejectApplication}</div>
              <div className="item">{local.acceptApplication}</div>
              <div className="item">{local.acceptSecondVisit}</div>
              <div className="item">{local.editCustomer}</div>
              <div className="item">{local.viewCustomerLead}</div>
            </div>}
          </div>
      },
    ]
  }

  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'customer' });
  }
  getLeadsCustomers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'customer' });
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
                <span className="text-muted">{local.noOfRoles + ` (${100})`}</span>
              </div>
              <div>
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(Leads));