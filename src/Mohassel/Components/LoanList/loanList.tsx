import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Search from '../Search/search';
import { connect } from 'react-redux';
import { search, searchFilters } from '../../redux/search/actions';
import { timeToDateyyymmdd, beneficiaryType, iscoreDate } from '../../Services/utils';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getIscore } from '../../Services/APIs/iScore/iScore';
import Swal from 'sweetalert2';
import Table from 'react-bootstrap/Table';
import store from '../../redux/store';
import Can from '../../config/Can';
import ability from '../../config/ability';

interface Props {
  history: Array<any>;
  data: any;
  branchId: string;
  fromBranch?: boolean;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
};
interface State {
  size: number;
  from: number;
  iScoreModal: boolean;
  iScoreCustomers: any;
  loading: boolean;
  searchKeys: any;
}

class LoanList extends Component<Props, State> {
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props: Props) {
    super(props);
    this.state = {
      size: 10,
      from: 0,
      iScoreModal: false,
      iScoreCustomers: [],
      loading: false,
      searchKeys: ['keyword', 'dateFromTo', 'status', 'branch']
    }
    this.mappers = [
      {
        title: local.customerType,
        key: "customerType",
        render: data => beneficiaryType(data.application.product.beneficiaryType)
      },
      {
        title: local.loanCode,
        key: "loanCode",
        render: data => data.application.loanApplicationKey
      },
      {
        title: local.customerName,
        key: "name",
        sortable: true,
        render: data => <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
          {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.customerName}</span> : null)}
            </div>)
          }
        </div>
      },
      {
        title: local.nationalId,
        key: "nationalId",
        render: data => <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
          {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.nationalId :
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.nationalId}</span> : null)}
            </div>)
          }
        </div>
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.loanIssuanceDate,
        key: "issueDate",
        sortable: true,
        render: data => data.application.issueDate ? timeToDateyyymmdd(data.application.issueDate) : ''
      },
      {
        title: local.status,
        key: "status",
        sortable: true,
        render: data => this.getStatus(data.application.status)
      },
      {
        title: '',
        key: "action",
        render: data => this.renderIcons(data)
      },
    ]
  }
  componentDidMount() {
  const searchKeys = this.state.searchKeys
    if(ability.can('viewDoubtfulLoans','application')){
      searchKeys.push('doubtful')
      this.setState({searchKeys})
    }
    this.props.search({ size: this.state.size, from: this.state.from, url: 'loan', sort:"issueDate" });
  }
  getStatus(status: string) {
    switch (status) {
      case 'paid':
        return <div className="status-chip paid">{local.paid}</div>
      case 'issued':
        return <div className="status-chip unpaid">{local.issued}</div>
      case 'pending':
        return <div className="status-chip pending">{local.pending}</div>
      case 'canceled':
        return <div className="status-chip canceled">{local.cancelled}</div>
      default: return null;
    }
  }
  renderIcons(data) {
    return (
      <>
        <img style={{ cursor: 'pointer', marginLeft: 20 }} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}></img>
        <Can I='getIscore' a='customer'><span style={{ cursor: 'pointer' }} title={"iScore"} onClick={() => this.getAllIScores(data)}>iScore</span></Can>
      </>
    )
  }
  getAllIScores(data: any) {
    this.setState({ iScoreModal: true });
    const customers: any[] = [];
    if (data.application.product.beneficiaryType === 'individual') {
      const obj = {
        requestNumber: '148',
        reportId: '3004',
        product: '023',
        loanAccountNumber: `${data.application.customer.key}`,
        number: '1703943',
        date: '02/12/2014',
        amount: `${data.application.principal}`,
        lastName: `${data.application.customer.customerName}`,
        idSource: '003',
        idValue: `${data.application.customer.nationalId}`,
        gender: (data.application.customer.gender === 'male') ? '001' : '002',
        dateOfBirth: iscoreDate(data.application.customer.birthDate)
      }
      customers.push(obj)
    } else {
      data.application.group.individualsInGroup.forEach(member => {
        const obj = {
          requestNumber: '148',
          reportId: '3004',
          product: '023',
          loanAccountNumber: `${member.customer.key}`,
          number: '1703943',
          date: '02/12/2014',
          amount: `${data.application.principal}`,
          lastName: `${member.customer.customerName}`,
          idSource: '003',
          idValue: `${member.customer.nationalId}`,
          gender: (member.customer.gender === 'male') ? '001' : '002',
          dateOfBirth: iscoreDate(member.customer.birthDate)
        }
        customers.push(obj)
      })
    }
    customers.forEach((customer, i) => {
      this.getiScore(customer, i)
    })
    this.setState({ iScoreCustomers: customers })
  }
  async getLoans() {
     let query = {};
     if(this.props.fromBranch){
       query = {...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'loan', branchId: this.props.branchId, sort:"issueDate" }
     } else {
      query = {...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'loan', sort:"issueDate"}
     }
    this.props.search(query);
  }
  componentWillUnmount() {
    this.props.setSearchFilters({})
  }
  async getiScore(obj, i) {
    this.setState({ loading: true });
    const iScore = await getIscore(obj)
    if (iScore.status === 'success') {
      const customers = this.state.iScoreCustomers;
      customers[i].iScore = iScore.body
      this.setState({ loading: false, iScoreCustomers: customers })
    } else {
      Swal.fire('', local.noIScore, 'error')
      this.setState({ loading: false })
    }
  }
  downloadFile(fileURL) {
    const link = document.createElement('a');
    link.href = fileURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <span className="text-muted">{local.noOfIssuedLoans + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
              </div>
            </div>
            <hr className="dashed-line" />
            <Search 
            searchKeys={this.state.searchKeys} 
            dropDownKeys={['name', 'nationalId', 'key']}
            searchPlaceholder = {local.searchByBranchNameOrNationalIdOrCode}
            datePlaceholder={local.issuanceDate}
             url="loan" 
             from={this.state.from} 
             size={this.state.size} 
             hqBranchIdRequest={this.props.branchId} />
            <DynamicTable
              from={this.state.from} 
              size={this.state.size} 
              url="loan" 
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
        <Modal show={this.state.iScoreModal} backdrop="static">
          <Modal.Header>
            <Modal.Title>
              iScore
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Loader type="fullsection" open={this.state.loading} />
            <Table style={{ textAlign: 'right' }}>
              <thead>
                <tr>
                  <td>{local.customer}</td>
                  <td>{local.nationalId}</td>
                  <td>{local.value}</td>
                  <td>{local.downloadPDF}</td>
                </tr>
              </thead>
              <tbody>
                {this.state.iScoreCustomers.map(customer =>
                  <tr key={customer.idValue}>
                    <td>{customer.lastName}</td>
                    <td>{customer.idValue}</td>
                    <td>{customer.iScore && customer.iScore.value}</td>
                    <td>{customer.iScore && <span style={{ cursor: 'pointer' }} title={"iScore"} className="fa fa-download"  onClick={() => {this.downloadFile(customer.iScore.url)}}></span>}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ iScoreModal: false, iScoreCustomers: [] })}>{local.cancel}</Button>
          </Modal.Footer>
        </Modal>
      </>
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
    data: state.search.applications,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(LoanList));