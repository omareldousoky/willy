import React, { Component } from 'react'
import { Formik } from 'formik'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import Select from 'react-select'
import produce from 'immer'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import local from 'Shared/Assets/ar.json'
import { Loader } from 'Shared/Components/Loader'
import { getFormulas } from 'Shared/Services/APIs/LoanFormula/getFormulas'
import { getProduct } from 'Shared/Services/APIs/loanProduct/getProduct'
import { getProductsByBranch } from 'Shared/Services/APIs/Branch/getBranches'
import { getGenderFromNationalId } from 'Shared/Services/nationalIdValidation'
import {
  newApplication,
  editApplication,
  newNanoApplication,
} from 'Shared/Services/APIs/loanApplication/newApplication'
import { getApplication } from 'Shared/Services/APIs/loanApplication/getApplication'
import { getLoanOfficer } from 'Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import {
  getAge,
  getFullCustomerKey,
  getErrorMessage,
  getDateString,
} from 'Shared/Services/utils'
import DualBox from 'Shared/Components/DualListBox/dualListBox'
import Wizard from 'Shared/Components/wizard/Wizard'
import { theme } from 'Shared/theme'
import { Customer } from 'Shared/Models/Customer'
import { searchCustomer } from 'Shared/Services/APIs/customer/searchCustomer'
import { getMaxPrinciples } from 'Shared/Services/APIs/config'
import { getCustomersBalances } from 'Shared/Services/APIs/customer/customerLoans'
import { getCustomerByID } from 'Shared/Services/APIs/customer/getCustomer'
import { getLoanUsage } from 'Shared/Services/APIs/LoanUsage/getLoanUsage'
import CustomerSearch from 'Shared/Components/CustomerSearch'
import { Product } from 'Shared/Services/interfaces'
import InfoBox from '../userInfoBox'
import { LoanApplicationCreationGuarantorForm } from './loanApplicationCreationGuarantorForm'
import { LoanApplicationCreationForm } from './loanApplicationCreationForm'
import {
  Application,
  LoanApplicationValidation,
  SMELoanApplicationValidation,
  SMELoanApplicationStep2Validation,
  EntitledToSign,
  EntitledToSignIds,
  Results,
} from './loanApplicationStates'
import {
  checkGroupValidation,
  chooseCustomerType,
  filterProducts,
  getCustomerLimits,
  getCustomerType,
  getGroupErrorMessage,
  setInitState,
} from './Helpers'
import { FinancialLeasingDetailsForm } from './FinancialLeasingDetailsForm'

interface LoanApplicationCreationRouteState {
  id?: string
  action?: string
  sme?: boolean
}

interface Props
  extends RouteComponentProps<{}, {}, LoanApplicationCreationRouteState> {
  edit: boolean
}
export interface Formula {
  name: string
  _id: string
  interest_type: string
}
interface LoanOfficer {
  _id: string
  username: string
  name: string
}
interface State {
  step: number
  application: Application
  customerType: string
  loading: boolean
  selectedCustomer: Customer
  selectedGroupLeader: string
  selectedLoanOfficer: LoanOfficer
  searchResults: Results
  formulas: Array<Formula>
  products: Array<Product>
  loanUsage: Array<object>
  loanOfficers: Array<LoanOfficer>
  branchCustomers: Array<Customer>
  selectedCustomers: Array<Customer>
  prevId: string
  searchGroupCustomerKey: string
  showModal: boolean
  customerToView: Customer
  isNano: boolean
  branchId: string
}

