import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import { Formik } from 'formik';
import { Loader } from '../../../Shared/Components/Loader';
import { searchApplication } from '../../Services/APIs/loanApplication/searchApplication';
import { searchApplicationValidation } from './searchApplicationValidation';
import * as local from '../../../Shared/Assets/ar.json';

interface LoanItem {
  customerType: string;
  loanApplicationId: string;
  customerName: string;
  loanAppCreationDate: string;
  loanStatus: string;
  productName: string;
  loanPrinciple: string;
  loanOfficer: string;
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
      searchResults: [
        {
          customerType: 'فردي',
          // loanApplicationId: '5e847f5d85a52c84914a0392',
          loanApplicationId: '5e8c5780aadba6885c1f2626',
          customerName: 'احمد',
          loanAppCreationDate: '15/3/2020',
          loanStatus: 'تحت التحرير',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin1'
        },
        {
          customerType: 'مجموعة',
          loanApplicationId: '5e8c5780aadba6885c1f2626',
          customerName: 'محمد',
          loanAppCreationDate: '16/3/2020',
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin1'
        },
        {
          customerType: 'فردي',
          loanApplicationId: '211',
          customerName: 'جمال',
          loanAppCreationDate: '10/3/2020',
          loanStatus: 'موافق عليها',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin3'
        },
        {
          customerType: 'مجموعة',
          loanApplicationId: '311',
          customerName: 'علاء',
          loanAppCreationDate: '10/3/2020',
          loanStatus: 'مرفوضة',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin1'
        },
        {
          customerType: 'فردي',
          loanApplicationId: '541',
          customerName: 'سمير',
          loanAppCreationDate: '10/3/2020',
          loanStatus: 'إنشاء',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin2'
        },
        {
          customerType: 'مجموعة',
          loanApplicationId: '214',
          customerName: 'محمد',
          loanAppCreationDate: '16/3/2020',
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin2'
        },
      ],
      uniqueLoanOfficers: ["admin1", "admin2", "admin3"],
      selectedReviewedLoans: [],
    }
  }
  async componentDidMount() {
    this.setState({ loading: true })
    const obj = {
      branchId: '5e79ee0ba92c135c57399330',
      from: 0,
      size: 30
    };
    const res = await searchApplication(obj);
    if (res.status === "success") {
      this.setState({ loading: false })

      console.log(res);
    } else {
      this.setState({ loading: false })

    }
  }
  handleSubmit = async () => {
    this.setState({ loading: true })
    const obj = {
      branchId: '5e79ee0ba92c135c57399330',
      fromDate: this.state.dateFrom,
      toDate: this.state.dateTo,
      name: this.state.searchKeyword
    }
    const res = await searchApplication(obj);
    if (res.status === "success") {
      this.setState({ loading: false })
      console.log(res);
    } else {
      this.setState({ loading: false })

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
    if (loan.loanStatus === local.approved) {
      return <Button onClick={() => this.props.history.push('/create-loan', '{ "id": ' + loan.loanApplicationId + ',"type": "create"}')}>{local.createLoan}</Button>
    } else if (loan.loanStatus === local.created) {
      return <Button onClick={() => this.props.history.push('/create-loan', '{ "id": ' + loan.loanApplicationId + ',"type": "issue"}')}>{local.issueLoan}</Button>
    } else if (loan.loanStatus === local.reviewed) {
      return (
        <div>
          <Button onClick={() => this.props.history.push(`/edit-loan-application`, {id: loan.loanApplicationId, action:'unreview'})}>{local.undoLoanReview}</Button>
          <Button onClick={() => this.props.history.push(`/edit-loan-application`, {id: loan.loanApplicationId, action:'reject'})}>{local.rejectLoan}</Button>
        </div>
      )
    } else if (loan.loanStatus === local.underReview) {
      return (
        <div>
          <Button onClick={() => this.props.history.push(`/edit-loan-application`, {id: loan.loanApplicationId, action:'review'})}>{local.reviewLoan}</Button>
          <Button onClick={() => this.props.history.push(`/edit-loan-application`, {id: loan.loanApplicationId, action:'edit'})}>{local.editLoan}</Button>
        </div>
      )
    }
    else return null;
  }

  render() {
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
              <Form.Label style={{ textAlign: 'right' }} column >{`${local.searchByNameOrNationalId}*`}</Form.Label>
              <Form.Control
                type="text"
                name="searchKeyword"
                data-qc="searchKeyword"
                // placeholder="Search by Customer name or ID"
                onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({ searchKeyword: e.currentTarget.value })}
              // isInvalid={Boolean(formikProps.errors.name) && Boolean(formikProps.touched.name)}
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.searchKeyword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="dateFrom" style={{ flex: 1 }}>
              <Form.Label style={{ textAlign: 'right' }} column >{local.dateFrom}</Form.Label>
              <Form.Control
                type="date"
                placeholder="Date from"
                onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({ dateFrom: e.currentTarget.value })}
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.dateFrom}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="dateTo" style={{ flex: 1, marginLeft: 10 }}>
              <Form.Label style={{ textAlign: 'right' }} column >{local.dateTo}</Form.Label>

              <Form.Control
                type="date"
                placeholder="Date To"
                onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({ dateTo: e.currentTarget.value })}
              />
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.dateTo}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Button type="submit">{local.search}</Button>
            </Form.Group>
          </Form >
          }
        </Formik>
        <div style={{ textAlign: 'center' }}>
          <span className={this.state.filters.includes(local.underReview) ? "chip chip-active" : "chip"} onClick={() => this.toggleChip(local.underReview)}>{local.underReview}</span>
          <span className={this.state.filters.includes(local.reviewed) ? "chip chip-active" : "chip"} onClick={() => this.toggleChip(local.reviewed)}>{local.reviewed}</span>
          <span className={this.state.filters.includes(local.approved) ? "chip chip-active" : "chip"} onClick={() => this.toggleChip(local.approved)}>{local.approved}</span>
          <span className={this.state.filters.includes(local.rejected) ? "chip chip-active" : "chip"} onClick={() => this.toggleChip(local.rejected)}>{local.rejected}</span>
          <span className={this.state.filters.includes(local.created) ? "chip chip-active" : "chip"} onClick={() => this.toggleChip(local.created)}>{local.created}</span>
        </div>
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
            {this.state.searchResults
              .filter(loanItem => this.state.filteredLoanOfficer !== "" ? loanItem.loanOfficer === this.state.filteredLoanOfficer : loanItem)
              .filter(loanItem => this.state.filters.length ? this.state.filters.includes(loanItem.loanStatus) : loanItem)
              .map((loanItem, index) => {
                return (
                  <tr key={index}>
                    <td>{loanItem.customerType}</td>
                    <td>{loanItem.loanApplicationId}</td>
                    <td>{loanItem.customerName}</td>
                    <td>{loanItem.loanAppCreationDate}</td>
                    <td>{loanItem.loanStatus}</td>
                    <td>{loanItem.productName}</td>
                    <td>{loanItem.loanPrinciple}</td>
                    <td>{loanItem.loanOfficer}</td>
                    <td>{this.getActionFromStatus(loanItem)}</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default withRouter(TrackLoanApplications);