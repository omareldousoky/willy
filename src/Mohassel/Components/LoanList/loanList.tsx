import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search } from '../../redux/search/actions';

interface Props {
  history: Array<any>;
  data: any;
  totalCount: number;
  loading: boolean;
  search: (data) => void;
};
interface State {
  size: number;
  from: number;
}

class LoanList extends Component<Props, State> {
  mappers: { title: string; key: string; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      size: 5,
      from: 0,
    }
    this.mappers = [
      {
        title: local.customerName,
        key: "customerName",
        render: data => <div onClick={() => this.props.history.push('/loan-profile', { id: data.application._id })}>{data.application.customer.customerName}</div>
      },
      {
        title: local.customerCode,
        key: "customerCode",
        render: data => data.application.customer._id
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.representative,
        key: "representative",
        render: data => data.application.customer.representative
      },
      {
        title: local.loanIssuanceDate,
        key: "loanIssuanceDate",
        render: data => new Date(data.application.issueDate).toISOString().slice(0, 10)
      },
      {
        title: local.status,
        key: "status",
        render: data => this.getStatus(data.application.status)
      },
    ]
  }
  componentDidMount() {
    this.getLoans()
  }
  getStatus(status: string) {
    switch (status) {
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'issued':
        return <div className="status-chip unpaid">{local.issued}</div>
      default: return null;
    }
  }

  async getLoans() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'loan' });
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullsection" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.issuedLoans}</Card.Title>
                <span className="text-muted">{local.noOfIssuedLoans + ` (${this.props.totalCount})`}</span>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search searchKeys={['keyword', 'dateFromTo', 'status', 'branch']} url="loan" from={this.state.from} size={this.state.size} />
            <DynamicTable
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number } as any, () => this.getLoans());
              }}
            />
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
    data: state.search.applications,
    totalCount: state.search.totalCount,
    loading: state.loading
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(LoanList));