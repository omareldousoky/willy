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
import { step1, step2, step3, customerCreationValidationStepOne, customerCreationValidationStepTwo, customerCreationValidationStepThree } from './customerFormIntialState';
import { StepOneForm } from './StepOneForm';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import DocumentsUpload from './documentsUpload';
import { createCustomer } from '../../Services/APIs/Customer-Creation/createCustomer';
import * as local from '../../../Shared/Assets/ar.json';
import { timeToDateyyymmdd } from '../../Services/utils';

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
  allowMultiLoans: boolean;
  allowGuarantorLoan: boolean;
  allowMultiGuarantee: boolean;
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
    representative: any;
    applicationDate: any;
    permanentEmployeeCount: any;
    partTimeEmployeeCount: any;
    comments: string;
  };
  customerId: string;
  selectedCustomer: any;
  loading: boolean;
  hasLoan: boolean;
  searchResults: {
    results: Array<object>;
    empty: boolean;
  };
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
      searchResults: {
        results: [],
        empty: false
      },
      selectedCustomer: {}
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.getCustomerById();
    }
  }
  async getCustomerById() {
    this.setState({ loading: true });
    const res = await getCustomerByID(this.props.location.state.id)
    if (res.status === 'success') {
      const customerInfo = {
        customerName: res.body.customerName,
        nationalId: res.body.nationalId,
        birthDate: timeToDateyyymmdd(res.body.birthDate),
        gender: res.body.gender,
        nationalIdIssueDate: timeToDateyyymmdd(res.body.nationalIdIssueDate),
        homePostalCode: res.body.homePostalCode,
        customerHomeAddress: res.body.customerHomeAddress,
        customerAddressLatLong: res.body.customerAddressLatLong,
        customerAddressLatLongNumber: {
          lat: res.body.customerAddressLatLong ? Number(res.body.customerAddressLatLong.split(',')[0]) : 0,
          lng: res.body.customerAddressLatLong ? Number(res.body.customerAddressLatLong.split(',')[1]) : 0,
        },
        homePhoneNumber: res.body.homePhoneNumber,
        faxNumber: res.body.faxNumber,
        mobilePhoneNumber: res.body.mobilePhoneNumber,
        customerWebsite: res.body.customerWebsite,
        emailAddress: res.body.emailAddress
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
        representative: res.body.representative,
        applicationDate: timeToDateyyymmdd(res.body.applicationDate),
        permanentEmployeeCount: res.body.permanentEmployeeCount,
        partTimeEmployeeCount: res.body.partTimeEmployeeCount,
        comments: res.body.comments,
        allowMultiLoans: res.body.allowMultiLoans,
        allowGuarantorLoan: res.body.allowGuarantorLoan,
        allowMultiGuarantee: res.body.allowMultiGuarantee,
      };
      this.setState({
        loading: false,
        selectedCustomer: res.body,
        step1: { ...this.state.step1, ...customerInfo },
        step2: { ...this.state.step2, ...customerBusiness },
        step3: { ...this.state.step3, ...customerExtraDetails },
        hasLoan: res.body.hasLoan
      } as any);
    } else {
      this.setState({ loading: false });
      Swal.fire('error', local.searchError, 'error');
    }
  }
  submit = (values: object) => {
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
    objToSubmit.representative = objToSubmit.representative._id;
    if (this.props.edit) {
      const res = await editCustomer(objToSubmit, this.state.selectedCustomer._id);
      if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("", local.customerEdited, "success").then(() => { this.setState({ step: 4, customerId: res.body.customerId }) })
      } else {
        Swal.fire("error", local.customerCreationError)
        this.setState({ loading: false });
      }
    } else {
      const res = await createCustomer(objToSubmit);
      if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("", local.customerCreated, "success").then(() => { this.setState({ step: 4, customerId: res.body.customerId }) })
      } else {
        Swal.fire("error", local.customerCreationError)
        this.setState({ loading: false });
      }
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
        {(formikProps) =>
          <StepOneForm {...formikProps} edit={this.props.edit} hasLoan={this.state.hasLoan} />
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
        {(formikProps) =>
          <StepTwoForm {...formikProps} previousStep={(valuesOfStep2) => this.previousStep(valuesOfStep2, 2)} hasLoan={this.state.hasLoan}/>
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
        validationSchema={customerCreationValidationStepThree}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) =>
          <StepThreeForm {...formikProps} previousStep={(valuesOfStep3) => this.previousStep(valuesOfStep3, 3)} edit={this.props.edit} hasLoan={this.state.hasLoan}/>
        }
      </Formik>
    )
  }
  renderDocuments() {
    return (
      <DocumentsUpload
        customerId={this.props.edit ? this.state.selectedCustomer._id : this.state.customerId}
        previousStep={() => this.setState({ step: 3 })}
        edit={this.props.edit}
        view = {true}
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
  render() {
    return (
      <Container>
        <Loader open={this.state.loading} type="fullscreen" />
        <Card>
          <div style={{ display: "flex", flexDirection: "row", }} >
            <Wizard currentStepNumber={this.state.step - 1}
              stepsDescription={[local.mainInfo, local.workInfo, local.differentInfo, local.documents]}></Wizard>
            <Card.Body style={{width:"80%"}} >
              {this.renderSteps()}
            </Card.Body>
          </div>
        </Card>
      </Container >
    )
  }
}

export default withRouter(CustomerCreation);