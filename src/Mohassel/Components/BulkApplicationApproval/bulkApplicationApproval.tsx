import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import FormCheck from 'react-bootstrap/FormCheck';
import { Loader } from '../../../Shared/Components/Loader';
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
  branches: Array<string>;
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
      branches: ['branch1', 'branch2'],
      searchResults: [],
      uniqueLoanOfficers: ["admin1", "admin2", "admin3"],
      selectedReviewedLoans: [],
      loading: false,
    }
  }
  getDataFromBranch(e: React.FormEvent<HTMLInputElement>) {
    this.setState({loading: true})
    this.setState({
      loading: false,
      filteredBranch: e.currentTarget.value,
      searchResults: [
        {
          customerType: 'فردي',
          loanApplicationId: '213',
          customerName: 'احمد',
          loanAppCreationDate: '15/3/2020',
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin1'
        },
        {
          customerType: 'مجموعة',
          loanApplicationId: '214',
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
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin3'
        },
        {
          customerType: 'مجموعة',
          loanApplicationId: '311',
          customerName: 'علاء',
          loanAppCreationDate: '10/3/2020',
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin1'
        },
        {
          customerType: 'فردي',
          loanApplicationId: '541',
          customerName: 'سمير',
          loanAppCreationDate: '10/3/2020',
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin2'
        },
        {
          customerType: 'مجموعة',
          loanApplicationId: '243',
          customerName: 'محمد',
          loanAppCreationDate: '16/3/2020',
          loanStatus: 'رُجعت',
          productName: 'test1',
          loanPrinciple: 'اصل القرض',
          loanOfficer: 'admin2'
        },
      ]
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
    console.log("this.state => ", this.state)
    return (
      <Container>
        <div style={{ display: 'flex' }}>
          <Form.Group controlId="branchSelector" style={{ flex: 2, margin: 10 }}>
            <Form.Control as="select"
              placeholder="Search by Customer name or ID"
              data-qc="branchSelector"
              value={this.state.filteredBranch}
              onChange={(e: React.FormEvent<HTMLInputElement>) => this.getDataFromBranch(e)}
            >
              <option value="" disabled></option>
              {this.state.branches.map((branch, index) => {
                return <option key={index} value={branch}>{branch}</option>
              })}
            </Form.Control>
          </Form.Group>
        </div>
        {this.state.searchResults.length || this.state.loading ?
          <div style={{position: 'relative'}}>
          <Loader type="fullsection" open={this.state.loading}/>
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