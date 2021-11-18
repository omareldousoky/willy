import React, { Component } from 'react'
import { Formik } from 'formik'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Swal from 'sweetalert2'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { doneSuccessfully } from 'Shared/localUtils'
import { changeCustomerMobilePhoneNumber } from 'Shared/Services/APIs/customer/changeCustomerMobileNumber'
import Wizard from '../../../Shared/Components/wizard/Wizard'
import { Loader } from '../../../Shared/Components/Loader'
import { StepOneForm } from './StepOneForm'
import { StepTwoForm } from './StepTwoForm'
import { StepThreeForm } from './StepThreeForm'
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
import { step1, step2, step3 } from '../../../Shared/Constants/customer'
import {
  customerCreationValidationStepOne,
  customerCreationValidationStepTwo,
  customerCreationValidationStepThreeEdit,
  customerCreationValidationStepThree,
} from '../../../Shared/Validations/customer'
import {
  CustomerCreationStep1,
  CustomerCreationStep2,
  CustomerCreationStep3,
} from '../../../Shared/Models/Customer'

interface Props extends RouteComponentProps<{}, {}, { id: string }> {
  edit: boolean
}
interface State {
  step: number
  step1: CustomerCreationStep1
  step2: CustomerCreationStep2
  step3: CustomerCreationStep3
  customerId: string
  selectedCustomer: any
  loading: boolean
  hasLoan: boolean
  isGuarantor: boolean
  oldRepresentative: string
  branchId: string
  editMobileNumber: boolean
}

class CustomerCreation extends Component<Props, State> {
  formikStep1 = {
    isValid: true,
    values: step1,
  }

  formikStep2 = {
    isValid: true,
    values: step2,
  }

