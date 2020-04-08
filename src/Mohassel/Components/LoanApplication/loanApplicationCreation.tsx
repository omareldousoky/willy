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
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import { Location } from '../LoanCreation/loanCreation';
import { reviewApplication, undoreviewApplication, rejectApplication } from '../../Services/APIs/loanApplication/stateHandler';

interface Props {
    history: any;
    location: Location;
    edit: boolean;
};
interface Formula {
    name: string;
    _id: string;
}
interface Customer {
    customerID?: string;
    customerName?: string;
    customerCode?: string;
    nationalId?: string;
    birthDate?: string;
    gender?: string;
    nationalIdIssueDate?: string;
    businessSector?: string;
    businessActivity?: string;
    businessSpeciality?: string;
    permanentEmployeeCount?: string;
    partTimeEmployeeCount?: string;
}
interface State {
    application: Application;
    loading: boolean;
    selectedCustomer: Customer;
    searchResults: Array<Application>;
    guarantor1Res: Array<object>;
    guarantor2Res: Array<object>;
    formulas: Array<Formula>;
    products: Array<object>;
    guarantor1: any;
    guarantor2: any;
    viceCustomers: Array<Vice>;
    prevId: string;
}
const date = new Date();

class LoanApplicationCreation extends Component<Props & RouteProps, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            application: {
                customerID: '',
                customerName: "",
                customerCode: '',
                nationalId: '',
                birthDate: '',
                gender: '',
                nationalIdIssueDate: '',
                businessSector: '',
                businessActivity: '',
                businessSpeciality: '',
                permanentEmployeeCount: '',
                partTimeEmployeeCount: '',
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
                state: 'under_review'
            },
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
                viceCustomerName: '',
                viceCustomerNumber: ''
            }],
            prevId: ''
        }
    }

    static getDerivedStateFromProps(props, state) {
        const application = { ...state.application };
        console.log('Derived', props)
        if ((props.history.location.state.id !== state.prevId) && (props.history.location.state.action !== state.application.state)) {
            application.state = props.history.location.state.action
            application.id = props.history.location.state.id
            return { prevId: props.history.location.state.id, application: application }
        }
        return null
    }
    componentDidMount() {
        console.log(this.state)
        this.setappStats()
    }
    componentDidUpdate(prevProps: Props) {
        console.log('Did update', prevProps, this.props, this.state)
        // const application = state.application;
        if (prevProps.location.state.action !== this.props.location.state.action) {
            console.log('change')
            //set State to initial value
            // I need to add application id in the form values to be passed to status helper component
            // const app = { ...this.state.application }
            // app.state = 'under_review';
            // this.setState({ application: app });
            this.setappStats();
        }
    }
    setappStats() {
        this.getProducts();
        this.getFormulas();
        if (this.state.prevId.length > 0) {
            // const app = { ...this.state.application }
            // const customer = { ...this.state.selectedCustomer }
            this.getAppByID(this.state.prevId)
            // app.state = status;
            // app.loanApplicationId = loanApplication.id;
            // app.customerID = '5e7cacc27d33706d57961f66';
            // app.customerName = "zaher branch test";
            // app.customerCode = '';
            // app.nationalId = '77005678910124';
            // app.birthDate = '2020-03-14';
            // app.gender = 'male';
            // app.nationalIdIssueDate = '2020-03-14';
            // app.businessSector = 'sdsd';
            // app.businessActivity = 'sdsds2';
            // app.businessSpeciality = '';
            // app.permanentEmployeeCount = '0';
            // app.partTimeEmployeeCount = '0'
            // customer.customerID = '5e7cacc27d33706d57961f66';
            // customer.customerName = "zaher branch test";
            // customer.customerCode = '';
            // customer.nationalId = '77005678910124';
            // customer.birthDate = '2020-03-14';
            // customer.gender = 'male';
            // customer.nationalIdIssueDate = '2020-03-14';
            // customer.businessSector = 'sdsd';
            // customer.businessActivity = 'sdsds2';
            // customer.businessSpeciality = '';
            // customer.permanentEmployeeCount = '0';
            // customer.partTimeEmployeeCount = '0'
            // this.setState({ application: app, selectedCustomer: customer })
        } else {
            this.setState({ selectedCustomer: {} })
        }
    }
    async getAppByID(id) {
        this.setState({ loading: true })
        const application = await getApplication(id);
        if (application.status === 'success') {
            const formData = this.state.application;
            const guarantor1 = application.body.guarantors[0];
            const guarantor2 = application.body.guarantors[1];
            formData.guarantorIds.push(guarantor1.customerInfo.nationalId);
            formData.guarantorIds.push(guarantor2.customerInfo.nationalId);
            formData.entryDate = this.getDateString(application.body.entryDate);
            formData.visitationDate = this.getDateString(application.body.visitationDate);
            formData.usage = application.body.usage;
            formData.enquirorId = application.body.enquirorId;
            formData.viceCustomers = application.body.viceCustomers;

            this.populateCustomer(application.body.customer)
            this.setState({
                selectedCustomer: application.body.customer,
                application: formData,
                guarantor1,
                guarantor2,
                loading: false
            })
        } else {
            console.log('err')
            this.setState({ loading: false });
        }
    }
    async getFormulas() {
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
            // sameBranch: true,
            from:0,
            size:30,
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
    populateCustomer(response) {
        const defaultApplication = this.state.application;
        defaultApplication.customerName = response.customerInfo.customerName;
        defaultApplication.nationalId = response.customerInfo.nationalId;
        defaultApplication.birthDate = this.getDateString(response.customerInfo.birthDate);
        defaultApplication.gender = getGenderFromNationalId(response.customerInfo.nationalId);
        defaultApplication.nationalIdIssueDate = this.getDateString(response.customerInfo.nationalIdIssueDate);
        defaultApplication.businessSector = response.customerBusiness.businessSector;
        defaultApplication.businessActivity = response.customerBusiness.businessActivity;
        defaultApplication.businessSpeciality = response.customerBusiness.businessSpeciality;
        defaultApplication.permanentEmployeeCount = response.customerExtraDetails.permanentEmployeeCount;
        defaultApplication.partTimeEmployeeCount = response.customerExtraDetails.partTimeEmployeeCount;
        defaultApplication.representative = response.customerExtraDetails.representative;
        this.setState({
            application: defaultApplication
        });
    }
    selectCustomer = async (customer) => {
        this.setState({ loading: true });
        const selectedCustomer = await getCustomerByID(customer.id)
        if (selectedCustomer.status === 'success') {
            const defaultApplication = this.state.application;
            defaultApplication.customerID = customer.id;
            this.populateCustomer(customer.body)
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
    async handleStatusChange(intState, intProps) {
        console.log('IN CREATION TSX')
        this.setState({ loading: true });
        if (intProps.status === 'review') {
            const res = await reviewApplication({ id: intProps.id, date: new Date(intState.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.loanApplicationCreationError, 'error')
                this.setState({ loading: false });
            }
        } else if (intProps.status === 'unreview') {
            console.log(intProps.status, intProps.id)
            const res = await undoreviewApplication({ id: intProps.id, date: new Date(intState.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.loanApplicationCreationError, 'error')
                this.setState({ loading: false });
            }
        } else if (intProps.status === 'reject') {
            console.log(intProps.status, intProps.id)
            const res = await rejectApplication({ applicationIds: [intProps.id], rejectionDate: new Date(intState.rejectionDate).valueOf(), rejectionReason: intState.rejectionReason });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.loanApplicationCreationError, 'error')
                this.setState({ loading: false });
            }
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
                            handleStatusChange={(state, props) => this.handleStatusChange(state, props)}
                        />
                    }
                </Formik> : <CustomerSearch source='loanApplication' style={{ width: '60%' }} handleSearch={(query) => this.handleSearch(query)} searchResults={this.state.searchResults} selectCustomer={(customer) => this.selectCustomer(customer)} />}
            </Container>
        )
    }
}
export default withRouter(LoanApplicationCreation);