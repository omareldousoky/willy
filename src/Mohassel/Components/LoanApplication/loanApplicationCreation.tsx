import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { RouteProps } from 'react-router';
import { Application, Vice, LoanApplicationValidation } from './loanApplicationStates';
import { LoanApplicationCreationForm } from './loanApplicationCreationForm';
import { searchCustomerByName, getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/customerSearch';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { getProducts, getProduct } from '../../Services/APIs/loanProduct/getProduct';
import { getGenderFromNationalId } from '../../Services/nationalIdValidation';
import { newApplication } from '../../Services/APIs/loanApplication/newApplication';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import { Location } from '../LoanCreation/loanCreation'
interface Props {
    history: Array<string>;
    location: Location;
    edit: boolean;
};
interface Formula {
    name: string;
    _id: string;
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
const date = new Date();

class LoanApplicationCreation extends Component<Props & RouteProps, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            application: {
                customerID: '5e7cacc27d33706d57961f66',
                customerName: "zaher branch test",
                customerCode: '',
                nationalId: '77005678910124',
                birthDate: '2020-03-14',
                gender: 'male',
                nationalIdIssueDate: '2020-03-14',
                businessSector: 'sdsd',
                businessActivity: 'sdsds2',
                businessSpeciality: '',
                permanentEmployeeCount: '0',
                partTimeEmployeeCount: '0',
                productID: '',
                calculationFormulaId: '',
                currency: 'egp',
                interest: 0,
                interestPeriod: 'yearly',
                minPrincipal: 0,
                maxPrincipal: 0,
                minInstallment: 0,
                maxInstallment: 0,
                allowInterestAdjustment: true,
                inAdvanceFees: 0,
                inAdvanceFrom: 'principal',
                inAdvanceType: 'uncut',
                periodLength: 1,
                periodType: 'days',
                gracePeriod: 0,
                pushPayment: 0,
                noOfInstallments: 1,
                principal: 0,
                applicationFee: 0,
                individualApplicationFee: 0,
                applicationFeePercent: 0,
                applicationFeeType: 'principal',
                applicationFeePercentPerPerson: 0,
                applicationFeePercentPerPersonType: 'principal',
                representativeFees: 0,
                allowRepresentativeFeesAdjustment: true,
                stamps: 0,
                allowStampsAdjustment: true,
                adminFees: 0,
                allowAdminFeesAdjustment: true,
                entryDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0],
                usage: '',
                representative: '',
                enquirorId: '',
                visitationDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0],
                guarantorIds: [],
                viceCustomers: [{
                    viceCustomerName: '',
                    viceCustomerNumber: ''
                }],
                state: 'under_review',
                id:'12345'
            },
            loading: false,
            selectedCustomer: {
                customerID: '5e7cacc27d33706d57961f66',
                customerName: "zaher branch test",
                customerCode: '',
                nationalId: '77005678910124',
                birthDate: '2020-03-14',
                gender: 'male',
                nationalIdIssueDate: '2020-03-14',
                businessSector: 'sdsd',
                businessActivity: 'sdsds2',
                businessSpeciality: '',
                permanentEmployeeCount: '0',
                partTimeEmployeeCount: '0'
            },
            searchResults: [],
            formulas: [],
            products: [],
            guarantor1Res: [],
            guarantor2Res: [],
            guarantor1: {},
            guarantor2: {},
            viceCustomers: [{
                viceCustomerName: '',
                viceCustomerNumber: ''
            }],
        }
    }
    componentDidUpdate(prevProps: Props, _prevState: State) {
        if (prevProps.edit !== this.props.edit) {
            //set State to initial value
            // I need to add application id in the form values to be passed to status helper component
            const app = { ...this.state.application }
            app.state = 'under_review';
            this.setState({ application: app });
        }
    }
    async UNSAFE_componentWillMount() {
        console.log('Here', this.props)
        if (this.props.edit === false) {

            this.setState({ loading: true });
            const formulas = await getFormulas();
            if (formulas.status === 'success') {
                this.setState({
                    formulas: formulas.body.data,
                    loading: false
                })
            } else {
                console.log('err')
                this.setState({ loading: false });
            }
            this.getProducts();
        } else {
            const loanApplication = JSON.parse(this.props.location.state);
            const status = loanApplication.state;
            const loanApplicationId = loanApplication.id;
            console.log(loanApplication)
            const app = { ...this.state.application }
            app.state = status;
            // app.loanApplicationId = loanApplication.id;
            this.setState({ application: app })
        }
    }
    async getProducts() {
        this.setState({ products: [], loading: true })
        const products = await getProducts();
        if (products.status === 'success') {
            this.setState({
                products: products.body.data.data,
                loading: false
            })
        } else {
            console.log('err')
            this.setState({ loading: false });
        }
    }
    handleSearch = async (query) => {
        this.setState({ loading: true });
        const results = await searchCustomerByName(query)
        if (results.status === 'success') {
            this.setState({ loading: false, searchResults: results.body.customers });
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    handleSearchGuarantors = async (query, guarantor: string) => {
        const obj = {
            name: query,
            sameBranch: true,
            excludedIds: [this.state.application.customerID, ...this.state.application.guarantorIds]
        }
        this.setState({ loading: true });
        const results = await searchCustomer(obj)
        if (results.status === 'success') {
            const newState = {};
            newState[guarantor] = results.body.customers;
            this.setState(newState, () => { this.setState({ loading: false }) });
        } else {
            Swal.fire("error", local.searchError, 'error')
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
            defaultApplication.businessSpeciality = selectedCustomer.body.customerBusiness.businessSpeciality;
            defaultApplication.permanentEmployeeCount = selectedCustomer.body.customerExtraDetails.permanentEmployeeCount;
            defaultApplication.partTimeEmployeeCount = selectedCustomer.body.customerExtraDetails.partTimeEmployeeCount;
            defaultApplication.representative = selectedCustomer.body.customerExtraDetails.representative;
            this.setState({
                loading: false,
                selectedCustomer: selectedCustomer.body,
                application: defaultApplication
            });

        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    selectGuarantor = async (obj, guarantor: string) => {
        this.setState({ loading: true });
        const selectedGuarantor = await getCustomerByID(obj.id);
        if (selectedGuarantor.status === 'success') {
            const defaultApplication = this.state.application
            defaultApplication.guarantorIds.push(obj.id)
            const newState = {};
            newState[guarantor] = { ...selectedGuarantor.body, id: obj.id };
            this.setState(newState, () => { this.setState({ loading: false }) });
        } else {
            console.log('err')
            this.setState({ loading: false });
        }
    }
    removeGuarantor = async (obj, guarantor: string) => {
        this.setState({ loading: true });
        const defaultApplication = this.state.application
        defaultApplication.guarantorIds = defaultApplication.guarantorIds.filter(id => obj.id !== id)
        const newState = {
            application: defaultApplication
        };
        newState[guarantor] = {};
        newState[`${guarantor}Res`] = [];
        newState['loading'] = false;
        this.setState(newState);
    }
    getSelectedLoanProduct = async (id, setValues, values) => {
        this.setState({ loading: true });
        const selectedProduct = await getProduct(id)
        if (selectedProduct.status === 'success') {
            const defaultApplication = { ...this.state.application };
            const selectedProductDetails = selectedProduct.body.data;
            defaultApplication.productID = id;
            defaultApplication.calculationFormulaId = selectedProductDetails.calculationFormula._id;
            defaultApplication.currency = selectedProductDetails.currency;
            defaultApplication.interest = selectedProductDetails.interest;
            defaultApplication.interestPeriod = selectedProductDetails.interestPeriod;
            defaultApplication.allowInterestAdjustment = selectedProductDetails.allowInterestAdjustment;
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
            defaultApplication.minPrincipal = selectedProductDetails.minPrincipal;
            defaultApplication.maxPrincipal = selectedProductDetails.maxPrincipal;
            defaultApplication.minInstallment = selectedProductDetails.minInstallment;
            defaultApplication.maxInstallment = selectedProductDetails.maxInstallment;
            setValues({ ...values, ...defaultApplication })
            this.setState({ loading: false });
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    submit = async (values: Application) => {
        const obj = { ...values }
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
            representative: obj.representative,
            enquirorId: obj.enquirorId,
            visitationDate: new Date(obj.visitationDate).valueOf(),
            viceCustomers: obj.viceCustomers.filter(item => item !== undefined),
        }
        if (Object.keys(this.state.guarantor1).length > 0 && Object.keys(this.state.guarantor2).length > 0) {
            this.setState({ loading: true });
            const res = await newApplication(objToSubmit);
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/") })
            } else {
                Swal.fire("error", local.loanApplicationCreationError, 'error')
                this.setState({ loading: false });
            }
        } else {
            Swal.fire("error", local.selectTwoGuarantors, 'error')
        }
    }
    render() {
        return (
            <Container>
                <Loader open={this.state.loading} type="fullscreen" />
                {(Object.keys(this.state.selectedCustomer).length > 0) ? <Formik
                    initialValues={this.state.application}
                    onSubmit={this.submit}
                    validationSchema={LoanApplicationValidation}
                    validateOnBlur
                    validateOnChange
                    enableReinitialize
                >
                    {(formikProps) =>
                        <LoanApplicationCreationForm {...formikProps}
                            formulas={this.state.formulas}
                            products={this.state.products}
                            getSelectedLoanProduct={(id, setValues, values) => this.getSelectedLoanProduct(id, setValues, values)}
                            handleSearch={(query, guarantor) => { this.handleSearchGuarantors(query, guarantor) }}
                            selectGuarantor={(query, guarantor) => { this.selectGuarantor(query, guarantor) }}
                            removeGuarantor={(query, guarantor) => { this.removeGuarantor(query, guarantor) }}
                            searchResults1={this.state.guarantor1Res}
                            searchResults2={this.state.guarantor2Res}
                            guarantorOne={this.state.guarantor1}
                            guarantorTwo={this.state.guarantor2}
                            viceCustomers={this.state.viceCustomers}
                        />
                    }
                </Formik> : <CustomerSearch source='loanApplication' style={{ width: '60%' }} handleSearch={(query) => this.handleSearch(query)} searchResults={this.state.searchResults} selectCustomer={(customer) => this.selectCustomer(customer)} />}
            </Container>
        )
    }
}
export default withRouter(LoanApplicationCreation);