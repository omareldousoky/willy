import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { LoanApplication, LoanApplicationValidation } from './loanApplicationStates';
import { LoanApplicationCreationForm } from './loanApplicationCreationForm';
import { searchCustomerByName, getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/customerSearch';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { getProducts, getProduct } from '../../Services/APIs/loanProduct/getProduct';
import { getGenderFromNationalId } from '../../Services/nationalIdValidation';
import { newApplication } from '../../Services/APIs/loanApplication/newApplication';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
interface Props {
    history: Array<string>;
};
interface Formula {
    name: string;
    _id: string;
}
interface Application {
    customerID: string;
    customerName: string;
    customerCode: string;
    nationalId: string;
    birthDate: string;
    gender: string;
    nationalIdIssueDate: string;
    businessSector: string;
    businessActivity: string;
    businessSpeciality: string;
    permanentEmployeeCount: string;
    partTimeEmployeeCount: string;
    productID: string;
    calculationFormulaId: string;
    currency: string;
    interest: number;
    interestPeriod: string;
    inAdvanceFees: number;
    inAdvanceFrom: string;
    inAdvanceType: string;
    periodLength: number;
    periodType: string;
    gracePeriod: number;
    principal: number;
    pushPayment: number;
    noOfInstallments: number;
    applicationFee: number;
    individualApplicationFee: number;
    applicationFeePercent: number;
    applicationFeeType: string;
    applicationFeePercentPerPerson: number;
    applicationFeePercentPerPersonType: number;
    representativeFees: number;
    allowRepresentativeFeesAdjustment: boolean;
    stamps: number;
    allowStampsAdjustment: boolean;
    adminFees: number;
    allowAdminFeesAdjustment: boolean;
    entryDate: Date;
    usage: string;
    representativeId: string;
    enquirorId: string;
    visitationDate: Date;
    guarantorIds: Array<string>;
    viceCustomers: Array<Vice>;
}
interface Vice {
    name: string;
    phoneNumber: string;
}
interface State {
    application: Application;
    loading: boolean;
    selectedCustomer: object;
    searchResults: Array<Application>;
    guarantor1Res: Array<object>;
    guarantor2Res: Array<object>;
    formulas: Array<Formula>;
    products: Array<object>;
    guarantor1: any;
    guarantor2: any;
    viceCustomers: Array<Vice>;
}
class LoanApplicationCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            application: LoanApplication,
            loading: false,
            selectedCustomer: {},
            searchResults: [],
            formulas: [],
            products: [],
            guarantor1Res: [],
            guarantor2Res: [],
            guarantor1: {},
            guarantor2: {},
            viceCustomers: [{
                name: '',
                phoneNumber: ''
            }],
        }
    }
    async UNSAFE_componentWillMount() {
        const formulas = await getFormulas();
        if (formulas.status === 'success') {
            this.setState({
                formulas: formulas.body.data
            })
        } else {
            console.log('err')
        }
        this.getProducts();
    }
    async getProducts() {
        this.setState({ products: [] })
        const products = await getProducts();
        if (products.status === 'success') {
            this.setState({
                products: products.body.data.data
            })
        } else {
            console.log('err')
        }
    }
    handleSearch = async (query) => {
        this.setState({ loading: true });
        const results = await searchCustomerByName(query)
        if (results.status === 'success') {
            this.setState({ loading: false, searchResults: results.body.customers });
        } else {
            Swal.fire("error", 'search error')
            this.setState({ loading: false });
        }
    }
    handleSearchGuarantors = async (query, guarantor: string) => {
        const obj = {
            name: query,
            sameBranch: true,
            excludedIds: (guarantor === 'guarantor2Res') ? [this.state.application.customerID, this.state.guarantor1.id] : [this.state.application.customerID]
        }
        const results = await searchCustomer(obj)
        if (results.status === 'success') {
            const newState = {};
            newState[guarantor] = results.body.customers;
            this.setState(newState);
        } else {
            Swal.fire("error", 'search error')
            this.setState({ loading: false });
        }
    }
    getDateString(date) {
        return (
            new Date(new Date(date).getTime() - (new Date(date).getTimezoneOffset() * 60000)).toISOString().split("T")[0]
        )
    }
    selectCustomer = async (customer) => {
        this.setState({ loading: true });
        const selectedCustomer = await getCustomerByID(customer.id)
        if (selectedCustomer.status === 'success') {
            const defaultApplication = this.state.application;
            defaultApplication.customerID = customer.id;
            defaultApplication.customerName = selectedCustomer.body.customerInfo.customerName;
            defaultApplication.nationalId = selectedCustomer.body.customerInfo.nationalId;
            defaultApplication.birthDate = this.getDateString(selectedCustomer.body.customerInfo.birthDate);
            defaultApplication.gender = getGenderFromNationalId(selectedCustomer.body.customerInfo.nationalId);
            defaultApplication.nationalIdIssueDate = this.getDateString(selectedCustomer.body.customerInfo.nationalIdIssueDate);
            defaultApplication.businessSector = selectedCustomer.body.customerBusiness.businessSector;
            defaultApplication.businessActivity = selectedCustomer.body.customerBusiness.businessActivity;
            this.setState({
                loading: false,
                selectedCustomer: selectedCustomer.body,
                application: defaultApplication
            });

        } else {
            Swal.fire("error", 'search error')
            this.setState({ loading: false });
        }
    }
    selectGuarantor = async (obj, guarantor: string) => {
        const selectedGuarantor = await getCustomerByID(obj.id);
        if (selectedGuarantor.status === 'success') {
            const defaultApplication = this.state.application
            defaultApplication.guarantorIds.push(obj.id)
            const newState = {};
            newState[guarantor] = { ...selectedGuarantor.body, id: obj.id };
            this.setState(newState);
        } else {
            console.log('err')
        }
    }
    getSelectedLoanProduct = async (id) => {
        this.setState({ loading: true });
        const selectedProduct = await getProduct(id)
        if (selectedProduct.status === 'success') {
            const defaultApplication = this.state.application;
            const selectedProductDetails = selectedProduct.body.data;
            defaultApplication.productID = id;
            defaultApplication.calculationFormulaId = selectedProductDetails.calculationFormula._id;
            defaultApplication.currency = selectedProductDetails.currency;
            defaultApplication.interest = selectedProductDetails.interest;
            defaultApplication.interestPeriod = selectedProductDetails.interestPeriod;
            defaultApplication.inAdvanceFees = selectedProductDetails.inAdvanceFees;
            defaultApplication.inAdvanceFrom = selectedProductDetails.inAdvanceFrom;
            defaultApplication.inAdvanceType = selectedProductDetails.inAdvanceType;
            defaultApplication.periodLength = selectedProductDetails.periodLength;
            defaultApplication.periodType = selectedProductDetails.periodType;
            defaultApplication.gracePeriod = selectedProductDetails.gracePeriod;
            defaultApplication.pushPayment = selectedProductDetails.pushPayment;
            defaultApplication.noOfInstallments = selectedProductDetails.noOfInstallments;
            defaultApplication.applicationFee = selectedProductDetails.applicationFee;
            defaultApplication.individualApplicationFee = selectedProductDetails.individualApplicationFee;
            defaultApplication.applicationFeePercent = selectedProductDetails.applicationFeePercent;
            defaultApplication.applicationFeeType = selectedProductDetails.applicationFeeType;
            defaultApplication.applicationFeePercentPerPerson = selectedProductDetails.applicationFeePercentPerPerson;
            defaultApplication.applicationFeePercentPerPersonType = selectedProductDetails.applicationFeePercentPerPersonType;
            defaultApplication.representativeFees = selectedProductDetails.representativeFees;
            defaultApplication.allowRepresentativeFeesAdjustment = selectedProductDetails.allowRepresentativeFeesAdjustment;
            defaultApplication.stamps = selectedProductDetails.stamps;
            defaultApplication.allowStampsAdjustment = selectedProductDetails.allowStampsAdjustment;
            defaultApplication.adminFees = selectedProductDetails.adminFees;
            defaultApplication.allowAdminFeesAdjustment = selectedProductDetails.allowAdminFeesAdjustment;
            this.setState({ loading: false, application: defaultApplication });
        } else {
            Swal.fire("error", 'search error')
            this.setState({ loading: false });
        }
    }
    handleChangeVices(name: string, value: string, i, flag) {
        const vices = this.state.viceCustomers;

        if (flag && i) {
            delete vices[i]
        } else if (flag && !i) {
            vices.push({
                name: '',
                phoneNumber: ''
            })
        }
        else {
            vices[i][name] = value;
        }
        const vicesClean = vices.filter(item => item !== undefined);
        this.setState({
            viceCustomers: vices,
        })
    }
    submit = async (values: Application) => {
        const obj = values
        const objToSubmit = {
            customerId: obj.customerID,
            guarantorIds: obj.guarantorIds,
            productId: obj.productID,
            interest: obj.interest,
            interestPeriod: obj.interestPeriod,
            gracePeriod: obj.gracePeriod,
            pushPayment: obj.pushPayment,
            noOfInstallments: obj.noOfInstallments,
            principal: obj.principal,
            individualApplicationFee: obj.individualApplicationFee,
            applicationFeePercent: obj.applicationFeePercent,
            applicationFeeType: obj.applicationFeeType,
            applicationFeePercentPerPerson: obj.applicationFeePercentPerPerson,
            applicationFeePercentPerPersonType: obj.applicationFeePercentPerPersonType,
            representativeFees: obj.representativeFees,
            stamps: obj.stamps,
            adminFees: obj.adminFees,
            entryDate: new Date(obj.entryDate).valueOf(),
            usage: obj.usage,
            representativeId: obj.representativeId,
            enquirorId: obj.enquirorId,
            visitationDate: new Date(obj.visitationDate).valueOf(),
            viceCustomers: this.state.viceCustomers.filter(item => item !== undefined),
        }
        const res = await newApplication(objToSubmit);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/") })
        } else {
            Swal.fire("error", local.loanApplicationCreationError)
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <div>
                {this.state.loading ? <Spinner animation="border" className="central-loader-fullscreen" /> :
                    <Container>
                        {(Object.keys(this.state.selectedCustomer).length > 0) ? <Formik
                            initialValues={this.state.application}
                            onSubmit={this.submit}
                            validationSchema={LoanApplicationValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <LoanApplicationCreationForm {...formikProps}
                                    formulas={this.state.formulas}
                                    products={this.state.products}
                                    getSelectedLoanProduct={(id) => this.getSelectedLoanProduct(id)}
                                    handleSearch={(query, guarantor) => { this.handleSearchGuarantors(query, guarantor) }}
                                    selectGuarantor={(query, guarantor) => { this.selectGuarantor(query, guarantor) }}
                                    searchResults1={this.state.guarantor1Res}
                                    searchResults2={this.state.guarantor2Res}
                                    guarantorOne={this.state.guarantor1}
                                    guarantorTwo={this.state.guarantor2}
                                    viceCustomers={this.state.viceCustomers}
                                    updateViceCustomer={(name, value, i, flag) => this.handleChangeVices(name, value, i, flag)}
                                />
                            }
                        </Formik> : <CustomerSearch source='loanApplication' handleSearch={(query) => this.handleSearch(query)} searchResults={this.state.searchResults} selectCustomer={(customer) => this.selectCustomer(customer)} />}
                    </Container>
                }
            </div>
        )
    }
}
export default withRouter(LoanApplicationCreation);