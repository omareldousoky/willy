import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DynamicTable from '../DynamicTable/dynamicTable';
import Can from '../../config/Can';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import { getDateAndTime } from '../../Services/getRenderDate';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import { withRouter } from 'react-router-dom';
import ability from '../../config/ability';

interface State {
  size: number;
  from: number;
}
interface Props {
  history: any;
  data: any;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  branchId: string;
  search: (data) => void;
  setSearchFilters: (data) => void;
}
class CustomersList extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
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
        title: local.nationalId,
        key: "nationalId",
        render: data => data.nationalId
      },
      {
        title: local.governorate,
        sortable: true,
        key: "governorate",
        render: data => data.governorate
      },
      {
        title: local.creationDate,
        sortable: true,
        key: "createdAt",
        render: data => data.created?.at? getDateAndTime(data.created?.at): ''
      },
      {
        title: '',
        key: "actions",
        
        render: data => <>  {ability.can('updateCustomer', 'customer') || ability.can('updateNationalId','customer')? <img style={{cursor: 'pointer', marginLeft: 20}} alt={"view"} src={require('../../Assets/editIcon.svg')} onClick={() => this.props.history.push("/customers/edit-customer", { id: data._id })}></img>: null}
          <Can I='getCustomer' a='customer'><img style={{cursor: 'pointer'}} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push("/customers/view-customer", { id: data._id })}></img></Can></>  
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'customer', branchId: this.props.branchId });
  }
  getCustomers() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'customer', branchId: this.props.branchId });
  }
  render() {
    return (
      <Card style={{ margin: '20px 50px' }}>
        <Loader type="fullsection" open={this.props.loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.customers}</Card.Title>
              <span className="text-muted">{local.noOfCustomers + ` (${this.props.totalCount? this.props.totalCount : 0})`}</span>
            </div>
            <div>
              <Can I='createCustomer' a='customer'><Button onClick={() => { this.props.history.push("/customers/new-customer") }} className="big-button" style={{ marginLeft: 20 }}>{local.newCustomer}</Button></Can>
              {/* <Button variant="outline-primary" className="big-button">download pdf</Button> */}
            </div>
          </div>
          <hr className="dashed-line" />
          <Search 
          searchKeys={['keyword', 'dateFromTo', 'governorate']} 
          dropDownKeys={['name', 'nationalId', 'key', 'code']} 
          searchPlaceholder ={local.searchByBranchNameOrNationalIdOrCode}
          url="customer" 
          from={this.state.from} size={this.state.size}  
          hqBranchIdRequest = {this.props.branchId}/>
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
    setSearchFilters: data => dispatch(searchFilters(data)),
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(CustomersList));