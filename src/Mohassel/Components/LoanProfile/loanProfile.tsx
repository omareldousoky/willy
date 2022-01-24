/* eslint-disable prefer-destructuring */
import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as Barcode from 'react-barcode'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import { getCookie } from 'Shared/Services/getCookie'

import { getRollableActionsById } from 'Shared/Services/APIs/loanApplication/rollBack'
import ReturnItemModal from 'Shared/Components/LoanApplication/ReturnItemModal'
import { doneSuccessfully } from 'Shared/localUtils'
import { returnItem } from 'Shared/Services/APIs/loanApplication/returnItemCF'
import { UploadDocuments } from 'Shared/Components/UploadDocument'
import { getApplication } from 'Shared/Services/APIs/loanApplication/getApplication'
import {
  BranchDetails,
  BranchDetailsResponse,
  getBranch,
} from 'Shared/Services/APIs/Branch/getBranch'
import local from 'Shared/Assets/ar.json'
import { Loader } from 'Shared/Components/Loader'
import { CardNavBar, Tab } from 'Shared/Components/HeaderWithCards/cardNavbar'
import EarlyPaymentPDF from 'Shared/Components/pdfTemplates/Financial/earlyPayment/earlyPayment'
import { PendingActions } from 'Shared/Services/interfaces'
import {
  iscoreDate,
  getErrorMessage,
  statusLocale,
  timeToDateyyymmdd,
} from 'Shared/Services/utils'
import { payment } from 'Shared/redux/payment/actions'
import { cancelApplication } from 'Shared/Services/APIs/loanApplication/stateHandler'
import store from 'Shared/redux/store'
import PaymentReceipt from 'Shared/Components/pdfTemplates/Financial/paymentReceipt'
import RandomPaymentReceipt from 'Shared/Components/pdfTemplates/Financial/randomPaymentReceipt/randomPaymentReceipt'
import { calculatePenalties } from 'Shared/Services/APIs/clearance/calculatePenalties'
import { remainingLoan } from 'Shared/Services/APIs/Loan/remainingLoan'
import { InfoBox, LtsIcon, ProfileActions } from 'Shared/Components'
import {
  getCompanyInfo,
  getCustomerInfo,
} from 'Shared/Services/formatCustomersInfo'
import { FieldProps } from 'Shared/Components/Profile/types'
import {
  CalculateEarlyPaymentResponse,
  RemainingLoanResponse,
} from 'Shared/Models/Payment'
import {
  getIscore,
  getIscoreCached,
  getSMECachedIscore,
  getSMEIscore,
} from 'Shared/Services/APIs/iScore'
import { getGeoAreasByBranch } from 'Shared/Services/APIs/geoAreas/getGeoAreas'
import { getWriteOffReasons } from 'Shared/Services/APIs/config'
import { getLoanUsage } from 'Shared/Services/APIs/LoanUsage/getLoanUsage'
import { getEarlyPaymentPdfData } from 'Shared/Utils/payment'
import EarlyPaymentReceipt from 'Shared/Components/pdfTemplates/Financial/earlyPaymentReceipt/earlyPaymentReceipt'
import { Score, Customer } from 'Shared/Models/Customer'
import { getPendingActions } from '../../Services/APIs/Loan/getPendingActions'
import { approveManualPayment } from '../../Services/APIs/Loan/approveManualPayment'
import Payment from '../Payment/payment'
import Logs from './applicationLogs'
import { LoanDetailsTableView } from './applicationsDetails'
import { GuarantorTableView } from './guarantorDetails'
import { CustomerCardView } from './customerCard'
import Rescheduling from '../Rescheduling/rescheduling'
import ability from '../../config/ability'
import CustomerCardPDF from '../pdfTemplates/customerCard/customerCard'
import CashReceiptPDF from '../pdfTemplates/cashReceipt/cashReceipt'
import CustomerCardAttachments from '../pdfTemplates/customerCardAttachments/customerCardAttachments'
import FollowUpStatementPDF from '../pdfTemplates/followUpStatment/followUpStatement'
import LoanContract from '../pdfTemplates/loanContract/loanContract'
import LoanContractForGroup from '../pdfTemplates/loanContractForGroup/loanContractForGroup'
import Can from '../../config/Can'
import { rejectManualPayment } from '../../Services/APIs/Loan/rejectManualPayment'
import { writeOffLoan } from '../../Services/APIs/Loan/writeOffLoan'
import { doubtLoan } from '../../Services/APIs/Loan/doubtLoan'
import ManualRandomPaymentsActions from './manualRandomPaymentsActions'
import { getManualOtherPayments } from '../../Services/APIs/Payment/getManualOtherPayments'
import { rejectManualOtherPayment } from '../../Services/APIs/Payment/rejectManualOtherPayment'
import { approveManualOtherPayment } from '../../Services/APIs/Payment/approveManualOtherPayment'
import { numTo2Decimal } from '../CIB/textFiles'
import { FollowUpStatementView } from './followupStatementView'
import { getGroupMemberShares } from '../../Services/APIs/Loan/groupMemberShares'

import {
  AcknowledgmentAndPledge,
  AcknowledgmentOfCommitment,
  AcknowledgmentWasSignedInFront,
  AuthorizationToFillCheck,
  AuthorizationToFillInfo,
  KnowYourCustomer,
  PromissoryNote,
  SmeLoanContract,
  SolidarityGuarantee,
} from '../pdfTemplates/smeLoanContract'
import NanoLoanContract from '../pdfTemplates/nanoLoanContract/nanoLoanContract'
import { PromissoryNoteMicro } from '../pdfTemplates/PromissoryNoteMicro/promissoryNoteMicro'
import LoanProfileComments from './loanProfileComments'

export interface IndividualWithInstallments {
  installmentTable: {
    id: number
    installmentResponse: number
    dateOfPayment: number
  }[]
  customerTable?: {
    amount: number
    installmentAmount: number
    customer: Customer
    type: string
  }[]
  rescheduled?: boolean
}

interface State {
  application: any
  activeTab: string
  tabsArray: Array<Tab>
  loading: boolean
  print: string
  earlyPaymentData?: CalculateEarlyPaymentResponse
  pendingActions: PendingActions
  manualPaymentEditId: string
  branchDetails: BranchDetails
  receiptData: any
  iscores: any
  penalty: number
  randomPendingActions: Array<any>
  geoAreas: Array<any>
  remainingTotal: number
  remainingLoan?: RemainingLoanResponse
  individualsWithInstallments: IndividualWithInstallments
  loanUsage: string
  canReturnItem?: boolean
  returnItemModalOpen: boolean
}

