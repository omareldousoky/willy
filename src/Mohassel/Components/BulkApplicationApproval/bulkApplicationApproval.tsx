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
import Select from 'react-select';
import { Formik } from 'formik';
import { Loader } from '../../../Shared/Components/Loader';
import { getBranches } from '../../Services/APIs/Branch/getBranches';
import { searchApplication } from '../../Services/APIs/loanApplication/searchApplication';
import { bulkApproval } from '../../Services/APIs/loanApplication/bulkApproval';
import { bulkApplicationApprovalValidation } from './bulkApplicationApprovalValidation';
import * as local from '../../../Shared/Assets/ar.json';

interface Branch {
  label: string;
  value: string;
}
interface Product {
  productName: string;
  loanNature: string;
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
}
interface LoanItem {
  id: string;
  branchId: string;
  application: Application;
}
interface State {
  branches: Array<Branch>;
  filteredBranch: Branch;
  searchResults: Array<LoanItem>;
  uniqueLoanOfficers: Array<string>;
  filteredLoanOfficer: string;
  selectedReviewedLoans: Array<string>;
  loading: boolean;
  showModal: boolean;
}
interface Props {
  history: Array<string>;
};
class BulkApplicationApproval extends Component<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      filteredBranch: { label: '', value: '' },
      filteredLoanOfficer: '',
      branches: [],
      searchResults: [],
      uniqueLoanOfficers: [],
      selectedReviewedLoans: [],
      loading: false,
      showModal: false,
    }
  }
  async componentDidMount() {
    this.setState({ loading: true })
    const res = await getBranches();
    if (res.status === "success") {
      const branches: any = [];
      res.body.data.data.forEach(branch => {
        branches.push({
          label: branch.name,
          value: branch._id
        })
      })
      this.setState({
        loading: false,
        branches: branches
      })
    } else {
      this.setState({ loading: false })
      Swal.fire('', local.searchError, 'error');
    }
  }
  async getDataFromBranch(e: Branch) {
    this.setState({ loading: true, filteredBranch: e });
    const res = await searchApplication({ branchId: e.value, size: 50 });
    if (res.status === "success") {
      this.setState({ loading: false, searchResults: res.body.applications ? res.body.applications : [] });
    } else {
      this.setState({ loading: false });
      Swal.fire('', local.searchError, 'error');
    }
  }
  addRemoveItemFromChecked(id: string) {
    if (this.state.selectedReviewedLoans.includes(id)) {
      this.setState({
        selectedReviewedLoans: this.state.selectedReviewedLoans.filter(el => el !== id),
      })
    } else {
      this.setState({
        selectedReviewedLoans: [...this.state.selectedReviewedLoans, id],
      })
    }
  }
  checkAll(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.checked) {
      const newselectedReviewedLoans: Array<string> = this.state.searchResults.map(loanItem => loanItem.id);
      this.setState({ selectedReviewedLoans: newselectedReviewedLoans })
    } else this.setState({ selectedReviewedLoans: [] })
  }
  handleSubmit = async (values) => {
    this.setState({ showModal: false, loading: true })
    const obj = {
      approvalDate: new Date(values.approvalDate).valueOf(),
      fundSource: values.fundSource,
      applicationIds: this.state.selectedReviewedLoans
    }
    const res = await bulkApproval(obj);
    if (res.status === "success") {
      this.setState({ loading: false })
      Swal.fire('', local.bulkLoanApproved, 'success');
    } else {
      this.setState({ loading: false })
      Swal.fire('', local.bulkLoanError, 'error');
    }
  }
  englishToArabic(status: string) {
    switch (status) {
      case 'underReview':
        return 'تحت التحرير';
      case 'reviewed':
        return 'رُجعت';
      case 'rejected':
        return 'مرفوضة';
      case 'approved':
        return 'موافق عليها';
      case 'created':
        return 'إنشاء';
      default: return '';
    }
  }
  render() {
    return (
      <Container>
        <Loader type="fullscreen" open={this.state.loading} />
        <div style={{ display: 'flex' }}>
          <Form.Group controlId="branchSelector" style={{ flex: 2, margin: 10, textAlign: 'right' }}>
            <Form.Label>{`${local.selectBranch}*`}</Form.Label>
            <Select
              data-qc="branchSelector"
              value={this.state.filteredBranch}
              onChange={(e: Branch) => this.getDataFromBranch(e)}
              type='text'
              options={this.state.branches}
            />
          </Form.Group>
        </div>
        {this.state.searchResults.filter(loanItem => loanItem.application.status === "reviewed").length ?
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{local.customerType}</th>
                  <th>{local.loanApplicationId}</th>
                  <th>{local.customerName}</th>
                  <th>{local.loanAppCreationDate}</th>
                  <th>{local.loanStatus}</th>
                  <th>{local.productName}</th>
                  <th>{local.loanPrinciple}</th>
                  <th>
                    <Form.Control as="select"
                      type="select"
                      name="issuingBank"
                      data-qc="issuingBank"
                      value={this.state.filteredLoanOfficer}
                      onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({ filteredLoanOfficer: e.currentTarget.value })}
                    >
                      <option value="">{local.loanOfficer}</option>
                      {this.state.uniqueLoanOfficers.map((loanOfficer, index) => {
                        return <option key={index} value={loanOfficer}>{loanOfficer}</option>
                      })}
                    </Form.Control>
                  </th>
                  <th><FormCheck type='checkbox' onClick={(e) => this.checkAll(e)}></FormCheck></th>
                </tr>
              </thead>
              <tbody>
                {this.state.searchResults
                  .filter(loanItem => loanItem.application.status === "reviewed")
                  // .filter(loanItem => this.state.filteredLoanOfficer !== "" ? loanItem.loanOfficer === this.state.filteredLoanOfficer : loanItem)
                  .map((loanItem, index) => {
                    return (
                      <tr key={index}>
                        <td></td>
                        <td>{loanItem.id}</td>
                        <td>{loanItem.application.customer.customerName}</td>
                        <td>{new Date(loanItem.application.entryDate).toISOString().slice(0, 10)}</td>
                        <td>{this.englishToArabic(loanItem.application.status)}</td>
                        <td>{loanItem.application.product.productName}</td>
                        <td>{loanItem.application.principal}</td>
                        <td></td>
                        <td>
                          <FormCheck type='checkbox'
                            checked={this.state.selectedReviewedLoans.includes(loanItem.id)}
                            onChange={() => this.addRemoveItemFromChecked(loanItem.id)}>
                          </FormCheck>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
            <Button onClick={() => this.state.selectedReviewedLoans.length ? this.setState({ showModal: true }) : null}>Approve</Button>
          </div>
          : this.state.filteredBranch.value ? <h4 style={{ textAlign: 'center', marginTop: 20 }}>{local.noApprovedApplicationsForThisBranch}</h4> : null}
        {this.state.showModal && <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Formik
            initialValues={{ approvalDate: new Date().toISOString().slice(0, 10), fundSource: '' }}
            onSubmit={this.handleSubmit}
            validationSchema={bulkApplicationApprovalValidation}
            validateOnBlur
            validateOnChange
          >
            {(formikProps) =>
              <Form onSubmit={formikProps.handleSubmit}>
                <Modal.Header>
                  <Modal.Title>Bulk Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group as={Row} controlId="approvalDate">
                    <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.entryDate}*`}</Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="date"
                        name="approvalDate"
                        data-qc="approvalDate"
                        value={formikProps.values.approvalDate}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.approvalDate) && Boolean(formikProps.touched.approvalDate)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.approvalDate}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="fundSource">
                    <Form.Label style={{ textAlign: 'right' }} column sm={3}>{`${local.fundSource}*`}</Form.Label>
                    <Col sm={6}>
                      <Form.Control as="select"
                        name="fundSource"
                        data-qc="fundSource"
                        value={formikProps.values.fundSource}
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        isInvalid={Boolean(formikProps.errors.fundSource) && Boolean(formikProps.touched.fundSource)}
                      >
                        <option value="" disabled></option>
                        <option value='tasaheel'>{local.tasaheel}</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.fundSource}
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

export default withRouter(BulkApplicationApproval);