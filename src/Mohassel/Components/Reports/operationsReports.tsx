import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import { fetchLoansBriefingReport } from '../../../Shared/Services/APIs/Reports/Operations/loansBriefingReport'
import LoansBriefing2Pdf from '../pdfTemplates/loansBriefing/loansBriefing2'
import UnpaidInst from '../../../Shared/Components/pdfTemplates/Operations/unpaidInst/unpaidInst'
import UnpaidInstallmentsByOfficerPdf from '../../../Shared/Components/pdfTemplates/Operations/unpaidInstallmentsByOfficer/unpaidInstallmentsByOfficer'
import InstallmentsDuePerOfficerCustomerCardPdf from '../../../Shared/Components/pdfTemplates/Operations/installmentsDuePerOfficerCustomerCard/installmentsDuePerOfficerCustomerCard'
import {
  CustomersArrearsRequest,
  InstallmentsDuePerOfficerCustomerCardRequest,
  OfficersBranchPercentPaymentRequest,
  LeakedCustomersReportRequest,
  OfficersPercentPaymentRequest,
  OperationsReportRequest,
  PaidArrearsRequest,
  UnpaidInstallmentsByOfficerRequest,
} from '../../../Shared/Models/operationsReports'
import {
  fetchUnpaidInstallmentsPerAreaReport,
  fetchOfficersPercentPaymentReport,
  fetchOfficersBranchPercentPaymentReport,
  fetchLeakedCustomersReport,
  fetchPaidArrearsReport,
  fetchCustomersArrearsReport,
  fetchMonthComparisonReport,
  fetchActiveWalletIndividualReport,
  ActiveWalletRequest,
  fetchActiveWalletGroupReport,
  installmentsDuePerOfficerCustomerCard,
  unpaidInstallmentsByOfficer,
  fetchDueInstallmentsReport,
  postBlockedCustomers,
  getBlockedCustomers,
} from '../../../Shared/Services/APIs/Reports/Operations'
import OfficersPercentPaymentPdf from '../../../Shared/Components/pdfTemplates/Operations/officersPercentPayment/officersPercentPayment'
import OfficerBranchPercentPayment from '../../../Shared/Components/pdfTemplates/Operations/officersPercentPayment/officersBranchPercentPayment'
import LeakedCustomersPDF from '../../../Shared/Components/pdfTemplates/Operations/LeakedCustomers/leakedCustomers'
import DueInstallmentsPdf from '../../../Shared/Components/pdfTemplates/Operations/dueInstallments/dueInstallments'
import { getErrorMessage, downloadFile } from '../../../Shared/Services/utils'
import CustomersArrearsPdf from '../../../Shared/Components/pdfTemplates/Operations/customersArrears/customersArrears'
import PaidArrearsPdf from '../../../Shared/Components/pdfTemplates/Operations/paidArrears/paidArrears'
import MonthComparisonPdf from '../../../Shared/Components/pdfTemplates/Operations/monthComparison/monthComparison'
import ActiveWalletIndividualPdf from '../../../Shared/Components/pdfTemplates/Operations/activeWalletIndividual/activeWalletIndividual'
import ActiveWalletGroupPdf from '../../../Shared/Components/pdfTemplates/Operations/activeWalletGroup/activeWalletGroup'
import { PDFList } from '../../../Shared/Components/PdfList'
import { PDF } from '../../../Shared/Components/PdfList/types'
import ReportsModal from '../../../Shared/Components/ReportsModal/reportsModal'
import { ApiResponse } from '../../../Shared/Models/common'

interface OperationsReportsState {
  showModal?: boolean
  print?: string
  pdfsArray: Array<PDF>
  selectedPdf: PDF
  data: any // TODO: Handle type
  loading: boolean
  fromDate: string
  toDate: string
  date: string
}

enum Reports {
  LoansBriefing2 = 'loansBriefing2',
  OfficersPercentPayment = 'officersPercentPayment',
  OfficersBranchPercentPayment = 'officersBranchPercentPayment',
  UnpaidInstallmentsByOfficer = 'unpaidInstallmentsByOfficer',
  InstallmentsDuePerOfficerCustomerCard = 'installmentsDuePerOfficerCustomerCard',
  UnpaidInstallmentsPerArea = 'unpaidInstallmentsPerArea',
  DueInstallments = 'dueInstallments',
  LeakedCustomers = 'leakedCustomers',
  PaidArrears = 'paidArrears',
  CustomersArrears = 'customersArrears',
  MonthComparison = 'monthComparison',
  ActiveWalletIndividual = 'activeWalletIndividual',
  ActiveWalletGroup = 'activeWalletGroup',
  BlockedCustomers = 'blockedCustomers',
}

