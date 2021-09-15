import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
// import { CustomerStatusDetails } from '../pdfTemplates/customerStatusDetails'
// import { getCustomerDetails } from '../../Services/APIs/Reports/customerDetails'
// import { getLoanDetails } from '../../Services/APIs/Reports/loanDetails'
// import { remainingLoan } from '../../Services/APIs/Loan/remainingLoan'
// import { LoanApplicationDetails } from '../pdfTemplates/loanApplicationDetails'
import { CollectionStatement } from '../../../Shared/Components/pdfTemplates/CollectionStatement'
import { ManualPayments } from '../../../Shared/Components/pdfTemplates/manualPayments'
import { LoanPenaltiesList } from '../../../Shared/Components/pdfTemplates/loanPenaltiesList'
import { CrossedOutLoansList } from '../../../Shared/Components/pdfTemplates/crossedOutLoansList'
import { DoubtfulPayments } from '../../../Shared/Components/pdfTemplates/doubtfulPayments'
import { IssuedLoanList } from '../../../Shared/Components/pdfTemplates/issuedLoanList'
import { PaymentsDone } from '../../../Shared/Components/pdfTemplates/paymentsDone'
import { RandomPayment } from '../../../Shared/Components/pdfTemplates/randomPayment'
import { CustomerTransactionReport } from '../../../Shared/Components/pdfTemplates/customerTransactionReport'
import RaseedyTransactionsReport from '../../../Shared/Components/pdfTemplates/RaseedyTransactions'

import {
  collectionReport,
  penalties,
  writeOffs,
  postCollectionReportExcel,
  getCollectionReportExcel,
  postPenaltiesExcel,
  getPenaltiesExcel,
  getWriteOffsExcel,
  postWriteOffsExcel,
  getManualPayments,
  postManualPaymentsExcel,
  getManualPaymentsExcel,
  getDoubtfulLoansExcel,
  postDoubtfulLoansExcel,
  doubtfulLoans,
  getIssuedLoanList,
  getIssuedLoansExcel,
  postIssuedLoansExcel,
  getInstallmentsExcel,
  installments,
  postInstallmentsExcel,
  getRandomPaymentsExcel,
  postRandomPaymentsExcel,
  getRandomPayments,
  getCustomerTransactions,
  getRaseedyTransactionsExcel,
  postRaseedyTransactionsExcel,
  fetchRaseedyTransactions,
  getRescheduledLoanExcel,
  getRescheduledLoanList,
  postRescheduledLoanExcel,
} from '../../../Shared/Services/APIs/Reports'

import { downloadFile } from '../../../Shared/Services/utils'
import { PdfPortal } from '../../../Shared/Components/Common/PdfPortal'
import { PDFList } from '../../../Shared/Components/PdfList'
import { PDF } from '../../../Shared/Components/PdfList/types'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'

interface State {
  showModal?: boolean
  print?: string
  pdfsArray: Array<PDF>
  selectedPdf: PDF
  data: any
  loading: boolean
  // customerKey: string
  fromDate: number
  toDate: number
}

