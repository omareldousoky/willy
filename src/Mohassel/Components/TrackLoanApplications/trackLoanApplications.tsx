import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { Loader } from '../../../Shared/Components/Loader';
import { searchApplication } from '../../Services/APIs/loanApplication/searchApplication';
import { searchApplicationValidation } from './searchApplicationValidation';
import * as local from '../../../Shared/Assets/ar.json';
import { getCookie } from '../../Services/getCookie';
import { DownloadReviewedPdf } from '../PDF/documentExport';
import Can from '../../config/Can';

interface Product {
  productName: string;
  loanNature: string;
}
interface CustomerInfo {
  customerName: string;
  nationalId: string;
  birthDate: number;
  nationalIdIssueDate: number;
  gender: string;
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
  searchKeyword: string;
  dateFrom: string;
  dateTo: string;
  filters: Array<string>;
  searchResults: Array<LoanItem>;
  uniqueLoanOfficers: Array<string>;
  filteredLoanOfficer: string;
  selectedReviewedLoans: Array<LoanItem>;
  loading: boolean;
}
interface Props {
  history: any;
};
class TrackLoanApplications extends Component<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      dateFrom: '',
      dateTo: '',
      filters: [],
      filteredLoanOfficer: '',
      loading: false,
      searchResults: [],
      uniqueLoanOfficers: [],
      selectedReviewedLoans: [],
    }
  }
  async componentDidMount() {
    this.setState({ loading: true })
    const branchId = JSON.parse(getCookie('branches'))
    const obj = {
      branchId: branchId[0],
      from: 0,
      size: 30
    };
    const res = await searchApplication(obj);
    if (res.status === "success") {
      this.setState({
        loading: false,
        searchResults: res.body.applications
      })
    } else {
      this.setState({ loading: false })
    }
  }
  handleSubmit = async (values) => {
    this.setState({ loading: true })
    let obj = {}
    const branchId = JSON.parse(getCookie('branches'));
    if (values.dateFrom === "" && values.dateTo === "") {
      obj = {
        branchId: branchId[0],
        size: 20,
        from: 0,
      }
    } else {
      obj = {
        branchId: branchId[0],
        fromDate: new Date(values.dateFrom).valueOf(),
        toDate: new Date(values.dateTo).valueOf(),
        size: 20,
        from: 0,
      }
    }
    if (isNaN(Number(values.searchKeyword))) obj = { ...obj, name: values.searchKeyword }
    else obj = { ...obj, nationalId: values.searchKeyword }
    const res = await searchApplication(obj);
    if (res.status === "success") {
      this.setState({
        loading: false,
        searchResults: res.body.applications ? res.body.applications : []
      })
    } else {
      this.setState({ loading: false });
      Swal.fire('', local.searchError, 'error');
    }
  }
  toggleChip(loanStatus: string) {
    if (this.state.filters.includes(loanStatus)) {
      this.setState({
        filters: this.state.filters.filter((status) => status !== loanStatus)
      })
    } else {
      this.setState({
        filters: [...this.state.filters, loanStatus]
      })
    }
  }
  getActionFromStatus(loan: LoanItem) {
    if (loan.application.status === 'approved') {
      return <Can I='create' a='Loan'><Button onClick={() => this.props.history.push('/create-loan', { id: loan.id, type: "create" })}>{local.createLoan}</Button></Can>
    } else if (loan.application.status === 'created') {
      return <Can I='issue' a='Loan'><Button onClick={() => this.props.history.push('/create-loan', { id: loan.id, type: "issue" })}>{local.issueLoan}</Button></Can>
    } else if (loan.application.status === 'reviewed') {
      return (
        <div>
          <Can I='unReview' a='Application'><Button onClick={() => this.props.history.push(`/edit-loan-application`, { id: loan.id, action: 'unreview' })}>{local.undoLoanReview}</Button></Can>
          <Can I='reject' a='Application'><Button onClick={() => this.props.history.push(`/edit-loan-application`, { id: loan.id, action: 'reject' })}>{local.rejectLoan}</Button></Can>
        </div>
      )
    } else if (loan.application.status === 'underReview') {
      return (
        <div>
          <Can I='review' a='Application'><Button onClick={() => this.props.history.push(`/edit-loan-application`, { id: loan.id, action: 'review' })}>{local.reviewLoan}</Button></Can>
          <Can I='edit' a='Application'><Button onClick={() => this.props.history.push(`/edit-loan-application`, { id: loan.id, action: 'edit' })}>{local.editLoan}</Button></Can>
        </div>
      )
    }
    else return null;
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
      case 'issued':
        return 'أصدرت';
      default: return '';
    }
  }
  render() {
    const reviewedResults = (this.state.searchResults) ? this.state.searchResults.filter(result => result.application.status === "reviewed") : [];
    return (
      <Container>
        <Loader open={this.state.loading} type="fullscreen" />
        <Formik
          initialValues={this.state}
          onSubmit={this.handleSubmit}
          validationSchema={searchApplicationValidation}
          validateOnBlur
          validateOnChange
        >{(formikProps) =>
          <Form onSubmit={formikProps.handleSubmit} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Form.Group as={Col} controlId="searchKeyword" style={{ flex: 2 }}>
              <Form.Label style={{ textAlign: 'right' }} column>{`${local.searchByNameOrNationalId}*`}</Form.Label>
              <Form.Control
                type="text"
                name="searchKeyword"
                data-qc="searchKeyword"
                value={formikProps.values.searchKeyword}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isInvalid={Boolean(formikProps.errors.searchKeyword) && Boolean(formikProps.touched.searchKeyword)}
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.searchKeyword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="dateFrom" style={{ flex: 1 }}>
              <Form.Label style={{ textAlign: 'right' }} column >{local.dateFrom}</Form.Label>
              <Form.Control
                type="date"
                data-qc="dateFrom"
                value={formikProps.values.dateFrom}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isInvalid={Boolean(formikProps.errors.dateFrom) && Boolean(formikProps.touched.dateFrom)}
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.dateFrom}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="dateTo" style={{ flex: 1, marginLeft: 10 }}>
              <Form.Label style={{ textAlign: 'right' }} column >{local.dateTo}</Form.Label>

              <Form.Control
                type="date"
                data-qc="dateTo"
                value={formikProps.values.dateTo}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isInvalid={Boolean(formikProps.errors.dateTo) && Boolean(formikProps.touched.dateTo)}
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.dateTo}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
            </Form.Group>
            <Button type="submit">{local.search}</Button>
          </Form >
          }
        </Formik>
        <div style={{ textAlign: 'center' }}>
          <span className={this.state.filters.includes('underReview') ? "chip chip-active" : "chip"} onClick={() => this.toggleChip('underReview')}>{local.underReview}</span>
          <span className={this.state.filters.includes('reviewed') ? "chip chip-active" : "chip"} onClick={() => this.toggleChip('reviewed')}>{local.reviewed}</span>
          <span className={this.state.filters.includes('rejected') ? "chip chip-active" : "chip"} onClick={() => this.toggleChip('rejected')}>{local.rejected}</span>
          <span className={this.state.filters.includes('approved') ? "chip chip-active" : "chip"} onClick={() => this.toggleChip('approved')}>{local.approved}</span>
          <span className={this.state.filters.includes('created') ? "chip chip-active" : "chip"} onClick={() => this.toggleChip('created')}>{local.created}</span>
        </div>
        <Table striped bordered hover size="sm">
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
                  onChange={(e) => this.setState({ filteredLoanOfficer: e.currentTarget.value })}
                >
                  <option value="">{local.loanOfficer}</option>
                  {this.state.uniqueLoanOfficers.map((loanOfficer, index) => {
                    return <option key={index} value={loanOfficer}>{loanOfficer}</option>
                  })}
                </Form.Control>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.searchResults && this.state.searchResults
              // .filter(loanItem => this.state.filteredLoanOfficer !== "" ? loanItem.loanOfficer === this.state.filteredLoanOfficer : loanItem)
              .filter(loanItem => this.state.filters.length ? this.state.filters.includes(loanItem.application.status) : loanItem)
              .map((loanItem, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{loanItem.id}</td>
                    <td>{loanItem.application.customer.customerName}</td>
                    <td>{(loanItem.application.entryDate)?new Date(loanItem.application.entryDate).toISOString().slice(0, 10):''}</td>
                    <td>{this.englishToArabic(loanItem.application.status)}</td>
                    <td>{loanItem.application.product.productName}</td>
                    <td>{loanItem.application.principal}</td>
                    <td></td>
                    <td>{this.getActionFromStatus(loanItem)}</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
        {reviewedResults.length > 0 && <DownloadReviewedPdf data={reviewedResults} />}
      </Container>
    )
  }
}

export default withRouter(TrackLoanApplications);