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
    productName: string;
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
    guarantor: Array<string>;
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
            guarantor1Res:[],
            guarantor2Res:[],
            guarantor:[]
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
            // const ProductLabels: Array<object> = [];
            // products.body.data.data.forEach(product => {
            //     ProductLabels.push({ value: product._id, label: product.productName })
            // })
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
    handleSearchGurantors = async (query,guarantor) => {
        console.log(this.state.selectedCustomer)
        this.setState({ loading: true });
        const obj = {
            name: query,
            sameBranch: true,
            excludedIds:[this.state.application.customerID]
        }
        const results = await searchCustomer(obj)
        if (results.status === 'success') {
            if(guarantor===1){this.setState({ loading: false, guarantor1Res: results.body.customers });}
            if(guarantor===2){this.setState({ loading: false, guarantor2Res: results.body.customers });}
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
        console.log(selectedCustomer)
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
            }, () => { console.log(this.state.application) });

        } else {
            Swal.fire("error", 'search error')
            this.setState({ loading: false });
        }
    }
    selectGurantor(id,guarantor){
        console.log(id)
        const guar = this.state.guarantor;
        guar.push(id)
        this.setState({
            guarantor: guar
        },()=>{console.log(this.state)})
    }
    getSelectedLoanProduct = async (id) => {
        this.setState({ loading: true });
        const selectedProduct = await getProduct(id)
        if (selectedProduct.status === 'success') {
            const defaultApplication = this.state.application;
            const selectedProductDetails = selectedProduct.body.data;
            defaultApplication.productName = id;
            defaultApplication.calculationFormulaId = selectedProductDetails.calculationFormula._id;
            defaultApplication.currency = selectedProductDetails.currency;
            defaultApplication.interest = selectedProductDetails.interest;
            defaultApplication.interestPeriod = selectedProductDetails.interesPeriod;
            defaultApplication.inAdvanceFees = selectedProductDetails.inAdvanceFees;
            defaultApplication.inAdvanceFrom = selectedProductDetails.inAdvanceFrom;
            defaultApplication.inAdvanceType = selectedProductDetails.inAdvanceType;
            defaultApplication.periodLength = selectedProductDetails.periodLength;
            defaultApplication.periodType = selectedProductDetails.periodType;
            defaultApplication.gracePeriod = selectedProductDetails.gracePeriod;
            defaultApplication.pushPayment = selectedProductDetails.pushPayment;
            defaultApplication.noOfInstallments = selectedProductDetails.noOfInstallments;
            // defaultApplication.principal = selectedProductDetails.
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
            this.setState({ loading: false, application: defaultApplication }, () => { console.log('PRODUCT', selectedProduct.body) });
        } else {
            Swal.fire("error", 'search error')
            this.setState({ loading: false });
        }
    }
    submit = async (values: object) => {
        this.setState({ loading: true });
        const obj = values
        // const res = await createProduct(obj);
        // if (res.status === 'success') {
        //     this.setState({ loading: false });
        //     Swal.fire("success", local.loanProductCreated).then(() => { this.props.history.push("/") })
        // } else {
        //     Swal.fire("error", local.loanProductCreationError)
        //     this.setState({ loading: false });
        // }
    }
    render() {
        return (
            <div>
                {this.state.loading ? <Spinner animation="border" className="central-loader-fullscreen" /> :
                    <Container>
                        {(Object.keys(this.state.selectedCustomer).length > 0) ? <Formik
                            enableReinitialize
                            initialValues={this.state.application}
                            onSubmit={this.submit}
                            validationSchema={LoanApplicationValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <LoanApplicationCreationForm {...formikProps} formulas={this.state.formulas} products={this.state.products} getSelectedLoanProduct={(id) => this.getSelectedLoanProduct(id)} handleSearch={(query,guarantor)=>{this.handleSearchGurantors(query,guarantor)}} selectGuarantor={(query,guarantor)=>{this.selectGurantor(query,guarantor)}} searchResults1={this.state.guarantor1Res} searchResults2={this.state.guarantor2Res} gurantorOneSelected={this.state.guarantor.length>0}/>
                            }
                        </Formik> : <CustomerSearch source='loanApplication' handleSearch={(query) => this.handleSearch(query)} searchResults={this.state.searchResults} selectCustomer={(customer) => this.selectCustomer(customer)} />}
                    </Container>
                }
            </div>
        )
    }
}
export default withRouter(LoanApplicationCreation);