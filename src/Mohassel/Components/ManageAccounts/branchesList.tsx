import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../DynamicTable/dynamicTable';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search } from '../../redux/search/actions';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageAccountsArray } from './manageAccountsInitials';
interface State {
  size: number;
  from: number;
}
interface Props {
  history: any;
  data: any;
  totalCount: number;
  loading: boolean;
  search: (data) => void;
}

class BranchesList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 5,
      from: 0,
    }
    this.mappers = [
      {
        title: local.branchCode,
        key: "branchCode",
        render: data => data.branchCode
      },
      {
        title: local.oneBranch,
        key: "branch",
        render: data => data.governorate + "-" + data.name
      },
      {
        title: local.noOfUsers,
        key: "noOfUsers",
        render: data => 'noOfUsers'
      },
      {
        title: local.transactions,
        key: "transactions",
        render: data => "transactions"
      },
      {
        title: local.creationDate,
        key: "creationDate",
        render: data => getDateAndTime(data.created.at)
      },
      {
        title: local.status,
        key: "status",
        render: data => data.status
      },
      {
        title: local.gender,
        key: "type",
        render: data => data.type
      },
      {
        title: '',
        key: "actions",
        render: data => <><span className='fa fa-eye icon'></span> <span className='fa fa-pencil-alt icon'></span></>
      },
    ]
  }
  componentDidMount() {
    this.getBranches()
  }

  getBranches() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'branch' });
  }
  render() {
    return (
      <div>
        <HeaderWithCards
      header={local.manageAccounts}
      array = {manageAccountsArray}
      active = {2}
      />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.branches}</Card.Title>
                <span className="text-muted">{local.noOfBranches + ` (${this.props.totalCount})`}</span>
              </div>
              <div>
              <Can I='createBranch' a='branch'><Button onClick={() => { this.props.history.push("/manage-accounts/branches/new-branch") }} className="big-button" style={{ marginLeft: 20 }}>{local.createNewBranch}</Button></Can>
                {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
              </div>
            </div>
            <hr className="dashed-line" />
            <Search searchKeys={['keyword', 'dateFromTo']} url="branch" from={this.state.from} size={this.state.size} />
            {this.props.data &&
              <DynamicTable
                totalCount={this.props.totalCount}
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
  };
};
const mapStateToProps = state => {
  return {
    data: state.search.data,
    totalCount: state.search.totalCount,
    loading: state.loading
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(BranchesList));