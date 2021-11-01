import React, { Component } from 'react'
import { Formik } from 'formik'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Swal from 'sweetalert2'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import produce from 'immer'
import Wizard from '../../../Shared/Components/wizard/Wizard'
import { Loader } from '../../../Shared/Components/Loader'
import {
  companyCreationValidationStepOne,
  companyCreationValidationStepTwo,
  companyCreationValidationStepTwoEdit,
  step1Company,
  step2Company,
} from './companyFormIntialState'
import { StepOneCompanyForm } from './StepOneCompanyForm'
import { StepTwoCompanyForm } from './StepTwoCompanyForm'
import { DocumentsUpload } from '../../../Shared/Components/Customer'
import * as local from '../../../Shared/Assets/ar.json'
import {
  getErrorMessage,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'
import ability from '../../config/ability'
import { getMaxPrinciples } from '../../../Shared/Services/APIs/config'
import { createCustomer } from '../../../Shared/Services/APIs/customer/createCustomer'
import { editCustomer } from '../../../Shared/Services/APIs/customer/editCustomer'
import { getCustomerByID } from '../../../Shared/Services/APIs/customer/getCustomer'

interface Props extends RouteComponentProps<{}, {}, { id?: string }> {
  edit: boolean
  isCompany?: boolean
}
interface State {
  step: number
  step1: {
    businessName: string
    businessAddress: string
    businessCharacteristic: string
    businessSector: string
    businessActivityDetails: string
    legalConstitution: string
    smeCategory: string
    businessLicenseNumber: string
    // businessLicenseIssuePlace: string
    businessLicenseIssueDate: any
    commercialRegisterNumber: string
    commercialRegisterExpiryDate: string | number
    // industryRegisterNumber: string
    taxCardNumber: string
    customerType: string
    initialConsumerFinanceLimit?: number
  }
  step2: {
    geographicalDistribution: string
    geoAreaId: string
    representative: any
    newRepresentative: any
    representativeName: string
    applicationDate: any
    permanentEmployeeCount: any
    partTimeEmployeeCount: any
    comments: string
    guarantorMaxLoans: number
    maxLoansAllowed: number
    principals?: {
      maxIndividualPrincipal: number
      maxGroupIndividualPrincipal: number
      maxGroupPrincipal: number
    }
    cbeCode: string
    paidCapital: number
    establishmentDate: number | string
    smeSourceId: string
    smeBankName: string
    smeBankBranch: string
    smeBankAccountNumber: string
    smeIbanNumber: string
    guarantorMaxCustomers: number
  }
  customerId: string
  selectedCustomer: any
  loading: boolean
  hasLoan: boolean
  isGuarantor: boolean
  oldRepresentative: string
  branchId: string
  companyKey: string
}

class CompanyCreation extends Component<Props, State> {
  formikStep1: any = {
    isValid: true,
    values: step1Company,
    errors: {},
  }

  formikStep2: any = {
    isValid: true,
    values: step2Company,
    errors: {},
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      step: 1,
      step1: step1Company,
      step2: step2Company,
      customerId: '',
      loading: false,
      hasLoan: false,
      isGuarantor: false,
      selectedCustomer: {},
      oldRepresentative: '',
      branchId: '',
      companyKey: '',
    }
  }

  componentDidMount() {
    if (this.props.edit && this.props.location.state.id) {
      this.getCustomerById(this.props.location.state.id)
    }
  }

  async getCustomerById(id) {
    this.setState({ loading: true })
    const res = await getCustomerByID(id)
    if (res.status === 'success') {
      const customerBusiness = {
        businessName: res.body.customer.businessName,
        businessAddress: res.body.customer.businessAddress,
        businessCharacteristic: res.body.customer.businessCharacteristic,
        businessSector: res.body.customer.businessSector,
        businessActivityDetails: res.body.customer.businessActivityDetails,
        legalConstitution: res.body.customer.legalConstitution || 'other',
        smeCategory: res.body.customer.smeCategory || 'other',
        businessLicenseNumber: res.body.customer.businessLicenseNumber,
        // businessLicenseIssuePlace: res.body.customer.businessLicenseIssuePlace,
        businessLicenseIssueDate: timeToDateyyymmdd(
          res.body.customer.businessLicenseIssueDate
        ),
        commercialRegisterExpiryDate: timeToDateyyymmdd(
          res.body.customer.commercialRegisterExpiryDate
        ),
        commercialRegisterNumber: res.body.customer.commercialRegisterNumber,
        // industryRegisterNumber: res.body.customer.industryRegisterNumber,
        taxCardNumber: res.body.customer.taxCardNumber,
        governorate: res.body.customer.governorate,
        policeStation: res.body.customer.policeStation,
        currHomeAddressGov: res.body.customer.currHomeAddressGov,
        currentHomeAddress: res.body.customer.currentHomeAddress,
        initialConsumerFinanceLimit:
          res.body.customer.initialConsumerFinanceLimit,
        mobilePhoneNumber: res.body.customer.mobilePhoneNumber,
      }
      const customerExtraDetails = {
        geographicalDistribution: res.body.customer.geographicalDistribution,
        geoAreaId: res.body.customer.geoAreaId
          ? res.body.customer.geoAreaId
          : '',
        representative: res.body.customer.representative,
        representativeName: res.body.customer.representativeName,
        applicationDate: timeToDateyyymmdd(res.body.customer.applicationDate),
        permanentEmployeeCount: res.body.customer.permanentEmployeeCount,
        partTimeEmployeeCount: res.body.customer.partTimeEmployeeCount,
        comments: res.body.customer.comments,
        maxLoansAllowed: res.body.customer.maxLoansAllowed
          ? Number(res.body.customer.maxLoansAllowed)
          : 1,
        allowGuarantorLoan: res.body.customer.allowGuarantorLoan,
        guarantorMaxLoans: res.body.customer.guarantorMaxLoans
          ? Number(res.body.customer.guarantorMaxLoans)
          : 1,
        cbeCode: res.body.customer.cbeCode,
        paidCapital: res.body.customer.paidCapital,
        establishmentDate: timeToDateyyymmdd(
          res.body.customer.establishmentDate
        ),
        smeSourceId: res.body.customer.smeSourceId,
        smeBankName: res.body.customer.smeBankName,
        smeBankBranch: res.body.customer.smeBankBranch,
        smeBankAccountNumber: res.body.customer.smeBankAccountNumber,
        smeIbanNumber: res.body.customer.smeIbanNumber,
        guarantorMaxCustomers: res.body.customer.guarantorMaxCustomers
          ? Number(res.body.customer.guarantorMaxCustomers)
          : 1,
      }
      this.formikStep1 = {
        values: { ...this.state.step1, ...customerBusiness },
        errors: {},
        isValid: true,
      }
      this.formikStep2 = {
        errors: {},
        values: { ...this.state.step2, ...customerExtraDetails },
        isValid: true,
      }
      this.setState(
        produce<State>((draftState) => {
          draftState.loading = false
          draftState.selectedCustomer = res.body.customer
          draftState.step1 = { ...draftState.step1, ...customerBusiness }
          draftState.step2 = { ...draftState.step2, ...customerExtraDetails }
          draftState.hasLoan = res.body.customer.hasLoan
          draftState.isGuarantor = res.body.customer.isGuarantor
          draftState.oldRepresentative = res.body.customer.representative
          draftState.branchId = res.body.customer.branchId
          draftState.companyKey = res.body.customer.key
        })
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
    }
  }

  async getGlobalPrinciple() {
    this.setState({ loading: true })
    const principles = await getMaxPrinciples()
    if (principles.status === 'success') {
      const principals = {
        maxIndividualPrincipal: principles.body.maxIndividualPrincipal,
        maxGroupIndividualPrincipal:
          principles.body.maxGroupIndividualPrincipal,
        maxGroupPrincipal: principles.body.maxGroupPrincipal,
      }
      this.setState(
        produce<State>((draftState) => {
          draftState.loading = false
          draftState.step2.principals = principals
        })
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(principles.error.error), 'error')
      )
    }
  }

  submit = (values: object) => {
    if (this.props.edit && this.state.step === 1) this.getGlobalPrinciple()
    if (this.state.step < 2) {
      this.setState(
        produce<State>((draftState) => {
          draftState[`step${draftState.step}`] = values
          draftState.step += 1
        })
      )
    } else {
      this.setState({ step2: values, loading: true } as any, () =>
        this.createEditCustomer()
      )
    }
  }

  handleWizardClick = (index: number) => {
    if (this.props.edit && index === 1) this.getGlobalPrinciple()
    if (this.formikStep1.isValid === true && this.formikStep2.isValid === true)
      switch (this.state.step) {
        case 1:
          return this.setState({
            step1: this.formikStep1.values,
            step: index + 1,
          })
        case 2:
          return this.setState({
            step2: this.formikStep2.values,
            step: index + 1,
          })
        default:
          return this.setState({
            step: index + 1,
          })
      }
  }

  async createEditCustomer() {
    const objToSubmit = {
      ...this.state.step1,
      ...this.state.step2,
      customerName: this.state.step1.businessName,
      customerHomeAddress: this.state.step1.businessAddress,
    }
    objToSubmit.businessLicenseIssueDate = new Date(
      objToSubmit.businessLicenseIssueDate
    ).valueOf()
    objToSubmit.applicationDate = new Date(
      objToSubmit.applicationDate
    ).valueOf()
    objToSubmit.establishmentDate = new Date(
      objToSubmit.establishmentDate
    ).valueOf()
    objToSubmit.commercialRegisterExpiryDate = new Date(
      objToSubmit.commercialRegisterExpiryDate
    ).valueOf()
    objToSubmit.permanentEmployeeCount = Number(
      objToSubmit.permanentEmployeeCount
    )
    objToSubmit.partTimeEmployeeCount = Number(
      objToSubmit.partTimeEmployeeCount
    )
    objToSubmit.representative =
      this.props.edit &&
      this.state.oldRepresentative !== objToSubmit.newRepresentative
        ? this.state.oldRepresentative
        : objToSubmit.representative
    objToSubmit.newRepresentative =
      this.props.edit &&
      this.state.oldRepresentative !== objToSubmit.newRepresentative
        ? objToSubmit.newRepresentative
        : ''
    if (objToSubmit?.guarantorMaxLoans && objToSubmit.guarantorMaxLoans > 0)
      objToSubmit.guarantorMaxLoans = Number(objToSubmit.guarantorMaxLoans)
    else objToSubmit.guarantorMaxLoans = 1
    if (objToSubmit?.maxLoansAllowed && objToSubmit.maxLoansAllowed > 0)
      objToSubmit.maxLoansAllowed = Number(objToSubmit.maxLoansAllowed)
    else objToSubmit.maxLoansAllowed = 1
    delete objToSubmit.principals
    if (this.props.edit) {
      const res = await editCustomer(
        objToSubmit,
        this.state.selectedCustomer._id
      )
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire('', local.companyEdited, 'success').then(() => {
          this.setState({ step: 3, customerId: res.body.customerId })
        })
      } else {
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    } else {
      const res = await createCustomer(objToSubmit)
      if (res.status === 'success') {
        this.setState({ loading: false })
        Swal.fire(
          '',
          local.companyCreated +
            ' ' +
            local.withCode +
            ' ' +
            res.body.customerKey,
          'success'
        ).then(() => {
          this.setState({ step: 3, customerId: res.body.customerId })
        })
      } else {
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    }
  }

  previousStep(values, step: number): void {
    this.setState({
      step: step - 1,
      [`step${step}`]: values,
    } as State)
  }

  renderStepOne(): any {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.step1}
        onSubmit={this.submit}
        validationSchema={companyCreationValidationStepOne}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep1 = formikProps
          }
          return (
            <StepOneCompanyForm
              {...formikProps}
              hasLoan={this.state.hasLoan}
              isGuarantor={this.state.isGuarantor}
              edit={this.props.edit}
              consumerFinanceLimitStatus={
                this.state.selectedCustomer.consumerFinanceLimitStatus
              }
            />
          )
        }}
      </Formik>
    )
  }

  renderStepTwo(): any {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.step2}
        onSubmit={this.submit}
        validationSchema={
          ability.can('updateNationalId', 'customer') && this.props.edit
            ? companyCreationValidationStepTwoEdit
            : companyCreationValidationStepTwo
        }
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep2 = formikProps
          }
          return (
            <StepTwoCompanyForm
              {...formikProps}
              representativeDetails={this.state.step2}
              previousStep={(valuesOfStep3) =>
                this.previousStep(valuesOfStep3, 2)
              }
              isGuarantor={this.state.isGuarantor}
              edit={this.props.edit}
              hasLoan={this.state.hasLoan}
              branchId={this.state.branchId}
              companyKey={this.state.companyKey}
            />
          )
        }}
      </Formik>
    )
  }

  renderDocuments() {
    return (
      <DocumentsUpload
        customerId={
          this.props.edit
            ? this.state.selectedCustomer._id
            : this.state.customerId
        }
        previousStep={() => this.setState({ step: 2 })}
        edit={this.props.edit}
        view={false}
        isCompany
      />
    )
  }

  renderSteps(): any {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne()
      case 2:
        return this.renderStepTwo()
      case 3:
        return this.renderDocuments()
      default:
        return null
    }
  }

  render() {
    return (
      <Container>
        <Loader open={this.state.loading} type="fullscreen" />
        <Card style={{ width: '100' }}>
          <div className="row-nowrap">
            <Wizard
              currentStepNumber={this.state.step - 1}
              edit={this.props.edit}
              onClick={this.handleWizardClick}
              stepsDescription={[
                local.workInfo,
                local.differentInfo,
                local.documents,
              ]}
            />
            <Card.Body style={{ width: '80%' }}>{this.renderSteps()}</Card.Body>
          </div>
        </Card>
      </Container>
    )
  }
}

export default withRouter(CompanyCreation)
