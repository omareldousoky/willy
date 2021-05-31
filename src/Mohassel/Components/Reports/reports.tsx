import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import ReportsModal from './reportsModal'
import * as local from '../../../Shared/Assets/ar.json'
import CustomerStatusDetails from '../pdfTemplates/customerStatusDetails/customerStatusDetails'
import { getCustomerDetails } from '../../Services/APIs/Reports/customerDetails'
import { getLoanDetails } from '../../Services/APIs/Reports/loanDetails'
import LoanApplicationDetails from '../pdfTemplates/loanApplicationDetails/loanApplicationDetails'
import BranchesLoanList from '../pdfTemplates/branchesLoanList/branchesLoanList'
import {
  getBranchLoanList,
  postBranchLoanListExcel,
  getBranchLoanListExcel,
} from '../../Services/APIs/Reports/branchLoanList'
import CollectionStatement from '../pdfTemplates/CollectionStatement/CollectionStatement'
import LoanPenaltiesList from '../pdfTemplates/loanPenaltiesList/loanPenaltiesList'
import CrossedOutLoansList from '../pdfTemplates/crossedOutLoansList/crossedOutLoansList'
import DoubtfulPayments from '../pdfTemplates/doubtfulPayments/doubtfulPayments'
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
} from '../../Services/APIs/Reports'
import {
  installments,
  postInstallmentsExcel,
  getInstallmentsExcel,
} from '../../Services/APIs/Reports/installments'
import PaymentsDone from '../pdfTemplates/paymentsDone/paymentsDone'
import IssuedLoanList from '../pdfTemplates/issuedLoanList/issuedLoanList'
import {
  getIssuedLoanList,
  postIssuedLoansExcel,
  getIssuedLoansExcel,
} from '../../Services/APIs/Reports/issuedLoansList'
import {
  getCreatedLoanList,
  postCreatedLoansExcel,
  getCreatedLoansExcel,
} from '../../Services/APIs/Reports/createdLoansList'
import {
  getRescheduledLoanList,
  postRescheduledLoanExcel,
  getRescheduledLoanExcel,
} from '../../Services/APIs/Reports/rescheduledLoansList'
import LoanCreationList from '../pdfTemplates/loanCreationList/loanCreationList'
import RescheduledLoanList from '../pdfTemplates/rescheduledLoanList/rescheduledLoanList'
import {
  getRandomPayments,
  postRandomPaymentsExcel,
  getRandomPaymentsExcel,
} from '../../Services/APIs/Reports/randomPayment'
import RandomPayment from '../pdfTemplates/randomPayment/randomPayment'
import {
  getLoanApplicationFees,
  postLoanApplicationFeesExcel,
  getLoanApplicationFeesExcel,
} from '../../Services/APIs/Reports/loanApplicationFees'
import LoanApplicationFees from '../pdfTemplates/loanApplicationFees/loanApplicationFees'
import Can from '../../config/Can'
import {
  doubtfulLoans,
  postDoubtfulLoansExcel,
  getDoubtfulLoansExcel,
} from '../../Services/APIs/Reports/doubtfulLoans'
import { cibPaymentReport } from '../../Services/APIs/Reports/cibPaymentReport'
import ManualPayments from '../pdfTemplates/manualPayments/manualPayments'
import {
  getManualPayments,
  postManualPaymentsExcel,
  getManualPaymentsExcel,
} from '../../Services/APIs/Reports/manualPayments'
import { downloadFile } from '../../../Shared/Services/utils'
import { remainingLoan } from '../../Services/APIs/Loan/remainingLoan'
import CustomerTransactionReport from '../pdfTemplates/customerTransactionReport/customerTransactionReport'
import { getCustomerTransactions } from '../../Services/APIs/Reports/customerTransactions'

export interface PDF {
  key?: string
  local?: string
  inputs?: Array<string>
  permission: string
}

interface State {
  showModal?: boolean
  print?: string
  pdfsArray?: Array<PDF>
  selectedPdf: PDF
  data: any
  loading: boolean
  customerKey: string
  fromDate: string
  toDate: string
}