  formikStep3 = {
    isValid: true,
    values: step3,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      step: 1,
      step1,
      step2,
      step3,
      customerId: '',
      loading: false,
      hasLoan: false,
      isGuarantor: false,
      selectedCustomer: {},
      oldRepresentative: '',
      branchId: '',
      editMobileNumber: !props.edit,
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.getCustomerById()
    }
  }

  async getCustomerById() {
    this.setState({ loading: true })
    const res = await getCustomerByID(this.props.location.state.id)
    if (res.status === 'success') {
      const customerInfo = {
        customerName: res.body.customer.customerName?.trim(),
        nationalId: res.body.customer.nationalId,
        birthDate: timeToDateyyymmdd(res.body.customer.birthDate),
        gender: res.body.customer.gender,
        nationalIdIssueDate: timeToDateyyymmdd(
          res.body.customer.nationalIdIssueDate
        ),
        homePostalCode: res.body.customer.homePostalCode,
        customerHomeAddress: res.body.customer.customerHomeAddress,
        currentHomeAddress: res.body.customer.currentHomeAddress,
        customerAddressLatLong: res.body.customer.customerAddressLatLong,
        customerAddressLatLongNumber: {
          lat: res.body.customer.customerAddressLatLong
            ? Number(res.body.customer.customerAddressLatLong.split(',')[0])
            : 0,
          lng: res.body.customer.customerAddressLatLong
            ? Number(res.body.customer.customerAddressLatLong.split(',')[1])
            : 0,
        },
        homePhoneNumber: res.body.customer.homePhoneNumber,
        faxNumber: res.body.customer.faxNumber,
        mobilePhoneNumber: res.body.customer.mobilePhoneNumber,
        customerWebsite: res.body.customer.customerWebsite?.trim(),
        emailAddress: res.body.customer.emailAddress?.trim(),
        currHomeAddressGov: res.body.customer.currHomeAddressGov,
        policeStation: res.body.customer.policeStation,
        initialConsumerFinanceLimit:
          res.body.customer.initialConsumerFinanceLimit,
      }
      const customerBusiness = {
        businessAddressLatLong: res.body.customer.businessAddressLatLong,
        businessAddressLatLongNumber: {
          lat: res.body.customer.businessAddressLatLong
            ? Number(res.body.customer.businessAddressLatLong.split(',')[0])
            : 0,
          lng: res.body.customer.businessAddressLatLong
            ? Number(res.body.customer.businessAddressLatLong.split(',')[1])
            : 0,
        },
        businessName: res.body.customer.businessName,
        businessAddress: res.body.customer.businessAddress,
        governorate: res.body.customer.governorate,
        district: res.body.customer.district,
        village: res.body.customer.village,
        ruralUrban: res.body.customer.ruralUrban,
        businessPostalCode: res.body.customer.businessPostalCode,
        businessPhoneNumber: res.body.customer.businessPhoneNumber,
        businessSector: res.body.customer.businessSector,
        businessActivity: res.body.customer.businessActivity,
        businessSpeciality: res.body.customer.businessSpeciality,
        businessLicenseNumber: res.body.customer.businessLicenseNumber,
        businessLicenseIssuePlace: res.body.customer.businessLicenseIssuePlace,
        businessLicenseIssueDate: timeToDateyyymmdd(
          res.body.customer.businessLicenseIssueDate
        ),
        commercialRegisterNumber: res.body.customer.commercialRegisterNumber,
        industryRegisterNumber: res.body.customer.industryRegisterNumber,
        taxCardNumber: res.body.customer.taxCardNumber,
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
        maxPrincipal: res.body.customer.maxPrincipal
          ? Number(res.body.customer.maxPrincipal)
          : 0,
        guarantorMaxCustomers: res.body.customer.guarantorMaxCustomers
          ? Number(res.body.customer.guarantorMaxCustomers)
          : 1,
      }
      this.formikStep1 = {
        values: { ...this.state.step1, ...customerInfo },

        isValid: true,
      }
      this.formikStep2 = {
        values: { ...this.state.step2, ...customerBusiness },

        isValid: true,
      }
      this.formikStep3 = {
        values: { ...this.state.step3, ...customerExtraDetails },
        isValid: true,
      }
      this.setState(
        (prevState) =>
          ({
            loading: false,
            selectedCustomer: res.body.customer,
            step1: { ...prevState.step1, ...customerInfo },
            step2: { ...prevState.step2, ...customerBusiness },
            step3: { ...prevState.step3, ...customerExtraDetails },
            hasLoan: res.body.customer.hasLoan,
            isGuarantor: res.body.customer.isGuarantor,
            oldRepresentative: res.body.customer.representative,
            branchId: res.body.customer.branchId,
          } as any)
      )
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
      )
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
      }
      step3.principals = principals
      this.setState((prevState) => ({
        loading: false,
        step3: { ...prevState.step3, principals },
      }))
    } else {
      this.setState({ loading: false }, () =>
        Swal.fire('Error !', getErrorMessage(princples.error.error), 'error')
      )
    }
  }

  submit = (values: object) => {
    if (this.props.edit && this.state.step === 2) this.getGlobalPrinciple()
    if (this.state.step < 3) {
      this.setState(
        (prevState) =>
          ({
            [`step${prevState.step}`]: values,
            step: prevState.step + 1,
          } as any)
      )
    } else {
      this.setState({ step3: values, loading: true } as any, () =>
        this.createEditCustomer()
      )
    }
  }

  handleWizardClick = (index: number) => {
    if (this.props.edit && index === 2) this.getGlobalPrinciple()
    if (
      this.formikStep1.isValid === true &&
      this.formikStep2.isValid === true &&
      this.formikStep3.isValid === true
    )
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
        case 3:
          return this.setState({
            step3: this.formikStep3.values,
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
      ...this.state.step3,
    }
    objToSubmit.birthDate = new Date(objToSubmit.birthDate).valueOf()
    objToSubmit.nationalIdIssueDate = new Date(
      objToSubmit.nationalIdIssueDate
    ).valueOf()
    objToSubmit.customerAddressLatLongNumber?.lat === 0 &&
    objToSubmit.customerAddressLatLongNumber?.lng === 0
      ? (objToSubmit.customerAddressLatLong = '')
      : (objToSubmit.customerAddressLatLong = `${objToSubmit.customerAddressLatLongNumber?.lat},${objToSubmit.customerAddressLatLongNumber?.lng}`)
    this.state.step2.businessAddressLatLongNumber?.lat === 0 &&
    this.state.step2.businessAddressLatLongNumber?.lng === 0
      ? (objToSubmit.businessAddressLatLong = '')
      : (objToSubmit.businessAddressLatLong = `${this.state.step2.businessAddressLatLongNumber?.lat},${this.state.step2.businessAddressLatLongNumber?.lng}`)
    objToSubmit.businessLicenseIssueDate = new Date(
      objToSubmit.businessLicenseIssueDate
    ).valueOf()
    objToSubmit.applicationDate = new Date(
      objToSubmit.applicationDate
    ).valueOf()
    objToSubmit.permanentEmployeeCount = Number(
      objToSubmit.permanentEmployeeCount
    )
    objToSubmit.partTimeEmployeeCount = Number(
      objToSubmit.partTimeEmployeeCount
    )
    objToSubmit.representative =
      this.state.oldRepresentative !== objToSubmit.newRepresentative
        ? this.state.oldRepresentative
        : objToSubmit.representative
    objToSubmit.newRepresentative =
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
        Swal.fire('', local.customerEdited, 'success').then(() => {
          this.setState({ step: 4, customerId: res.body.customerId })
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
          local.customerCreated +
            ' ' +
            local.withCode +
            ' ' +
            res.body.customerKey,
          'success'
        ).then(() => {
          this.setState({ step: 4, customerId: res.body.customerId })
        })
      } else {
        this.setState({ loading: false }, () =>
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        )
      }
    }
  }

  changeMobileNumber(customerId, mobileNumber) {
    Swal.fire({
      title: local.areYouSure,
      text: `${
        local.will +
        ' ' +
        local.changeCfMobileNumber +
        ' ' +
        local.from +
        ' ' +
        this.state.step1.mobilePhoneNumber +
        ' ' +
        local.to +
        ' ' +
        mobileNumber
      }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: local.changeCfMobileNumber,
      cancelButtonText: local.cancel,
    }).then(async (result) => {
      if (result.value) {
        this.setState({ loading: true })
        const res = await changeCustomerMobilePhoneNumber(
          customerId,
          mobileNumber
        )
        if (res.status === 'success') {
          this.setState({ loading: false, editMobileNumber: false })
          Swal.fire('', doneSuccessfully(), 'success').then(() =>
            this.getCustomerById()
          )
        } else {
          this.setState({ loading: false })
          Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
        }
      }
    })
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
        validationSchema={customerCreationValidationStepOne}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep1 = formikProps
          }

          return (
            <StepOneForm
              {...formikProps}
              edit={this.props.edit}
              hasLoan={this.state.hasLoan}
              isGuarantor={this.state.isGuarantor}
              consumerFinanceLimit={
                this.state.selectedCustomer.initialConsumerFinanceLimit
              }
              consumerFinanceLimitStatus={
                this.state.selectedCustomer.consumerFinanceLimitStatus
              }
              changeMobileNumber={(number) =>
                this.changeMobileNumber(this.state.selectedCustomer._id, number)
              }
              setEditMobileNumber={(bool: boolean) =>
                this.setState({ editMobileNumber: bool })
              }
              editMobileNumber={this.state.editMobileNumber}
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
        validationSchema={customerCreationValidationStepTwo}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep2 = formikProps
          }

          return (
            <StepTwoForm
              {...formikProps}
              previousStep={(valuesOfStep2) =>
                this.previousStep(valuesOfStep2, 2)
              }
              hasLoan={this.state.hasLoan}
              isGuarantor={this.state.isGuarantor}
              edit={this.props.edit}
            />
          )
        }}
      </Formik>
    )
  }

  renderStepThree(): any {
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.step3}
        onSubmit={this.submit}
        validationSchema={
          ability.can('updateNationalId', 'customer') && this.props.edit
            ? customerCreationValidationStepThreeEdit
            : customerCreationValidationStepThree
        }
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep3 = formikProps
          }
          return (
            <StepThreeForm
              {...formikProps}
              representativeDetails={this.state.step3}
              previousStep={(valuesOfStep3) =>
                this.previousStep(valuesOfStep3, 3)
              }
              edit={this.props.edit}
              hasLoan={this.state.hasLoan}
              isGuarantor={this.state.isGuarantor}
              branchId={this.state.branchId}
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
        previousStep={() => this.setState({ step: 3 })}
        edit={this.props.edit}
        view={false}
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
        return this.renderStepThree()
      case 4:
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
              onClick={
                this.state.editMobileNumber ? null : this.handleWizardClick
              }
              stepsDescription={[
                local.mainInfo,
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

export default withRouter(CustomerCreation)