class Reports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      print: '',
      pdfsArray: [
        // {
        //   key: 'customerDetails',
        //   local: 'حالة العميل التفصيليه',
        //   inputs: ['customerKey'],
        //   permission: 'customerDetails',
        // },
        // {
        //   key: 'loanDetails',
        //   local: 'تفاصيل طلب القرض',
        //   inputs: ['customerKey'],
        //   permission: 'loanDetails',
        // },
        {
          key: 'CollectionStatement',
          local: 'كشف التحصيل',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'collectionReport',
        },
        {
          key: 'Penalties',
          local: 'الغرامات',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'penalties',
        },
        {
          key: 'CrossedOutLoans',
          local: 'قائمة حركات إعدام ديون القروض المنفذة',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'writeOffs',
        },
        {
          key: 'DoubtfulLoans',
          local: 'قائمة حركة القروض المشكوك في سدادها',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'loanDoubts',
        },
        {
          key: 'issuedLoanList',
          local: 'القروض المصدرة',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'loansIssued',
        },
        {
          key: 'rescheduledLoanList',
          local: 'قائمة حركات جدولة القروض المنفذه',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'loanRescheduling',
        },
        {
          key: 'paymentsDoneList',
          local: 'حركات الاقساط',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'installments',
        },
        {
          key: 'randomPayments',
          local: 'الحركات المالية',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'randomPayments',
        },
        {
          key: 'manualPayments',
          local: 'مراجعه حركات السداد اليدوي',
          inputs: ['dateFromTo', 'branches'],
          permission: 'manualPayments',
        },
        {
          key: 'customerTransactionReport',
          local: 'الحركة تبعا للعميل',
          inputs: ['applicationKey'],
          permission: 'loanTransactionReport',
        },
        {
          key: 'raseedyTransactions',
          local: 'مدفوعات رصيدي',
          inputs: ['dateFromTo', 'branches'],
          permission: 'raseedyTransactions',
        },
      ],
      selectedPdf: { permission: '' },
      data: {},
      loading: false,
      // customerKey: '',
      fromDate: 0,
      toDate: 0,
    }
  }

  handlePrint(selectedPdf: PDF) {
    this.setState({ showModal: true, selectedPdf })
  }

  handleSubmit(values) {
    const from = new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf()
    const to = new Date(values.toDate).setHours(23, 59, 59, 999).valueOf()
    values.fromDate = from
    values.toDate = to
    switch (this.state.selectedPdf.key) {
      // case 'customerDetails':
      //   return this.getCustomerDetails(values)
      // case 'loanDetails':
      //   return this.getLoanDetails(values)
      case 'CollectionStatement':
        return this.getCollectionReport(values)
      case 'Penalties':
        return this.getLoanPenaltiesReport(values)
      case 'CrossedOutLoans':
        return this.getWriteOffsReport(values)
      case 'DoubtfulLoans':
        return this.getDoubtfulLoansReport(values)
      case 'issuedLoanList':
        return this.getIssuedLoanList(values)
      case 'rescheduledLoanList':
        return this.getRescheduledLoanList(values)
      case 'paymentsDoneList':
        return this.getInstallments(values)
      case 'randomPayments':
        return this.getRandomPayments(values)
      case 'manualPayments':
        return this.getManualPayments(values)
      case 'customerTransactionReport':
        return this.getCustomerTransactions(values)
      case 'raseedyTransactions':
        return this.getRaseedyTransactions(values)
      default:
        return null
    }
  }

  getExcel(values) {
    const from = new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf()
    const to = new Date(values.toDate).setHours(23, 59, 59, 999).valueOf()
    values.fromDate = from
    values.toDate = to
    switch (this.state.selectedPdf.key) {
      // case 'customerDetails': return this.getCustomerDetails(values); TODO keep commented
      // case 'loanDetails': return this.getLoanDetails(values); TODO keep commented
      case 'CollectionStatement':
        return this.getExcelFile(
          postCollectionReportExcel,
          getCollectionReportExcel,
          values
        )
      case 'Penalties':
        return this.getExcelFile(postPenaltiesExcel, getPenaltiesExcel, values)
      case 'CrossedOutLoans':
        return this.getExcelFile(postWriteOffsExcel, getWriteOffsExcel, values)
      case 'DoubtfulLoans':
        return this.getExcelFile(
          postDoubtfulLoansExcel,
          getDoubtfulLoansExcel,
          values
        )
      case 'issuedLoanList':
        return this.getExcelFile(
          postIssuedLoansExcel,
          getIssuedLoansExcel,
          values
        )
      case 'rescheduledLoanList':
        return this.getExcelFile(
          postRescheduledLoanExcel,
          getRescheduledLoanExcel,
          values
        )
      case 'paymentsDoneList':
        return this.getExcelFile(
          postInstallmentsExcel,
          getInstallmentsExcel,
          values
        )
      case 'randomPayments':
        return this.getExcelFile(
          postRandomPaymentsExcel,
          getRandomPaymentsExcel,
          values
        )
      case 'manualPayments':
        return this.getExcelFile(
          postManualPaymentsExcel,
          getManualPaymentsExcel,
          values
        )
      case 'raseedyTransactions':
        return this.getExcelFile(
          postRaseedyTransactionsExcel,
          getRaseedyTransactionsExcel,
          values
        )
      default:
        return null
    }
  }

  // async getRemainingLoan(id: string) {
  //   const res = await remainingLoan(id)
  //   if (res.status === 'success') {
  //     return res.body.remainingTotal
  //   }
  //   return 0
  // }

  // async getCustomerDetails(values) {
  //   this.setState({ loading: true, showModal: false })
  //   const res = await getCustomerDetails(values.key)
  //   if (res.status === 'success') {
  //     if (!res.body) {
  //       this.setState({ loading: false })
  //       Swal.fire('error', local.noResults)
  //     } else {
  //       const remainingTotal = await this.getRemainingLoan(res.body.customerID)
  //       this.setState(
  //         {
  //           data: { ...res.body, remainingTotal },
  //           showModal: false,
  //           print: 'customerDetails',
  //           loading: false,
  //           customerKey: values.key,
  //         },
  //         () => window.print()
  //       )
  //     }
  //   } else {
  //     this.setState({ loading: false })
  //     console.log(res)
  //   }
  // }

  // async getLoanDetails(values) {
  //   this.setState({ loading: true, showModal: false })
  //   const res = await getLoanDetails(values.key)
  //   if (res.status === 'success') {
  //     if (!res.body) {
  //       this.setState({ loading: false })
  //       Swal.fire('error', local.noResults)
  //     } else {
  //       this.setState(
  //         {
  //           loading: false,
  //           data: res.body,
  //           print: 'loanDetails',
  //           customerKey: values.key,
  //         },
  //         () => window.print()
  //       )
  //     }
  //   } else {
  //     this.setState({ loading: false })
  //     console.log(res)
  //   }
  // }

  async getInstallments(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [] : branches,
      loanType: values.loanType,
    }
    const res = await installments(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: { data: res.body, from: values.fromDate, to: values.toDate },
            showModal: false,
            print: 'paymentsDoneList',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getRandomPayments(values) {
    this.setState({
      loading: true,
      showModal: false,
      fromDate: values.fromDate,
      toDate: values.toDate,
    })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [] : branches,
      loanType: values.loanType,
    }
    const res = await getRandomPayments(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: 'randomPayments',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getIssuedLoanList(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [] : branches,
      loanType: values.loanType,
    }
    const res = await getIssuedLoanList(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: { data: res.body, from: values.fromDate, to: values.toDate },
            showModal: false,
            print: 'issuedLoanList',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getRescheduledLoanList(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [] : branches,
      loanType: values.loanType,
    }
    const res = await getRescheduledLoanList(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: { data: res.body, from: values.fromDate, to: values.toDate },
            showModal: false,
            print: 'rescheduledLoanList',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getCollectionReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await collectionReport({
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches.some((branch) => branch._id === '')
        ? []
        : values.branches.map((branch) => branch._id),
      loanType: values.loanType,
    })
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        const data = {
          startDate: values.fromDate,
          endDate: values.toDate,
          data: res.body,
        }
        this.setState(
          {
            data,
            showModal: false,
            print: 'CollectionStatement',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getLoanPenaltiesReport(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const res = await penalties({
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: branches.includes('') ? [] : branches,
      loanType: values.loanType,
    })
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        const data = {
          days: res.body.days,
          totalNumberOfTransactions: Number(res.body.numTrx),
          totalTransactionAmount: Number(res.body.transactionAmount),
          totalCancelledAmount: Number(res.body.rbAmount),
          totalPaidAmount: Number(res.body.netAmount),
          startDate: values.fromDate,
          endDate: values.toDate,
        }
        this.setState(
          {
            data,
            showModal: false,
            print: 'Penalties',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getDoubtfulLoansReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await doubtfulLoans({
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches
        .filter((branch) => branch._id !== '')
        .map((branch) => branch._id),
      loanType: values.loanType,
    })
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        const data = {
          req: { startDate: values.fromDate, endDate: values.toDate },
          data: { ...res.body },
        }
        this.setState(
          {
            data,
            showModal: false,
            print: 'DoubtfulLoans',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getWriteOffsReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await writeOffs({
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches
        .filter((branch) => branch._id !== '')
        .map((branch) => branch._id),
      loanType: values.loanType,
    })
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        const data = {
          req: { startDate: values.fromDate, endDate: values.toDate },
          data: { ...res.body },
        }
        this.setState(
          {
            data,
            showModal: false,
            print: 'CrossedOutLoans',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getManualPayments(values) {
    this.setState({
      loading: true,
      showModal: false,
      fromDate: values.fromDate,
      toDate: values.toDate,
    })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [] : branches,
      loanType: 'consumerFinance',
    }
    const res = await getManualPayments(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: { result: res.body },
            fromDate: values.fromDate,
            toDate: values.toDate,
            showModal: false,
            print: 'manualPayments',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getCustomerTransactions(values) {
    this.setState({ loading: true, showModal: false })
    const res = await getCustomerTransactions({
      loanApplicationKey: values.loanApplicationKey,
    })
    if (res.status === 'success') {
      if (!res.body || !Object.keys(res.body).length) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: 'customerTransactionReport',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getRaseedyTransactions(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const res = await fetchRaseedyTransactions({
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: branches.includes('') ? [] : branches,
    })

    if (res.status === 'success') {
      if (!res.body || !Object.keys(res.body).length) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: 'raseedyTransactions',
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
    }
  }

  async getExcelFile(func, pollFunc, values) {
    const { branches, fromDate, toDate, loanType } = values
    this.setState({
      loading: true,
      showModal: false,
      fromDate,
      toDate,
    })
    const obj = {
      startdate: fromDate,
      enddate: toDate,
      branches: !branches
        ? undefined
        : branches.some((branch) => branch._id === '')
        ? []
        : branches.map((branch) => branch._id),
      loanType,
    }
    const res = await func(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState({ loading: true })
        const pollStart = new Date().valueOf()
        this.getExcelPoll(pollFunc, res.body.fileId, pollStart)
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getExcelPoll(func, id, pollStart) {
    const pollInstant = new Date().valueOf()
    if (pollInstant - pollStart < 300000) {
      const file = await func(id)
      if (file.status === 'success') {
        if (['created', 'failed'].includes(file.body.status)) {
          if (file.body.status === 'created')
            downloadFile(file.body.presignedUrl)
          if (file.body.status === 'failed') Swal.fire('error', local.failed)
          this.setState({
            showModal: false,
            loading: false,
          })
        } else {
          setTimeout(() => this.getExcelPoll(func, id, pollStart), 5000)
        }
      } else {
        this.setState({ loading: false })
        console.log(file)
      }
    } else {
      this.setState({ loading: false })
      Swal.fire('error', 'TimeOut')
    }
  }

  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                  {local.paymentsReports}
                </Card.Title>
              </div>
            </div>
            <PDFList
              list={this.state.pdfsArray}
              onClickDownload={(item) => this.handlePrint(item)}
            />
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <ReportsModal
            pdf={this.state.selectedPdf}
            show={this.state.showModal}
            hideModal={() => this.setState({ showModal: false })}
            submit={(values) => this.handleSubmit(values)}
            getExcel={(values) => this.getExcel(values)}
            isCF
          />
        )}
        {/* {this.state.print === 'customerDetails' && (
          <CustomerStatusDetails
            data={this.state.data}
            customerKey={this.state.customerKey}
          />
        )}
        {this.state.print === 'loanDetails' && (
          <LoanApplicationDetails data={this.state.data} />
        )}
        */}
        {this.state.print === 'issuedLoanList' && (
          <IssuedLoanList data={this.state.data} isCF />
        )}
        {this.state.print === 'paymentsDoneList' && (
          <PaymentsDone data={this.state.data} isCF />
        )}
        {this.state.print === 'CollectionStatement' && (
          <CollectionStatement data={this.state.data} isCF />
        )}
        {this.state.print === 'Penalties' && (
          <LoanPenaltiesList data={this.state.data} isCF />
        )}

        {this.state.print === 'CrossedOutLoans' && (
          <CrossedOutLoansList data={this.state.data} isCF />
        )}

        {this.state.print === 'DoubtfulLoans' && (
          <DoubtfulPayments data={this.state.data} isCF />
        )}

        {this.state.print === 'randomPayments' && (
          <RandomPayment
            branches={this.state.data.branches}
            startDate={this.state.fromDate}
            endDate={this.state.toDate}
            isCF
          />
        )}
        {this.state.print === 'manualPayments' && (
          <ManualPayments
            result={this.state.data.result}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            isCF
          />
        )}
        {this.state.print === 'customerTransactionReport' && (
          <CustomerTransactionReport result={this.state.data} isCF />
        )}

        {this.state.print === 'raseedyTransactions' && (
          <PdfPortal
            component={
              <RaseedyTransactionsReport data={this.state.data} isCF />
            }
          />
        )}
      </>
    )
  }
}

export default Reports
