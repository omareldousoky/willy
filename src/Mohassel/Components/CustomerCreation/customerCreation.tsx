import React, { Component } from 'react';
import { Formik } from 'formik';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import Wizard from '../wizard/Wizard';
import { Loader } from '../../../Shared/Components/Loader';
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { editCustomer } from '../../Services/APIs/Customer-Creation/editCustomer';
import { step1, step2, step3, customerCreationValidationStepOne, customerCreationValidationStepTwo, customerCreationValidationStepThree, customerCreationValidationStepThreeEdit, } from './customerFormIntialState';
import { StepOneForm } from './StepOneForm';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import DocumentsUpload from './documentsUpload';
import { createCustomer } from '../../Services/APIs/Customer-Creation/createCustomer';
import * as local from '../../../Shared/Assets/ar.json';
import { getErrorMessage, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import ability from '../../config/ability';
import { getMaxPrinciples } from '../../Services/APIs/configApis/config';


interface CustomerInfo {
  birthDate: number;
  customerName?: string;
  nationalIdIssueDate: number;
  homePostalCode: number;
  nationalId?: string;
  customerHomeAddress?: string;
  customerAddressLatLong: string;
  customerAddressLatLongNumber: {
    lat: number;
    lng: number;
  };
}
interface CustomerBusiness {
  businessAddressLatLong: string;
  businessAddressLatLongNumber: {
    lat: number;
    lng: number;
  };
  businessPostalCode: any;
  businessLicenseIssueDate: any;
}
interface CustomerExtraDetails {
  applicationDate: any;
  permanentEmployeeCount: any;
  partTimeEmployeeCount: any;
  representative: any;
  maxLoansAllowed: number;
  allowGuarantorLoan: boolean;
  guarantorMaxLoans: number;
}
export interface Customer {
  customerInfo: CustomerInfo;
  customerBusiness: CustomerBusiness;
  customerExtraDetails: CustomerExtraDetails;
}
interface Props {
  history: Array<string>;
  location: {
    state: {
      id: string;
    };
  };
  edit: boolean;
};
interface State {
  step: number;
  step1: {
    birthDate: number;
    nationalIdIssueDate: number;
    homePostalCode: number;
    customerAddressLatLong: string;
    customerAddressLatLongNumber: {
      lat: number;
      lng: number;
    };
  };
  step2: {
    businessAddressLatLong: string;
    businessAddressLatLongNumber: {
      lat: number;
      lng: number;
    };
    businessName: string;
    businessAddress: string;
    governorate: string;
    district: string;
    village: string;
    ruralUrban: string;
    businessPostalCode: string;
    businessPhoneNumber: string;
    businessSector: string;
    businessActivity: string;
    businessSpeciality: string;
    businessLicenseNumber: string;
    businessLicenseIssuePlace: string;
    businessLicenseIssueDate: any;
    commercialRegisterNumber: string;
    industryRegisterNumber: string;
    taxCardNumber: string;
  };
  step3: {
    geographicalDistribution: string;
    geoAreaId: string;
    representative: any;
    newRepresentative: any;
    representativeName: string;
    applicationDate: any;
    permanentEmployeeCount: any;
    partTimeEmployeeCount: any;
    comments: string;
    guarantorMaxLoans: number;
    maxLoansAllowed: number;
    maxPrincipal: number;
    principals?: {
      maxIndividualPrincipal: number;
      maxGroupIndividualPrincipal: number;
      maxGroupPrincipal: number;
    };
  };
  customerId: string;
  selectedCustomer: any;
  loading: boolean;
  hasLoan: boolean;
  isGuarantor: boolean;
  searchResults: {
    results: Array<object>;
    empty: boolean;
  };
  oldRepresentative: string;
  branchId: string;
}

class CustomerCreation extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 1,
      step1: step1,
      step2: step2,
      step3: step3,
      customerId: '',
      loading: false,
      hasLoan: false,
      isGuarantor: false,
      searchResults: {
        results: [],
        empty: false
      },
      selectedCustomer: {},
      oldRepresentative: '',
      branchId: ''
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.getCustomerById();
    }
  }
  formikStep1: any = {
    isValid: true,
    values: step1,
    errors: {},
  };
  formikStep2: any = {
    isValid: true,
    values: step2,
    errors: {},
  };
  formikStep3: any = {
    isValid: true,
    values: step3,
    errors: {},
  };
  async getCustomerById() {
    this.setState({ loading: true });
    const res = await getCustomerByID(this.props.location.state.id)
    if (res.status === 'success') {
      const customerInfo = {
        customerName: res.body.customerName?.trim(),
        nationalId: res.body.nationalId,
        birthDate: timeToDateyyymmdd(res.body.birthDate),
        gender: res.body.gender,
        nationalIdIssueDate: timeToDateyyymmdd(res.body.nationalIdIssueDate),
        homePostalCode: res.body.homePostalCode,
        customerHomeAddress: res.body.customerHomeAddress,
        currentHomeAddress: res.body.currentHomeAddress,
        customerAddressLatLong: res.body.customerAddressLatLong,
        customerAddressLatLongNumber: {
          lat: res.body.customerAddressLatLong ? Number(res.body.customerAddressLatLong.split(',')[0]) : 0,
          lng: res.body.customerAddressLatLong ? Number(res.body.customerAddressLatLong.split(',')[1]) : 0,
        },
        homePhoneNumber: res.body.homePhoneNumber,
        faxNumber: res.body.faxNumber,
        mobilePhoneNumber: res.body.mobilePhoneNumber,
        customerWebsite: res.body.customerWebsite?.trim(),
        emailAddress: res.body.emailAddress?.trim()
      };
      const customerBusiness = {
        businessAddressLatLong: res.body.businessAddressLatLong,
        businessAddressLatLongNumber: {
          lat: res.body.businessAddressLatLong ? Number(res.body.businessAddressLatLong.split(',')[0]) : 0,
          lng: res.body.businessAddressLatLong ? Number(res.body.businessAddressLatLong.split(',')[1]) : 0,
        },
        businessName: res.body.businessName,
        businessAddress: res.body.businessAddress,
        governorate: res.body.governorate,
        district: res.body.district,
        village: res.body.village,
        ruralUrban: res.body.ruralUrban,
        businessPostalCode: res.body.businessPostalCode,
        businessPhoneNumber: res.body.businessPhoneNumber,
        businessSector: res.body.businessSector,
        businessActivity: res.body.businessActivity,
        businessSpeciality: res.body.businessSpeciality,
        businessLicenseNumber: res.body.businessLicenseNumber,
        businessLicenseIssuePlace: res.body.businessLicenseIssuePlace,
        businessLicenseIssueDate: timeToDateyyymmdd(res.body.businessLicenseIssueDate),
        commercialRegisterNumber: res.body.commercialRegisterNumber,
        industryRegisterNumber: res.body.industryRegisterNumber,
        taxCardNumber: res.body.taxCardNumber,
      };
      const customerExtraDetails = {
        geographicalDistribution: res.body.geographicalDistribution,
        geoAreaId: res.body.geoAreaId ? res.body.geoAreaId : '',
        representative: res.body.representative,
        representativeName: res.body.representativeName,
        applicationDate: timeToDateyyymmdd(res.body.applicationDate),
        permanentEmployeeCount: res.body.permanentEmployeeCount,
        partTimeEmployeeCount: res.body.partTimeEmployeeCount,
        comments: res.body.comments,
        maxLoansAllowed: res.body.maxLoansAllowed ? Number(res.body.maxLoansAllowed) : 1,
        allowGuarantorLoan: res.body.allowGuarantorLoan,
        guarantorMaxLoans: res.body.guarantorMaxLoans ? Number(res.body.guarantorMaxLoans) : 1,
        maxPrincipal: res.body.maxPrincipal ? Number(res.body.maxPrincipal) : 0,
      };
      this.formikStep1 = {
        values: { ...this.state.step1, ...customerInfo },
        errors: {},
        isValid: true,
      };
      this.formikStep2 = {
        values: { ...this.state.step2, ...customerBusiness },
        errors: {},
        isValid: true,
      };
      this.formikStep3 = {
        errors: {},
        values: { ...this.state.step3, ...customerExtraDetails },
        isValid: true,

      };
      this.setState({
        loading: false,
        selectedCustomer: res.body,
        step1: { ...this.state.step1, ...customerInfo },
        step2: { ...this.state.step2, ...customerBusiness },
        step3: { ...this.state.step3, ...customerExtraDetails },
        hasLoan: res.body.hasLoan,
        isGuarantor: res.body.isGuarantor,
        oldRepresentative: res.body.representative,
        branchId: res.body.branchId
      } as any);
    } else {
      this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(res.error.error),'error'));
    }
  }
  submit = (values: object) => {
    if (this.props.edit && this.state.step === 2) this.getGlobalPrinciple();
    if (this.state.step < 3) {
      this.setState({
        [`step${this.state.step}`]: values,
        step: this.state.step + 1,
      } as any);
    } else {
      this.setState({ step3: values, loading: true } as any, () => this.createEditCustomer())
    }
  }
  async createEditCustomer() {
    const objToSubmit = { ...this.state.step1, ...this.state.step2, ...this.state.step3 };
    objToSubmit.birthDate = new Date(objToSubmit.birthDate).valueOf();
    objToSubmit.nationalIdIssueDate = new Date(objToSubmit.nationalIdIssueDate).valueOf();
    objToSubmit.customerAddressLatLongNumber?.lat === 0 && objToSubmit.customerAddressLatLongNumber?.lng === 0 ? objToSubmit.customerAddressLatLong = '' : objToSubmit.customerAddressLatLong = `${objToSubmit.customerAddressLatLongNumber?.lat},${objToSubmit.customerAddressLatLongNumber?.lng}`;
    this.state.step2.businessAddressLatLongNumber?.lat === 0 && this.state.step2.businessAddressLatLongNumber?.lng === 0 ? objToSubmit.businessAddressLatLong = '' : objToSubmit.businessAddressLatLong = `${this.state.step2.businessAddressLatLongNumber?.lat},${this.state.step2.businessAddressLatLongNumber?.lng}`;
    objToSubmit.businessLicenseIssueDate = new Date(objToSubmit.businessLicenseIssueDate).valueOf();
    objToSubmit.applicationDate = new Date(objToSubmit.applicationDate).valueOf();
    objToSubmit.permanentEmployeeCount = Number(objToSubmit.permanentEmployeeCount);
    objToSubmit.partTimeEmployeeCount = Number(objToSubmit.partTimeEmployeeCount);
    objToSubmit.representative = (this.state.oldRepresentative !== objToSubmit.newRepresentative) ? this.state.oldRepresentative : objToSubmit.representative;
    objToSubmit.newRepresentative = (this.state.oldRepresentative !== objToSubmit.newRepresentative) ? objToSubmit.newRepresentative : '';
    if (objToSubmit?.guarantorMaxLoans && objToSubmit.guarantorMaxLoans > 0) objToSubmit.guarantorMaxLoans = Number(objToSubmit.guarantorMaxLoans);
    else objToSubmit.guarantorMaxLoans = 1;
    if (objToSubmit?.maxLoansAllowed && objToSubmit.maxLoansAllowed > 0) objToSubmit.maxLoansAllowed = Number(objToSubmit.maxLoansAllowed);
    else objToSubmit.maxLoansAllowed = 1;
    delete objToSubmit.principals
    if (this.props.edit) {
      const res = await editCustomer(objToSubmit, this.state.selectedCustomer._id);
      if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("", local.customerEdited, "success").then(() => { this.setState({ step: 4, customerId: res.body.customerId }) })
      } else {
        this.setState({ loading: false },()=> Swal.fire('Error !', getErrorMessage(res.error.error),'error'));
      }
    } else {
      const res = await createCustomer(objToSubmit);
      if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("", local.customerCreated + ' ' + local.withCode + ' ' + res.body.customerKey, "success").then(() => { this.setState({ step: 4, customerId: res.body.customerId }) })
      } else {
        this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(res.error.error),'error'));
      }
    }
  }
  async getGlobalPrinciple() {
    this.setState({ loading: true });
    const princples = await getMaxPrinciples();
    if (princples.status === 'success') {
      const principals = {
        maxIndividualPrincipal: princples.body.maxIndividualPrincipal,
        maxGroupIndividualPrincipal: princples.body.maxGroupIndividualPrincipal,
        maxGroupPrincipal: princples.body.maxGroupPrincipal,
      }
      const step3 = this.state.step3;
      step3.principals = principals
      this.setState({
        loading: false,
        step3
      })
    } else {
      this.setState({ loading: false }, () => Swal.fire('Error !', getErrorMessage(princples.error.error),'error'));
    }
  }
  previousStep(values, step: number): void {
    this.setState({
      step: step - 1,
      [`step${step}`]: values,
    } as State);
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
            this.formikStep1 = formikProps;
          }

          return (
            <StepOneForm {...formikProps} edit={this.props.edit} hasLoan={this.state.hasLoan} isGuarantor={this.state.isGuarantor} />);
        }
        }
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
            this.formikStep2 = formikProps;
          }

          return (
            <StepTwoForm {...formikProps} previousStep={(valuesOfStep2) => this.previousStep(valuesOfStep2, 2)} hasLoan={this.state.hasLoan} isGuarantor={this.state.isGuarantor} edit={this.props.edit} />);
        }
        }

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
          (ability.can("updateNationalId", "customer") && this.props.edit)
            ? customerCreationValidationStepThreeEdit
            : customerCreationValidationStepThree
        }
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep3 = formikProps;
          }
          return (
            <StepThreeForm {...formikProps} representativeDetails={this.state.step3} previousStep={(valuesOfStep3) => this.previousStep(valuesOfStep3, 3)} edit={this.props.edit} hasLoan={this.state.hasLoan} isGuarantor={this.state.isGuarantor} branchId={this.state.branchId}/>
          )
        }}
      </Formik>
    );
  }
  renderDocuments() {
    return (
      <DocumentsUpload
        customerId={this.props.edit ? this.state.selectedCustomer._id : this.state.customerId}
        previousStep={() => this.setState({ step: 3 })}
        edit={this.props.edit}
        view={false}
      />
    )
  }

  renderSteps(): any {
    switch (this.state.step) {
      case 1:
        return this.renderStepOne();
      case 2:
        return this.renderStepTwo();
      case 3:
        return this.renderStepThree();
      case 4:
        return this.renderDocuments();
      default: return null;
    }
  }
  handleWizardClick = (index: number) => {
    if (this.props.edit && index === 2) this.getGlobalPrinciple();
    if (this.formikStep1.isValid == true && this.formikStep2.isValid == true && this.formikStep3.isValid == true)
      switch (this.state.step) {
        case 1:
          return (this.setState({
            step1: this.formikStep1.values,
            step: index + 1
          }))
        case 2:
          return (this.setState({
            step2: this.formikStep2.values,
            step: index + 1
          }))
        case 3:
          return (this.setState({
            step3: this.formikStep3.values,
            step: index + 1
          }))
        default:
          return (this.setState({
            step: index + 1
          }))

      }
  }
  render() {
    return (
      <Container>
        <Loader open={this.state.loading} type="fullscreen" />
        <Card style={{ width: "100" }}>
          <div className="row-nowrap" >
            <Wizard currentStepNumber={this.state.step - 1}
              edit={this.props.edit}
              onClick={this.handleWizardClick}
              stepsDescription={[local.mainInfo, local.workInfo, local.differentInfo, local.documents]}
            />
            <Card.Body style={{ width: "80%" }} >
              {this.renderSteps()}
            </Card.Body>
          </div>
        </Card>
      </Container >
    )
  }
}

export default withRouter(CustomerCreation);