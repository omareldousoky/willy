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
import { newApplication, editApplication } from '../../Services/APIs/loanApplication/newApplication';
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
        this.state = this.setInitState();
    }
    setInitState() {
        return ({
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
                    name: '',
                    phoneNumber: ''
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
                name: '',
                phoneNumber: ''
            }],
            prevId: ''
        })
    }
    static getDerivedStateFromProps(props, state) {
        const application = { ...state.application };
        if ((props.history.location.state.id !== state.prevId) && (props.history.location.state.action !== state.application.state)) {
            application.state = props.history.location.state.action
            application.id = props.history.location.state.id
            return { prevId: props.history.location.state.id, application: application }
        }
        return null
    }
    componentDidMount() {
        this.setappStats()
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.location.state.action !== this.props.location.state.action && prevProps.location.state.id !== this.props.location.state.id) {
            //set State to initial value
            // I need to add application id in the form values to be passed to status helper component
            this.setappStats();
        }
    }
    setappStats() {
        this.getProducts();
        this.getFormulas();
        if (this.state.prevId.length > 0) {
            this.getAppByID(this.state.prevId)
        } else {
            this.setState(this.setInitState());
        }
    }
    async getAppByID(id) {
        this.setState({ loading: true })
        const application = await getApplication(id);
        if (application.status === 'success') {
            const formData = this.state.application;
            this.populateCustomer(application.body.customer)
            this.populateLoanProduct(application.body.product)
            const guarantor1 = (application.body.guarantors[0]) ? application.body.guarantors[0] : null;
            const guarantor2 = (application.body.guarantors[1]) ? application.body.guarantors[1] : null;
            if (guarantor1) formData.guarantorIds.push(guarantor1._id);
            if (guarantor2) formData.guarantorIds.push(guarantor2._id);
            formData.entryDate = (application.body.entryDate) ? this.getDateString(application.body.entryDate) : '';
            formData.visitationDate = (application.body.visitationDate) ? this.getDateString(application.body.visitationDate) : '';
            formData.usage = (application.body.usage) ? application.body.usage : '';
            formData.enquirorId = (application.body.enquirorId) ? application.body.enquirorId : '';
            formData.viceCustomers = application.body.viceCustomers;
            formData.principal = (application.body.principal) ? application.body.principal : 0;
            formData.customerID = application.body.customer._id;
            formData.productID = application.body.product._id;
            this.setState({
                selectedCustomer: application.body.customer,
                application: formData,
                guarantor1,
                guarantor2,
                loading: false
            })
        } else {
            Swal.fire('', local.searchError, 'error');
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
            Swal.fire('', local.searchError, 'error');
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
            Swal.fire('', local.searchError, 'error');
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
            from: 0,
            size: 30,
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
        defaultApplication.customerName = response.customerName;
        defaultApplication.nationalId = response.nationalId;
        defaultApplication.birthDate = this.getDateString(response.birthDate);
        defaultApplication.gender = getGenderFromNationalId(response.nationalId);
        defaultApplication.nationalIdIssueDate = this.getDateString(response.nationalIdIssueDate);
        defaultApplication.businessSector = response.businessSector;
        defaultApplication.businessActivity = response.businessActivity;
        defaultApplication.businessSpeciality = response.businessSpeciality;
        defaultApplication.permanentEmployeeCount = response.permanentEmployeeCount;
        defaultApplication.partTimeEmployeeCount = response.partTimeEmployeeCount;
        defaultApplication.representative = response.representative;
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
            this.populateCustomer(selectedCustomer.body)
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
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    removeGuarantor = async (obj, guarantor: string) => {
        this.setState({ loading: true });
        const defaultApplication = this.state.application
        defaultApplication.guarantorIds = defaultApplication.guarantorIds.filter(id => obj._id !== id)
        const newState = {
            application: defaultApplication
        };
        newState[guarantor] = {};
        newState[`${guarantor}Res`] = [];
        newState['loading'] = false;
        this.setState(newState);
    }
    populateLoanProduct(selectedProductDetails) {
        const defaultApplication = this.state.application;
        const defaultValues = this.setInitState().application;
        defaultApplication.calculationFormulaId = selectedProductDetails.calculationFormula._id;
        defaultApplication.currency = selectedProductDetails.currency;
        defaultApplication.interest = (selectedProductDetails.interest) ? selectedProductDetails.interest : defaultValues.interest;
        defaultApplication.interestPeriod = selectedProductDetails.interestPeriod;
        defaultApplication.allowInterestAdjustment = selectedProductDetails.allowInterestAdjustment;
        defaultApplication.inAdvanceFees = (selectedProductDetails.inAdvanceFees) ? selectedProductDetails.inAdvanceFees : defaultValues.inAdvanceFees;
        defaultApplication.inAdvanceFrom = selectedProductDetails.inAdvanceFrom;
        defaultApplication.inAdvanceType = selectedProductDetails.inAdvanceType;
        defaultApplication.periodLength = (selectedProductDetails.periodLength) ? selectedProductDetails.periodLength : defaultValues.periodLength;
        defaultApplication.periodType = selectedProductDetails.periodType;
        defaultApplication.gracePeriod = (selectedProductDetails.gracePeriod) ? selectedProductDetails.gracePeriod : defaultValues.gracePeriod;
        defaultApplication.pushPayment = (selectedProductDetails.pushPayment) ? selectedProductDetails.pushPayment : defaultValues.pushPayment;
        defaultApplication.noOfInstallments = (selectedProductDetails.noOfInstallments) ? selectedProductDetails.noOfInstallments : defaultValues.noOfInstallments;
        defaultApplication.applicationFee = (selectedProductDetails.applicationFee) ? selectedProductDetails.applicationFee : defaultValues.applicationFee;
        defaultApplication.individualApplicationFee = (selectedProductDetails.individualApplicationFee) ? selectedProductDetails.individualApplicationFee : defaultValues.individualApplicationFee;
        defaultApplication.applicationFeePercent = (selectedProductDetails.applicationFeePercent) ? selectedProductDetails.applicationFeePercent : defaultValues.applicationFeePercent;
        defaultApplication.applicationFeeType = selectedProductDetails.applicationFeeType;
        defaultApplication.applicationFeePercentPerPerson = (selectedProductDetails.applicationFeePercentPerPerson) ? selectedProductDetails.applicationFeePercentPerPerson : defaultValues.applicationFeePercentPerPerson;
        defaultApplication.applicationFeePercentPerPersonType = selectedProductDetails.applicationFeePercentPerPersonType;
        defaultApplication.representativeFees = (selectedProductDetails.representativeFees) ? selectedProductDetails.representativeFees : defaultValues.representativeFees;
        defaultApplication.allowRepresentativeFeesAdjustment = selectedProductDetails.allowRepresentativeFeesAdjustment;
        defaultApplication.stamps = (selectedProductDetails.stamps) ? selectedProductDetails.stamps : defaultValues.stamps;
        defaultApplication.allowStampsAdjustment = selectedProductDetails.allowStampsAdjustment;
        defaultApplication.adminFees = (selectedProductDetails.adminFees) ? selectedProductDetails.adminFees : defaultValues.adminFees;
        defaultApplication.allowAdminFeesAdjustment = selectedProductDetails.allowAdminFeesAdjustment;
        defaultApplication.minPrincipal = (selectedProductDetails.minPrincipal) ? selectedProductDetails.minPrincipal : defaultValues.minPrincipal;
        defaultApplication.maxPrincipal = (selectedProductDetails.maxPrincipal) ? selectedProductDetails.maxPrincipal : defaultValues.maxPrincipal;
        defaultApplication.minInstallment = (selectedProductDetails.minInstallment) ? selectedProductDetails.minInstallment : defaultValues.minInstallment;
        defaultApplication.maxInstallment = (selectedProductDetails.maxInstallment) ? selectedProductDetails.maxInstallment : defaultValues.maxInstallment;
        this.setState({ application: defaultApplication });
    }
    getSelectedLoanProduct = async (id) => {
        this.setState({ loading: true });
        const selectedProduct = await getProduct(id)
        if (selectedProduct.status === 'success') {
            const selectedProductDetails = selectedProduct.body.data;
            this.populateLoanProduct(selectedProductDetails)
            const defaultApplication = { ...this.state.application };
            defaultApplication.productID = id;
            this.setState({ loading: false, application: defaultApplication });
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    async handleStatusChange(intState, intProps) {
        this.setState({ loading: true });
        if (intProps.status === 'review') {
            const res = await reviewApplication({ id: intProps.id, date: new Date(intState.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.reviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        } else if (intProps.status === 'unreview') {
            const res = await undoreviewApplication({ id: intProps.id, date: new Date(intState.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.unreviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        } else if (intProps.status === 'reject') {
            const res = await rejectApplication({ applicationIds: [intProps.id], rejectionDate: new Date(intState.rejectionDate).valueOf(), rejectionReason: intState.rejectionReason });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.rejectSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
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
            if (!this.props.edit) {
                this.setState({ loading: true });
                const res = await newApplication(objToSubmit);
                if (res.status === 'success') {
                    this.setState({ loading: false });
                    Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/") })
                } else {
                    Swal.fire("error", local.loanApplicationCreationError, 'error')
                    this.setState({ loading: false });
                }
            } else if (this.props.edit) {
                this.setState({ loading: true });
                const res = await editApplication(objToSubmit,this.state.prevId);
                if (res.status === 'success') {
                    this.setState({ loading: false });
                    Swal.fire("success", local.loanApplicationEdited).then(() => { this.props.history.push("/") })
                } else {
                    Swal.fire("error", local.loanApplicationEditError, 'error')
                    this.setState({ loading: false });
                }
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
                            getSelectedLoanProduct={(id) => this.getSelectedLoanProduct(id)}
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