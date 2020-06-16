import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { RouteProps } from 'react-router';
import { Application, Vice, LoanApplicationValidation } from './loanApplicationStates';
import { LoanApplicationCreationForm } from './loanApplicationCreationForm';
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { getProducts, getProduct } from '../../Services/APIs/loanProduct/getProduct';
import { getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
import { getGenderFromNationalId } from '../../Services/nationalIdValidation';
import { newApplication, editApplication } from '../../Services/APIs/loanApplication/newApplication';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import { Location } from '../LoanCreation/loanCreation';
import { reviewApplication, undoreviewApplication, rejectApplication } from '../../Services/APIs/loanApplication/stateHandler';
import { getCookie } from '../../Services/getCookie';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { getLoanOfficer, searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { parseJwt } from '../../Services/utils';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Wizard from '../wizard/Wizard';
import Col from 'react-bootstrap/Col';
import { LoanApplicationCreationGuarantorForm } from './loanApplicationCreationGuarantorForm';
import DualBox from '../DualListBox/dualListBox';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InfoBox from '../userInfoBox';
interface Props {
    history: any;
    location: Location;
    edit: boolean;
};
interface Formula {
    name: string;
    _id: string;
}
export interface Customer {
    _id?: string;
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
export interface Results {
    results: Array<object>;
    empty: boolean;
}
interface State {
    step: number;
    application: Application;
    customerType: string;
    loading: boolean;
    selectedCustomer: Customer;
    selectedGroupLeader: string;
    searchResults: Results;
    guarantor1Res: Results;
    guarantor2Res: Results;
    formulas: Array<Formula>;
    products: Array<object>;
    loanUsage: Array<object>;
    loanOfficers: Array<object>;
    branchCustomers: Array<object>;
    selectedCustomers: Array<Customer>;
    guarantor1: any;
    guarantor2: any;
    viceCustomers: Array<Vice>;
    prevId: string;
    searchGroupCustomerKey: string;
    showModal: boolean;
    customerToView: Customer;
}
const date = new Date();



class LoanApplicationCreation extends Component<Props & RouteProps, State>{
    tokenData: any;
    constructor(props: Props) {
        super(props);
        this.state = this.setInitState();
        const token = getCookie('token');
        this.tokenData = parseJwt(token);
    }
    setInitState() {
        return ({
            step: 1,
            application: {
                beneficiaryType: '',
                individualDetails: [],
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
                allowApplicationFeeAdjustment: true,
                adminFees: 0,
                allowAdminFeesAdjustment: true,
                entryDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0],
                usage: '',
                representative: '',
                representativeName: '',
                enquirorId: '',
                visitationDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0],
                guarantorIds: [],
                viceCustomers: [{
                    name: '',
                    phoneNumber: ''
                }],
                state: 'under_review',
                reviewedDate: date,
                undoReviewDate: date,
                rejectionDate: date,
                noOfGuarantors: 0,
                guarantors: []
            },
            customerType: '',
            loading: false,
            selectedCustomer: {},
            selectedGroupLeader: '',
            searchResults: {
                results: [],
                empty: false
            },
            formulas: [],
            loanUsage: [],
            loanOfficers: [],
            products: [],
            branchCustomers: [],
            selectedCustomers: [],
            searchGroupCustomerKey: '',
            guarantor1Res: {
                results: [],
                empty: false
            },
            guarantor2Res: {
                results: [],
                empty: false
            },
            guarantor1: {},
            guarantor2: {},
            viceCustomers: [{
                name: '',
                phoneNumber: ''
            }],
            prevId: '',
            showModal: false,
            customerToView: {}
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
        this.getLoanUsage();
        this.getLoanOfficers();
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
            const value = (application.body.product.noOfGuarantors) ? application.body.product.noOfGuarantors : 2;
            const guarsArr: Array<any> = [];
            for (let i = 0; i < value; i++) {
                if (application.body.guarantors[i]) {
                    guarsArr.push({
                        searchResults: {
                            results: [],
                            empty: false
                        },
                        guarantor: application.body.guarantors[i],
                    })
                    formData.guarantorIds.push(application.body.guarantors[i]._id);
                } else {
                    guarsArr.push({
                        searchResults: {
                            results: [],
                            empty: false
                        },
                        guarantor: {},
                    })
                }
            }
            formData.entryDate = (application.body.entryDate) ? this.getDateString(application.body.entryDate) : '';
            formData.visitationDate = (application.body.visitationDate) ? this.getDateString(application.body.visitationDate) : '';
            formData.usage = (application.body.usage) ? application.body.usage : '';
            formData.enquirorId = (application.body.enquirorId) ? application.body.enquirorId : '';
            formData.viceCustomers = application.body.viceCustomers;
            formData.principal = (application.body.principal) ? application.body.principal : 0;
            formData.customerID = application.body.customer._id;
            formData.productID = application.body.product._id;
            formData.reviewedDate = application.body.reviewedDate;
            formData.undoReviewDate = application.body.undoReviewDate;
            formData.rejectionDate = application.body.reviewedDate;
            formData.guarantors = guarsArr;

            this.setState({
                selectedCustomer: application.body.customer,
                customerType: application.body.product.beneficiaryType,
                application: formData,
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
    async getLoanUsage() {
        this.setState({ loanUsage: [], loading: true })
        const usage = await getLoanUsage();
        if (usage.status === 'success') {
            this.setState({
                loanUsage: usage.body.usages.filter(usage => usage.activated),
                loading: false
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    async getLoanOfficers() {
        this.setState({ loanOfficers: [], loading: true })
        const res = await searchLoanOfficer({ from: 0, size: 100, branchId: this.tokenData.branch });
        if (res.status === "success") {
            this.setState({
                loanOfficers: res.body.data.filter(officer => officer.status === 'active'),
                loading: false
            });
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    async getProducts() {
        this.setState({ products: [], loading: true })
        if (this.tokenData.branch.length > 0) {
            const products = await getProductsByBranch(this.tokenData.branch);
            if (products.status === 'success') {
                this.setState({
                    products: products.body.data.productIds,
                    loading: false
                })
            } else {
                Swal.fire('', local.searchError, 'error');
                this.setState({ loading: false });
            }
        } else {
            Swal.fire('', local.selectBranch, 'error');
        }
    }
    async searchCustomers(key?: string) {
        let query = {}
        if (key && key.length > 0) {
            this.setState({ loading: true, searchGroupCustomerKey: key });
            query = { from: 0, size: 50, name: key, branchId: this.tokenData.branch }
        } else {
            this.setState({ loading: true });
            query = { from: 0, size: 50, branchId: this.tokenData.branch }
        }
        const results = await searchCustomer(query)
        if (results.status === 'success') {
            this.setState({ loading: false, branchCustomers: results.body.data });
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    handleSearch = async (query) => {
        this.setState({ loading: true });
        const results = await searchCustomer({ from: 0, size: 50, name: query })
        if (results.status === 'success') {
            if (results.body.data.length > 0) {
                this.setState({ loading: false, searchResults: { results: results.body.data, empty: false } });
            } else {
                this.setState({ loading: false, searchResults: { results: results.body.data, empty: true } });
            }
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    handleSearchGuarantors = async (query, index) => {
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
            const defaultApp = { ...this.state.application };
            const defaultGuarantors = { ...defaultApp.guarantors };
            const defaultGuar = { ...defaultGuarantors[index] };
            if (results.body.data.length > 0) {
                defaultGuar.searchResults = { results: results.body.data, empty: false };
            } else {
                defaultGuar.searchResults = { results: results.body.data, empty: true };
            }
            defaultApp.guarantors[index] = defaultGuar
            this.setState({
                application: defaultApp
            }, () => { this.setState({ loading: false }) });
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
    async getOfficerName(id) {
        const res = await getLoanOfficer(id);
        const defaultApplication = this.state.application;
        if (res.status === "success") {
            const name = res.body.name
            defaultApplication.representativeName = name
        } else {
            defaultApplication.representativeName = id;
        }
        this.setState({
            application: defaultApplication
        })
    }
    populateCustomer(response) {
        this.getOfficerName(response.representative);
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
        const selectedCustomer = await getCustomerByID(customer._id)
        if (selectedCustomer.status === 'success') {
            const defaultApplication = this.state.application;
            defaultApplication.customerID = customer._id;
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
    selectGuarantor = async (obj, index, values) => {
        this.setState({ loading: true });
        const selectedGuarantor = await getCustomerByID(obj._id);
        if (selectedGuarantor.status === 'success') {
            const defaultApplication = { ...values }
            const defaultGuarantors = { ...defaultApplication.guarantors };
            const defaultGuar = { ...defaultGuarantors[index] };
            defaultGuar.guarantor = { ...selectedGuarantor.body, id: obj._id };
            defaultApplication.guarantorIds.push(obj._id)
            defaultApplication.guarantors[index] = defaultGuar;
            this.setState({ application: defaultApplication, loading: false });
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    removeGuarantor = (obj, index, values) => {
        this.setState({ loading: true });
        const defaultApplication = { ...values }
        const defaultGuarantors = { ...defaultApplication.guarantors };
        const defaultGuar = { ...defaultGuarantors[index] };
        defaultApplication.guarantorIds = defaultApplication.guarantorIds.filter(id => obj._id !== id)
        defaultGuar.guarantor = {};
        defaultGuar.searchResults.results = [];
        defaultGuar.searchResults.empty = false;
        defaultApplication.guarantors[index] = defaultGuar;
        this.setState({ application: defaultApplication, loading: false });
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
        defaultApplication.noOfGuarantors = (selectedProductDetails.noOfGuarantors) ? selectedProductDetails.noOfGuarantors : defaultValues.noOfGuarantors;
        defaultApplication.allowApplicationFeeAdjustment = selectedProductDetails.allowApplicationFeeAdjustment;
        defaultApplication.beneficiaryType = selectedProductDetails.beneficiaryType;
        this.setState({ application: defaultApplication });
    }
    getSelectedLoanProduct = async (id) => {
        this.setState({ loading: true });
        const selectedProduct = await getProduct(id)
        if (selectedProduct.status === 'success') {
            const selectedProductDetails = selectedProduct.body.data;
            this.populateLoanProduct(selectedProductDetails)
            const element = {
                searchResults: {
                    results: [],
                    empty: false
                },
                guarantor: {},
            };
            const guarsArr = Array(selectedProductDetails.noOfGuarantors).fill(element)
            const defaultApplication = { ...this.state.application };
            defaultApplication.guarantors = guarsArr;
            defaultApplication.productID = id;
            this.setState({ loading: false, application: defaultApplication });
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    addOptionalGuarantor() {
        const element = {
            searchResults: {
                results: [],
                empty: false
            },
            guarantor: {},
        };
        const defaultApplication = { ...this.state.application };
        defaultApplication.guarantors.push(element)
        this.setState({
            application: defaultApplication
        })
    }
    async handleStatusChange(values, status) {
        this.setState({ loading: true });
        if (status === 'review') {
            const res = await reviewApplication({ id: this.state.prevId, date: new Date(values.reviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.reviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        } else if (status === 'unreview') {
            const res = await undoreviewApplication({ id: this.state.prevId, date: new Date(values.unreviewDate).valueOf() });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.unreviewSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        } else if (status === 'reject') {
            const res = await rejectApplication({ applicationIds: [this.state.prevId], rejectionDate: new Date(values.rejectionDate).valueOf(), rejectionReason: values.rejectionReason });
            if (res.status === 'success') {
                this.setState({ loading: false });
                Swal.fire("success", local.rejectSuccess).then(() => { this.props.history.push("/track-loan-applications") })
            } else {
                Swal.fire("error", local.statusChangeError, 'error')
                this.setState({ loading: false });
            }
        }
    }
    setCustomerType(type) {
        const defaultApplication = this.state.application;
        defaultApplication.beneficiaryType = type;
        this.setState({
            customerType: type,
            application: defaultApplication
        }, () => {
            if (type === 'group') {
                this.searchCustomers()
            }
        })
    }
    submit = async (values: Application) => {
        if (this.state.step === 2 && this.state.customerType === 'individual') {
            this.step('forward');
        } else {
            const obj = { ...values }
            const individualsToSend: { id?: string; amount: number; type: string }[] = []
            obj.individualDetails.forEach(customer => {
                const obj = {
                    id: customer.customer._id,
                    amount: customer.amount,
                    type: customer.type
                }
                individualsToSend.push(obj)
            })
            console.log(individualsToSend)
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
                applicationFee: obj.applicationFee,
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
                enquirorId: obj.enquirorId._id,
                visitationDate: new Date(obj.visitationDate).valueOf(),
                individualDetails: individualsToSend,
                viceCustomers: obj.viceCustomers.filter(item => item !== undefined),
            }

            console.log(values, objToSubmit)
            if (this.state.application.guarantorIds.length < this.state.application.noOfGuarantors && this.state.customerType === 'individual') {
                Swal.fire("error", local.selectTwoGuarantors, 'error')
            } else {
                if (!this.props.edit) {
                    this.setState({ loading: true });
                    const res = await newApplication(objToSubmit);
                    if (res.status === 'success') {
                        this.setState({ loading: false });
                        Swal.fire("success", local.loanApplicationCreated).then(() => { this.props.history.push("/track-loan-applications") })
                    } else {
                        Swal.fire("error", local.loanApplicationCreationError, 'error')
                        this.setState({ loading: false });
                    }
                } else if (this.props.edit) {
                    this.setState({ loading: true });
                    const res = await editApplication(objToSubmit, this.state.prevId);
                    if (res.status === 'success') {
                        this.setState({ loading: false });
                        Swal.fire("success", local.loanApplicationEdited).then(() => { this.props.history.push("/track-loan-applications") })
                    } else {
                        Swal.fire("error", local.loanApplicationEditError, 'error')
                        this.setState({ loading: false });
                    }
                }
            }
        }
    }
    step(key) {
        let currentStep = this.state.step
        if (this.state.step === 2 && key === 'forward' && this.state.customerType === 'group') {
            console.log(this.state.application)
        } else {
            if (this.state.step < 3 && key === 'forward') {
                currentStep++
            } else if (this.state.step >= 1 && key === 'backward') {
                currentStep--
            }
            this.setState({
                step: currentStep,
            })
        }
    }
    handleGroupChange(customers) {
        if (customers.length === 0) {
            this.setState({
                selectedGroupLeader: ''
            })
        }
        const customersTemp: { customer: Customer; amount: number; type: string }[] = [];
        const defaultApplication = this.state.application;
        customers.forEach(customer => {
            const obj = {
                customer: customer,
                amount: 0,
                type: 'member'
            }
            customersTemp.push(obj)
        })
        defaultApplication.individualDetails = customersTemp;
        console.log(customers, customersTemp, defaultApplication)
        this.setState({
            selectedCustomers: customers,
            application: defaultApplication
        })
    }
    async viewCustomer(id) {
        this.setState({ loading: true });
        const selectedCustomer = await getCustomerByID(id)
        if (selectedCustomer.status === 'success') {
            this.setState({
                customerToView: selectedCustomer.body,
                loading: false,
                showModal: true
            })
        } else {
            Swal.fire("error", local.searchError, 'error')
            this.setState({ loading: false });
        }
    }
    setGroupLeader(id) {
        const defaultApplication = this.state.application;
        defaultApplication.individualDetails.forEach(member => {
            console.log(member.customer._id, id)
            if (member.customer._id === id) {
                member.type = 'leader'
            } else {
                member.type = 'member'
            }
        })
        this.setState({
            application: defaultApplication,
            selectedGroupLeader: id
        })
    }
    renderStepOne() {
        if (this.state.customerType === 'individual') {
            return (
                <Col>
                    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <CustomerSearch source='loanApplication' style={{ width: '100%' }} handleSearch={(query) => this.handleSearch(query)} selectedCustomer={this.state.selectedCustomer} searchResults={this.state.searchResults} selectCustomer={(customer) => this.selectCustomer(customer)} />
                    </div>
                    <div className="d-flex" style={{ justifyContent: 'space-evenly', margin: '100px 0px' }}>
                        <Button
                            className={'btn-cancel-prev'} style={{ width: '20%' }}
                            onClick={() => { this.props.history.push("/track-loan-applications"); }}
                        >{local.cancel}</Button>
                        <Button className={'btn-submit-next'} style={{ float: 'left', width: '20%' }} onClick={() => this.step('forward')} data-qc="next">{local.next}</Button>

                    </div>
                </Col>
            )
        }
        else {
            return (
                <div className="d-flex flex-column justify-content-center w-100" >
                    <div style={{ textAlign: 'right' }}>
                        <h4>{local.customersSelection}</h4>
                    </div>
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <DualBox
                            labelKey={"customerName"}
                            direction={""}
                            search={(key) => this.searchCustomers(key)}
                            options={this.state.branchCustomers}
                            selected={this.state.selectedCustomers}
                            onChange={(list) => this.handleGroupChange(list)}
                            filterKey={this.state.searchGroupCustomerKey}
                            rightHeader={local.allCustomers}
                            leftHeader={local.selectedCustomers}
                            viewSelected={(id) => this.viewCustomer(id)}
                        />
                        {this.state.selectedCustomers.length <= 7 && this.state.selectedCustomers.length >= 3 ? <Form.Group controlId="leaderSelector" style={{ textAlign: 'right', margin: 'auto', width: '60%' }}>
                            <Form.Label>{local.groupLeaderName}</Form.Label>
                            <Form.Control as="select"
                                name="selectedGroupLeader"
                                data-qc="selectedGroupLeader"
                                value={this.state.selectedGroupLeader}
                                onChange={(event) => {
                                    this.setGroupLeader(event.currentTarget.value)
                                }}
                            >
                                <option value="" disabled></option>
                                {this.state.selectedCustomers.map((customer, i) =>
                                    <option key={i} value={customer._id}>{customer.customerName}</option>
                                )}
                            </Form.Control>
                        </Form.Group> : <span>Select customers</span>}
                    </div>
                    <div className="d-flex" style={{ justifyContent: 'space-evenly', margin: '100px 0px' }}>
                        <Button
                            className={'btn-cancel-prev'} style={{ width: '20%' }}
                            onClick={() => { this.props.history.push("/track-loan-applications"); }}
                        >{local.cancel}</Button>
                        <Button className={'btn-submit-next'} disabled={this.state.selectedGroupLeader.length === 0 || this.state.selectedCustomers.length < 3} style={{ float: 'left', width: '20%' }} onClick={() => this.step('forward')} data-qc="next">{local.next}</Button>

                    </div>
                </div>
            )
        }
    }
    renderStepTwo() {
        return (
            <Formik
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
                        loanUsage={this.state.loanUsage}
                        products={this.state.products}
                        loanOfficers={this.state.loanOfficers}
                        step={(key) => this.step(key)}
                        getSelectedLoanProduct={(id) => this.getSelectedLoanProduct(id)}
                    />
                }
            </Formik>
        )
    }
    renderStepThree() {
        return (
            <Formik
                initialValues={this.state.application}
                onSubmit={this.submit}
                validationSchema={LoanApplicationValidation}
                validateOnBlur
                validateOnChange
                enableReinitialize
            >
                {(formikProps) =>
                    <LoanApplicationCreationGuarantorForm {...formikProps}
                        step={(key) => this.step(key)}
                        addGuar={() => this.addOptionalGuarantor()}
                        handleSearch={(query, guarantor) => { this.handleSearchGuarantors(query, guarantor) }}
                        selectGuarantor={(query, guarantor, values) => { this.selectGuarantor(query, guarantor, values) }}
                        removeGuarantor={(query, guarantor, values) => { this.removeGuarantor(query, guarantor, values) }}
                    />
                }
            </Formik>
        )
    }
    renderSteps() {
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
                <Loader open={this.state.loading} type="fullscreen" />
                <Card>
                    {this.state.customerType === '' ? <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column" style={{ margin: '20px 60px' }}>
                            <img style={{ width: 75, margin: '40px 20px' }} src={require('../../Assets/individual.svg')} />
                            <Button onClick={() => this.setCustomerType('individual')}>{local.individual}</Button>
                        </div>
                        <div className="d-flex flex-column" style={{ margin: '20px 60px' }}>
                            <img style={{ width: 75, margin: '40px 20px' }} src={require('../../Assets/group.svg')} />
                            <Button onClick={() => this.setCustomerType('group')}>{local.group}</Button>
                        </div>
                    </div> :
                        <div style={{ display: "flex", flexDirection: "row" }} >
                            <Wizard
                                currentStepNumber={this.state.step - 1}
                                stepsDescription={(this.state.customerType === 'individual') ? [local.customersDetails, local.loanInfo, local.guarantorInfo] : [local.customersDetails, local.loanInfo]}
                            />
                            {this.renderSteps()}
                        </div>
                    }
                </Card>
                {this.state.showModal && <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                    <Modal.Body>
                        <InfoBox values={this.state.customerToView} />
                    </Modal.Body>
                </Modal>}
            </Container>
        )
    }
}
export default withRouter(LoanApplicationCreation);