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
import { step1Company, step2Company } from './customerFormIntialState';
import { companyCreationValidationStepOne, companyCreationValidationStepTwo, companyCreationValidationStepTwoEdit, } from './companyFormIntialState';
import { StepTwoForm } from './StepTwoForm';
import { StepThreeForm } from './StepThreeForm';
import DocumentsUpload from './documentsUpload';
import { createCustomer } from '../../Services/APIs/Customer-Creation/createCustomer';
import * as local from '../../../Shared/Assets/ar.json';
import { getErrorMessage, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import ability from '../../config/ability';
import { getMaxPrinciples } from '../../Services/APIs/configApis/config';

interface Props {
  history: Array<string>;
  location: {
    state: {
      id: string;
    };
  };
  edit: boolean;
  isCompany?: boolean;
};
interface State {
  step: number;
  step1: {
    businessName: string;
    businessAddress: string;
    businessCharacteristic: string;
    businessSector: string;
    businessActivityDetails: string;
    legalStructure: string;
    businessLicenseNumber: string;
    // businessLicenseIssuePlace: string;
    businessLicenseIssueDate: any;
    commercialRegisterNumber: string;
    commercialRegisterExpiryDate: string | number;
    // industryRegisterNumber: string;
    taxCardNumber: string;
    customerType: string;
  };
  step2: {
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

class CompanyCreation extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 1,
      step1: step1Company,
      step2: step2Company,
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
    values: step1Company,
    errors: {},
  };
  formikStep2: any = {
    isValid: true,
    values: step2Company,
    errors: {},
  };
  async getCustomerById() {
    this.setState({ loading: true });
    const res = await getCustomerByID(this.props.location.state.id)
    if (res.status === 'success') {
      const customerBusiness = {
        businessName: res.body.businessName,
        businessAddress: res.body.businessAddress,
        businessCharacteristic: res.body.businessCharacteristic,
        businessSector: res.body.businessSector,
        businessActivityDetails: res.body.businessActivityDetails,
        legalStructure: res.body.legalStructure,
        businessLicenseNumber: res.body.businessLicenseNumber,
        // businessLicenseIssuePlace: res.body.businessLicenseIssuePlace,
        businessLicenseIssueDate: timeToDateyyymmdd(res.body.businessLicenseIssueDate),
        commercialRegisterExpiryDate: timeToDateyyymmdd(res.body.commercialRegisterExpiryDate),
        commercialRegisterNumber: res.body.commercialRegisterNumber,
        // industryRegisterNumber: res.body.industryRegisterNumber,
        taxCardNumber: res.body.taxCardNumber,
      };
      const customerExtraDetails = {
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
        values: { ...this.state.step1, ...customerBusiness },
        errors: {},
        isValid: true,
      };
      this.formikStep2 = {
        errors: {},
        values: { ...this.state.step2, ...customerExtraDetails },
        isValid: true,

      };
      this.setState({
        loading: false,
        selectedCustomer: res.body,
        step1: { ...this.state.step1, ...customerBusiness },
        step2: { ...this.state.step2, ...customerExtraDetails },
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
    if (this.props.edit && this.state.step === 1) this.getGlobalPrinciple();
    if (this.state.step < 2) {
      this.setState({
        [`step${this.state.step}`]: values,
        step: this.state.step + 1,
      } as any);
    } else {
      this.setState({ step2: values, loading: true } as any, () => this.createEditCustomer())
    }
  }
  async createEditCustomer() {
    const objToSubmit = { ...this.state.step1, ...this.state.step2 };
    objToSubmit.businessLicenseIssueDate = new Date(objToSubmit.businessLicenseIssueDate).valueOf();
    objToSubmit.applicationDate = new Date(objToSubmit.applicationDate).valueOf();
    objToSubmit.commercialRegisterExpiryDate = new Date(objToSubmit.commercialRegisterExpiryDate).valueOf();
    objToSubmit.permanentEmployeeCount = Number(objToSubmit.permanentEmployeeCount);
    objToSubmit.partTimeEmployeeCount = Number(objToSubmit.partTimeEmployeeCount);
    objToSubmit.representative = (this.props.edit && this.state.oldRepresentative !== objToSubmit.newRepresentative) ? this.state.oldRepresentative : objToSubmit.representative;
    objToSubmit.newRepresentative = (this.props.edit && this.state.oldRepresentative !== objToSubmit.newRepresentative) ? objToSubmit.newRepresentative : '';
    if (objToSubmit?.guarantorMaxLoans && objToSubmit.guarantorMaxLoans > 0) objToSubmit.guarantorMaxLoans = Number(objToSubmit.guarantorMaxLoans);
    else objToSubmit.guarantorMaxLoans = 1;
    if (objToSubmit?.maxLoansAllowed && objToSubmit.maxLoansAllowed > 0) objToSubmit.maxLoansAllowed = Number(objToSubmit.maxLoansAllowed);
    else objToSubmit.maxLoansAllowed = 1;
    delete objToSubmit.principals
    if (this.props.edit) {
      const res = await editCustomer(objToSubmit, this.state.selectedCustomer._id);
      if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("", local.customerEdited, "success").then(() => { this.setState({ step: 3, customerId: res.body.customerId }) })
      } else {
        this.setState({ loading: false },()=> Swal.fire('Error !', getErrorMessage(res.error.error),'error'));
      }
    } else {
      const res = await createCustomer(objToSubmit);
      if (res.status === 'success') {
        this.setState({ loading: false });
        Swal.fire("", local.customerCreated + ' ' + local.withCode + ' ' + res.body.customerKey, "success").then(() => { this.setState({ step: 3, customerId: res.body.customerId }) })
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
      const step2 = { ...this.state.step2 };
      step2.principals = principals
      this.setState({
        loading: false,
        step2
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
        validationSchema={companyCreationValidationStepOne}
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep1 = formikProps;
          }
          return (
            <StepTwoForm {...formikProps} hasLoan={this.state.hasLoan} isGuarantor={this.state.isGuarantor} edit={this.props.edit} isCompany />);
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
        validationSchema={
          (ability.can("updateNationalId", "customer") && this.props.edit)
            ? companyCreationValidationStepTwoEdit
            : companyCreationValidationStepTwo
        }
        validateOnBlur
        validateOnChange
      >
        {(formikProps) => {
          if (this.props.edit) {
            this.formikStep2 = formikProps;
          }
          return (
            <StepThreeForm {...formikProps} representativeDetails={this.state.step2} previousStep={(valuesOfStep3) => this.previousStep(valuesOfStep3, 2)} isGuarantor={this.state.isGuarantor} edit={this.props.edit} hasLoan={this.state.hasLoan} branchId={this.state.branchId} isCompany />
          )
        }}
      </Formik>
    );
  }
  renderDocuments() {
    return (
      <DocumentsUpload
        customerId={this.props.edit ? this.state.selectedCustomer._id : this.state.customerId}
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
        return this.renderStepOne();
      case 2:
        return this.renderStepTwo();
      case 3:
        return this.renderDocuments();
      default: return null;
    }
  }
  handleWizardClick = (index: number) => {
    if (this.props.edit && index === 1) this.getGlobalPrinciple();
    if (this.formikStep1.isValid == true && this.formikStep2.isValid == true)
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
              stepsDescription={[local.workInfo, local.differentInfo, local.documents]}
            />
            <Card.Body style={{ width: "80%" }} >
              {this.renderSteps()}
            </Card.Body>
          </div>
        </Card>
      </Container>
    )
  }
}

export default withRouter(CompanyCreation);