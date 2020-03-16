import React, { Component } from 'react';
import { Formik } from 'formik';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import { step1, step2, step3, customerCreationValidationStepOne, customerCreationValidationStepTwo, customerCreationValidationStepThree } from './customerFormIntialState';
import { StepOneForm } from './StepOneForm';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import * as local from '../../../Shared/Assets/ar.json';

interface Props { };
interface State {
  step: number,
  submitObj: object,
  step1: any,
  step2: any,
  step3: any,
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
    }
  }
  submit = (values: object): void => {
    if (this.state.step < 3) {
      this.setState({
        [`step${this.state.step}`]: values,
        step: this.state.step + 1,
      } as any);
    } else {
      this.setState({step3: values})
      let objToSubmit = {
        customerInfo: {...this.state.step1},
        customerBusiness: {...this.state.step2},
        customerExtraDetails: values
      };
      console.log(objToSubmit);
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
    )
  }
}

export default CustomerCreation;