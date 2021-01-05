import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../Shared/Components/Loader';
import ReviewedApplicationsPDF from '../pdfTemplates/reviewedApplications/reviewedApplications';
import Can from '../../config/Can';
import Card from 'react-bootstrap/Card';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import Search from '../../../Shared/Components/Search/search';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { connect } from 'react-redux';
import * as local from '../../../Shared/Assets/ar.json';
import { timeToDateyyymmdd, beneficiaryType, parseJwt, getErrorMessage, downloadFile, iscoreStatusColor } from '../../../Shared/Services/utils';
import { getBranch } from '../../Services/APIs/Branch/getBranch';
import { getCookie } from '../../../Shared/Services/getCookie';
import Modal from 'react-bootstrap/Modal';
import { getIscoreCached } from '../../Services/APIs/iScore/iScore';
import Swal from 'sweetalert2';
import Table from 'react-bootstrap/Table';
import { Score } from '../CustomerCreation/customerProfile';
import { getReviewedApplications } from '../../Services/APIs/Reports/reviewedApplications';
import { manageApplicationsArray } from './manageApplicationInitials';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';

interface Product {
  productName: string;
  loanNature: string;
  beneficiaryType: string;
}
interface Customer {
  customerName: string;
}
interface Application {
  product: Product;
  customer: Customer;
  entryDate: number;
  principal: number;
  status: string;
}
interface LoanItem {
  id: string;
  branchId: string;
  application: Application;
}
interface State {
  print: boolean;
  size: number;
  from: number;
  branchDetails: any;
  reviewedResults: any;
  iScoreModal: boolean;
  iScoreCustomers: any;
  loading: boolean;
  manageApplicationsTabs: any[];
}
interface Props {
  history: any;
  data: any;
  error: string;
  totalCount: number;
  loading: boolean;
  searchFilters: any;
  search: (data) => Promise<void>;
  setSearchFilters: (data) => void;
  branchId?: string;
};
class TrackLoanApplications extends Component<Props, State>{
  mappers: { title: string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      print: false,
      size: 10,
      from: 0,
      branchDetails: {},
      reviewedResults: [],
      iScoreModal: false,
      iScoreCustomers: [],
      loading: false,
      manageApplicationsTabs: []
    }
    this.mappers = [
      {
        title: local.customerType,
        key: "customerType",
        render: data => beneficiaryType(data.application.product.beneficiaryType)
      },
      {
        title: local.applicationCode,
        key: "applicationCode",
        render: data => data.application.applicationKey
      },
      {
        title: local.customerName,
        key: "name",
        sortable: true,
        render: data => data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.customerName}</span> : null)}
          </div>
      },
      {
        title: local.nationalId,
        key: "nationalId",
        render: data => data.application.product.beneficiaryType === 'individual' ? data.application.customer.nationalId :
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.nationalId}</span> : null)}
          </div>
      },
      {
        title: local.productName,
        key: "productName",
        render: data => data.application.product.productName
      },
      {
        title: local.loanCreationDate,
        key: "createdAt",
        sortable: true,
        render: data => timeToDateyyymmdd(data.application.entryDate)
      },
      {
        title: local.loanStatus,
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
  renderIcons(data) {
    return (
      <>
        <img style={{ cursor: 'pointer', marginLeft: 20 }} alt={"view"} src={require('../../Assets/view.svg')} onClick={() => this.props.history.push('/track-loan-applications/loan-profile', { id: data.application._id })}></img>
        <Can I='viewIscore' a='customer'><span style={{ cursor: 'pointer' }} title={"iScore"} onClick={() => this.getCachediScores(data.application)}>iScore</span></Can>
      </>
    )
  }
  async getCachediScores(application) {
    this.setState({ iScoreModal: true });
    const ids: string[] = []
    if (application.product.beneficiaryType === 'group') {
      application.group.individualsInGroup.forEach(member => ids.push(member.customer.nationalId))
    } else {
      ids.push(application.customer.nationalId)
    }
    const obj: { nationalIds: string[]; date?: Date } = {
      nationalIds: ids
    }
    if (["approved", "created", "issued", "rejected", "paid", "pending", "canceled"].includes(application.status)) {
      obj.date = (application.status === 'approved') ? application.approvalDate :
        (application.status === 'created') ? application.creationDate :
          (['issued', 'pending'].includes(application.status)) ? application.issueDate :
            (application.status === 'rejected') ? application.rejectionDate :
              (['paid', 'canceled'].includes(application.status)) ? application.updated.at : 0
      // paid & canceled => updated.at, pending,issued =>issuedDate
    }
    this.setState({ loading: true });
    const iScores = await getIscoreCached(obj);
    if (iScores.status === "success") {
      const customers: Score[] = [];
      iScores.body.data.forEach(score => {
        const obj = {
          customerName: (application.product.beneficiaryType === 'group') ? application.group.individualsInGroup.filter(member => member.customer.nationalId === score.nationalId)[0].customer.customerName : application.customer.customerName,
          iscore: score.iscore,
          nationalId: score.nationalId,
          url: score.url,
        }
        customers.push(obj)
      })
      this.setState({ iScoreCustomers: customers, loading: false })
    } else {
      this.setState({ loading: false }, () =>    Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error'))
    }
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'application', branchId: this.props.branchId }).then(()=>{
      if(this.props.error)
      Swal.fire("Error !",getErrorMessage(this.props.error),"error")
    }
    );
    this.setState({ manageApplicationsTabs: manageApplicationsArray() })
  }
  getApplications() {
    this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'application', branchId: this.props.branchId }).then(()=>{
      if(this.props.error)
      Swal.fire("Error !",getErrorMessage(this.props.error),"error")
    }
    );
  }
  getStatus(status: string) {
    switch (status) {
      case 'underReview':
        return <div className="status-chip outline under-review">{local.underReview}</div>
      case 'created':
        return <div className="status-chip outline created">{local.created}</div>
      case 'reviewed':
        return <div className="status-chip outline reviewed">{local.reviewed}</div>
      case 'secondReview':
        return <div className="status-chip outline second-review">{local.secondReviewed}</div>
      case 'thirdReview':
        return <div className="status-chip outline third-review">{local.thirdReviewed}</div>
      case 'approved':
        return <div className="status-chip outline approved">{local.approved}</div>
      case 'rejected':
        return <div className="status-chip outline rejected">{local.rejected}</div>
      case 'canceled':
        return <div className="status-chip outline canceled">{local.cancelled}</div>
      default: return null;
    }
  }
  async getBranchData(id) {
    const res = await getBranch(id);
    if (res.status === 'success') {
      this.setState({ branchDetails: res.body.data })
    } else console.log('error getting branch details')
  }
  async getReviewedData() {
    const token = getCookie('token');
    const details = parseJwt(token)
    if (details.branch.length > 0) {
      this.getBranchData(details.branch)
    }
    this.setState({ loading: true })
    const res = await getReviewedApplications();
    if (res.status === 'success') {
      if (Object.keys(res.body).length === 0) {
        this.setState({ loading: false });
        Swal.fire("error", local.noResults)
      } else {
        this.setState({ reviewedResults: res.body.result, loading: false }, () => { this.setState({ print: true }, () => window.print()) });
      }
    } else {
      this.setState({ loading: false });
      console.log('error getting branch details')
    }
  }
  render() {
    return (
      <>
        <div className="print-none">
          <HeaderWithCards
            header={local.loanApplications}
            array={this.state.manageApplicationsTabs}
            active={this.state.manageApplicationsTabs.map(item => { return item.icon }).indexOf('applications')}
          />
          <Card style={{ margin: '20px 50px' }}>
            <Loader type="fullsection" open={this.props.loading || this.state.loading} />
            <Card.Body style={{ padding: 0 }}>
              <div className="custom-card-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.loanApplications}</Card.Title>
                  <span className="text-muted">{local.noOfApplications + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
                </div>
                <div>
                  {<Can I='assignProductToCustomer' a='application'><Button onClick={() => this.props.history.push('/track-loan-applications/new-loan-application', { id: '', action: 'under_review' })}>{local.createLoanApplication}</Button></Can>}
                  <Can I="loansReviewed" a="report"><Button style={{ marginRight: 10 }} onClick={() => { this.getReviewedData() }}>{local.downloadPDF}</Button></Can>
                </div>
              </div>
              <hr className="dashed-line" />
              <Search
                searchKeys={['keyword', 'dateFromTo', 'branch', 'status-application']}
                dropDownKeys={['name', 'nationalId', 'key', 'customerKey', 'customerCode']}
                url="application"
                from={this.state.from}
                size={this.state.size}
                setFrom={(from) => this.setState({ from: from })}
                searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
                hqBranchIdRequest={this.props.branchId} />
              <DynamicTable
                url="application"
                from={this.state.from}
                size={this.state.size}
                totalCount={this.props.totalCount}
                mappers={this.mappers}
                pagination={true}
                data={this.props.data}
                changeNumber={(key: string, number: number) => {
                  this.setState({ [key]: number } as any, () => this.getApplications());
                }}
              />
            </Card.Body>
          </Card>
          <Modal show={this.state.iScoreModal} backdrop="static" size='lg'>
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
                    <td></td>
                    <td>{local.downloadPDF}</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.iScoreCustomers.map(customer =>
                    <tr key={customer.nationalId}>
                      <td>{customer.customerName}</td>
                      <td>{customer.nationalId}</td>
                      <td style={{ color: iscoreStatusColor(customer.iscore).color }}>{customer.iscore}</td>
                      <td>{iscoreStatusColor(customer.iscore).status}</td>
                      <td>{customer.url && <span style={{ cursor: 'pointer' }} title={"iScore"} className="fa fa-download" onClick={() => { downloadFile(customer.url) }}></span>}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.setState({ iScoreModal: false, iScoreCustomers: [] })}>{local.cancel}</Button>
            </Modal.Footer>
          </Modal>
        </div>
        {this.state.print && <ReviewedApplicationsPDF data={this.state.reviewedResults} branchDetails={this.state.branchDetails} />}
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
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters
  };
};

export default connect(mapStateToProps, addSearchToProps)(withRouter(TrackLoanApplications));