class OperationsReports extends Component<{}, OperationsReportsState> {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      print: '',
      pdfsArray: [
        {
          key: Reports.LoansBriefing2,
          local: 'ملخص الحالات والقروض 2',
          inputs: ['loanTypeWithoutMicro', 'dateFromTo', 'branches'],
          permission: 'briefingReport',
        },
        {
          key: Reports.UnpaidInstallmentsByOfficer,
          local: 'الاقساط المستحقة بالمندوب',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'creationDateFromTo',
            'branches',
            'representatives',
          ],
          permission: 'unpaidInstallmentsByOfficer',
        },
        {
          key: Reports.InstallmentsDuePerOfficerCustomerCard,
          local: 'الاقساط المستحقة للمندوب كارت العميل',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'branches',
            'representatives',
          ],
          permission: 'installmentsDuePerOfficerCustomerCard',
        },
        {
          key: Reports.UnpaidInstallmentsPerArea,
          local: 'قائمة الاقساط الغير مسددة بمناطق العمل',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'branches',
            'geoAreas',
          ],
          permission: 'unpaidInstallmentsPerArea',
        },
        {
          key: Reports.OfficersPercentPayment,
          local: 'نسبة سداد المندوبين 1',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'branches',
            'representatives',
            'gracePeriod',
          ],
          permission: 'officerPercentPayment',
        },
        {
          key: Reports.OfficersBranchPercentPayment,
          local: 'نسبة سداد المندوبين 3',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'creationDateFromTo',
            'branches',
            'gracePeriod',
          ],
          permission: 'officerBranchPercentPayment',
        },
        {
          key: Reports.DueInstallments,
          local: 'ملخص الأقساط المستحقة (تقرير السداد الجزئي)',
          inputs: ['loanTypeWithoutMicro', 'dateFromTo', 'branches'],
          permission: 'dueInstallments',
        },
        {
          key: Reports.LeakedCustomers,
          local: 'تقرير العملاء المتسربون',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'branches',
            'representatives',
          ],
          permission: 'churnedCustomers',
        },
        {
          key: Reports.CustomersArrears,
          local: 'متأخرات المندوب لم يستحق أو مسدد جزئي',
          inputs: [
            'loanTypeWithoutMicro',
            'date',
            'branches',
            'representatives',
          ],
          permission: 'customersArrears',
        },
        {
          key: Reports.PaidArrears,
          local: 'تقرير ما تم تحصيله من المتأخرات',
          inputs: [
            'loanTypeWithoutMicro',
            'dateFromTo',
            'branches',
            'representatives',
          ],
          permission: 'paidArrears',
        },
        {
          key: Reports.MonthComparison,
          local:
            'مقارنه تقرير ملخص الاقساط المستحقه (تقرير السداد الجزئي ) بالشهر السابق',
          inputs: [
            'loanTypeWithoutMicro',
            'monthComparisonDateFromTo',
            'branches',
          ],
          permission: 'monthComparison',
        },
        {
          key: Reports.ActiveWalletIndividual,
          local: 'المحفظة النشطه للمندوبين - فردى',
          inputs: [
            'loanTypeWithoutMicro',
            'date',
            'branches',
            'representatives',
          ],
          permission: 'individualActiveWallet',
        },
        {
          key: Reports.ActiveWalletGroup,
          local: 'المحفظة النشطه للمندوبين - جماعى',
          inputs: ['date', 'branches', 'representatives'],
          permission: 'groupActiveLoans',
        },
        {
          key: Reports.BlockedCustomers,
          local: 'عملاء محظورين',
          inputs: ['branches'],
          permission: 'getBlockedCustomers',
          serviceKey: 'report-2',
          hidePdf: true,
        },
      ],
      selectedPdf: { permission: '' },
      data: undefined,
      loading: false,
      fromDate: '',
      toDate: '',
      date: '',
    }
  }

  handlePrint(selectedPdf: PDF) {
    // reset data
    this.setState({
      showModal: true,
      selectedPdf,
      data: undefined,
      fromDate: '',
      toDate: '',
      date: '',
    })
  }

  handleSubmit(values) {
    const branches = values.branches.map((branch) => branch._id)
    values.branches = branches.includes('') ? [] : branches
    const { fromDate, toDate, date } = values
    this.setState({ loading: true, showModal: false, fromDate, toDate, date })
    switch (this.state.selectedPdf.key) {
      case Reports.LoansBriefing2:
        return this.fetchLoansBriefing(values)
      case Reports.UnpaidInstallmentsByOfficer:
        return this.fetchUnpaidInstallmentsByOfficer(values)
      case Reports.InstallmentsDuePerOfficerCustomerCard:
        return this.fetchInstallmentsDuePerOfficerCustomerCard(values)
      case Reports.UnpaidInstallmentsPerArea:
        return this.fetchUnpaidInstallments(values)
      case Reports.OfficersPercentPayment:
        return this.fetchOfficersPercentPayment(values)
      case Reports.OfficersBranchPercentPayment:
        return this.fetchOfficersBranchPercentPayment(values)
      case Reports.DueInstallments:
        return this.fetchDueInstallments(values)
      case Reports.LeakedCustomers:
        return this.fetchLeakedCustomers(values)
      case Reports.CustomersArrears:
        return this.fetchCustomersArrears(values)
      case Reports.PaidArrears:
        return this.fetchPaidArrears(values)
      case Reports.MonthComparison:
        return this.fetchMonthComparison(values)
      case Reports.ActiveWalletIndividual:
        return this.fetchActiveWalletIndividual(values)
      case Reports.ActiveWalletGroup:
        return this.fetchActiveWalletGroup(values)
      default:
        return null
    }
  }

  handleFetchReport(res: ApiResponse<any>, report: Reports) {
    if (res.status === 'success') {
      if (!res.body || !Object.keys(res.body).length) {
        this.setState({ loading: false })
        Swal.fire({
          title: local.errorTitle,
          text: local.noResults,
          confirmButtonText: local.confirmationText,
          icon: 'error',
        })
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: report,
            loading: false,
          },
          () => window.print()
        )
      }
    } else {
      this.setState({ loading: false })
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage((res.error as Record<string, string>).error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
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
          if (file.body.status === 'failed')
            Swal.fire({
              title: local.errorTitle,
              text: local.failed,
              icon: 'error',
              confirmButtonText: local.confirmationText,
            })
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
      Swal.fire({
        title: local.errorTitle,
        text: local.timeOut,
        confirmButtonText: local.confirmationText,
        icon: 'error',
      })
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
        Swal.fire({
          title: local.errorTitle,
          text: local.noResults,
          confirmButtonText: local.confirmationText,
          icon: 'error',
        })
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

  getExcel(values) {
    const from = new Date(values.fromDate).setHours(0, 0, 0, 0).valueOf()
    const to = new Date(values.toDate).setHours(23, 59, 59, 999).valueOf()
    values.fromDate = from
    values.toDate = to
    switch (this.state.selectedPdf.key) {
      case Reports.BlockedCustomers:
        return this.getExcelFile(
          postBlockedCustomers,
          getBlockedCustomers,
          values
        )
      default:
        return null
    }
  }

  reportRequest(values): OperationsReportRequest {
    const { fromDate, toDate, branches, loanType } = values
    return {
      startDate: fromDate,
      endDate: toDate,
      branches,
      type: loanType,
    }
  }

  async fetchLoansBriefing(values) {
    const res = await fetchLoansBriefingReport(this.reportRequest(values))
    this.handleFetchReport(res, Reports.LoansBriefing2)
  }

  async fetchInstallmentsDuePerOfficerCustomerCard(values) {
    const request: InstallmentsDuePerOfficerCustomerCardRequest = {
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches,
      representatives: values.representatives,
      type: values.loanType,
    }
    const res = await installmentsDuePerOfficerCustomerCard(request)
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.InstallmentsDuePerOfficerCustomerCard
    )
  }

  async fetchUnpaidInstallmentsByOfficer(values) {
    const request: UnpaidInstallmentsByOfficerRequest = {
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches,
      representatives: values.representatives,
      creationDateFrom: values.creationDateFrom,
      creationDateTo: values.creationDateTo,
      type: values.loanType,
    }

    const res = await unpaidInstallmentsByOfficer(request)
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.UnpaidInstallmentsByOfficer
    )
  }

  async fetchUnpaidInstallments(values) {
    const res = await fetchUnpaidInstallmentsPerAreaReport({
      ...this.reportRequest(values),
      geoAreas: values.geoAreas as string[],
    })
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.UnpaidInstallmentsPerArea
    )
  }

  async fetchOfficersPercentPayment(values) {
    const {
      fromDate,
      toDate,
      branches,
      representatives,
      gracePeriod,
      loanType,
    } = values
    const request: OfficersPercentPaymentRequest = {
      startDate: fromDate,
      endDate: toDate,
      branches,
      representatives,
      gracePeriod,
      type: loanType,
    }
    const res = await fetchOfficersPercentPaymentReport({ ...request })
    this.handleFetchReport(res, Reports.OfficersPercentPayment)
  }

  async fetchOfficersBranchPercentPayment(values) {
    const request: OfficersBranchPercentPaymentRequest = {
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches,
      representatives: values.representatives,
      gracePeriod: values.gracePeriod,
      creationDateFrom: values.creationDateFrom,
      creationDateTo: values.creationDateTo,
      type: values.loanType,
    }

    const res = await fetchOfficersBranchPercentPaymentReport(request)
    this.handleFetchReport(res, Reports.OfficersBranchPercentPayment)
  }

  async fetchDueInstallments(values) {
    const res = await fetchDueInstallmentsReport(this.reportRequest(values))
    this.handleFetchReport(res, Reports.DueInstallments)
  }

  async fetchLeakedCustomers(values) {
    const { loanOfficerIds } = values
    const res = await fetchLeakedCustomersReport({
      ...this.reportRequest(values),
      loanOfficerIds,
    } as LeakedCustomersReportRequest)
    this.handleFetchReport(res, Reports.LeakedCustomers)
  }

  async fetchPaidArrears(values) {
    const { fromDate, toDate, branches, loanOfficerIds, loanType } = values
    const res = await fetchPaidArrearsReport({
      startDate: fromDate,
      endDate: toDate,
      branches,
      loanOfficerIds,
      type: loanType,
    } as PaidArrearsRequest)
    this.handleFetchReport(res, Reports.PaidArrears)
  }

  async fetchCustomersArrears(values) {
    const { date, branches, loanOfficers, loanType } = values
    const res = await fetchCustomersArrearsReport({
      date,
      branches,
      loanOfficers,
      type: loanType,
    } as CustomersArrearsRequest)
    this.handleFetchReport(res, Reports.CustomersArrears)
  }

  async fetchMonthComparison(values) {
    // get timestamp in UTC
    const res = await fetchMonthComparisonReport({
      startDate: new Date(new Date(values.fromDate).toUTCString()).setUTCHours(
        0,
        0,
        0,
        0
      ),
      endDate: new Date(new Date(values.toDate).toUTCString()).setUTCHours(
        23,
        59,
        59,
        999
      ),
      branches: values.branches,
      type: values.loanType,
    })
    this.handleFetchReport(res, Reports.MonthComparison)
  }

  async fetchActiveWalletIndividual(values) {
    const { date, branches, loanOfficerIds, loanType } = values
    const res = await fetchActiveWalletIndividualReport({
      date,
      branches,
      loanOfficerIds,
      type: loanType,
    } as ActiveWalletRequest)
    this.handleFetchReport(res, Reports.ActiveWalletIndividual)
  }

  async fetchActiveWalletGroup(values) {
    const { date, branches, loanOfficerIds } = values
    const res = await fetchActiveWalletGroupReport({
      date,
      branches,
      loanOfficerIds,
      type: 'all',
    } as ActiveWalletRequest)
    this.handleFetchReport(res, Reports.ActiveWalletGroup)
  }

  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <div className="d-flex">
                <Card.Title className="mr-5">
                  {local.operationsReports}
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
            getExcel={(vales) => this.getExcel(vales)}
            disableExcel={
              !['blockedCustomers'].includes(this.state.selectedPdf.key || '')
            }
          />
        )}
        {this.state.print === Reports.LoansBriefing2 && this.state.data && (
          <LoansBriefing2Pdf
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.InstallmentsDuePerOfficerCustomerCard &&
          this.state.data && (
            <InstallmentsDuePerOfficerCustomerCardPdf
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.UnpaidInstallmentsByOfficer &&
          this.state.data && (
            <UnpaidInstallmentsByOfficerPdf
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.UnpaidInstallmentsPerArea &&
          this.state.data && (
            <UnpaidInst
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.OfficersPercentPayment &&
          this.state.data && (
            <OfficersPercentPaymentPdf
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.OfficersBranchPercentPayment &&
          this.state.data && (
            <OfficerBranchPercentPayment
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.DueInstallments && this.state.data && (
          <DueInstallmentsPdf
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.LeakedCustomers && this.state.data && (
          <LeakedCustomersPDF
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.CustomersArrears && this.state.data && (
          <CustomersArrearsPdf data={this.state.data} date={this.state.date} />
        )}
        {this.state.print === Reports.PaidArrears && this.state.data && (
          <PaidArrearsPdf
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.MonthComparison && this.state.data && (
          <MonthComparisonPdf
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.ActiveWalletIndividual &&
          this.state.data && (
            <ActiveWalletIndividualPdf
              date={this.state.date}
              data={this.state.data}
            />
          )}
        {this.state.print === Reports.ActiveWalletGroup && this.state.data && (
          <ActiveWalletGroupPdf date={this.state.date} data={this.state.data} />
        )}
      </>
    )
  }
}

export default OperationsReports