class Reports extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      print: '',
      pdfsArray: [
        {
          key: 'customerDetails',
          local: 'حالة العميل التفصيليه',
          inputs: ['customerKey'],
          permission: 'customerDetails',
        },
        {
          key: 'loanDetails',
          local: 'تفاصيل طلب القرض',
          inputs: ['customerKey'],
          permission: 'loanDetails',
        },
        {
          key: 'branchLoanList',
          local: 'ملخص الحالات والقروض',
          inputs: ['dateFromTo', 'branches'],
          permission: 'branchIssuedLoans',
        },
        {
          key: 'CollectionStatement',
          local: 'كشف التحصيل',
          inputs: ['dateFromTo', 'branches', 'loanType'],
          permission: 'collectionReport',
        },
        {
          key: 'Penalties',
          local: 'الغرامات',
          inputs: ['dateFromTo', 'branches'],
          permission: 'penalties',
        },
        {
          key: 'CrossedOutLoans',
          local: 'قائمة حركات إعدام ديون القروض المنفذة',
          inputs: ['dateFromTo', 'branches'],
          permission: 'writeOffs',
        },
        {
          key: 'DoubtfulLoans',
          local: 'قائمة حركة القروض المشكوك في سدادها',
          inputs: ['dateFromTo', 'branches'],
          permission: 'loanDoubts',
        },
        {
          key: 'issuedLoanList',
          local: 'القروض المصدره',
          inputs: ['dateFromTo', 'branches'],
          permission: 'loansIssued',
        },
        {
          key: 'createdLoanList',
          local: 'انشاء القروض',
          inputs: ['dateFromTo', 'branches'],
          permission: 'loansCreated',
        },
        {
          key: 'rescheduledLoanList',
          local: 'قائمة حركات جدولة القروض المنفذه',
          inputs: ['dateFromTo', 'branches'],
          permission: 'loanRescheduling',
        },
        {
          key: 'paymentsDoneList',
          local: 'حركات الاقساط',
          inputs: ['dateFromTo', 'branches'],
          permission: 'installments',
        },
        {
          key: 'randomPayments',
          local: 'الحركات المالية',
          inputs: ['dateFromTo', 'branches'],
          permission: 'randomPayments',
        },
        {
          key: 'loanApplicationFees',
          local: 'حركات رسوم طلب القرض',
          inputs: ['dateFromTo', 'branches'],
          permission: 'loanFees',
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
      ],
      selectedPdf: { permission: '' },
      data: {},
      loading: false,
      customerKey: '',
      fromDate: '',
      toDate: '',
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
      case 'customerDetails':
        return this.getCustomerDetails(values)
      case 'loanDetails':
        return this.getLoanDetails(values)
      case 'branchLoanList':
        return this.getBranchLoanList(values)
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
      case 'createdLoanList':
        return this.getCreatedLoanList(values)
      case 'rescheduledLoanList':
        return this.getRescheduledLoanList(values)
      case 'paymentsDoneList':
        return this.getInstallments(values)
      case 'randomPayments':
        return this.getRandomPayments(values)
      case 'loanApplicationFees':
        return this.getLoanApplicationFees(values)
      case 'manualPayments':
        return this.getManualPayments(values)
      case 'customerTransactionReport':
        return this.getCustomerTransactions(values)
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
      // case 'customerDetails': return this.getCustomerDetails(values);
      // case 'loanDetails': return this.getLoanDetails(values);
      case 'branchLoanList':
        return this.getExcelFile(
          postBranchLoanListExcel,
          getBranchLoanListExcel,
          values
        )
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
      case 'createdLoanList':
        return this.getExcelFile(
          postCreatedLoansExcel,
          getCreatedLoansExcel,
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
      case 'loanApplicationFees':
        return this.getExcelFile(
          postLoanApplicationFeesExcel,
          getLoanApplicationFeesExcel,
          values
        )
      // case 'cibPaymentReport': return this.getCibPaymentReport(values);
      case 'manualPayments':
        return this.getExcelFile(
          postManualPaymentsExcel,
          getManualPaymentsExcel,
          values
        )
      default:
        return null
    }
  }

  async getRemainingLoan(id: string) {
    const res = await remainingLoan(id)
    if (res.status === 'success') {
      return res.body.remainingTotal
    }
    return 0
  }

  async getCustomerDetails(values) {
    this.setState({ loading: true, showModal: false })
    const res = await getCustomerDetails(values.key)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        const remainingTotal = await this.getRemainingLoan(res.body.customerID)
        this.setState(
          {
            data: { ...res.body, remainingTotal },
            showModal: false,
            print: 'customerDetails',
            loading: false,
            customerKey: values.key,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getLoanDetails(values) {
    this.setState({ loading: true, showModal: false })
    const res = await getLoanDetails(values.key)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            loading: false,
            data: res.body,
            print: 'loanDetails',
            customerKey: values.key,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      console.log(res)
    }
  }

  async getBranchLoanList(values) {
    this.setState({
      loading: true,
      showModal: false,
      fromDate: values.fromDate,
      toDate: values.toDate,
    })
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: values.branches.some((branch) => branch._id === '')
        ? []
        : values.branches.map((branch) => branch._id),
    }
    const res = await getBranchLoanList(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: 'branchLoanList',
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

  async getInstallments(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [''] : branches,
      all: branches.includes('') || branches === [] ? '1' : '0',
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
      branches: branches.includes('') ? [''] : branches,
      all: branches.includes('') ? '1' : '0',
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

  async getCreatedLoanList(values) {
    this.setState({ loading: true, showModal: false })
    const branches = values.branches.map((branch) => branch._id)
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: branches.includes('') ? [] : branches,
    }
    const res = await getCreatedLoanList(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: { data: res.body, from: values.fromDate, to: values.toDate },
            showModal: false,
            print: 'createdLoanList',
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

  async getLoanApplicationFees(values) {
    this.setState({
      loading: true,
      showModal: false,
      fromDate: values.fromDate,
      toDate: values.toDate,
    })
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: values.branches
        .filter((branch) => branch._id !== '')
        .map((branch) => branch._id),
    }
    const res = await getLoanApplicationFees(obj)
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: 'loanApplicationFees',
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
      all: values.branches.some((branch) => branch._id === '') ? '1' : '0',
      branchList: values.branches.some((branch) => branch._id === '')
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
    const branches = values.branches.map((branch) => branch._id)
    this.setState({ loading: true, showModal: false })
    const res = await penalties({
      startDate: values.fromDate,
      endDate: values.toDate,
      all: branches.includes('') || branches === [] ? '1' : '0',
      branchList: branches.includes('') ? [''] : branches,
    })
    if (res.status === 'success') {
      if (!res.body) {
        this.setState({ loading: false })
        Swal.fire('error', local.noResults)
      } else {
        const data = {
          days: res.body.days,
          totalNumberOfTransactions: res.body.numTrx,
          totalTransactionAmount: res.body.transactionAmount,
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
    const branches = values.branches.map((branch) => branch._id)
    const res = await doubtfulLoans({
      startDate: values.fromDate,
      endDate: values.toDate,
      all: branches.includes('') || branches === [] ? '1' : '0',
      branchList: values.branches
        .filter((branch) => branch._id !== '')
        .map((branch) => branch._id),
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
    const branches = values.branches.map((branch) => branch._id)
    const res = await writeOffs({
      startDate: values.fromDate,
      endDate: values.toDate,
      all: branches.includes('') || branches === [] ? '1' : '0',
      branchList: values.branches
        .filter((branch) => branch._id !== '')
        .map((branch) => branch._id),
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

  async getCibPaymentReport(values) {
    this.setState({ loading: true, showModal: false })
    const res = await cibPaymentReport({ endDate: values.toDate })
    if (res.status === 'success') {
      this.setState({ loading: false })
      const link = document.createElement('a')
      link.href = res.body.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      link.remove()
    } else {
      this.setState({ loading: false })
      Swal.fire('', local.noResults, 'error')
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
      branchList: branches.includes('') ? [''] : branches,
      all: branches.includes('') || branches === [] ? '1' : '0',
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

  async getExcelFile(func, pollFunc, values) {
    this.setState({
      loading: true,
      showModal: false,
      fromDate: values.fromDate,
      toDate: values.toDate,
    })
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: values.branches.some((branch) => branch._id === '')
        ? []
        : values.branches.map((branch) => branch._id),
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
            {this.state.pdfsArray?.map((pdf, index) => {
              return (
                <Can I={pdf.permission} a="report" key={index}>
                  <Card key={index}>
                    <Card.Body>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0px 20px',
                          fontWeight: 'bold',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                          <span>{pdf.local}</span>
                        </div>
                        <img
                          style={{ cursor: 'pointer' }}
                          alt="download"
                          data-qc="download"
                          src={require(`../../Assets/green-download.svg`)}
                          onClick={() => this.handlePrint(pdf)}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Can>
              )
            })}
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <ReportsModal
            pdf={this.state.selectedPdf}
            show={this.state.showModal}
            hideModal={() => this.setState({ showModal: false })}
            submit={(values) => this.handleSubmit(values)}
            getExcel={(values) => this.getExcel(values)}
          />
        )}
        {this.state.print === 'customerDetails' && (
          <CustomerStatusDetails
            data={this.state.data}
            customerKey={this.state.customerKey}
          />
        )}
        {this.state.print === 'loanDetails' && (
          <LoanApplicationDetails data={this.state.data} />
        )}
        {this.state.print === 'issuedLoanList' && (
          <IssuedLoanList data={this.state.data} />
        )}
        {this.state.print === 'createdLoanList' && (
          <LoanCreationList data={this.state.data} />
        )}
        {this.state.print === 'rescheduledLoanList' && (
          <RescheduledLoanList data={this.state.data} />
        )}
        {this.state.print === 'paymentsDoneList' && (
          <PaymentsDone data={this.state.data} />
        )}
        {this.state.print === 'branchLoanList' && (
          <BranchesLoanList
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === 'CollectionStatement' && (
          <CollectionStatement data={this.state.data} />
        )}
        {this.state.print === 'Penalties' && (
          <LoanPenaltiesList data={this.state.data} />
        )}
        {this.state.print === 'CrossedOutLoans' && (
          <CrossedOutLoansList data={this.state.data} />
        )}
        {this.state.print === 'DoubtfulLoans' && (
          <DoubtfulPayments data={this.state.data} />
        )}
        {this.state.print === 'randomPayments' && (
          <RandomPayment
            branches={this.state.data.branches}
            startDate={this.state.fromDate}
            endDate={this.state.toDate}
          />
        )}
        {this.state.print === 'loanApplicationFees' && (
          <LoanApplicationFees
            result={this.state.data.result}
            total={this.state.data.total}
            trx={this.state.data.trx}
            canceled={this.state.data.canceled}
            net={this.state.data.net}
            startDate={this.state.fromDate}
            endDate={this.state.toDate}
          />
        )}
        {this.state.print === 'manualPayments' && (
          <ManualPayments
            result={this.state.data.result}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === 'customerTransactionReport' && (
          <CustomerTransactionReport result={this.state.data} />
        )}
      </>
    )
  }
}

export default Reports
