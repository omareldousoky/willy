import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormCheck from 'react-bootstrap/FormCheck';
import { Loader } from '../../../Shared/Components/Loader';
import { getBranches } from '../../Services/APIs/Branch/getBranches';
import * as local from '../../../Shared/Assets/ar.json';

interface Branch {
  _id: string;
  name: string;
}
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
  branches: Array<Branch>;
  filteredBranch: string;
  searchResults: Array<LoanItem>;
  uniqueLoanOfficers: Array<string>;
  filteredLoanOfficer: string;
  selectedReviewedLoans: Array<string>;
  loading: boolean;
}
interface Props {
  history: Array<string>;
};
class BulkApplicationApproval extends Component<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      filteredBranch: '',
      filteredLoanOfficer: '',
      branches: [],
      searchResults: [],
      uniqueLoanOfficers: ["admin1", "admin2", "admin3"],
      selectedReviewedLoans: [],
      loading: false,
    }
  }
  async componentDidMount() {
    this.setState({ loading: true })
    const res = await getBranches();
    if (res.status === "success") {
      this.setState({ 
        loading: false,
        branches: res.body.data.data
       })
    } else {
      this.setState({ loading: false })
    }
  }
  async getDataFromBranch(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ loading: true })
    // const res = await  ;
    this.setState({
      loading: false,
      filteredBranch: e.currentTarget.value,
      // searchResults: 
    })
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
      const newselectedReviewedLoans: Array<string> = this.state.searchResults.map(loanItem => loanItem.loanApplicationId);
      this.setState({ selectedReviewedLoans: newselectedReviewedLoans })
    } else this.setState({ selectedReviewedLoans: [] })
  }
  render() {
    return (
      <Container>
        <Loader type="fullscreen" open={this.state.loading} />
        <div style={{ display: 'flex' }}>
          <Form.Group controlId="branchSelector" style={{ flex: 2, margin: 10, textAlign: 'right' }}>
            <Form.Label>{`${local.selectBranch}*`}</Form.Label>
            <Form.Control as="select"
              placeholder="Search by Customer name or ID"
              data-qc="branchSelector"
              value={this.state.filteredBranch}
              onChange={(e: React.FormEvent<HTMLInputElement>) => this.getDataFromBranch(e)}
            >
              <option value="" disabled></option>
              {this.state.branches.map((branch, index) => {
                return <option key={index} value={branch._id}>{branch.name}</option>
              })}
            </Form.Control>
          </Form.Group>
        </div>
        {this.state.searchResults.length ?
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
                  .filter(loanItem => this.state.filteredLoanOfficer !== "" ? loanItem.loanOfficer === this.state.filteredLoanOfficer : loanItem)
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
                        <td>
                          <FormCheck type='checkbox'
                            checked={this.state.selectedReviewedLoans.includes(loanItem.loanApplicationId)}
                            onChange={() => this.addRemoveItemFromChecked(loanItem.loanApplicationId)}>
                          </FormCheck>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
            <Button>Approve</Button>
          </div>
          : null}
      </Container>
    )
  }
}

export default withRouter(BulkApplicationApproval);