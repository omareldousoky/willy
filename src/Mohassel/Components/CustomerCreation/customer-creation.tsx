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


interface Props { 
  history: Array<string>
};
interface State {
  step: number,
  submitObj: object,
  step1: any,
  step2: any,
  step3: any,
  loading: boolean,
}

class CustomerCreation extends Component<Props, State>{
  constructor(props: any) {
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
      this.setState({ step3: values, loading: true })
      let objToSubmit = {
        customerInfo: { ...this.state.step1 },
        customerBusiness: { ...this.state.step2 },
        customerExtraDetails: values
      };
      this.createCustomer(objToSubmit);
    }
  }

  async createCustomer(obj: object) {
    obj.customerInfo.birthDate = new Date(obj.customerInfo.birthDate).valueOf();
    obj.customerInfo.nationalIdIssueDate = new Date(obj.customerInfo.nationalIdIssueDate).valueOf();
    obj.customerInfo.homePostalCode = Number(obj.customerInfo.homePostalCode);
    Object.keys(obj.customerInfo.customerAddressLatLong).length === 0 ? obj.customerInfo.customerAddressLatLong = "" : obj.customerInfo.customerAddressLatLong = `${obj.customerInfo.customerAddressLatLong.lat},${obj.customerInfo.customerAddressLatLong.lng}`;
    Object.keys(obj.customerBusiness.businessAddressLatLong).length === 0 ? obj.customerBusiness.businessAddressLatLong = "" : obj.customerBusiness.businessAddressLatLong = `${obj.customerBusiness.businessAddressLatLong.lat},${obj.customerBusiness.businessAddressLatLong.lng}`;
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
      <>
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
      </>
    )
  }
}

export default withRouter(CustomerCreation);