interface LoanProfileRouteState {
  id: string
  action?: string
  type?: string
  status?: string
  sme?: boolean
}

interface Props extends RouteComponentProps<{}, {}, LoanProfileRouteState> {
  changePaymentState: (data) => void
}

class LoanProfile extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      application: {},
      activeTab: 'loanDetails',
      tabsArray: [],
      loading: false,
      print: '',
      pendingActions: {},
      manualPaymentEditId: '',
      receiptData: {},
      iscores: [],
      penalty: 0,
      randomPendingActions: [],
      geoAreas: [],
      remainingTotal: 0,
      individualsWithInstallments: {
        installmentTable: [],
      },
      loanUsage: '',
      branchDetails: {
        branchCode: 0,
        _id: '',
        status: '',
      },
      returnItemModalOpen: false,
    }
  }

  componentDidMount() {
    const appId = this.props.location.state.id
    this.getAppByID(appId)
  }

  async getLoanUsages() {
    this.setState({ loading: true })
    const res = await getLoanUsage()
    if (res.status === 'success') {
      const uses = res.body.usages
      const value = uses.find((use) => use.id === this.state.application.usage)
        ?.name
      this.setState({ loanUsage: value, loading: false })
      return value
    }
    Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    this.setState({ loading: false })
    return ''
  }

  async getManualOtherPayments(appId) {
    if (ability.can('pendingAction', 'application')) {
      this.setState({ loading: true })
      const res = await getManualOtherPayments(appId)
      if (res.status === 'success') {
        this.setState({
          randomPendingActions: res.body.pendingActions
            ? res.body.pendingActions
            : [],
          loading: false,
        })
      } else {
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    }
  }

  async getAppRollableActionsByID(id) {
    const actions = await getRollableActionsById(id)
    if (actions.status === 'success') {
      this.setState({ canReturnItem: Object.keys(actions.body).length === 0 })
    } else {
      this.setState({ canReturnItem: true })
    }
  }

  async getAppByID(id) {
    await this.getMembersShare(id)
    this.setState({
      loading: true,
      activeTab: 'loanDetails',
      manualPaymentEditId: '',
    })
    const application = await getApplication(id)
    this.getBranchData(application.body.branchId)
    if (
      application.body.status === 'paid' ||
      application.body.status === 'pending' ||
      application.body.status === 'canceled' ||
      application.body.status === 'issued'
    )
      this.getManualOtherPayments(id)
    if (application.status === 'success') {
      if (store.getState().auth.clientPermissions === {}) {
        store.subscribe(() => {
          this.setTabsToRender(application)
        })
      } else this.setTabsToRender(application)
      if (ability.can('viewIscore', 'customer'))
        this.getCachediScores(application.body)
      if (
        application.body.status === 'issued' &&
        application.body.product.type === 'consumerFinance' &&
        ability.can('returnCFItem', 'cfApplication')
      )
        this.getAppRollableActionsByID(application.body._id)
      else this.setState({ canReturnItem: false })
      await this.getLoanUsages()
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(application.error.error), 'error')
      )
    }
    if (
      application.body.status === 'pending' ||
      application.body.status === 'issued' ||
      application.body.status === 'created'
    ) {
      const customerId =
        application.body.product.beneficiaryType === 'group'
          ? application.body?.group?.individualsInGroup[0]?.customer?._id
          : application.body.customer._id
      const remainingLoanRes = await this.getRemainingLoan(
        customerId,
        application.body.status
      )
      if (remainingLoanRes) {
        this.setState({ remainingLoan: remainingLoanRes })
      }
    }
  }

  async getRemainingLoan(id: string, status: string) {
    if (
      status === 'pending' ||
      status === 'issued' ||
      (status === 'created' && id)
    ) {
      const res = await remainingLoan(id)
      if (res.status === 'success') {
        return res.body
      }
      return undefined
    }
    return undefined
  }

  async getCachedIndividualIScores(obj) {
    this.setState({ loading: true })
    const iScores = await getIscoreCached(obj)
    if (iScores.status === 'success') {
      this.setState({ loading: false })
      return iScores.body.data
    }
    this.setState({ loading: false }, () =>
      Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error')
    )
    return []
  }

  async getCachedSMEiScores(obj) {
    this.setState({ loading: true })
    const iScores = await getSMECachedIscore(obj)
    if (iScores.status === 'success') {
      this.setState({ loading: false })
      return iScores.body.data
    }
    this.setState({ loading: false }, () =>
      Swal.fire('Error !', getErrorMessage(iScores.error.error), 'error')
    )
    return []
  }

  async getCachediScores(application) {
    const ids: string[] = []
    const cbeCodes: string[] = []
    const entitledToSign = application.entitledToSign?.map(
      this.mapEntitledToSignToCustomer
    )

    if (application.product.beneficiaryType === 'group') {
      application.group.individualsInGroup.forEach((member) =>
        ids.push(member.customer.nationalId)
      )
    } else {
      if (application.guarantors.length > 0) {
        application.guarantors.forEach((guar) =>
          guar.customerType === 'company'
            ? guar.cbeCode && cbeCodes.push(guar.cbeCode)
            : ids.push(guar.nationalId)
        )
      }
      if (entitledToSign && entitledToSign.length > 0) {
        entitledToSign.forEach((cust) => ids.push(cust.nationalId))
      }
      application.customer.customerType === 'company'
        ? application.customer.cbeCode &&
          cbeCodes.push(application.customer.cbeCode)
        : ids.push(application.customer.nationalId)
    }
    const obj: { nationalIds: string[]; date?: Date } = {
      nationalIds: ids,
    }
    const smeObj: { ids: string[]; date?: Date } = {
      ids: cbeCodes,
    }
    if (
      [
        'approved',
        'created',
        'issued',
        'rejected',
        'paid',
        'pending',
        'canceled',
      ].includes(this.state.application.status)
    ) {
      obj.date =
        this.state.application.status === 'approved'
          ? this.state.application.approvalDate
          : this.state.application.status === 'created'
          ? this.state.application.creationDate
          : ['issued', 'pending'].includes(this.state.application.status)
          ? this.state.application.issueDate
          : this.state.application.status === 'rejected'
          ? this.state.application.rejectionDate
          : ['paid', 'canceled'].includes(this.state.application.status)
          ? this.state.application.updated.at
          : 0
      // paid & canceled => updated.at, pending,issued =>issuedDate
      smeObj.date = obj.date
    }
    let iscores: Array<Score> = []
    if (obj.nationalIds.length > 0)
      iscores = await this.getCachedIndividualIScores(obj)
    if (smeObj.ids.length > 0) {
      const smeScores: Array<Score> = await this.getCachedSMEiScores(smeObj)
      iscores.push(...smeScores)
    }
    this.setState({ iscores })
  }

  setTabsToRender(application) {
    const tabsToRender = [
      {
        header: local.loanInfo,
        stringKey: 'loanDetails',
      },
      {
        header: local.documents,
        stringKey: 'documents',
      },
      {
        header: local.comments,
        stringKey: 'comments',
      },
    ]
    const guarantorsTab = {
      header: local.guarantorInfo,
      stringKey: 'loanGuarantors',
    }
    const customerCardTab = {
      header: local.customerCard,
      stringKey: 'customerCard',
    }
    const followUpStatementTab = {
      header: local.followUpStatement,
      stringKey: 'followUpStatement',
      permission: 'followUpStatement',
      permissionKey: 'application',
    }
    const paymentTab = {
      header: local.payments,
      stringKey: 'loanPayments',
      permission: ['payInstallment', 'payEarly', 'payByInsurance'],
      permissionKey: 'application',
    }
    const reschedulingTab = {
      header: local.rescheduling,
      stringKey: 'loanRescheduling',
      permission: [
        'pushInstallment',
        'traditionRescheduling',
        'freeRescheduling',
      ],
      permissionKey: 'application',
    }
    const financialTransactionsTab = {
      header: local.financialTransactions,
      stringKey: 'financialTransactions',
      permission: 'payInstallment',
      permissionKey: 'application',
    }
    const penaltiesTab = {
      header: local.penalties,
      stringKey: 'penalties',
      permission: ['payInstallment', 'cancelPenalty'],
      permissionKey: 'application',
    }
    const logsTab = {
      header: local.logs,
      stringKey: 'loanLogs',
      permission: 'viewActionLogs',
      permissionKey: 'user',
    }
    const entitledToSignTab = {
      header: local.SMEviceCustomersInfo,
      stringKey: 'entitledToSign',
    }
    if (application.body.product.beneficiaryType === 'individual')
      tabsToRender.push(guarantorsTab)
    if (
      application.body.product.type === 'sme' ||
      (application.body.product.type === 'consumerFinance' &&
        application.body.customer.customerType === 'company')
    )
      tabsToRender.push(entitledToSignTab)
    if (application.body.status === 'paid') tabsToRender.push(customerCardTab)
    if (
      application.body.status === 'issued' ||
      application.body.status === 'pending'
    ) {
      tabsToRender.push(customerCardTab)
      tabsToRender.push(reschedulingTab)
      tabsToRender.push(paymentTab)
    }
    if (
      (application.body.status === 'issued' ||
        application.body.status === 'pending') &&
      !this.state.individualsWithInstallments.rescheduled
    ) {
      tabsToRender.push(followUpStatementTab)
    }
    if (
      application.body.status === 'issued' ||
      application.body.status === 'paid' ||
      application.body.status === 'pending'
    ) {
      tabsToRender.push(financialTransactionsTab)
      tabsToRender.push(penaltiesTab)
    }

    if (application.body.status === 'pending') {
      this.setState({ activeTab: 'loanDetails' })
      this.getPendingActions()
    }
    if (application.body.status === 'canceled') {
      tabsToRender.push(financialTransactionsTab)
    }
    tabsToRender.push(logsTab)
    this.getGeoAreas(application.body.branchId)
    this.setState({
      application: application.body,
      tabsArray: tabsToRender,
      loading: false,
    })
  }

  async getGeoAreas(branch) {
    this.setState({ loading: true })
    const resGeo = await getGeoAreasByBranch(branch)
    if (resGeo.status === 'success') {
      this.setState({ loading: false, geoAreas: resGeo.body.data })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(resGeo.error.error), 'error')
      )
  }

  getCustomerGeoArea(geoArea) {
    const geoAreaObject = this.state.geoAreas.filter(
      (area) => area._id === geoArea
    )
    if (geoAreaObject.length === 1) {
      return geoAreaObject[0]
    }
    return { name: '-', active: false }
  }

  async getPendingActions() {
    this.setState({ loading: true })
    const res = await getPendingActions(this.props.location.state.id)
    if (res.status === 'success') {
      this.setState({ loading: false, pendingActions: res.body })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  async getBranchData(branchId: string) {
    const res = await getBranch(branchId)
    if (res.status === 'success') {
      this.setState({
        branchDetails: (res.body as BranchDetailsResponse)?.data,
      })
    } else {
      const err = res.error as Record<string, string>
      Swal.fire('Error !', getErrorMessage(err.error), 'error')
    }
  }

  getProfileActions = () => {
    return [
      {
        icon: 'deactivate-doc',
        title: local.memberSeperation,
        permission:
          this.state.application.status === 'issued' &&
          !this.state.application.isDoubtful &&
          this.state.application.group.individualsInGroup &&
          this.state.application.group.individualsInGroup.length > 1 &&
          !this.state.application.writeOff &&
          ability.can('splitFromGroup', 'application'),
        onActionClick: () =>
          this.props.history.push('/track-loan-applications/remove-member', {
            id: this.props.location.state.id,
            sme: this.props.location.state?.sme,
          }),
      },
      {
        icon: 'download',
        title: local.downloadPDF,
        permission:
          this.state.application.status === 'created' &&
          ability.can('createLoan', 'application'),
        onActionClick: () => {
          this.setState(
            (prevState) => ({
              print:
                prevState.application.customer.customerType === 'company'
                  ? 'allSME'
                  : 'all',
            }),
            () => window.print()
          )
        },
      },
      {
        icon: 'edit',
        title: local.editLoan,
        permission:
          this.state.application.status === 'underReview' &&
          JSON.parse(getCookie('ltsbranch'))._id !== 'hq' &&
          ability.can('assignProductToCustomer', 'application'),
        onActionClick: () =>
          this.props.history.push(
            '/track-loan-applications/edit-loan-application',
            {
              id: this.props.location.state.id,
              action: 'edit',
              sme: this.props.location.state?.sme,
            }
          ),
      },
      {
        icon: 'bulk-loan-applications-review',
        title: local.reviewLoan,
        permission:
          this.state.application.status === 'underReview' &&
          ability.can('reviewLoanApplication', 'application'),
        onActionClick: () =>
          this.props.history.push(
            '/track-loan-applications/loan-status-change',
            {
              id: this.props.location.state.id,
              action: 'review',
              sme: this.props.location.state?.sme,
            }
          ),
      },
      {
        icon: 'bulk-loan-applications-review',
        title: local.undoLoanReview,
        permission:
          this.state.application.status === 'reviewed' &&
          ability.can('rollback', 'application'),
        onActionClick: () =>
          this.props.history.push(
            '/track-loan-applications/loan-status-change',
            {
              id: this.props.location.state.id,
              action: 'unreview',
              sme: this.props.location.state?.sme,
            }
          ),
      },
      {
        icon: 'deactivate-doc',
        title: local.rejectLoan,
        permission:
          this.state.application.status === 'reviewed' &&
          ability.can('rejectLoanApplication', 'application'),
        onActionClick: () =>
          this.props.history.push(
            '/track-loan-applications/loan-status-change',
            {
              id: this.props.location.state.id,
              action: 'reject',
              sme: this.props.location.state?.sme,
            }
          ),
      },
      {
        icon: 'applications',
        title: local.issueLoan,
        permission:
          this.state.application.status === 'created' &&
          ability.can('issueLoan', 'application'),
        onActionClick: () =>
          this.props.history.push('/track-loan-applications/create-loan', {
            id: this.props.location.state.id,
            type: 'issue',
            sme: this.props.location.state?.sme,
          }),
      },
      {
        icon: 'applications',
        title: local.createLoan,
        permission:
          this.state.application.status === 'approved' &&
          ability.can('createLoan', 'application'),
        onActionClick: () =>
          this.props.history.push('/track-loan-applications/create-loan', {
            id: this.props.location.state.id,
            type: 'create',
            sme: this.props.location.state?.sme,
          }),
      },
      {
        icon: 'close',
        title: local.cancel,
        permission:
          this.state.application.status === 'underReview' &&
          ability.can('cancelApplication', 'application'),
        onActionClick: () => this.cancelApplication(),
      },
      {
        icon: 'reschedule',
        title: local.rollBackAction,
        permission:
          (ability.can('rollback', 'application') ||
            ability.can('rollbackCancelPenalities', 'application') ||
            ability.can('rollbackPayment', 'application') ||
            ability.can('rollbackIssueLoan', 'application')) &&
          !['reviewed', 'underReview'].includes(this.state.application.status),
        onActionClick: () =>
          this.props.history.push('/track-loan-applications/loan-roll-back', {
            id: this.props.location.state.id,
            status: this.state.application.status,
            sme: this.props.location.state?.sme,
          }),
      },
      {
        icon: 'rollback',
        title: local.returnItem,
        permission: !!this.state.canReturnItem,
        onActionClick: () => this.setState({ returnItemModalOpen: true }),
        isLoading: this.state.canReturnItem === undefined,
      },
      {
        icon: 'close',
        title: local.writeOffLoan,
        permission:
          this.state.application.status === 'issued' &&
          this.state.application.isDoubtful &&
          !this.state.application.writeOff &&
          ability.can('writeOff', 'application'),
        onActionClick: () => this.writeOffApplication(),
      },
      {
        icon: 'minus',
        title: local.doubtLoan,
        permission:
          this.state.application.status === 'issued' &&
          !this.state.application.isDoubtful &&
          !this.state.application.writeOff &&
          ability.can('setDoubtfulLoan', 'application'),
        onActionClick: () => this.doubtApplication(),
      },
    ]
  }

  getInfo = (): FieldProps[][] => {
    if (
      this.state.application.product?.beneficiaryType === 'individual' &&
      this.state.application.customer
    ) {
      if (this.state.application.customer?.customerType === 'company') {
        const smeScore = this.state.iscores.filter(
          (score) => score.id === this.state.application.customer.cbeCode
        )[0]
        const info: FieldProps[] = getCompanyInfo({
          company: this.state.application.customer,
          score: smeScore,
          getIscore: (data) => this.getIscore(data),
          applicationStatus: this.state.application.status,
        })
        return [info]
      }
      const customerScore = this.state.iscores.filter(
        (score) =>
          score.nationalId === this.state.application.customer.nationalId
      )[0]
      const info: FieldProps[] = getCustomerInfo({
        customerDetails: this.state.application.customer,
        score: customerScore,
        isLeader: false,
        getIscore: (data) => this.getIscore(data),
        applicationStatus: this.state.application.status,
        productType: this.state.application.product.type,
      })
      return [info]
    }
    if (this.state.application.product?.beneficiaryType === 'group') {
      const groupMainInfo = this.state.application.group.individualsInGroup.map(
        (individual) => {
          const customerScore = this.state.iscores.filter(
            (score) => score.nationalId === individual.customer.nationalId
          )[0]
          return getCustomerInfo({
            customerDetails: individual.customer,
            score: customerScore,
            isLeader: individual.type === 'leader',
            getIscore: (data) => this.getIscore(data),
            applicationStatus: this.state.application.status,
          })
        }
      )
      return groupMainInfo
    }
    return []
  }

  async getIscore(data) {
    this.setState({ loading: true })
    const obj =
      data.customerType === 'company'
        ? {
            productId: '104',
            amount: `${this.state.application.principal}`,
            name: `${data.businessName}`,
            idSource: '031',
            idValue: `${data.cbeCode}`,
          }
        : {
            requestNumber: '148',
            reportId: '3004',
            product: '023',
            loanAccountNumber: `${data.key}`,
            number: '1703943',
            date: '02/12/2014',
            amount: `${this.state.application.principal}`,
            lastName: `${data.customerName}`,
            idSource: '003',
            idValue: `${data.nationalId}`,
            gender: data.gender === 'male' ? '001' : '002',
            dateOfBirth: iscoreDate(data.birthDate),
          }
    const iScore =
      data.customerType === 'company'
        ? await getSMEIscore(obj)
        : await getIscore(obj)
    if (iScore.status === 'success') {
      this.getCachediScores(this.state.application)
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(iScore.error.error), 'error')
      )
    }
  }

  getSumOfPendingActions() {
    let sum = 0
    this.state.pendingActions.transactions?.forEach((transaction) => {
      sum += transaction.transactionAmount
    })
    return numTo2Decimal(sum)
  }

  async getMembersShare(id: string) {
    this.setState({ loading: true })
    const res = await getGroupMemberShares(id)
    if (res.status === 'success') {
      this.setState({ loading: false, individualsWithInstallments: res.body })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  async getWriteOffReasons() {
    this.setState({ loading: true })
    const res = await getWriteOffReasons()
    if (res.status === 'success') {
      this.setState({ loading: false })
      const options = {}
      if (
        this.state.application.group.individualsInGroup !== null &&
        this.state.application.group.individualsInGroup.length > 1
      ) {
        res.body.reasons
          .filter((reason) => reason.name !== 'Deceased')
          .map((option) => {
            options[option.name] = local[option.name.replace(/\s/g, '')]
          })
      } else {
        res.body.reasons.map((option) => {
          options[option.name] = local[option.name.replace(/\s/g, '')]
        })
      }
      return options
    }
    this.setState({ loading: false }, () =>
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    )
    return {}
  }

  mapEntitledToSignToCustomer({
    customer,
    position,
  }: {
    customer: Customer
    position: string
  }) {
    return {
      ...customer,
      position,
    }
  }

  async writeOffApplication() {
    const options = await this.getWriteOffReasons()
    const { value: text } = await Swal.fire({
      title: local.writeOffReason,
      input: 'select',
      inputOptions: options,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.writeOffLoan,
      cancelButtonText: local.cancel,
      inputValidator: (value) => {
        if (!value) {
          return local.required
        }
        return ''
      },
    })
    if (text) {
      Swal.fire({
        title: local.areYouSure,
        text: `${local.loanWillBeWrittenOff}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.writeOffLoan,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        const appId = this.props.location.state.id
        if (result.value) {
          this.setState({ loading: true })
          const res = await writeOffLoan(appId, {
            writeOffReason: text,
          })
          if (res.status === 'success') {
            this.setState({ loading: false })
            Swal.fire('', local.loanWriteOffSuccess, 'success').then(() =>
              this.getAppByID(appId)
            )
          } else {
            this.setState({ loading: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        }
      })
    }
  }

  cancelApplication() {
    Swal.fire({
      title: local.areYouSure,
      text: `${local.applicationWillBeCancelled}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.cancelApplication,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      const appId = this.props.location.state.id
      if (result.value) {
        this.setState({ loading: true })
        const res = await cancelApplication(appId)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire('', local.applicationCancelSuccess, 'success').then(() =>
            this.getAppByID(appId)
          )
        } else {
          this.setState({ loading: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      }
    })
  }

  editManualPayment(randomPendingActionId: string) {
    this.props.changePaymentState(3)
    window.scrollTo(0, document.body.scrollHeight)
    if (randomPendingActionId !== '') {
      this.setState((prevState) => {
        const pendingAction = prevState.randomPendingActions.find(
          (el) => el._id === randomPendingActionId
        )
        const tab =
          pendingAction.transactions[0].action === 'penalty'
            ? 'penalties'
            : 'financialTransactions'
        return {
          activeTab: tab,
          manualPaymentEditId: pendingAction._id,
        }
      })
    } else {
      this.setState((prevState) => ({
        activeTab: 'loanPayments',
        manualPaymentEditId: prevState.pendingActions?._id || '',
      }))
    }
  }

  async approveManualPayment(randomPendingActionId: string) {
    let receiptNumber = 0
    let truthDate = 0
    let actualDate = 0
    let transactionAmount = 0
    if (randomPendingActionId !== '') {
      const pendingAction = this.state.randomPendingActions.find(
        (el) => el._id === randomPendingActionId
      )
      receiptNumber = pendingAction.receiptNumber
      truthDate = pendingAction.transactions[0].truthDate
      actualDate = pendingAction.transactions[0].actualDate
      transactionAmount = pendingAction.transactions[0].transactionAmount
    } else {
      receiptNumber = Number(this.state.pendingActions.receiptNumber)
      truthDate = this.state.pendingActions.transactions
        ? this.state.pendingActions.transactions[0].truthDate
        : 0
      actualDate = this.state.pendingActions.transactions
        ? this.state.pendingActions.transactions[0].actualDate
        : 0
      transactionAmount = Number(this.getSumOfPendingActions())
    }
    const table = document.createElement('table')
    table.className = 'swal-table'
    table.innerHTML = `<thead><tr><th>${local.receiptNumber}</th><th>${
      local.truthDate
    }</th><th>${local.dueDate}</th><th>${local.amount}</th>
                            </thead>
                            <tbody><tr><td>${receiptNumber}</td>
                            <td>${timeToDateyyymmdd(truthDate)}</td>
                            <td>${timeToDateyyymmdd(actualDate)}</td>
                            <td>${transactionAmount}</td></tr></tbody>`
    Swal.fire({
      width: 700,
      title: local.installmentPaymentConfirmation,
      html: table,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: local.confirmPayment,
      cancelButtonText: local.cancel,
      confirmButtonColor: '#7dc356',
      cancelButtonColor: '#d33',
    }).then(async (isConfirm) => {
      if (isConfirm.value) {
        this.setState({ loading: true })
        const res =
          randomPendingActionId !== ''
            ? await approveManualOtherPayment(randomPendingActionId)
            : await approveManualPayment(this.props.location.state.id)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire('', local.manualPaymentApproveSuccess, 'success').then(() =>
            this.getAppByID(this.props.location.state.id)
          )
        } else {
          this.setState({ loading: false }, () =>
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
          )
        }
      }
    })
  }

  async calculatePenalties() {
    this.setState({ loading: true })
    const res = await calculatePenalties({
      id: this.state.application._id,
      truthDate: new Date().getTime(),
    })
    if (res.body) {
      this.setState({ penalty: res.body.penalty, loading: false })
    } else
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
  }

  async rejectManualPayment(randomPendingActionId: string) {
    this.setState({ loading: true })
    if (randomPendingActionId !== '') {
      const res = await rejectManualOtherPayment(randomPendingActionId)
      if (res.status === 'success') {
        this.setState((prevState) => ({
          loading: false,
          randomPendingActions: prevState.randomPendingActions.filter(
            (el) => el._id !== randomPendingActionId
          ),
        }))
        Swal.fire('', local.rejectManualPaymentSuccess, 'success').then(() =>
          this.getManualOtherPayments(this.props.location.state.id)
        )
      } else
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
    } else {
      const res = await rejectManualPayment(this.props.location.state.id)
      if (res.status === 'success') {
        this.setState({ loading: false, pendingActions: {} })
        Swal.fire('', local.rejectManualPaymentSuccess, 'success').then(() =>
          this.getAppByID(this.props.location.state.id)
        )
      } else
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
    }
  }

  async doubtApplication() {
    const { value: text } = await Swal.fire({
      title: local.doubtReason,
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.doubtLoan,
      cancelButtonText: local.cancel,
      inputValidator: (value) => {
        if (!value) {
          return local.required
        }
        return ''
      },
    })
    if (text) {
      Swal.fire({
        title: local.areYouSure,
        text: `${local.loanWillBeDoubted}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.doubtLoan,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        const appId = this.props.location.state.id
        if (result.value) {
          this.setState({ loading: true })
          const res = await doubtLoan(appId, {
            doubtReason: text,
          })
          if (res.status === 'success') {
            this.setState({ loading: false })
            Swal.fire('', local.loanDoubtSuccess, 'success').then(() =>
              this.getAppByID(appId)
            )
          } else {
            this.setState({ loading: false }, () =>
              Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
            )
          }
        }
      })
    }
  }

  successHandler(successMsg: string, callback?: () => void) {
    this.setState({ loading: false })
    Swal.fire('', successMsg, 'success').then(() =>
      callback ? callback() : undefined
    )
  }

  failureHandler(res: any) {
    this.setState({ loading: false }, () =>
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    )
  }

  async returnItem(date) {
    const truthDate = new Date(date).setHours(23, 59, 59, 999).valueOf()
    this.setState({ returnItemModalOpen: false })
    await Swal.fire({
      title: local.areYouSure,
      text: local.returnItem,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7dc356',
      cancelButtonColor: '#6c757d',
      confirmButtonText: local.returnItem,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      const appId = this.props.location.state.id
      if (result.value) {
        this.setState({ loading: true })
        const res = await returnItem(appId, truthDate)
        if (res.status === 'success') {
          this.successHandler(doneSuccessfully('returnItem'), () =>
            this.getAppByID(appId)
          )
        } else {
          this.failureHandler(res)
        }
      }
    })
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 'loanDetails':
        return (
          <LoanDetailsTableView
            application={this.state.application}
            branchName={this.state.branchDetails?.name}
          />
        )
      case 'loanGuarantors':
        return (
          <GuarantorTableView
            guarantors={this.state.application.guarantors}
            customerId={this.state.application.customer._id}
            application={this.state.application}
            getGeoArea={(area) => this.getCustomerGeoArea(area)}
            getIscore={(data) => this.getIscore(data)}
            iScores={this.state.iscores}
            status={this.state.application.status}
          />
        )
      case 'loanLogs':
        return <Logs id={this.props.location.state.id} />
      case 'loanPayments':
        return (
          <Payment
            print={(data) =>
              this.setState(
                (prevState) => ({
                  print: data.print,
                  earlyPaymentData: { ...prevState.earlyPaymentData, ...data },
                }),
                () => window.print()
              )
            }
            setReceiptData={(data) => this.setState({ receiptData: data })}
            setEarlyPaymentData={(data) =>
              this.setState({ earlyPaymentData: data })
            }
            application={this.state.application}
            installments={
              this.state.application.installmentsObject.installments
            }
            currency={this.state.application.product.currency}
            applicationId={this.state.application._id}
            pendingActions={this.state.pendingActions}
            manualPaymentEditId={this.state.manualPaymentEditId}
            refreshPayment={() => this.getAppByID(this.state.application._id)}
            paymentType="normal"
            randomPendingActions={this.state.randomPendingActions}
          />
        )
      case 'customerCard':
        return (
          <CustomerCardView
            application={this.state.application}
            getGeoArea={(area) => this.getCustomerGeoArea(area)}
            penalty={this.state.penalty}
            print={() =>
              this.setState({ print: 'customerCard' }, () => window.print())
            }
            rescheduled={
              this.state.individualsWithInstallments.rescheduled || false
            }
          />
        )
      case 'followUpStatement':
        return (
          <FollowUpStatementView
            application={this.state.application}
            print={() =>
              this.setState({ print: 'followUpStatement' }, () =>
                window.print()
              )
            }
            members={this.state.individualsWithInstallments}
          />
        )
      case 'loanRescheduling':
        return (
          <Rescheduling application={this.state.application} test={false} />
        )
      case 'loanReschedulingTest':
        return <Rescheduling application={this.state.application} test />
      case 'documents':
        return <UploadDocuments application={this.state.application} />
      case 'financialTransactions':
        return (
          <Payment
            print={(data) =>
              this.setState(
                (prevState) => ({
                  print: data.print,
                  earlyPaymentData: { ...prevState.earlyPaymentData, ...data },
                }),
                () => window.print()
              )
            }
            setReceiptData={(data) => this.setState({ receiptData: data })}
            setEarlyPaymentData={(data) =>
              this.setState({ earlyPaymentData: data })
            }
            application={this.state.application}
            installments={
              this.state.application.installmentsObject.installments
            }
            currency={this.state.application.product.currency}
            applicationId={this.state.application._id}
            pendingActions={this.state.pendingActions}
            manualPaymentEditId={this.state.manualPaymentEditId}
            refreshPayment={() => this.getAppByID(this.state.application._id)}
            paymentType="random"
            randomPendingActions={this.state.randomPendingActions}
          />
        )
      case 'penalties':
        return (
          <Payment
            print={(data) =>
              this.setState(
                (prevState) => ({
                  print: data.print,
                  earlyPaymentData: { ...prevState.earlyPaymentData, ...data },
                }),
                () => window.print()
              )
            }
            setReceiptData={(data) => this.setState({ receiptData: data })}
            setEarlyPaymentData={(data) =>
              this.setState({ earlyPaymentData: data })
            }
            application={this.state.application}
            installments={
              this.state.application.installmentsObject.installments
            }
            currency={this.state.application.product.currency}
            applicationId={this.state.application._id}
            pendingActions={this.state.pendingActions}
            manualPaymentEditId={this.state.manualPaymentEditId}
            refreshPayment={() => this.getAppByID(this.state.application._id)}
            paymentType="penalties"
            randomPendingActions={this.state.randomPendingActions}
          />
        )
      case 'entitledToSign':
        return (
          <GuarantorTableView
            guarantors={this.state.application.entitledToSign.map(
              this.mapEntitledToSignToCustomer
            )}
            customerId={this.state.application.customer._id}
            application={this.state.application}
            getGeoArea={(area) => this.getCustomerGeoArea(area)}
            getIscore={(data) => this.getIscore(data)}
            iScores={this.state.iscores}
            status={this.state.application.status}
            entitledToSign
          />
        )
      case 'comments':
        return (
          <LoanProfileComments
            applicationId={this.props.location.state.id}
            applicationStatus={this.state.application.status}
            comments={this.state.application.inReviewNotes ?? []}
            recallAPI={() => this.getAppByID(this.props.location.state.id)}
          />
        )
      default:
        return null
    }
  }

  render() {
    return (
      <Container>
        <Loader type="fullscreen" open={this.state.loading} />
        {Object.keys(this.state.application).length > 0 && (
          <div className="print-none">
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start flex-grow-1">
                <h3>{local.loanDetails}</h3>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 10,
                    marginRight: 10,
                    borderRadius: 30,
                    border: `1px solid ${
                      statusLocale[this.state.application.status].color
                    }`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: `${
                        statusLocale[this.state.application.status].color
                      }`,
                    }}
                  >
                    {statusLocale[this.state.application.status].text}
                  </p>
                </span>
                {this.state.application.writeOff && (
                  <span
                    style={{
                      display: 'flex',
                      padding: 10,
                      marginRight: 10,
                      borderRadius: 30,
                      border: `1px solid red`,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 11, color: 'red' }}>
                      {local.writtenOffLoan}
                      {this.state.application.writeOffReason
                        ? `- ${
                            local[
                              this.state.application.writeOffReason.replace(
                                /\s/g,
                                ''
                              )
                            ]
                          }`
                        : null}
                    </p>
                  </span>
                )}
                {this.state.application.isDoubtful &&
                  !this.state.application.writeOff && (
                    <span
                      style={{
                        display: 'flex',
                        padding: 10,
                        marginRight: 10,
                        borderRadius: 30,
                        border: `1px solid red`,
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 11, color: 'red' }}>
                        {local.doubtedLoan}
                      </p>
                    </span>
                  )}
              </div>
              <ProfileActions actions={this.getProfileActions()} />
            </div>
            {this.state.application.status === 'pending' ? (
              <div className="warning-container">
                <LtsIcon name="warning" color="#edb600" />
                <h6>{local.manualPaymentNeedsInspection}</h6>
                <div className="info">
                  <span className="text-muted">{local.truthDate}</span>
                  <span>
                    {this.state.pendingActions.transactions
                      ? timeToDateyyymmdd(
                          this.state.pendingActions?.transactions[0].truthDate
                        )
                      : ''}
                  </span>
                </div>
                <div className="info">
                  <span className="text-muted">{local.dueDate}</span>
                  <span>
                    {this.state.pendingActions.transactions
                      ? timeToDateyyymmdd(
                          this.state.pendingActions.transactions[0].actualDate
                        )
                      : ''}
                  </span>
                </div>
                <div className="info">
                  <span className="text-muted">{local.amount}</span>
                  <span>{this.getSumOfPendingActions()}</span>
                </div>
                <div className="info">
                  <span className="text-muted">{local.receiptNumber}</span>
                  <span>{this.state.pendingActions?.receiptNumber}</span>
                </div>
                <div className="status-chip pending">{local.pending}</div>
                <Can I="payInstallment" a="application">
                  <div
                    style={{ color: '#000', cursor: 'pointer' }}
                    data-qc="editManualPayment"
                    onClick={() => this.editManualPayment('')}
                  >
                    <span className="fa fa-pencil" style={{ marginLeft: 5 }} />
                    {local.edit}
                  </div>
                </Can>
                <Can I="payInstallment" a="application">
                  <div
                    className="cancel"
                    data-qc="rejectManualPayment"
                    onClick={() => {
                      this.rejectManualPayment('')
                    }}
                  >
                    {local.cancel}
                  </div>
                </Can>
                <Can I="approvePendingAction" a="application">
                  <div
                    className="submit"
                    data-qc="approveManualPayment"
                    onClick={() => {
                      this.approveManualPayment('')
                    }}
                  >
                    {local.submit}
                  </div>
                </Can>
              </div>
            ) : null}
            {this.state.randomPendingActions.length > 0 && (
              <ManualRandomPaymentsActions
                pendingActions={this.state.randomPendingActions}
                rejectManualPayment={(randomPaymentId: string) =>
                  this.rejectManualPayment(randomPaymentId)
                }
                approveManualPayment={(randomPaymentId: string) =>
                  this.approveManualPayment(randomPaymentId)
                }
                editManualPayment={(randomPaymentId: string) =>
                  this.editManualPayment(randomPaymentId)
                }
              />
            )}
            <div style={{ marginTop: 15 }}>
              <InfoBox
                info={this.getInfo()}
                title={
                  this.state.application.product.beneficiaryType ===
                  'individual'
                    ? local.mainInfo
                    : local.mainGroupInfo
                }
              />
            </div>
            <Card className="mt-4 d-flex flex-row">
              <div className="mt-4 w-max-content">
                <CardNavBar
                  array={this.state.tabsArray}
                  active={this.state.activeTab}
                  isVertical
                  selectTab={(index: string) =>
                    this.setState(
                      { activeTab: index, manualPaymentEditId: '' },
                      () => {
                        if (index === 'customerCard') this.calculatePenalties()
                        this.props.changePaymentState(0)
                      }
                    )
                  }
                />
              </div>
              <div className="border mt-5 mb-5" />
              <div className="p-3 w-100 mt-4 overflow-auto">
                {this.renderContent()}
              </div>
            </Card>
            {this.state.returnItemModalOpen && (
              <ReturnItemModal
                show={this.state.returnItemModalOpen}
                hideModal={() => this.setState({ returnItemModalOpen: false })}
                issueDate={this.state.application.issueDate}
                submit={(date) => this.returnItem(date)}
              />
            )}
          </div>
        )}
        {this.state.print === 'all' && (
          <>
            <CashReceiptPDF
              data={this.state.application}
              remainingTotal={this.state.remainingLoan?.remainingTotal || 0}
            />
            <CustomerCardPDF
              data={this.state.application}
              getGeoArea={(area) => this.getCustomerGeoArea(area)}
              penalty={this.state.penalty}
              branchDetails={this.state.branchDetails}
              remainingTotal={this.state.remainingLoan?.remainingTotal || 0}
              members={this.state.individualsWithInstallments}
            />
            <CustomerCardAttachments
              data={this.state.application}
              branchDetails={this.state.branchDetails}
            />
            <FollowUpStatementPDF
              data={this.state.application}
              branchDetails={this.state.branchDetails}
              members={this.state.individualsWithInstallments}
            />
            <PromissoryNoteMicro
              application={this.state.application}
              branchDetails={this.state.branchDetails}
              customer={this.state.application.customer}
            />
            {this.state.application.product.type === 'nano' ? (
              <NanoLoanContract
                data={this.state.application}
                loanUsage={this.state.loanUsage}
                branchDetails={this.state.branchDetails}
              />
            ) : this.state.application.product.beneficiaryType ===
              'individual' ? (
              <LoanContract
                data={this.state.application}
                loanUsage={this.state.loanUsage}
                branchDetails={this.state.branchDetails}
              />
            ) : (
              <LoanContractForGroup
                data={this.state.application}
                loanUsage={this.state.loanUsage}
                branchDetails={this.state.branchDetails}
              />
            )}
          </>
        )}
        {this.state.print === 'allSME' && (
          <>
            <AcknowledgmentAndPledge
              entitledToSign={this.state.application.entitledToSign}
              application={this.state.application}
            />
            <KnowYourCustomer
              application={this.state.application}
              loanUsage={this.state.loanUsage}
            />
            <AcknowledgmentWasSignedInFront
              application={this.state.application}
              branchDetails={this.state.branchDetails}
            />
            <CustomerCardPDF
              data={this.state.application}
              getGeoArea={(area) => this.getCustomerGeoArea(area)}
              penalty={this.state.penalty}
              branchDetails={this.state.branchDetails}
              remainingTotal={this.state.remainingTotal}
              members={this.state.individualsWithInstallments}
            />
            <AcknowledgmentOfCommitment
              application={this.state.application}
              branchDetails={this.state.branchDetails}
            />
            {this.state.application.guarantors?.map((person, index) => (
              <div key={index}>
                <SolidarityGuarantee
                  application={this.state.application}
                  person={person}
                />
                <PromissoryNote
                  noteKind="individual"
                  application={this.state.application}
                  branchDetails={this.state.branchDetails}
                  person={person}
                />
              </div>
            ))}
            {this.state.application.entitledToSign?.map((person, index) => (
              <div key={index}>
                <SolidarityGuarantee
                  application={this.state.application}
                  person={person.customer}
                  personPosition={person.position}
                />
                <PromissoryNote
                  noteKind="individual"
                  application={this.state.application}
                  branchDetails={this.state.branchDetails}
                  person={person.customer}
                  personPosition={person.position}
                />
                <PromissoryNote
                  noteKind="sme"
                  application={this.state.application}
                  branchDetails={this.state.branchDetails}
                  person={person.customer}
                  personPosition={person.position}
                />
              </div>
            ))}
            <AuthorizationToFillCheck application={this.state.application} />
            <AuthorizationToFillInfo application={this.state.application} />
            <SmeLoanContract
              data={this.state.application}
              branchDetails={this.state.branchDetails}
            />
            <div className="text-center loan-contract">
              <Barcode
                value={this.state.application.loanApplicationKey.toString()}
              />
            </div>
            <FollowUpStatementPDF
              data={this.state.application}
              branchDetails={this.state.branchDetails}
              members={this.state.individualsWithInstallments}
            />
          </>
        )}
        {this.state.print === 'followUpStatement' && (
          <FollowUpStatementPDF
            data={this.state.application}
            branchDetails={this.state.branchDetails}
            members={this.state.individualsWithInstallments}
          />
        )}
        {this.state.print === 'customerCard' && (
          <CustomerCardPDF
            data={this.state.application}
            getGeoArea={(area) => this.getCustomerGeoArea(area)}
            penalty={this.state.penalty}
            branchDetails={this.state.branchDetails}
            remainingTotal={this.state.remainingLoan?.remainingTotal || 0}
            members={this.state.individualsWithInstallments}
          />
        )}
        {this.state.print === 'earlyPayment' && (
          <EarlyPaymentPDF
            type={this.props.location.state?.sme ? 'sme' : 'lts'}
            application={this.state.application}
            earlyPaymentPdfData={getEarlyPaymentPdfData(
              this.state.application,
              this.state.remainingLoan
            )}
            branchDetails={this.state.branchDetails}
          />
        )}
        {this.state.print === 'payment' && (
          <PaymentReceipt
            receiptData={this.state.receiptData}
            data={this.state.application}
            companyReceipt={
              this.state.application.customer.customerType === 'company'
            }
            type={this.state.application?.product?.type}
          />
        )}
        {this.state.print === 'payEarly' && (
          <EarlyPaymentReceipt
            type={this.props.location.state?.sme ? 'sme' : 'lts'}
            receiptData={this.state.receiptData}
            branchDetails={this.state.branchDetails}
            earlyPaymentData={this.state.earlyPaymentData}
            data={this.state.application}
          />
        )}
        {this.state.print === 'randomPayment' ||
        this.state.print === 'penalty' ? (
          <RandomPaymentReceipt receiptData={this.state.receiptData} />
        ) : null}
      </Container>
    )
  }
}
const addPaymentToProps = (dispatch) => {
  return {
    changePaymentState: (data) => dispatch(payment(data)),
  }
}
export default connect(null, addPaymentToProps)(withRouter(LoanProfile))
