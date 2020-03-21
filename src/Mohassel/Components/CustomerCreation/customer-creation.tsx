import React, { Component } from 'react';
import { Formik } from 'formik';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { step1, step2, step3, customerCreationValidationStepOne, customerCreationValidationStepTwo, customerCreationValidationStepThree } from './customerFormIntialState';
import { StepOneForm } from './StepOneForm';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import { createCustomer } from '../../Services/APIs/Customer-Creation/createCustomer';
import * as local from '../../../Shared/Assets/ar.json';

interface CustomerInfo {
  birthDate: number;
  nationalIdIssueDate: number;
  homePostalCode: number;
  customerAddressLatLong: string
  customerAddressLatLongNumber: {
    lat: number;
    lng: number;
  };
}
interface CustomerBusiness {
  businessAddressLatLong: string,
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
}
interface Customer {
  customerInfo: CustomerInfo
  customerBusiness: CustomerBusiness
  customerExtraDetails: CustomerExtraDetails
}
interface Props {
  history: Array<string>;
};
interface State {
  step: number;
  submitObj: object;
  step1: {
    birthDate: number;
    nationalIdIssueDate: number;
    homePostalCode: number;
    customerAddressLatLong: string,
    customerAddressLatLongNumber: {
      lat: number;
      lng: number;
    };
  };
  step2: {
    businessAddressLatLong: string,
    businessAddressLatLongNumber: {
      lat: number;
      lng: number;
    };
    businessName: string,
    businessAddress: string,
    governorate: string,
    district: string,
    village: string,
    ruralUrban: string,
    businessPostalCode: string,
    businessPhoneNumber: string,
    businessSector: string,
    businessActivity: string,
    businessSpeciality: string,
    businessLicenseNumber: string,
    businessLicenseIssuePlace: string,
    businessLicenseIssueDate: string,
    commercialRegisterNumber: string,
    industryRegisterNumber: string,
    taxCardNumber: string,
  };
  step3: {
    geographicalDistribution: string,
    representative: string,
    applicationDate: any;
    permanentEmployeeCount: any;
    partTimeEmployeeCount: any;
    accountNumber: string,
    accountBranch: string,
    comments: string,
  };
  loading: boolean;
}

class CustomerCreation extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 1,
      submitObj: {},
      step1: step1,
      step2: step2,
      step3: step3,
      loading: false,
    }
  }
  submit = (values: object) => {
    if (this.state.step < 3) {
      this.setState({
        [`step${this.state.step}`]: values,
        step: this.state.step + 1,
      } as any);
    } else {
      this.setState({ step3: values, loading: true } as any)
      const objToSubmit: Customer = {
        customerInfo: this.state.step1,
        customerBusiness: this.state.step2,
        customerExtraDetails: this.state.step3
      };
      this.createCustomer(objToSubmit);
    }
  }
  async createCustomer(obj: Customer) {
    obj.customerInfo.birthDate = new Date(obj.customerInfo.birthDate).valueOf();
    obj.customerInfo.nationalIdIssueDate = new Date(obj.customerInfo.nationalIdIssueDate).valueOf();
    obj.customerInfo.homePostalCode = Number(obj.customerInfo.homePostalCode);
    obj.customerInfo.customerAddressLatLongNumber.lat === 0 && obj.customerInfo.customerAddressLatLongNumber.lng === 0? obj.customerInfo.customerAddressLatLong = '' : obj.customerInfo.customerAddressLatLong = `${obj.customerInfo.customerAddressLatLongNumber.lat},${obj.customerInfo.customerAddressLatLongNumber.lng}`;
    obj.customerBusiness.businessAddressLatLongNumber.lat === 0 && obj.customerBusiness.businessAddressLatLongNumber.lng === 0? obj.customerBusiness.businessAddressLatLong = '' : obj.customerBusiness.businessAddressLatLong = `${obj.customerBusiness.businessAddressLatLongNumber.lat},${obj.customerBusiness.businessAddressLatLongNumber.lng}`;
    obj.customerBusiness.businessPostalCode = Number(obj.customerBusiness.businessPostalCode);
    obj.customerBusiness.businessLicenseIssueDate = new Date(obj.customerBusiness.businessLicenseIssueDate).valueOf();
    obj.customerExtraDetails.applicationDate = new Date(obj.customerExtraDetails.applicationDate).valueOf();
    obj.customerExtraDetails.permanentEmployeeCount = Number(obj.customerExtraDetails.permanentEmployeeCount);
    obj.customerExtraDetails.partTimeEmployeeCount = Number(obj.customerExtraDetails.partTimeEmployeeCount);
    const res = await createCustomer(obj);
    if (res.status === 'success') {
      this.setState({ loading: false });
      Swal.fire("success", local.customerCreated).then(() => { this.props.history.push("/") })
    } else {
      Swal.fire("error", local.customerCreationError)
      this.setState({ loading: false });
    }
  }
  previousStep(): void {
    this.setState({ step: this.state.step - 1 });
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
          <StepOneForm {...formikProps} />
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
          <StepTwoForm {...formikProps} previousStep={() => this.previousStep()} />
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
          <StepThreeForm {...formikProps} previousStep={() => this.previousStep()} />
        }
      </Formik>
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
      default: return null;
    }
  }
  render() {
    return (
      <div>
        {this.state.loading ? <Spinner animation="border" className="central-loader-fullscreen" /> :
          <Container>
            <Tabs activeKey={this.state.step} id="controlled-tab-example" style={{ marginBottom: 20 }}>
              <Tab eventKey={1} title={local.mainInfo}>
              </Tab>
              <Tab eventKey={2} title={local.workInfo}>
              </Tab>
              <Tab eventKey={3} title={local.differentInfo}>
              </Tab>
            </Tabs>
            {this.renderSteps()}
          </Container>
        }
      </div>
    )
  }
}

export default withRouter(CustomerCreation);