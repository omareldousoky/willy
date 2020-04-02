import React, { Component } from 'react';
import { Formik } from 'formik';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import { Loader } from '../../../Shared/Components/Loader';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import { searchCustomerByName, getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
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
}
export interface Customer {
  customerInfo: CustomerInfo;
  customerBusiness: CustomerBusiness;
  customerExtraDetails: CustomerExtraDetails;
}
interface Props {
  history: Array<string>;
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
  loading: boolean;
  searchResults: Array<object>;
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
      searchResults: [],
    }
  }
  componentDidUpdate(prevProps: Props, _prevState: State) {
    if (prevProps.edit !== this.props.edit) {
      //set State to initial value
      this.setState({ customerId: '', step1: step1, step2: step2, step3: step3, step: 1, searchResults: [] });
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
        customerInfo: {...this.state.step1},
        customerBusiness: {...this.state.step2},
        customerExtraDetails: {...this.state.step3}
      };
      this.createCustomer(objToSubmit);
    }
  }
  async handleSearch(query: string) {
    this.setState({ loading: true });
    const results = await searchCustomerByName(query)
    if (results.status === 'success') {
      this.setState({ loading: false, searchResults: results.body.customers });
    } else {
      Swal.fire("error", local.searchError, 'error')
      this.setState({ loading: false });
    }
  }
  async selectCustomer(customer) {
    this.setState({ loading: true, customerId: customer.id });
    const res = await getCustomerByID(customer.id)
    if (res.status === 'success') {
      const customerInfo = res.body.customerInfo;
      const customerBusiness = res.body.customerBusiness;
      const customerExtraDetails = res.body.customerExtraDetails;
      customerInfo.birthDate = new Date(customerInfo.birthDate).toISOString().slice(0, 10);
      customerInfo.nationalIdIssueDate = new Date(customerInfo.nationalIdIssueDate).toISOString().slice(0, 10);
      customerBusiness.businessLicenseIssueDate = customerBusiness.businessLicenseIssueDate ? new Date(customerBusiness.businessLicenseIssueDate).toISOString().slice(0, 10) : customerBusiness.businessLicenseIssueDate;
      customerExtraDetails.applicationDate = new Date(customerExtraDetails.applicationDate).toISOString().slice(0, 10);
      this.setState({
        loading: false,
        step1: { ...this.state.step1, ...customerInfo },
        step2: { ...this.state.step2, ...customerBusiness },
        step3: { ...this.state.step3, ...customerExtraDetails },
      });

    } else {
      this.setState({ loading: false });
      Swal.fire('error', local.searchError, 'error');
    }
  }
  async createCustomer(obj: Customer) {
    obj.customerInfo.birthDate = new Date(obj.customerInfo.birthDate).valueOf();
    obj.customerInfo.nationalIdIssueDate = new Date(obj.customerInfo.nationalIdIssueDate).valueOf();
    obj.customerInfo.homePostalCode = Number(obj.customerInfo.homePostalCode);
    obj.customerInfo.customerAddressLatLongNumber.lat === 0 && obj.customerInfo.customerAddressLatLongNumber.lng === 0 ? obj.customerInfo.customerAddressLatLong = '' : obj.customerInfo.customerAddressLatLong = `${obj.customerInfo.customerAddressLatLongNumber.lat},${obj.customerInfo.customerAddressLatLongNumber.lng}`;
    obj.customerBusiness.businessAddressLatLongNumber.lat === 0 && obj.customerBusiness.businessAddressLatLongNumber.lng === 0 ? obj.customerBusiness.businessAddressLatLong = '' : obj.customerBusiness.businessAddressLatLong = `${obj.customerBusiness.businessAddressLatLongNumber.lat},${obj.customerBusiness.businessAddressLatLongNumber.lng}`;
    obj.customerBusiness.businessPostalCode = Number(obj.customerBusiness.businessPostalCode);
    obj.customerBusiness.businessLicenseIssueDate = new Date(obj.customerBusiness.businessLicenseIssueDate).valueOf();
    obj.customerExtraDetails.applicationDate = new Date(obj.customerExtraDetails.applicationDate).valueOf();
    obj.customerExtraDetails.permanentEmployeeCount = Number(obj.customerExtraDetails.permanentEmployeeCount);
    obj.customerExtraDetails.partTimeEmployeeCount = Number(obj.customerExtraDetails.partTimeEmployeeCount);
    const res = await createCustomer(obj);
    if (res.status === 'success') {
      this.setState({ loading: false });
      Swal.fire("success", local.customerCreated).then(() => { this.setState({ step: 4, customerId: res.body.CustomerId }) })
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
    console.log(this.state)
    return (
      <Container>
        <Loader open={this.state.loading} type="fullscreen" />
        {this.props.edit && this.state.customerId === "" ?
          <CustomerSearch source='loanApplication' handleSearch={(query: string) => this.handleSearch(query)} searchResults={this.state.searchResults} selectCustomer={(customer: object) => this.selectCustomer(customer)} />
          : <>
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
        }
      </Container>
    )
  }
}

export default withRouter(CustomerCreation);