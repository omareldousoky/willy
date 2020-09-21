import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormCheck from 'react-bootstrap/FormCheck';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { Loader } from '../../../Shared/Components/Loader';
import { searchApplication } from '../../Services/APIs/loanApplication/searchApplication';
import { bulkApproval } from '../../Services/APIs/loanApplication/bulkApproval';
import local from '../../../Shared/Assets/ar.json';
import { englishToArabic } from '../../Services/statusLanguage';
import { timeToDateyyymmdd, beneficiaryType } from '../../Services/utils';
import InputGroup from 'react-bootstrap/InputGroup';
import { bulkApplicationCreationValidation } from './bulkApplicationCreationValidation';

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
  loading: boolean;
  showModal: boolean;
  filterCustomers: string;
}
interface Props {
  history: Array<string>;
};
class BulkApplicationCreation extends Component<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      selectedApplications: [],
      loading: false,
      showModal: false,
      filterCustomers: ''
    }
  }
  async componentDidMount() {
    this.getApplications();
  }
  async getApplications() {
    this.setState({ loading: true });
    const res = await searchApplication({ size: 1000, status: "approved" });
    if (res.status === "success") {
      this.setState({ loading: false, applications: res.body.applications });
    } else {
      this.setState({ loading: false });
      Swal.fire('', local.searchError, 'error');
    }
  }
  addRemoveItemFromChecked(loan: LoanItem) {
    if (this.state.selectedApplications.findIndex(loanItem => loanItem.id == loan.id) > -1) {
      this.setState({
        selectedApplications: this.state.selectedApplications.filter(el => el.id !== loan.id),
      })
    } else {
      this.setState({
        selectedApplications: [...this.state.selectedApplications, loan],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      // const newselectedReviewedLoans: Array<string> = this.state.searchResults.map(loanItem => loanItem.id);
      this.setState({ selectedApplications: this.state.applications })
    } else this.setState({ selectedApplications: [] })
  }
  handleSubmit = async (values) => {
    this.setState({ showModal: false, loading: true })
    const obj = {
      approvalDate: new Date(values.approvalDate).valueOf(),
      applicationIds: this.state.selectedApplications.map(loan => loan.id)
    }
    const res = await bulkApproval(obj);
    if (res.status === "success") {
      this.setState({ loading: false })
      Swal.fire('', local.bulkLoanApproved, 'success').then(() => this.getApplications());
    } else {
      this.setState({ loading: false })
      Swal.fire('', local.bulkLoanError, 'error');
    }
  }
  dateSlice(date) {
    if (!date) {
      return timeToDateyyymmdd(0)
    } else {
      return timeToDateyyymmdd(date)
    }
  }
  render() {
    return (
      <Container>
        <Loader type="fullscreen" open={this.state.loading} />
        {this.state.applications.length ?
          <div>
            <InputGroup style={{ direction: 'ltr', margin: '20px 0px' }}>
              <Form.Control
                value={this.state.filterCustomers}
                style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                placeholder={local.searchByName}
                onChange={(e) => this.setState({ filterCustomers: e.currentTarget.value })}
              />
              <InputGroup.Append>
                <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{local.customerType}</th>
                  <th>{local.productName}</th>
                  <th>{local.customerName}</th>
                  <th>{local.loanAppCreationDate}</th>
                  <th>{local.applicationStatus}</th>
                  <th>{local.loanPrinciple}</th>
                  <th><FormCheck type='checkbox' onClick={(e) => this.checkAll(e)}></FormCheck></th>
                </tr>
              </thead>
              <tbody>
                {this.state.applications
                  .filter(loanItem => loanItem.application.product.beneficiaryType !== 'group' ?
                    loanItem.application.customer.customerName?.includes(this.state.filterCustomers)
                    : loanItem.application.group.individualsInGroup.find(customer => customer.type === 'leader')?.customer.customerName.includes(this.state.filterCustomers)
                  )
                  .map((loanItem, index) => {
                    return (
                      <tr key={index}>
                        <td>{beneficiaryType(loanItem.application.product.beneficiaryType)}</td>
                        <td>{loanItem.application.product.productName}</td>
                        <td>{loanItem.application.product.beneficiaryType === 'group' ? loanItem.application.group.individualsInGroup.find(customer => customer.type === 'leader')?.customer.customerName : loanItem.application.customer.customerName}</td>
                        <td>{this.dateSlice(loanItem.application.entryDate)}</td>
                        <td>{englishToArabic(loanItem.application.status).text}</td>
                        <td>{loanItem.application.principal}</td>
                        <td>
                          <FormCheck type='checkbox'
                            checked={this.state.selectedApplications.includes(loanItem)}
                            onChange={() => this.addRemoveItemFromChecked(loanItem)}>
                          </FormCheck>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
            <Button
              onClick={() => this.setState({ showModal: true })}
              disabled={Boolean(!this.state.selectedApplications.length)}
            >{local.bulkApplicationCreation}</Button>
          </div>
          : null}
        {this.state.showModal && <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Formik
            initialValues={{ creationDate: this.dateSlice(null) }}
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
      </Container>
    )
  }
}

export default withRouter(BulkApplicationCreation);