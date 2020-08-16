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
import CollectionStatement from '../pdfTemplates/CollectionStatement/CollectionStatement';
import LoanPenaltiesList from '../pdfTemplates/loanPenaltiesList/loanPenaltiesList';
import CrossedOutLoansList from '../pdfTemplates/crossedOutLoansList/crossedOutLoansList';
import { collectionReport, penalties, writeOffs } from "../../Services/APIs/Reports";

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
  fromDate: string;
  toDate: string;
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
        { key: 'CollectionStatement', local: 'كشف التحصيل', inputs: ['dateFromTo', 'branches'] },
        { key: 'Penalties', local: 'الغرامات', inputs: ['dateFromTo'] },
        { key: 'CrossedOutLoans', local: 'قائمة حركات شطب القرض المنفذة', inputs: ['dateFromTo', 'branches'] }

      ],
      selectedPdf: {},
      data: {},
      loading: false,
      customerKey: '',
      fromDate: '',
      toDate: ''
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
      case 'CollectionStatement': return this.getCollectionReport(values);
      case 'Penalties': return this.getLoanPenaltiesReport(values);
      case 'CrossedOutLoans': return this.getWriteOffsReport(values);
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
    this.setState({ loading: true, showModal: false, fromDate: values.fromDate, toDate: values.toDate })
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: values.branches.some(branch => branch._id === "") ? [] : values.branches.map((branch) => branch._id)
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

  async getCollectionReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await collectionReport({
      startDate: values.fromDate,
      endDate: values.toDate,
      all: values.branches.some(branch => branch._id === "") ? "1" : "0",
      branchList: values.branches.some(branch => branch._id === "") ? [] : values.branches.map((branch) => branch._id)
    });
    if (res.status === 'success') {
      const data = {
        startDate: values.fromDate,
        endDate: values.toDate,
        data: res.body
      }
      this.setState({
        data: data, showModal: false, print: 'CollectionStatement', loading: false
      }, () => window.print())
    } else {
      this.setState({ loading: false });
      console.log(res)
    }
  }

  async getLoanPenaltiesReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await penalties({
      startDate: values.fromDate,
      endDate: values.toDate,
    });
    if (res.status === 'success') {
      const data= {
            days: res.body.days,
            totalNumberOfTransactions: res.body.numTrx,
            totalTransactionAmount: res.body.transactionAmount,
            startDate: values.fromDate,
            endDate: values.toDate
          }
      this.setState({
        data, showModal: false, print: 'Penalties', loading: false
      }, () => window.print())
    } else {
      this.setState({ loading: false });
      console.log(res)
    }
  }

  async getWriteOffsReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await writeOffs({
      startDate: values.fromDate,
      endDate: values.toDate,
      all:  values.branches.some(branch => branch._id === "")? "1": "0",
      branchList: values.branches.some(branch => branch._id === "") ? [] : values.branches.map((branch) => branch._id)
    });
    if (res.status === 'success') {
      const data = {
            req: {  startDate: values.fromDate,  endDate: values.toDate },
            data: {...res.body}
        }
      this.setState({
        data: data, showModal: false, print: 'CrossedOutLoans', loading: false
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
        {this.state.print === "branchLoanList" && <BranchesLoanList data={this.state.data} fromDate={this.state.fromDate} toDate={this.state.toDate}/>}
        {(this.state.print === "CollectionStatement") && ( <CollectionStatement data={this.state.data} /> )}
        {(this.state.print === "Penalties") && ( <LoanPenaltiesList data={this.state.data} /> )}
        {(this.state.print === "CrossedOutLoans") && (<CrossedOutLoansList data={this.state.data} /> )}
      </>
    )
  }
}

export default Reports;