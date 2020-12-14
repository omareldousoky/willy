import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import FormCheck from 'react-bootstrap/FormCheck';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import Search from '../../../Shared/Components/Search/search';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { search, searchFilters } from '../../../Shared/redux/search/actions';
import { loading } from '../../../Shared/redux/loading/actions';
import { Loader } from '../../../Shared/Components/Loader';
import { bulkReview } from '../../Services/APIs/loanApplication/bulkReview';
import { bulkApplicationReviewValidation } from './bulkApplicationReviewValidation';
import { timeToDateyyymmdd, beneficiaryType } from '../../../Shared/Services/utils';
import local from '../../../Shared/Assets/ar.json';
import { manageApplicationsArray } from '../TrackLoanApplications/manageApplicationInitials';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import Can from '../../config/Can';

interface Product {
  productName: string;
  loanNature: string;
  beneficiaryType: string;
}
interface Customer {
  customerName: string;
  nationalId: string;
  birthDate: number;
  nationalIdIssueDate: number;
  gender: string;
}
interface Application {
  product: Product;
  customer: Customer;
  entryDate: number;
  principal: number;
  status: string;
  group: Group;
}
interface IndividualsInGroup {
  type: string;
  customer: Customer;
}
interface Group {
  _id: string;
  individualsInGroup: Array<IndividualsInGroup>;
}
interface LoanItem {
  id: string;
  branchId: string;
  application: Application;
}
interface State {
  selectedReviewedLoans: Array<LoanItem>;
  showModal: boolean;
  checkAll: boolean;
  from: number;
  size: number;
  manageApplicationsTabs: any[];
}
interface Props {
  history: Array<any>;
  loading: boolean;
  totalCount: number;
  data: any;
  searchFilters: any;
  search: (data) => void;
  setSearchFilters: (data) => void;
  setLoading: (data) => void;
};
class BulkApplicationReview extends Component<Props, State>{
  mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      selectedReviewedLoans: [],
      showModal: false,
      checkAll: false,
      from: 0,
      size: 10,
      manageApplicationsTabs: [],
    }
    this.mappers = [
      {
        title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
        key: 'selected',
        render: data => <FormCheck
          type="checkbox"
          checked={Boolean(this.state.selectedReviewedLoans.find(application => application.id === data.id))}
          onChange={() => this.addRemoveItemFromChecked(data)}
        ></FormCheck>
      },
      {
        title: local.applicationCode,
        key: "applicationCode",
        render: data => data.application.applicationKey
      },
      {
        title: local.customerName,
        key: "name",
        render: data => <div style={{ cursor: 'pointer' }} onClick={() => this.props.history.push('/loans/loan-profile', { id: data.application._id })}>
          {(data.application.product.beneficiaryType === 'individual' ? data.application.customer.customerName :
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.application.group?.individualsInGroup.map(member => member.type === 'leader' ? <span key={member.customer._id}>{member.customer.customerName}</span> : null)}
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
        title: local.customerType,
        key: "customerType",
        render: data => local[data.application.product.beneficiaryType]
      },
      {
        title: local.principal,
        key: "principal",
        render: data => data.application.principal
      },
      {
        title: local.reviewDate,
        key: "reviewDate",
        render: data => timeToDateyyymmdd(data.application.reviewedDate)
      },
    ]
  }
  componentDidMount() {
    if (this.props.data?.length > 0) {
      this.props.search({ url: 'clearData' });
    }
    this.setState({ manageApplicationsTabs: manageApplicationsArray() })

  }
  getApplications() {
    const query = { ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'application', status: "reviewed" }
    this.props.search(query);
  }

  addRemoveItemFromChecked(loan: LoanItem) {
    if (this.state.selectedReviewedLoans.findIndex(loanItem => loanItem.id == loan.id) > -1) {
      this.setState({
        selectedReviewedLoans: this.state.selectedReviewedLoans.filter(el => el.id !== loan.id),
      })
    } else {
      this.setState({
        selectedReviewedLoans: [...this.state.selectedReviewedLoans, loan],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedReviewedLoans: this.props.data })
    } else this.setState({ checkAll: false, selectedReviewedLoans: [] })
  }
  handleSubmit = async (values) => {
    this.props.setLoading(true);
    this.setState({ showModal: false })
    const obj = {
      date: new Date(values.date).valueOf(),
      action: values.action,
      ids: this.state.selectedReviewedLoans.map(loan => loan.id)
    }
      const res = await bulkReview(obj);
     if (res.status === "success") {
      this.props.setLoading(false);
     this.setState({ selectedReviewedLoans: [], checkAll: false })
       Swal.fire('',  local.reviewed, 'success').then(() => this.getApplications());
    } else {
    this.props.setLoading(false);
       Swal.fire('', local.reviewApplicationsError, 'error');
     }
  }
  dateSlice(date) {
    if (!date) {
      return timeToDateyyymmdd(-1)
    } else {
      return timeToDateyyymmdd(date)
    }
  }
  render() {
    return (
      <>
        <HeaderWithCards
          header={local.bulkLoanApplicationReviews}
          array={this.state.manageApplicationsTabs}
          active={this.state.manageApplicationsTabs.map(item => { return item.icon }).indexOf('bulkLoanApplicationsReview')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.reviewedApplications}</Card.Title>
                <span className="text-muted" style={{ marginLeft: 10 }}>{local.maxLoansAllowed + ` (${this.props.totalCount || 0})`}</span>
                <span className="text-muted">{local.noOfSelectedLoans + ` (${this.state.selectedReviewedLoans.length})`}</span>
              </div>
              <Button onClick={() => { this.setState({ showModal: true }) }}
                disabled={!Boolean(this.state.selectedReviewedLoans.length)}
                className="big-button"
                style={{ marginLeft: 20, height: 70 }}
              > {local.bulkLoanApplicationReviews}
              </Button>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['keyword', 'dateFromTo', 'branch', 'status-review-application']}
              dropDownKeys={['name', 'nationalId', 'key', 'customerKey','customerCode']}
              url="application"
              from={this.state.from}
              size={this.state.size} />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="application"
              totalCount={this.props.totalCount}
              mappers={this.mappers}
              pagination={true}
              data={this.props.data}
              changeNumber={(key: string, number: number) => {
                this.setState({ [key]: number, checkAll: false } as any, () => this.getApplications());
              }}
            />
          </Card.Body>
        </Card>
        {this.state.showModal && <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Formik
            initialValues={{ date: this.dateSlice(null), action: '', selectedReviewedLoans: this.state.selectedReviewedLoans }}
            onSubmit={this.handleSubmit}
             validationSchema={bulkApplicationReviewValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikProps) =>
              <Form onSubmit={formikProps.handleSubmit}>
                <Modal.Header>
                  <Modal.Title>{local.bulkLoanApplicationReviews}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group as={Row} controlId="date">
                    <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.entryDate}*`}</Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="date"
                        name="date"
                        data-qc="date"
                        value={formikProps.values.date}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.date) && Boolean(formikProps.touched.date)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.date}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="action">
                    <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.action}*`}</Form.Label>
                    <Col sm={6}>
                      <Form.Control as="select"
                        name="action"
                        data-qc="action"
                        value={formikProps.values.action}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.action) && Boolean(formikProps.touched.action)}
                      >
                        <option value="" disabled></option>
                       {this.state.selectedReviewedLoans[0].application.status !== 'secondReview'  &&<Can I = "secondReview" a ="application"><option value='secondReview'>{local.secondReview}</option></Can> }
                       <Can I = "thirdReview" a= "application">  <option value='thirdReview'>{local.thirdReview}</option> </Can>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.action}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>{local.cancel}</Button>
                  <Button type="submit" variant="primary">{local.submit}</Button>
                </Modal.Footer>
              </Form>
            }
          </Formik>
        </Modal>}
      </>
    )
  }
}
const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    setSearchFilters: data => dispatch(searchFilters(data)),
    setLoading: data => dispatch(loading(data))
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(BulkApplicationReview));