import React, { Component } from 'react';
import { Formik } from 'formik';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { step1, step2, step3, customerCreationValidationStepOne, customerCreationValidationStepTwo, customerCreationValidationStepThree } from './customerFormIntialState';
import { StepOneForm } from './StepOneForm';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import DocumentsUpload from './documentsUpload';
import { createCustomer } from '../../Services/APIs/Customer-Creation/createCustomer';
import * as local from '../../../Shared/Assets/ar.json';

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
    businessLicenseIssueDate: string;
    commercialRegisterNumber: string;
    industryRegisterNumber: string;
    taxCardNumber: string;
  };
  step3: {
    geographicalDistribution: string;
    representative: string;
    applicationDate: any;
    permanentEmployeeCount: any;
    partTimeEmployeeCount: any;
    accountNumber: string;
    accountBranch: string;
    comments: string;
  };
  customerId: string;
  selectedCustomer: any;
  loading: boolean;
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
        const customerInfo = { ...res.body };
        const customerBusiness = { ...res.body };
        const customerExtraDetails = { ...res.body };
        customerInfo.birthDate = new Date(customerInfo.birthDate).toISOString().slice(0, 10);
        customerInfo.nationalIdIssueDate = new Date(customerInfo.nationalIdIssueDate).toISOString().slice(0, 10);
        customerBusiness.businessLicenseIssueDate = customerBusiness.businessLicenseIssueDate ? new Date(customerBusiness.businessLicenseIssueDate).toISOString().slice(0, 10) : customerBusiness.businessLicenseIssueDate;
        customerExtraDetails.applicationDate = new Date(customerExtraDetails.applicationDate).toISOString().slice(0, 10);
        this.setState({
          loading: false,
          selectedCustomer: res.body,
          step1: { ...this.state.step1, ...customerInfo },
          step2: { ...this.state.step2, ...customerBusiness },
          step3: { ...this.state.step3, ...customerExtraDetails },
        });

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
      this.setState({ step3: values, loading: true } as any)
      const objToSubmit: Customer = {
        customerInfo: { ...this.state.step1 },
        customerBusiness: { ...this.state.step2 },
        customerExtraDetails: { ...this.state.step3 }
      };
      this.createCustomer(objToSubmit);
    }
  }
  async createCustomer(obj: Customer) {
    const objToSubmit = { ...obj.customerInfo, ...obj.customerBusiness, ...obj.customerExtraDetails };
    objToSubmit.birthDate = new Date(objToSubmit.birthDate).valueOf();
    objToSubmit.nationalIdIssueDate = new Date(objToSubmit.nationalIdIssueDate).valueOf();
    objToSubmit.customerAddressLatLongNumber.lat === 0 && objToSubmit.customerAddressLatLongNumber.lng === 0 ? objToSubmit.customerAddressLatLong = '' : objToSubmit.customerAddressLatLong = `${objToSubmit.customerAddressLatLongNumber.lat},${objToSubmit.customerAddressLatLongNumber.lng}`;
    objToSubmit.businessAddressLatLongNumber.lat === 0 && objToSubmit.businessAddressLatLongNumber.lng === 0 ? objToSubmit.businessAddressLatLong = '' : objToSubmit.businessAddressLatLong = `${objToSubmit.businessAddressLatLongNumber.lat},${objToSubmit.businessAddressLatLongNumber.lng}`;
    objToSubmit.businessLicenseIssueDate = new Date(objToSubmit.businessLicenseIssueDate).valueOf();
    objToSubmit.applicationDate = new Date(objToSubmit.applicationDate).valueOf();
    objToSubmit.permanentEmployeeCount = Number(objToSubmit.permanentEmployeeCount);
    objToSubmit.partTimeEmployeeCount = Number(objToSubmit.partTimeEmployeeCount);
    objToSubmit.representative = objToSubmit.representative._id;
    const res = await createCustomer(objToSubmit);
    if (res.status === 'success') {
      this.setState({ loading: false });
      Swal.fire("success", local.customerCreated).then(() => { this.setState({ step: 4, customerId: res.body.customerId }) })
    } else {
      Swal.fire("error", local.customerCreationError)
      this.setState({ loading: false });
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
          <StepOneForm {...formikProps} edit={this.props.edit} />
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
          <StepTwoForm {...formikProps} previousStep={(valuesOfStep2) => this.previousStep(valuesOfStep2, 2)} />
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
          <StepThreeForm {...formikProps} previousStep={(valuesOfStep3) => this.previousStep(valuesOfStep3, 3)} />
        }
      </Formik>
    )
  }
  renderDocuments() {
    return (
      <DocumentsUpload
        customerId={this.state.customerId}
        previousStep={() => this.setState({ step: 3 })}
        edit={this.props.edit}
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
        <>
          <Tabs activeKey={this.state.step} id="controlled-tab-example" style={{ marginBottom: 20 }} onSelect={(key: string) => this.props.edit ? this.setState({ step: Number(key) }) : {}}>
            <Tab eventKey={1} title={local.mainInfo}>
            </Tab>
            <Tab eventKey={2} title={local.workInfo}>
            </Tab>
            <Tab eventKey={3} title={local.differentInfo}>
            </Tab>
            <Tab eventKey={4} title={local.documents}>
            </Tab>
          </Tabs>
          {this.renderSteps()}
        </>
      </Container>
    )
  }
}

export default withRouter(CustomerCreation);