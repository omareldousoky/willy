import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import DynamicTable from '../DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import local from '../../../Shared/Assets/ar.json';
import { search, searchFilters } from '../../redux/search/actions';
import { loading } from '../../redux/loading/actions';
import { timeToDateyyymmdd } from '../../Services/utils';
import { bulkCreation } from '../../Services/APIs/loanApplication/bulkCreation';
import { bulkApplicationCreationValidation } from './bulkApplicationCreationValidation';
import Search from '../Search/search';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import { manageApplicationsArray } from '../TrackLoanApplications/manageApplicationInitials';

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
  applications: Array<LoanItem>;
  selectedApplications: Array<LoanItem>;
  showModal: boolean;
  filterCustomers: string;
  size: number;
  from: number;
  checkAll: boolean;
  manageApplicationsTabs: any[];
}
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
  setLoading: (data) => void;
};
class BulkApplicationCreation extends Component<Props, State>{
  mappers: { title: (() => void) | string; key: string; sortable?: boolean; render: (data: any) => void }[]
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      selectedApplications: [],
      showModal: false,
      filterCustomers: '',
      size: 10,
      from: 0,
      checkAll: false,
      manageApplicationsTabs: []
    }
    this.mappers = [
      {
        title: () => <FormCheck type='checkbox' onChange={(e) => this.checkAll(e)} checked={this.state.checkAll}></FormCheck>,
        key: 'selected',
        render: data => <FormCheck
          type="checkbox"
          checked={Boolean(this.state.selectedApplications.find(application => application.id === data.id))}
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
        title: local.principal,
        key: "principal",
        render: data => data.application.principal
      },
      {
        title: local.currency,
        key: "currency",
        render: data => local[data.application.product.currency]
      },
      {
        title: local.noOfInstallments,
        key: "noOfInstallments",
        render: data => data.application.product.noOfInstallments
      },
      {
        title: local.periodLength,
        key: "periodLength",
        render: data => data.application.product.periodLength
      },
      {
        title: local.every,
        key: "every",
        render: data => local[data.application.product.periodType]
      },
      {
        title: local.entryDate,
        key: "entryDate",
        render: data => timeToDateyyymmdd(data.application.entryDate)
      },
      {
        title: local.approvalDate,
        key: "approvalDate",
        render: data => timeToDateyyymmdd(data.application.approvalDate)
      },
    ]
  }
  componentDidMount() {
    this.props.search({ size: this.state.size, from: this.state.from, url: 'application', status: "approved" });
    this.setState({ manageApplicationsTabs: manageApplicationsArray() })
  }
  getApplications() {
    const query = { ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'application', status: "approved" }
    this.props.search(query);
  }
  addRemoveItemFromChecked(selectedApplication: LoanItem) {
    if (this.state.selectedApplications.findIndex(application => application.id === selectedApplication.id) > -1) {
      this.setState({
        selectedApplications: this.state.selectedApplications.filter(application => application.id !== selectedApplication.id),
      })
    } else {
      this.setState({
        selectedApplications: [...this.state.selectedApplications, selectedApplication],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      this.setState({ checkAll: true, selectedApplications: this.props.data })
    } else this.setState({ checkAll: false, selectedApplications: [] })
  }
  handleSubmit = async (values) => {
    this.props.setLoading(true);
    this.setState({ showModal: false })
    const obj = {
      creationDate: new Date(values.creationDate).valueOf(),
      applicationIds: this.state.selectedApplications.map(application => application.id)
    }
    const res = await bulkCreation(obj);
    if (res.status === "success") {
      this.props.setLoading(false);
      this.setState({ selectedApplications: [], checkAll: false })
      Swal.fire('', local.bulkLoanCreated, 'success').then(() => this.getApplications());
    } else {
      this.props.setLoading(false);
      Swal.fire('', local.bulkLoanError, 'error');
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
          header={local.bulkApplicationCreation}
          array={this.state.manageApplicationsTabs}
          active={this.state.manageApplicationsTabs.map(item => { return item.icon }).indexOf('bulkApplicationCreation')}
        />
        <Card style={{ margin: '20px 50px' }}>
          <Loader type="fullscreen" open={this.props.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.approvedLoans}</Card.Title>
                <span className="text-muted" style={{ marginLeft: 10 }}>{local.maxLoansAllowed + ` (${this.props.totalCount})`}</span>
                <span className="text-muted">{local.noOfSelectedLoans + ` (${this.state.selectedApplications.length})`}</span>
              </div>
              <Button onClick={() => { this.setState({ showModal: true }) }}
                disabled={!Boolean(this.state.selectedApplications.length)}
                className="big-button"
                style={{ marginLeft: 20 }}
              > {local.bulkApplicationCreation}
              </Button>
            </div>
            <hr className="dashed-line" />
            <Search
              searchKeys={['dateFromTo']}
              datePlaceholder={local.entryDate}
              url="application"
              from={this.state.from}
              size={this.state.size}
              status="approved"
              hqBranchIdRequest={this.props.branchId} />
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
            initialValues={{ creationDate: this.dateSlice(null), selectedApplications: this.state.selectedApplications }}
            onSubmit={this.handleSubmit}
            validationSchema={bulkApplicationCreationValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikProps) =>
              <Form onSubmit={formikProps.handleSubmit}>
                <Modal.Header>
                  <Modal.Title>{local.bulkApplicationCreation}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group as={Row} controlId="creationDate">
                    <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.creationDate}*`}</Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="date"
                        name="creationDate"
                        data-qc="creationDate"
                        value={formikProps.values.creationDate}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.creationDate) && Boolean(formikProps.touched.creationDate)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.creationDate}
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

export default connect(mapStateToProps, addSearchToProps)(withRouter(BulkApplicationCreation));