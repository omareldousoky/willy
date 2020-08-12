import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import ReportsModal from './reportsModal';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerStatusDetails from '../pdfTemplates/customerStatusDetails/customerStatusDetails';
import { getCustomerDetails } from '../../Services/APIs/Reports/customerDetails';
import { getLoanDetails } from '../../Services/APIs/Reports/loanDetails';
import LoanApplicationDetails from '../pdfTemplates/loanApplicationDetails/loanApplicationDetails';
import BranchesLoanList from '../pdfTemplates/branchesLoanList/branchesLoanList';
import { getBranchLoanList } from '../../Services/APIs/Reports/branchLoanList';

export interface PDF {
  key?: string;
  local?: string;
  inputs?: Array<string>;
}

interface State {
  showModal?: boolean;
  print?: string;
  pdfsArray?: Array<PDF>;
  selectedPdf: PDF;
  data: any;
  loading: boolean;
  customerKey: string;
}

class Reports extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      print: '',
      pdfsArray: [
        { key: 'customerDetails', local: 'حالة العميل التفصيليه', inputs: ['customerKey'] },
        { key: 'loanDetails', local: 'تفاصيل طلب القرض', inputs: ['customerKey'] },
        { key: 'branchLoanList', local: 'القروض المصدرة بالفرع', inputs: ['dateFromTo', 'branches'] },

      ],
      selectedPdf: {},
      data: {},
      loading: false,
      customerKey: ''
    }
  }
  handlePrint(selectedPdf: PDF) {
    this.setState({ showModal: true, selectedPdf: selectedPdf })
  }
  handleSubmit(values) {
    switch (this.state.selectedPdf.key) {
      case 'customerDetails': return this.getCustomerDetails(values);
      case 'loanDetails': return this.getLoanDetails(values);
      case 'branchLoanList': return this.getBranchLoanList(values);
      default: return null;
    }
  }
  async getCustomerDetails(values) {
    this.setState({ loading: true, showModal: false })
    const res = await getCustomerDetails(values.key);
    if (res.status === 'success') {
      this.setState({
        data: res.body, showModal: false, print: 'customerDetails', loading: false, customerKey: values.key
      }, () => window.print())
    } else {
      this.setState({ loading: false });
      console.log(res)
    }
  }

  async getLoanDetails(values) {
    this.setState({ loading: true, showModal: false })
    const res = await getLoanDetails(values.key);
    if (res.status === 'success') {
      this.setState({ loading: false, data: res.body, print: 'loanDetails', customerKey: values.key }, () => window.print())
    } else {
      this.setState({ loading: false });
      console.log(res)
    }
  }
  async getBranchLoanList(values) {
    this.setState({ loading: true, showModal: false })
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: values.branches.map((branch) => branch._id)
    }
    const res = await getBranchLoanList(obj);
    if (res.status === 'success') {
      this.setState({
        data: res.body,
        showModal: false,
        print: 'branchLoanList',
        loading: false,
      }, () => window.print())
    } else {
      this.setState({ loading: false });
      console.log(res)
    }
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.paymentsReports}</Card.Title>
              </div>
            </div>
            {this.state.pdfsArray?.map((pdf, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                      <div>
                        <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                        <span>{pdf.local}</span>
                      </div>
                      <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.handlePrint(pdf)} />
                    </div>
                  </Card.Body>
                </Card>
              )
            })}
          </Card.Body>
        </Card>
        {this.state.showModal && <ReportsModal pdf={this.state.selectedPdf} show={this.state.showModal} hideModal={() => this.setState({ showModal: false })} submit={(values) => this.handleSubmit(values)} />}
        {this.state.print === "customerDetails" && <CustomerStatusDetails data={this.state.data} customerKey={this.state.customerKey}/>}
        {this.state.print === "loanDetails" && <LoanApplicationDetails data={this.state.data} />}
        {this.state.print === "branchLoanList" && <BranchesLoanList data={this.state.data} />}
      </>
    )
  }
}

export default Reports;