class LoanApplicationCreation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = setInitState()
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const application = { ...state.application }
    if (
      props.location.state.id !== state.prevId &&
      props.location.state.action !== state.application.state
    ) {
      application.state = props.location.state.action
      application._id = props.location.state.id
      return {
        prevId: props.location.state.id,
        application,
      }
    }
    return null
  }

  componentDidMount() {
    this.setappStats()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.location.state.action !== this.props.location.state.action &&
      prevProps.location.state.id !== this.props.location.state.id
    ) {
      // set State to initial value
      // I need to add application id in the form values to be passed to status helper component
      this.setappStats()
    }
  }

  async handleGroupChange(customers) {
    this.setState({ selectedGroupLeader: '' })
    const customersTemp: {
      customer: Customer
      amount: number
      type: string
    }[] = []
    if (customers.length > 0) {
      const check = await this.checkCustomersLimits(customers, false)
      if (check.flag === true && check.customers) {
        check.customers.forEach((customer) => {
          const obj = {
            customer,
            amount: 0,
            type: 'member',
          }
          customersTemp.push(obj)
        })
        this.setState(
          produce<State>((draftState) => {
            draftState.selectedCustomers = check.customers
            draftState.application.individualDetails = customersTemp
          })
        )
      } else if (
        check.flag === false &&
        check.validationObject &&
        Object.keys(check.validationObject).length > 0
      ) {
        // to be reflected in `DualBox` we need to declare that selected options has been reset
        // maintain existing customers in edit
        this.setState((prevState) => ({
          selectedCustomers: [...prevState.selectedCustomers],
        }))
        let names = ''
        let financeNames = ''
        Object.keys(check.validationObject).forEach((id, i) => {
          if (check.validationObject[id].totalPrincipals) {
            i === 0
              ? (financeNames += check.validationObject[id].customerName)
              : (financeNames =
                  financeNames + ', ' + check.validationObject[id].customerName)
          } else
            i === 0
              ? (names += check.validationObject[id].customerName)
              : (names = names + ', ' + check.validationObject[id].customerName)
        })
        Swal.fire(
          'error',
          `${names.length > 0 ? names : ''} ${
            names.length > 0 ? local.memberInvolvedInAnotherLoan : ''
          } ${
            financeNames.length > 0
              ? `\n ${financeNames} ${local.customersMaxLoanPrincipalError}`
              : ''
          }`,
          'error'
        )
      }
    } else {
      // remove all
      this.setState({
        selectedCustomers: [],
      })
    }
  }

  handleSearch = async (key, query) => {
    this.setState({ loading: true })
    const body = {
      from: 0,
      size: 1000,
      [key]: query,
      customerType: ['sme', 'smeFinancialLeasing'].includes(
        this.state.customerType
      )
        ? 'company'
        : 'individual',
    }
    const results = await searchCustomer(body)
    if (results.status === 'success') {
      this.setState({
        loading: false,
        searchResults: {
          results: results.body.data,
          empty: !results.body.data.length,
        },
      })
    } else {
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  handleSearchGuarantors = async (
    key,
    query,
    index,
    companySearch?: boolean
  ) => {
    const obj = {
      [key]: query,
      from: 0,
      size: 1000,
      excludedIds: [
        this.state.application.customerID,
        ...this.state.application.guarantorIds,
      ],
      customerType: companySearch ? 'company' : 'individual',
    }
    this.setState({ loading: true })
    const results = await searchCustomer(obj)
    if (results.status === 'success') {
      this.setState(
        produce<State>((draftState) => {
          const app = draftState.application
          const defaultGuarantors = { ...app.guarantors }
          const defaultGuar = { ...defaultGuarantors[index] }
          defaultGuar.searchResults = {
            results: results.body.data,
            empty: !results.body.data.length,
          }
          app.guarantors[index] = defaultGuar
        }),
        () => this.setState({ loading: false })
      )
    } else {
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  handleSearchEntitledToSign = async (key, query, index) => {
    const obj = {
      [key]: query,
      from: 0,
      size: 1000,
      excludedIds: [
        this.state.application.customerID,
        ...this.state.application.entitledToSignIds.map(
          ({ customerId }) => customerId
        ),
      ],
      customerType: 'individual',
    }
    this.setState({ loading: true })
    const results = await searchCustomer(obj)
    if (results.status === 'success') {
      this.setState(
        produce<State>((draftState) => {
          const app = draftState.application
          const defaultEntitledToSign = { ...app.entitledToSign }
          const defaultCustomer = { ...defaultEntitledToSign[index] }
          defaultCustomer.searchResults = {
            results: results.body.data,
            empty: !results.body.data.length,
          }
          app.entitledToSign[index] = defaultCustomer
        }),
        () => this.setState({ loading: false })
      )
    } else {
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getGlobalPrinciple() {
    this.setState({ loading: true })
    const princples = await getMaxPrinciples()
    if (princples.status === 'success') {
      const principals = {
        maxIndividualPrincipal: princples.body.maxIndividualPrincipal,
        maxGroupIndividualPrincipal: princples.body.maxGroupIndividualPrincipal,
        maxGroupPrincipal: princples.body.maxGroupPrincipal,
        maxGroupReturningIndividualPrincipal:
          princples.body.maxGroupReturningIndividualPrincipal,
      }
      const { application } = this.state
      application.principals = principals
      this.setState({
        loading: false,
        application,
      })
    } else {
      Swal.fire('Error!', getErrorMessage(princples.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getOfficerName(id) {
    const res = await getLoanOfficer(id)
    if (res.status === 'success') {
      const { name } = res.body
      this.setState(
        produce<State>((draftState) => {
          draftState.application.representativeName = name
        })
      )
    } else {
      this.setState(
        produce<State>((draftState) => {
          draftState.application.representativeName = id
        })
      )
    }
  }

  setCustomerType(type) {
    const isNano = type === 'nano'
    this.setState(
      produce<State>((draftState) => {
        draftState.customerType = isNano ? 'individual' : type
        draftState.application.beneficiaryType = isNano ? 'individual' : type
        draftState.isNano = isNano
      })
    )
  }

  async getProducts() {
    this.setState({ products: [], loading: true })
    if (this.state.branchId.length > 0) {
      const products = await getProductsByBranch(this.state.branchId)
      if (products.status === 'success') {
        this.setState({
          products: products.body.data.productIds
            ? products.body.data.productIds
            : [],
          loading: false,
        })
      } else {
        Swal.fire('Error !', getErrorMessage(products.error.error), 'error')
        this.setState({ loading: false })
      }
    } else {
      Swal.fire('', local.selectBranch, 'error')
    }
  }

  async getLoanUsage() {
    this.setState({ loanUsage: [], loading: true })
    const usage = await getLoanUsage()
    if (usage.status === 'success') {
      this.setState({
        loanUsage: usage.body.usages.filter((item) => item.activated),
        loading: false,
      })
    } else {
      Swal.fire('Error !', getErrorMessage(usage.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getFormulas() {
    this.setState({ loading: true })
    const formulas = await getFormulas()
    if (formulas.status === 'success') {
      this.setState({
        formulas: formulas.body.data,
        loading: false,
      })
    } else {
      Swal.fire('Error !', getErrorMessage(formulas.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async getAppByID(id) {
    this.setState({ loading: true })
    const application = await getApplication(id)
    if (application.status === 'success') {
      if (application.body.product.beneficiaryType === 'group') {
        const selectedCustomers: Customer[] = application.body.group.individualsInGroup.map(
          (item) => item.customer
        )
        const customers = await getCustomerLimits(
          selectedCustomers,
          this.state.application.principals
        )
        application.body.group.individualsInGroup.forEach((customer) => {
          if (customer.type === 'leader') {
            this.setState(
              produce<State>((draftState) => {
                draftState.selectedGroupLeader = customer.customer._id
                draftState.selectedLoanOfficer = draftState.loanOfficers.filter(
                  (officer) => officer._id === customer.customer.representative
                )[0]
              })
            )
          }
          customer.customer = customers.filter(
            (member) => member._id === customer.customer._id
          )[0]
        })

        this.setState(
          produce<State>((draftState) => {
            draftState.application.individualDetails =
              application.body.group.individualsInGroup
          })
        )

        this.setState({
          selectedCustomers,
          loading: false,
        })
      } else {
        const customers = await getCustomerLimits(
          [application.body.customer],
          this.state.application.principals
        )
        this.populateCustomer(customers[0])

        this.setState(
          produce<State>((draftState) => {
            const app = draftState.application
            app.customerTotalPrincipals = customers[0].totalPrincipals || 0
            app.customerMaxPrincipal = customers[0].maxPrincipal || 0
            app.individualDetails = application.body.group.individualsInGroup
            app.vendorName = application.body.vendorName
            app.itemDescription = application.body.itemDescription
            app.categoryName = application.body.categoryName
            app.itemType = application.body.itemType
            app.categoryName = application.body.categoryName
            app.itemSerialNumber = application.body.itemSerialNumber
            app.downPayment = application.body.downPayment
            draftState.loading = false
          })
        )
      }
      this.populateLoanProduct(application.body.product)
      const value =
        this.state.prevId.length > 0
          ? application.body.guarantors.length
          : application.body.product.noOfGuarantors
      const guarsArr: Array<any> = []
      for (let i = 0; i < value; i += 1) {
        if (application.body.guarantors[i]) {
          guarsArr.push({
            searchResults: {
              results: [],
              empty: false,
            },
            guarantor: application.body.guarantors[i],
          })
          this.setState(
            produce<State>((draftState) => {
              draftState.application.guarantorIds.push(
                application.body.guarantors[i]._id
              )
            })
          )
        } else {
          guarsArr.push({
            searchResults: {
              results: [],
              empty: false,
            },
            guarantor: {},
          })
        }
      }

      const entitledArr: Array<EntitledToSign> = []
      if (application.body.entitledToSign?.length > 0) {
        application.body.entitledToSign.forEach(({ customer, position }) => {
          entitledArr.push({
            searchResults: {
              results: [],
              empty: false,
            },
            entitledToSign: customer,
            position,
          })
          this.setState(
            produce<State>((draftState) => {
              draftState.application.entitledToSignIds.push({
                customerId: customer._id,
                position,
              })
            })
          )
        })
      }
      this.setState(
        produce<State>((draftState) => {
          const app = draftState.application
          const {
            entryDate,
            visitationDate,
            usage,
            enquirorId,
            viceCustomers,
            principal,
            customer,
            product,
            undoReviewDate,
            reviewedDate,
            managerVisitDate,
            branchManagerId,
            researcherId,
          } = application.body
          app.entryDate = getDateString(entryDate)
          app.visitationDate = getDateString(visitationDate)
          app.usage = usage || ''
          app.enquirorId = enquirorId || ''
          app.viceCustomers = viceCustomers || ''
          app.principal = principal || 0
          app.customerID = customer._id
          app.productID = product._id
          app.reviewedDate = reviewedDate
          app.undoReviewDate = undoReviewDate
          app.rejectionDate = reviewedDate
          app.guarantors = guarsArr
          app.managerVisitDate = getDateString(managerVisitDate)
          app.branchManagerId = branchManagerId
          app.researcherId = researcherId
          app.entitledToSign = entitledArr
          draftState.selectedCustomer = application.body.customer
          draftState.customerType = getCustomerType(product)
          draftState.isNano = product.type === 'nano'
          draftState.loading = false
        })
      )
    } else {
      Swal.fire('Error!', getErrorMessage(application.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  async setappStats() {
    if (this.state.prevId.length > 0) {
      await this.getProducts()
      await this.getFormulas()
      await this.getLoanUsage()
      await this.getGlobalPrinciple()
      this.getAppByID(this.state.prevId)
    } else {
      this.setState(setInitState())
      await this.getProducts()
      await this.getFormulas()
      await this.getLoanUsage()
      await this.getGlobalPrinciple()
    }
  }

  setGroupLeader(id) {
    const { application } = this.state
    const app = produce(application, (draftApplication) => {
      draftApplication.individualDetails.map((member) => {
        member.type = member.customer._id === id ? 'leader' : 'member'
      })
    })
    this.setState({
      application: app,
      selectedGroupLeader: id,
    })
  }

  removeGuarantor = (obj, index, values) => {
    this.setState({ loading: true })

    const application = produce(values as Application, (draftApp) => {
      const defaultGuarantors = { ...draftApp.guarantors }
      const defaultGuar = { ...defaultGuarantors[index] }
      draftApp.guarantorIds = draftApp.guarantorIds.filter(
        (id) => obj._id !== id
      )
      defaultGuar.guarantor = {}
      defaultGuar.searchResults.results = []
      defaultGuar.searchResults.empty = false
      draftApp.guarantors[index] = defaultGuar
    })

    this.setState({ application, loading: false })
  }

  getSelectedLoanProduct = async (id) => {
    this.setState({ loading: true })
    const selectedProduct = await getProduct(id)
    if (selectedProduct.status === 'success') {
      const selectedProductDetails = selectedProduct.body.data
      this.populateLoanProduct(selectedProductDetails)
      const element = {
        searchResults: {
          results: [],
          empty: false,
        },
        guarantor: {},
      }
      const guarsArr = Array(selectedProductDetails.noOfGuarantors).fill(
        element
      )
      this.setState(
        produce((draftState) => {
          draftState.loading = false
          draftState.application.guarantors =
            selectedProductDetails.type === 'sme' ? [] : guarsArr
          draftState.application.productID = id
          draftState.application.guarantorIds = []
        })
      )
    } else {
      Swal.fire('error', getErrorMessage(selectedProduct.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  selectCustomer = async (customer) => {
    let customerIsBlockerError = ''
    let customerLoanOrAgeError = ''

    const invalidNanoLimit = this.state.isNano && !customer.nanoLoansLimit

    if (invalidNanoLimit) {
      Swal.fire(local.error, 'برجاء تحديد الحد الائتماني', 'error')
      return
    }

    this.setState({ loading: true })
    const selectedCustomer = await getCustomerByID(customer._id)
    if (selectedCustomer.status === 'success') {
      if (selectedCustomer.body.customer.blocked.isBlocked === true) {
        customerIsBlockerError = local.theCustomerIsBlocked
      }
      if (
        getAge(selectedCustomer.body.customer.birthDate) >= 21 &&
        getAge(selectedCustomer.body.customer.birthDate) <= 65
      ) {
        const check = await this.checkCustomersLimits(
          [selectedCustomer.body.customer],
          false
        )
        if (
          check.flag === true &&
          check.customers &&
          selectedCustomer.body.customer.blocked.isBlocked !== true
        ) {
          this.populateCustomer(check.customers[0])

          this.setState(
            produce<State>((draftState) => {
              const app = draftState.application
              app.customerID = customer._id
              app.customerTotalPrincipals =
                check.customers[0].totalPrincipals || 0
              app.customerMaxPrincipal = check.customers[0].maxPrincipal || 0
              draftState.loading = false
              draftState.selectedCustomer = check.customers[0]
            })
          )
        } else if (
          check.flag === false &&
          Object.keys(check.validationObject).length > 0
        ) {
          if (check.validationObject[customer._id].totalPrincipals) {
            customerLoanOrAgeError = local.customerMaxLoanPrincipalError
          } else {
            customerLoanOrAgeError = local.customerInvolvedInAnotherLoan
          }
        }
      } else {
        this.setState({ loading: false })
        customerLoanOrAgeError = local.individualAgeError
      }
      if (customerIsBlockerError || customerLoanOrAgeError)
        Swal.fire(
          'error',
          `<span>${customerIsBlockerError}  ${
            customerIsBlockerError ? `<br/>` : ''
          } ${customerLoanOrAgeError}</span>`,
          'error'
        )
    } else {
      Swal.fire(
        'Error !',
        getErrorMessage(selectedCustomer.error.error),
        'error'
      )
    }

    this.setState({ loading: false })
  }

  selectGuarantor = async (obj, index, values) => {
    this.setState({ loading: true })
    const selectedGuarantor = await getCustomerByID(obj._id)
    if (selectedGuarantor.status === 'success') {
      let customerIsBlockedError = ''
      let customerInvolvedInAnotherLoanError = ''
      if (selectedGuarantor.body.customer.blocked.isBlocked === true) {
        customerIsBlockedError =
          selectedGuarantor.body.customer.customerType === 'company'
            ? local.theCompanyIsBlocked
            : local.theCustomerIsBlocked
      }
      const check = await this.checkCustomersLimits(
        [selectedGuarantor.body.customer],
        true
      )
      if (
        check.flag === true &&
        check.customers &&
        selectedGuarantor.body.customer.blocked.isBlocked !== true
      ) {
        const application = produce(values as Application, (draftApp) => {
          const defaultGuarantors = { ...draftApp.guarantors }
          const defaultGuar = { ...defaultGuarantors[index] }
          defaultGuar.guarantor = {
            ...selectedGuarantor.body.customer,
            id: obj._id,
          }
          draftApp.guarantorIds.push(obj._id)
          draftApp.guarantors[index] = defaultGuar
        })

        this.setState({ application, loading: false })
      } else if (check.flag === false && check.validationObject) {
        customerInvolvedInAnotherLoanError = local.customerInvolvedInAnotherLoan
      }
      if (customerIsBlockedError || customerInvolvedInAnotherLoanError)
        Swal.fire(
          'error',
          `<span>${customerIsBlockedError} ${
            customerIsBlockedError ? `<br/>` : ''
          } ${customerInvolvedInAnotherLoanError}</span>`,
          'error'
        )
    } else {
      Swal.fire(
        'Error !',
        getErrorMessage(selectedGuarantor.error.error),
        'error'
      )
    }
    this.setState({ loading: false })
  }

  selectEntitledToSign = async (obj, index, values) => {
    this.setState({ loading: true })
    const selectedGuarantor = await getCustomerByID(obj._id)
    if (selectedGuarantor.status === 'success') {
      if (selectedGuarantor.body.customer.blocked.isBlocked !== true) {
        const application = produce(values as Application, (draftApp) => {
          const defaultentitledToSign = { ...draftApp.entitledToSign }
          const defaultCustomer = { ...defaultentitledToSign[index] }
          defaultCustomer.entitledToSign = {
            ...selectedGuarantor.body.customer,
            id: obj._id,
          }
          draftApp.entitledToSignIds.push({ customerId: obj._id })
          draftApp.entitledToSign[index] = defaultCustomer
        })
        this.setState({ application, loading: false })
      } else {
        Swal.fire('error', local.theCustomerIsBlocked, 'error')
      }
    } else {
      Swal.fire(
        'Error !',
        getErrorMessage(selectedGuarantor.error.error),
        'error'
      )
    }
    this.setState({ loading: false })
  }

  submit = async (values: Application) => {
    if (
      (this.state.step === 2 &&
        ['individual', 'sme'].includes(this.state.customerType)) ||
      ([2, 3].includes(this.state.step) &&
        ['financialLeasing', 'smeFinancialLeasing'].includes(
          this.state.customerType
        ))
    ) {
      this.setState({ application: { ...values } }, () => this.step('forward'))
    } else {
      const obj = { ...values }
      const individualsToSend: {
        id?: string
        amount: number
        type: string
      }[] = []
      let principalToSend = 0
      obj.individualDetails &&
        obj.individualDetails.forEach((item) => {
          const customer = {
            id: item.customer._id,
            amount: item.amount,
            type: item.type,
          }
          principalToSend += customer.amount
          individualsToSend.push(customer)
        })
      if (obj.beneficiaryType !== 'group') {
        principalToSend = obj.principal
      }

      const viceCustomers = obj.viceCustomers.filter(
        (item) => item !== undefined
      )

      const entitledToSignIds: EntitledToSignIds[] = obj.entitledToSignIds.map(
        ({ customerId }) => {
          const entitledToSign = values.entitledToSign.find(
            ({ entitledToSign: entitledToSignItem }) =>
              entitledToSignItem._id === customerId
          )

          return {
            customerId,
            position: entitledToSign?.position,
          }
        }
      )

      const objToSubmit = {
        customerId: obj.customerID,
        guarantorIds: obj.guarantorIds,
        productId: obj.productID,
        interest: obj.interest,
        interestPeriod: obj.interestPeriod,
        gracePeriod: obj.gracePeriod,
        pushPayment: obj.pushPayment,
        noOfInstallments: obj.noOfInstallments,
        principal: principalToSend,
        applicationFee: obj.applicationFee,
        individualApplicationFee: obj.individualApplicationFee,
        applicationFeePercent: obj.applicationFeePercent,
        applicationFeeType: obj.applicationFeeType,
        applicationFeePercentPerPerson: obj.applicationFeePercentPerPerson,
        applicationFeePercentPerPersonType:
          obj.applicationFeePercentPerPersonType,
        representativeFees: obj.representativeFees,
        stamps: obj.stamps,
        adminFees: obj.adminFees,
        entryDate: new Date(obj.entryDate).valueOf(),
        usage: obj.usage,
        representativeId: obj.representative,
        enquirorId: obj.enquirorId,
        researcherId: obj.researcherId,
        visitationDate: new Date(obj.visitationDate).valueOf(),
        individualDetails: individualsToSend,
        viceCustomers,
        branchManagerId: values.branchManagerId,
        managerVisitDate: values.managerVisitDate
          ? new Date(values.managerVisitDate).valueOf()
          : 0,
        entitledToSignIds,
        vendorName: obj.vendorName,
        itemDescription: obj.itemDescription,
        categoryName: obj.categoryName,
        itemType: obj.itemType,
        itemSerialNumber: obj.itemSerialNumber,
        downPayment: obj.downPayment,
      }
      if (
        this.state.application.guarantorIds.length <
          this.state.application.noOfGuarantors &&
        this.state.customerType === 'individual'
      ) {
        Swal.fire('error', local.selectTwoGuarantors, 'error')
      } else if (!this.props.edit) {
        this.setState({ loading: true })

        const res = await (this.state.isNano
          ? newNanoApplication(objToSubmit)
          : newApplication(objToSubmit))

        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire(
            'success',
            local.loanApplicationCreated +
              ` ${local.withCode} ` +
              res.body.applicationKey
          ).then(() => {
            this.props.history.push('/track-loan-applications', {
              sme: ['sme', 'smeFinancialLeasing'].includes(
                this.state.customerType
              ),
            })
          })
        } else {
          Swal.fire('error', getErrorMessage(res.error.error), 'error')
          this.setState({ loading: false })
        }
      } else if (this.props.edit) {
        this.setState({ loading: true })
        const res = await editApplication(objToSubmit, this.state.prevId)
        if (res.status === 'success') {
          this.setState({ loading: false })
          Swal.fire('success', local.loanApplicationEdited).then(() => {
            this.props.history.push('/track-loan-applications', {
              sme: ['sme', 'smeFinancialLeasing'].includes(
                this.state.customerType
              ),
            })
          })
        } else {
          Swal.fire('error', getErrorMessage(res.error.error), 'error')
          this.setState({ loading: false })
        }
      }
    }
  }

  removeEntitledToSign = (obj, index, values) => {
    this.setState({ loading: true })

    const application = produce(values as Application, (draftApp) => {
      const defaultEntitledToSign = { ...draftApp.entitledToSign }
      const defaultCustomer = { ...defaultEntitledToSign[index] }
      draftApp.entitledToSignIds = draftApp.entitledToSignIds.filter(
        ({ customerId }) => obj._id !== customerId
      )
      defaultCustomer.entitledToSign = {}
      defaultCustomer.searchResults.results = []
      defaultCustomer.searchResults.empty = false
      draftApp.entitledToSign[index] = defaultCustomer
    })

    this.setState({ application, loading: false })
  }

  async viewCustomer(id) {
    this.setState({ loading: true })
    const selectedCustomer = await getCustomerByID(id)
    if (selectedCustomer.status === 'success') {
      this.setState({
        customerToView: selectedCustomer.body.customer,
        loading: false,
        showModal: true,
      })
    } else {
      Swal.fire('error', local.searchError, 'error')
      this.setState({ loading: false })
    }
  }

  addOptionalGuarantor(stringKey?: string) {
    const element: {
      searchResults: Results
      guarantor: Customer
      isCompany?: boolean
    } = {
      searchResults: {
        results: [],
        empty: false,
      },
      guarantor: {},
    }
    if (stringKey === 'company') element.isCompany = true
    this.setState(
      produce<State>((draftState) => {
        draftState.application.guarantors.push(element)
      })
    )
  }

  addEntitledToSignRow() {
    const element = {
      searchResults: {
        results: [],
        empty: false,
      },
      entitledToSign: {},
    }

    this.setState(
      produce<State>((draftState) => {
        draftState.application.entitledToSign.push(element)
      })
    )
  }

  populateLoanProduct(selectedProductDetails) {
    const defaultValues = setInitState().application
    if (
      selectedProductDetails.beneficiaryType === 'group' &&
      this.state.step === 1
    ) {
      this.searchCustomers()
    }

    this.setState(
      produce<State>((draftState) => {
        const app = draftState.application
        app.calculationFormulaId = selectedProductDetails.calculationFormula._id
        app.currency = selectedProductDetails.currency
        app.interest = selectedProductDetails.interest || defaultValues.interest
        app.interestPeriod = selectedProductDetails.interestPeriod
        app.allowInterestAdjustment =
          selectedProductDetails.allowInterestAdjustment
        app.inAdvanceFees =
          selectedProductDetails.inAdvanceFees || defaultValues.inAdvanceFees
        app.inAdvanceFrom = selectedProductDetails.inAdvanceFrom
        app.inAdvanceType = selectedProductDetails.inAdvanceType
        app.periodLength =
          selectedProductDetails.periodLength || defaultValues.periodLength
        app.periodType = selectedProductDetails.periodType
        app.gracePeriod =
          selectedProductDetails.gracePeriod || defaultValues.gracePeriod
        app.pushPayment =
          selectedProductDetails.pushPayment || defaultValues.pushPayment
        app.noOfInstallments =
          selectedProductDetails.noOfInstallments ||
          defaultValues.noOfInstallments
        app.applicationFee =
          selectedProductDetails.applicationFee || defaultValues.applicationFee
        app.individualApplicationFee =
          selectedProductDetails.individualApplicationFee ||
          defaultValues.individualApplicationFee
        app.applicationFeePercent =
          selectedProductDetails.applicationFeePercent ||
          defaultValues.applicationFeePercent
        app.applicationFeeType = selectedProductDetails.applicationFeeType
        app.applicationFeePercentPerPerson =
          selectedProductDetails.applicationFeePercentPerPerson ||
          defaultValues.applicationFeePercentPerPerson
        app.applicationFeePercentPerPersonType =
          selectedProductDetails.applicationFeePercentPerPersonType
        app.representativeFees =
          selectedProductDetails.representativeFees ||
          defaultValues.representativeFees
        app.allowRepresentativeFeesAdjustment =
          selectedProductDetails.allowRepresentativeFeesAdjustment
        app.stamps = selectedProductDetails.stamps || defaultValues.stamps
        app.allowStampsAdjustment = selectedProductDetails.allowStampsAdjustment
        app.adminFees =
          selectedProductDetails.adminFees || defaultValues.adminFees
        app.allowAdminFeesAdjustment =
          selectedProductDetails.allowAdminFeesAdjustment
        app.minPrincipal =
          selectedProductDetails.minPrincipal || defaultValues.minPrincipal
        app.maxPrincipal =
          selectedProductDetails.maxPrincipal || defaultValues.maxPrincipal
        app.minInstallment =
          selectedProductDetails.minInstallment || defaultValues.minInstallment
        app.maxInstallment =
          selectedProductDetails.maxInstallment || defaultValues.maxInstallment
        app.noOfGuarantors =
          selectedProductDetails.noOfGuarantors || defaultValues.noOfGuarantors
        app.allowApplicationFeeAdjustment =
          selectedProductDetails.allowApplicationFeeAdjustment
        app.beneficiaryType = selectedProductDetails.beneficiaryType
        app.branchManagerAndDate = selectedProductDetails.branchManagerAndDate
        app.branchManagerId = ''
        app.managerVisitDate = ''
        app.productType = selectedProductDetails.type
        app.financialLeasing = selectedProductDetails.financialLeasing
      })
    )
  }

  removeOptionalGuar(obj, index, values) {
    this.setState({ loading: true })
    const application = produce(values as Application, (draftApp) => {
      draftApp.guarantorIds = draftApp.guarantorIds.filter(
        (id) => obj.guarantor._id !== id
      )
      draftApp.guarantors.splice(index, 1)
    })

    this.setState({ application, loading: false })
  }

  removeEntitledToSignRow(obj, index, values) {
    this.setState({ loading: true })
    const application = produce(values as Application, (draftApp) => {
      draftApp.entitledToSignIds = draftApp.entitledToSignIds.filter(
        ({ customerId }) => obj.entitledToSign._id !== customerId
      )
      draftApp.entitledToSign.splice(index, 1)
    })

    this.setState({ application, loading: false })
  }

  populateCustomer(response) {
    this.getOfficerName(response.representative)
    this.setState(
      produce<State>((draftState) => {
        const app = draftState.application
        app.customerName = response.customerName
        app.customerType = response.customerType
        app.nationalId = response.nationalId
        app.birthDate = getDateString(response.birthDate)
        app.gender = getGenderFromNationalId(response.nationalId)
        app.nationalIdIssueDate = getDateString(response.nationalIdIssueDate)
        app.businessSector = response.businessSector
        app.businessActivity = response.businessActivity
        app.businessSpeciality = response.businessSpeciality
        app.permanentEmployeeCount = response.permanentEmployeeCount
        app.partTimeEmployeeCount = response.partTimeEmployeeCount
        app.representative = response.representative
        app.nanoLoansLimit = response.nanoLoansLimit
      })
    )
  }

  async searchCustomers(keyword?: string, key?: string) {
    this.setState({ loading: true, branchCustomers: [] })
    const query =
      !keyword || keyword.trim().length === 0 || !key
        ? {
            from: 0,
            size: 2000,
            branchId: this.state.branchId,
            representativeId: this.state.selectedLoanOfficer._id,
            customerType: 'individual',
          }
        : {
            from: 0,
            size: 2000,
            branchId: this.state.branchId,
            representativeId: this.state.selectedLoanOfficer._id,
            [key]: ['code', 'key'].includes(key) ? Number(keyword) : keyword,
            key: ['customerShortenedCode'].includes(key)
              ? getFullCustomerKey(keyword)
              : ['key'].includes(key)
              ? Number(keyword)
              : undefined,
            customerType: 'individual',
          }
    const results = await searchCustomer(query)
    if (results.status === 'success') {
      this.setState({ loading: false, branchCustomers: results.body.data })
    } else {
      Swal.fire('Error !', getErrorMessage(results.error.error), 'error')
      this.setState({ loading: false })
    }
  }

  selectLO(e) {
    this.setState({ selectedLoanOfficer: e }, () => {
      this.searchCustomers()
    })
  }

  async checkCustomersLimits(customers, guarantor) {
    const customerIds: Array<string> = []
    customers.forEach((customer) => customerIds.push(customer._id))
    this.setState({ loading: true })
    const res = await getCustomersBalances({ ids: customerIds })
    if (res.status === 'success') {
      this.setState({ loading: false })
      const merged: Array<any> = []
      const validationObject: any = {}
      for (let i = 0; i < customers.length; i += 1) {
        const customer = { ...customers[i] }
        delete customer.guarantorIds
        const obj = {
          ...customer,
          ...(res.body.data
            ? res.body.data.find((itmInner) => itmInner.id === customers[i]._id)
            : { id: customers[i]._id }),
          ...this.state.application.principals,
        }
        delete obj.id
        merged.push(obj)
      }
      if (res.body.data && res.body.data.length > 0) {
        merged.forEach((customer) => {
          if (!guarantor) {
            if (
              customer.nanoLoanIds?.length ||
              customer.nanoApplicationIds?.length
            ) {
              validationObject[customer._id] = {
                customerName: customer.customerName,
                ...(customer.nanoLoanIds && {
                  nanoLoanIds: customer.nanoLoanIds,
                }),
                ...(customer.nanoApplicationIds && {
                  nanoApplicationIds: customer.nanoApplicationIds,
                }),
              }
            }
            if (
              customer.applicationIds &&
              !customer.loanIds &&
              (this.state.isNano ||
                customer.applicationIds.length >= customer.maxLoansAllowed)
            ) {
              validationObject[customer._id] = {
                customerName: customer.customerName,
                applicationIds: customer.applicationIds,
              }
            }
            if (
              customer.loanIds &&
              !customer.applicationIds &&
              (this.state.isNano ||
                customer.loanIds.length >= customer.maxLoansAllowed)
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{ loanIds: customer.loanIds },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  loanIds: customer.loanIds,
                }
              }
            }
            if (
              customer.loanIds &&
              customer.applicationIds &&
              customer.loanIds.length + customer.applicationIds.length >=
                customer.maxLoansAllowed
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{
                    loanIds: customer.loanIds,
                    applicationIds: customer.applicationIds,
                  },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  loanIds: customer.loanIds,
                  applicationIds: customer.applicationIds,
                }
              }
            }
            if (
              customer.guarantorIds &&
              customer.guarantorIds.length >= 0 &&
              !customer.allowGuarantorLoan
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{ guarantorIds: customer.guarantorIds },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  guarantorIds: customer.guarantorIds,
                }
              }
            }
          } else {
            if (
              customer.applicationIds &&
              customer.applicationIds.length > 0 &&
              !customer.allowGuarantorLoan
            ) {
              validationObject[customer._id] = {
                customerName: customer.customerName,
                applicationIds: customer.applicationIds,
              }
            }
            if (
              customer.loanIds &&
              customer.loanIds.length > 0 &&
              !customer.allowGuarantorLoan
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{ loanIds: customer.loanIds },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  loanIds: customer.loanIds,
                }
              }
            }
            if (
              customer.guarantorIds &&
              customer.guarantorIds.length >= customer.guarantorMaxLoans
            ) {
              if (Object.keys(validationObject).includes(customer._id)) {
                validationObject[customer._id] = {
                  ...validationObject[customer._id],
                  ...{ guarantorIds: customer.guarantorIds },
                }
              } else {
                validationObject[customer._id] = {
                  customerName: customer.customerName,
                  guarantorIds: customer.guarantorIds,
                }
              }
            }
          }
        })
      }
      if (Object.keys(validationObject).length > 0) {
        return { flag: false, validationObject }
      }
      return { flag: true, customers: merged }
    }
    Swal.fire('error', getErrorMessage(res.error.error), 'error')
    this.setState({ loading: false })
    return { flag: false }
  }

  step(key) {
    if (
      this.state.step < 3 &&
      key === 'forward' &&
      !['financialLeasing', 'smeFinancialLeasing'].includes(
        this.state.customerType
      )
    ) {
      this.setState(
        produce<State>((draftState) => {
          draftState.step += 1
        })
      )
    } else if (
      this.state.step <= 3 &&
      key === 'forward' &&
      ['financialLeasing', 'smeFinancialLeasing'].includes(
        this.state.customerType
      )
    ) {
      this.setState(
        produce<State>((draftState) => {
          draftState.step += 1
        })
      )
    } else if (this.state.step >= 1 && key === 'backward') {
      this.setState(
        produce<State>((draftState) => {
          draftState.step -= 1
        })
      )
    }
  }

  renderStepOne() {
    return (
      <div
        className="d-flex flex-column justify-content-center"
        style={{ textAlign: 'right', width: '90%', padding: 20 }}
      >
        {this.state.customerType !== 'group' ? (
          <div style={{ justifyContent: 'center', display: 'flex' }}>
            <CustomerSearch
              source="loanApplication"
              style={{ width: '100%' }}
              handleSearch={(key, query) => this.handleSearch(key, query)}
              selectedCustomer={this.state.selectedCustomer}
              searchResults={this.state.searchResults}
              selectCustomer={(customer) => this.selectCustomer(customer)}
              sme={['sme', 'smeFinancialLeasing'].includes(
                this.state.customerType
              )}
            />
          </div>
        ) : (
          <div>
            <h4>{local.customersSelection}</h4>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <Form.Group
                controlId="loanOfficer"
                style={{ margin: 'auto', width: '60%' }}
              >
                <Form.Label>{local.loanOfficer}</Form.Label>
                <Select
                  name="loanOfficer"
                  data-qc="loanOfficer"
                  value={this.state.selectedLoanOfficer}
                  styles={theme.selectStyleWithBorder}
                  theme={theme.selectTheme}
                  enableReinitialize={false}
                  onChange={(event) => {
                    this.selectLO(event)
                  }}
                  type="text"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  options={this.state.loanOfficers}
                  isDisabled={this.state.selectedCustomers.length > 0}
                />
              </Form.Group>
            </div>
            {this.state.selectedLoanOfficer._id.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <DualBox
                  labelKey="customerName"
                  vertical
                  options={this.state.branchCustomers}
                  selected={this.state.selectedCustomers}
                  onChange={(list) => this.handleGroupChange(list)}
                  rightHeader={local.allCustomers}
                  leftHeader={local.selectedCustomers}
                  viewSelected={(id) => this.viewCustomer(id)}
                  search={(keyword, key) => this.searchCustomers(keyword, key)}
                  dropDownKeys={[
                    'nationalId',
                    'name',
                    'key',
                    'code',
                    'customerShortenedCode',
                  ]}
                  disabled={(customer) => checkGroupValidation(customer)}
                  disabledMessage={(customer) => getGroupErrorMessage(customer)}
                />
                {this.state.selectedCustomers.length <= 7 &&
                this.state.selectedCustomers.length >= 3 ? (
                  <Form.Group
                    controlId="leaderSelector"
                    style={{ margin: 'auto', width: '60%' }}
                  >
                    <Form.Label>{local.groupLeaderName}</Form.Label>
                    <Form.Control
                      as="select"
                      name="selectedGroupLeader"
                      data-qc="selectedGroupLeader"
                      value={this.state.selectedGroupLeader}
                      onChange={(event) => {
                        this.setGroupLeader(event.currentTarget.value)
                      }}
                    >
                      <option value="" disabled />
                      {this.state.selectedCustomers.map((customer, i) => (
                        <option key={i} value={customer._id}>
                          {customer.customerName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                ) : (
                  <span>{local.rangeOfGroup}</span>
                )}
              </div>
            )}
          </div>
        )}
        <div className="d-flex justify-content-between py-4">
          <Button
            variant="secondary"
            className="w-25"
            onClick={() => {
              this.props.history.push('/track-loan-applications', {
                sme: ['sme', 'smeFinancialLeasing'].includes(
                  this.state.customerType
                ),
              })
            }}
          >
            {local.cancel}
          </Button>
          <Button
            variant="primary"
            data-qc="next"
            className="w-25"
            disabled={
              (this.state.customerType === 'group' &&
                (this.state.selectedGroupLeader.length === 0 ||
                  this.state.selectedCustomers.length < 3)) ||
              (['individual', 'sme', 'smeFinancialLeasing'].includes(
                this.state.customerType
              ) &&
                Object.keys(this.state.selectedCustomer).length === 0)
            }
            onClick={() => this.step('forward')}
          >
            {local.next}
          </Button>
        </div>
      </div>
    )
  }

  renderStepTwo() {
    const filteredProducts = this.state.products.filter((product) => {
      return filterProducts(product, this.state.customerType, this.state.isNano)
    })
    return (
      <Formik
        initialValues={this.state.application}
        onSubmit={this.submit}
        validationSchema={
          ['sme', 'smeFinancialLeasing'].includes(this.state.customerType)
            ? SMELoanApplicationValidation
            : LoanApplicationValidation
        }
        validateOnBlur
        validateOnChange
        enableReinitialize
      >
        {(formikProps) => (
          <LoanApplicationCreationForm
            {...formikProps}
            formulas={this.state.formulas}
            loanUsage={this.state.loanUsage}
            products={filteredProducts}
            step={(key) => this.step(key)}
            getSelectedLoanProduct={(id) => this.getSelectedLoanProduct(id)}
            customer={
              this.state.customerType === 'group'
                ? this.state.selectedCustomers
                : this.state.selectedCustomer
            }
          />
        )}
      </Formik>
    )
  }

  renderStepThree() {
    return (
      <Formik
        initialValues={this.state.application}
        onSubmit={this.submit}
        validationSchema={
          ['sme', 'smeFinancialLeasing'].includes(this.state.customerType)
            ? SMELoanApplicationStep2Validation
            : LoanApplicationValidation
        }
        validateOnBlur
        validateOnChange
        enableReinitialize
      >
        {(formikProps) => (
          <LoanApplicationCreationGuarantorForm
            {...formikProps}
            step={(key) => this.step(key)}
            addGuar={(stringKey?: string) =>
              this.addOptionalGuarantor(stringKey)
            }
            removeGuar={(guarantor, i, values) =>
              this.removeOptionalGuar(guarantor, i, values)
            }
            handleSearch={(key, query, guarantor, companySearch) => {
              this.handleSearchGuarantors(key, query, guarantor, companySearch)
            }}
            selectGuarantor={(query, guarantor, values) => {
              this.selectGuarantor(query, guarantor, values)
            }}
            removeGuarantor={(query, guarantor, values) => {
              this.removeGuarantor(query, guarantor, values)
            }}
            addEntitledToSignRow={() => this.addEntitledToSignRow()}
            removeEntitledToSignRow={(guarantor, i, values) =>
              this.removeEntitledToSignRow(guarantor, i, values)
            }
            handleSearchEntitledToSign={(key, query, guarantor) => {
              this.handleSearchEntitledToSign(key, query, guarantor)
            }}
            selectEntitledToSign={(query, guarantor, values) => {
              this.selectEntitledToSign(query, guarantor, values)
            }}
            removeEntitledToSign={(query, guarantor, values) => {
              this.removeEntitledToSign(query, guarantor, values)
            }}
            customer={
              this.state.customerType === 'group'
                ? this.state.selectedCustomers
                : this.state.selectedCustomer
            }
          />
        )}
      </Formik>
    )
  }

  renderStepFour = () => (
    <Formik
      initialValues={this.state.application}
      onSubmit={this.submit}
      validationSchema={
        ['sme', 'smeFinancialLeasing'].includes(this.state.customerType)
          ? SMELoanApplicationStep2Validation
          : LoanApplicationValidation
      }
      validateOnBlur
      validateOnChange
      enableReinitialize
    >
      {(formikProps) => (
        <FinancialLeasingDetailsForm
          {...formikProps}
          step={(key) => this.step(key)}
        />
      )}
    </Formik>
  )

  renderSteps() {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne()
      case 2:
        return this.renderStepTwo()
      case 3:
        return this.renderStepThree()
      case 4:
        return this.renderStepFour()
      default:
        return null
    }
  }

  render() {
    return (
      <Container>
        <Loader open={this.state.loading} type="fullscreen" />
        <Card>
          {this.state.customerType === '' ? (
            chooseCustomerType(
              (customerType) => this.setCustomerType(customerType),
              this.props.location.state.sme
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Wizard
                currentStepNumber={this.state.step - 1}
                stepsDescription={
                  ['individual', 'financialLeasing'].includes(
                    this.state.customerType
                  )
                    ? [
                        local.customersDetails,
                        local.loanInfo,
                        local.guarantorInfo,
                        local.loanInfo,
                      ]
                    : ['sme', 'smeFinancialLeasing'].includes(
                        this.state.customerType
                      )
                    ? [
                        local.viewCompany,
                        local.loanInfo,
                        local.guarantorInfo,
                        local.loanInfo,
                      ]
                    : [local.customersDetails, local.loanInfo]
                }
              />
              {this.renderSteps()}
            </div>
          )}
        </Card>
        {this.state.showModal && (
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <Modal.Body>
              <InfoBox values={this.state.customerToView} />
            </Modal.Body>
          </Modal>
        )}
      </Container>
    )
  }
}
export default withRouter(LoanApplicationCreation)
