import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../DynamicTable/dynamicTable';
import Can from '../../config/Can';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search } from '../../redux/search/actions';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';

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
class CustomersList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 5,
      from: 0,
    }
    this.mappers = [
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.customerCode
      },
      {
        title: local.customerName,
        key: "customerName",
        render: data => data.customerName
      },
      {
        title: local.governorate,
        key: "governorate",
        render: data => data.governorate
      },
      {
        title: local.oneBranch,
        key: "oneBranch",
        render: data => data.branchId
      },
      {
        title: local.createdBy,
        key: "creationDate",
        render: data => data.created?.by
      },
      {
        title: local.creationDate,
        key: "creationDate",
        render: data => getDateAndTime(data.created?.at)
      },
      {
        title: '',
        key: "actions",//<span className='fa fa-eye icon'></span>
        render: data => <>  <Can I='updateCustomer' a='customer'><span className='fa fa-pencil-alt icon' onClick={()=> this.props.history.push("/customers/edit-customer", { id: data._id })}></span></Can></>
      },
    ]
  }
  componentDidMount() {
    this.getCustomers();
  }
  getCustomers() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'customer' });
  }
  render() {
    return (
      <Card style={{ margin: '20px 50px' }}>
        <Loader type="fullsection" open={this.props.loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.customers}</Card.Title>
              <span className="text-muted">{local.noOfCustomers + ` (${this.props.totalCount})`}</span>
            </div>
            <div>
              <Can I='createCustomer' a='customer'><Button onClick={() => { this.props.history.push("/customers/new-customer") }} className="big-button" style={{ marginLeft: 20 }}>{local.newCustomer}</Button></Can>
              {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
            </div>
          </div>
          <hr className="dashed-line" />
          <Search searchKeys={['keyword', 'dateFromTo', 'governorate']} url="customer" from={this.state.from} size={this.state.size} />
          {this.props.data &&
            <DynamicTable
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getCustomers());
              }}
            />
          }
        </Card.Body>
      </Card>
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(CustomersList));