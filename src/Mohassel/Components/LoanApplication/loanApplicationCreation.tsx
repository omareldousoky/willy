import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { RouteProps } from 'react-router';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as local from '../../../Shared/Assets/ar.json';
import { Application, Vice, LoanApplicationValidation } from './loanApplicationStates';
import { LoanApplicationCreationForm } from './loanApplicationCreationForm';
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { searchCompany, searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { Loader } from '../../../Shared/Components/Loader';
import { getFormulas } from '../../Services/APIs/LoanFormula/getFormulas';
import { getProduct } from '../../Services/APIs/loanProduct/getProduct';
import { getProductsByBranch } from '../../Services/APIs/Branch/getBranches';
import { getGenderFromNationalId } from '../../Services/nationalIdValidation';
import { newApplication, editApplication } from '../../Services/APIs/loanApplication/newApplication';
import { getApplication } from '../../Services/APIs/loanApplication/getApplication';
import { Location } from '../LoanCreation/loanCreation';
import { getCookie } from '../../../Shared/Services/getCookie';
import { getLoanUsage } from '../../Services/APIs/LoanUsage/getLoanUsage';
import { getLoanOfficer, searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer';
import { parseJwt, beneficiaryType, getAge, getFullCustomerKey, getErrorMessage } from "../../../Shared/Services/utils";
import { getBusinessSectors } from '../../Services/APIs/configApis/config'
import { LoanApplicationCreationGuarantorForm } from './loanApplicationCreationGuarantorForm';
import DualBox from '../DualListBox/dualListBox';
import InfoBox from '../userInfoBox';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
import Wizard from '../wizard/Wizard';
import { BusinessSector } from '../CustomerCreation/StepTwoForm';
import { getCustomersBalances } from '../../Services/APIs/Customer-Creation/customerLoans';
import Select from 'react-select';
import { getMaxPrinciples } from '../../Services/APIs/configApis/config';
import { theme } from '../../../theme';
import { Customer } from '../../../Shared/Services/interfaces';

interface Props {
    history: any;
    location: Location;
    edit: boolean;
};
export interface Formula {
    name: string;
    _id: string;
    interest_type: string;

}
interface LoanOfficer {
    _id: string;
    username: string;
    name: string;
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
    selectedLoanOfficer: LoanOfficer;
    searchResults: Results;
    guarantor1Res: Results;
    guarantor2Res: Results;
    formulas: Array<Formula>;
    products: Array<any>;
    loanUsage: Array<object>;
    loanOfficers: Array<LoanOfficer>;
    branchCustomers: Array<object>;
    selectedCustomers: Array<Customer>;
    businessSectors: Array<BusinessSector>;
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
                guarantors: [],
                principals: {
                    maxIndividualPrincipal: 0,
                    maxGroupIndividualPrincipal: 0,
                    maxGroupPrincipal: 0,
                    maxGroupReturningIndividualPrincipal: 0
                },
                customerTotalPrincipals: 0,
                customerMaxPrincipal: 0,
                branchManagerAndDate: false,
                branchManagerId: '',
                managerVisitDate: ''
            },
            customerType: '',
            loading: false,
            selectedCustomer: {},
            selectedGroupLeader: '',
            selectedLoanOfficer: {
                _id: '',
                username: '',
                name: ''
            },
            searchResults: {
                results: [],
                empty: false
            },
            formulas: [],
            loanUsage: [],
            loanOfficers: [],
            products: [],
            branchCustomers: [],
            businessSectors: [],
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
    async setappStats() {
        if (this.state.prevId.length > 0) {
            await this.getProducts();
            await this.getFormulas();
            await this.getLoanUsage();
            await this.getLoanOfficers();
            await this.getGlobalPrinciple();
            this.getAppByID(this.state.prevId)
        } else {
            this.setState(this.setInitState());
            await this.getProducts();
            await this.getFormulas();
            await this.getLoanUsage();
            await this.getLoanOfficers();
            await this.getGlobalPrinciple();
        }
    }
    async getAppByID(id) {
        this.setState({ loading: true })
        const application = await getApplication(id);
        if (application.status === 'success') {
            const formData = this.state.application;
            if (application.body.product.beneficiaryType === 'group') {
                this.getBusinessSectors();
                const selectedCustomers: Customer[] = application.body.group.individualsInGroup.map(x => x.customer);
                const customers = await this.getCustomerLimits(selectedCustomers);
                application.body.group.individualsInGroup.forEach(customer => {
                    if (customer.type === 'leader') {
                        this.setState({
                            selectedGroupLeader: customer.customer._id,
                            selectedLoanOfficer: this.state.loanOfficers.filter(officer => officer._id === customer.customer.representative)[0]
                        })
                    }
                    customer.customer = customers.filter(member => member._id === customer.customer._id)[0]
                })
                formData.individualDetails = application.body.group.individualsInGroup
                this.setState({
                    selectedCustomers
                })
            } else {
                const customers = await this.getCustomerLimits([application.body.customer]);
                this.populateCustomer(customers[0])
                formData.customerTotalPrincipals = customers[0].totalPrincipals ? customers[0].totalPrincipals : 0;
                formData.customerMaxPrincipal = customers[0].maxPrincipal ? customers[0].maxPrincipal : 0;
                formData.individualDetails = application.body.group.individualsInGroup
            }
            this.populateLoanProduct(application.body.product)
            const value = (this.state.prevId.length > 0) ? application.body.guarantors.length : application.body.product.noOfGuarantors
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
            // formData.individualDetails = application.body.group.individualsInGroups
            formData.managerVisitDate = (!application.body.managerVisitDate || application.body.managerVisitDate === 0) ? '' : this.getDateString(application.body.managerVisitDate);
            formData.branchManagerId = application.body.branchManagerId;
            this.setState({
                selectedCustomer: application.body.customer,
                customerType: application.body.product.beneficiaryType,
                application: formData,
                loading: false
            })
        } else {
            Swal.fire('Error!',getErrorMessage(application.error.error) , 'error');
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
            Swal.fire('Error !', getErrorMessage(formulas.error.error), 'error');
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
            Swal.fire('Error !', getErrorMessage(usage.error.error), 'error');
            this.setState({ loading: false });
        }
    }
    async getBusinessSectors() {
        this.setState({ businessSectors: [], loading: true })
        const sectors = await getBusinessSectors();
        if (sectors.status === 'success') {
            this.setState({
                businessSectors: sectors.body.sectors,
                loading: false
            })
        } else {
            Swal.fire('Error !', getErrorMessage(sectors.error.error), 'error');
            this.setState({ loading: false });
        }
    }
    async getLoanOfficers() {
        this.setState({ loanOfficers: [], loading: true })
        const res = await searchLoanOfficer({ from: 0, size: 100, branchId: this.tokenData.branch, status: "active" });
        if (res.status === "success") {
            this.setState({
                loanOfficers: res.body.data.filter(officer => officer.status === 'active'),
                loading: false
            });
        } else {
            Swal.fire('Error !',getErrorMessage(res.error.error), 'error');
            this.setState({ loading: false });
        }
    }
    async getProducts() {
        this.setState({ products: [], loading: true })
        if (this.tokenData.branch.length > 0) {
            const products = await getProductsByBranch(this.tokenData.branch);
            if (products.status === 'success') {
                this.setState({
                    products: (products.body.data.productIds) ? products.body.data.productIds : [],
                    loading: false
                })
            } else {
                Swal.fire('Error !', getErrorMessage(products.error.error), 'error');
                this.setState({ loading: false });
            }
        } else {
            Swal.fire('', local.selectBranch, 'error');
        }
    }
    async searchCustomers(keyword?: string, key?: string) {
    this.setState({ loading: true, branchCustomers: [] });
    const query =
      !keyword || keyword.trim().length === 0 || !key
        ? {
            from: 0,
            size: 2000,
            branchId: this.tokenData.branch,
            representativeId: this.state.selectedLoanOfficer._id,
          }
        : {
            from: 0,
            size: 2000,
            branchId: this.tokenData.branch,
            representativeId: this.state.selectedLoanOfficer._id,
            [key]: ["code", "key"].includes(key) ? Number(keyword) : keyword,
            key: ["customerShortenedCode"].includes(key)
              ? getFullCustomerKey(keyword)
              : ["key"].includes(key)
              ? Number(keyword)
              : undefined,
          };
    const results = await searchCustomer(query);
        if (results.status === 'success') {
            this.setState({ loading: false, branchCustomers: results.body.data });
        } else {
            Swal.fire("Error !", getErrorMessage(results.error.error), 'error')
            this.setState({ loading: false });
        }
    }
    handleSearch = async (key, query) => {
        this.setState({ loading: true });
        const body = { from: 0, size: 1000, [key]: query }
        const results = this.state.customerType === 'sme' ? await searchCompany(body) : await searchCustomer(body)
        if (results.status === 'success') {
            if (results.body.data.length > 0) {
                this.setState({ loading: false, searchResults: { results: results.body.data, empty: false } });
            } else {
                this.setState({ loading: false, searchResults: { results: results.body.data, empty: true } });
            }
        } else {
            Swal.fire("Error !",getErrorMessage(results.error.error), 'error')
            this.setState({ loading: false });
        }
    }
    handleSearchGuarantors = async (key, query, index) => {
        const obj = {
            [key]: query,
            from: 0,
            size: 1000,
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
            Swal.fire("Error !",getErrorMessage(results.error.error), 'error')
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
        const defaultApplication = this.state.application;
        this.getOfficerName(response.representative);
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
        let errorMessage1 = "";
        let errorMessage2 = "";
        this.setState({ loading: true });
        const selectedCustomer = await getCustomerByID(customer._id)
        if (selectedCustomer.status === 'success') {
            if (selectedCustomer.body.blocked.isBlocked === true) {
                errorMessage1 = local.theCustomerIsBlocked;
            }
            if (21 <= getAge(selectedCustomer.body.birthDate) && getAge(selectedCustomer.body.birthDate) <= 65
            ) {
                const check = await this.checkCustomersLimits([selectedCustomer.body], false);
                if (check.flag === true && check.customers && selectedCustomer.body.blocked.isBlocked !== true) {
                    const defaultApplication = this.state.application;
                    defaultApplication.customerID = customer._id;
                    defaultApplication.customerTotalPrincipals = check.customers[0].totalPrincipals ? check.customers[0].totalPrincipals : 0;
                    defaultApplication.customerMaxPrincipal = check.customers[0].maxPrincipal ? check.customers[0].maxPrincipal : 0;
                    this.populateCustomer(check.customers[0])
                    this.setState({
                        loading: false,
                        selectedCustomer: check.customers[0],
                        application: defaultApplication
                    });
                } else if (check.flag === false && Object.keys(check.validationObject).length > 0) {
                    if (check.validationObject[customer._id].totalPrincipals) {
                        errorMessage2 = local.customerMaxLoanPrincipalError;
                    } else {
                        errorMessage2 = local.customerInvolvedInAnotherLoan;
                    }
                }

            }
            else {
                this.setState({ loading: false })
                errorMessage2 = local.individualAgeError;
            }
            if(errorMessage1 || errorMessage2)
            Swal.fire("error", `<span>${errorMessage1}  ${errorMessage1 ? `<br/>` : ""} ${errorMessage2}</span>`, 'error');
        } else {
            Swal.fire("Error !", getErrorMessage(selectedCustomer.error.error), 'error')
        }

        this.setState({ loading: false });
    }
    selectGuarantor = async (obj, index, values) => {
        this.setState({ loading: true });
        const selectedGuarantor = await getCustomerByID(obj._id);

        if (selectedGuarantor.status === 'success') {
            let errorMessage1 = "";
            let errorMessage2 = "";
            if (selectedGuarantor.body.blocked.isBlocked === true) {
                errorMessage1 = local.theCustomerIsBlocked;
            }
            const check = await this.checkCustomersLimits([selectedGuarantor.body], true);
            if (check.flag === true && check.customers && selectedGuarantor.body.blocked.isBlocked !== true) {
                const defaultApplication = { ...values }
                const defaultGuarantors = { ...defaultApplication.guarantors };
                const defaultGuar = { ...defaultGuarantors[index] };
                defaultGuar.guarantor = { ...selectedGuarantor.body, id: obj._id };
                defaultApplication.guarantorIds.push(obj._id)
                defaultApplication.guarantors[index] = defaultGuar;
                this.setState({ application: defaultApplication, loading: false });
            } else if (check.flag === false && check.validationObject) {
                errorMessage2 = local.customerInvolvedInAnotherLoan;
            }
            if(errorMessage1 || errorMessage2)
            Swal.fire("error", `<span>${errorMessage1}  ${errorMessage1 ? `<br/>` : null} ${errorMessage2}</span>`, 'error');
        } else {
            Swal.fire('Error !', getErrorMessage(selectedGuarantor.error.error), 'error');
        }
        this.setState({ loading: false });
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
    removeOptionalGuar(obj, index, values) {
        this.setState({ loading: true });
        const defaultApplication = { ...values }
        defaultApplication.guarantorIds = defaultApplication.guarantorIds.filter(id => obj.guarantor._id !== id)
        defaultApplication.guarantors.splice(index, 1);
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
        defaultApplication.branchManagerAndDate = selectedProductDetails.branchManagerAndDate;
        defaultApplication.branchManagerId = '';
        defaultApplication.managerVisitDate = '';
        if (selectedProductDetails.beneficiaryType === 'group' && this.state.step === 1) { this.searchCustomers() }
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
            defaultApplication.guarantorIds = [];
            this.setState({ loading: false, application: defaultApplication });
        } else {
            Swal.fire("error", getErrorMessage(selectedProduct.error.error), 'error')
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
    setCustomerType(type) {
        const defaultApplication = this.state.application;
        defaultApplication.beneficiaryType = type;
        this.setState({
            customerType: type,
            application: defaultApplication
        }, () => {
            if (type === 'group') {
                this.getBusinessSectors()
            }
        })
    }
    submit = async (values: Application) => {
        if (this.state.step === 2 && this.state.customerType === 'individual') {
            this.step('forward');
        } else {
            const obj = { ...values }
            const individualsToSend: { id?: string; amount: number; type: string }[] = []
            let principalToSend = 0;
            obj.individualDetails && obj.individualDetails.forEach(customer => {
                const obj = {
                    id: customer.customer._id,
                    amount: customer.amount,
                    type: customer.type
                }
                principalToSend += customer.amount
                individualsToSend.push(obj)
            })
            if (obj.beneficiaryType !== 'group') {
                principalToSend = obj.principal
            }
            const objToSubmit = {
                customerId: obj.customerID,
                guarantorIds: obj.guarantorIds,
                productId: obj.productID,
                interest: obj.interest,
                interestPeriod: obj.interestPeriod,
                gracePeriod: obj.gracePeriod,
                pushPayment: obj.pushPayment,
                noOfInstallments: obj.noOfInstallments,
                principal: principalToSend,
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
                representativeId: obj.representative,
                enquirorId: obj.enquirorId,
                visitationDate: new Date(obj.visitationDate).valueOf(),
                individualDetails: individualsToSend,
                viceCustomers: obj.viceCustomers.filter(item => item !== undefined),
                branchManagerId: values.branchManagerId,
                managerVisitDate: values.managerVisitDate ? new Date(values.managerVisitDate).valueOf() : 0,
            }
            if (this.state.application.guarantorIds.length < this.state.application.noOfGuarantors && this.state.customerType === 'individual') {
                Swal.fire("error", local.selectTwoGuarantors, 'error')
            } else {
                if (!this.props.edit) {
                    this.setState({ loading: true });
                    const res = await newApplication(objToSubmit);
                    if (res.status === 'success') {
                        this.setState({ loading: false });
                        Swal.fire("success", local.loanApplicationCreated + ` ${local.withCode} ` + res.body.applicationKey).then(() => { this.props.history.push("/track-loan-applications") })
                    } else {
                        Swal.fire("error",getErrorMessage(res.error.error), 'error')
                        this.setState({ loading: false });
                    }
                } else if (this.props.edit) {
                    this.setState({ loading: true });
                    const res = await editApplication(objToSubmit, this.state.prevId);
                    if (res.status === 'success') {
                        this.setState({ loading: false });
                        Swal.fire("success", local.loanApplicationEdited).then(() => { this.props.history.push("/track-loan-applications") })
                    } else {
                        Swal.fire("error",getErrorMessage(res.error.error), 'error')
                        this.setState({ loading: false });
                    }
                }
            }
        }
    }
    step(key) {
        let currentStep = this.state.step
        if (this.state.step < 3 && key === 'forward') {
            currentStep++
        } else if (this.state.step >= 1 && key === 'backward') {
            currentStep--
        }
        this.setState({
            step: currentStep,
        })

    }
    async getCustomerLimits(customers) {
        const customerIds: Array<string> = [];
        customers.forEach(customer => customerIds.push(customer._id));
        this.setState({ loading: true });
        const res = await getCustomersBalances({ ids: customerIds });
        if (res.status === 'success') {
            this.setState({ loading: false });
            const merged: Array<any> = [];
            for (let i = 0; i < customers.length; i++) {
                const obj = {
                    ...customers[i],
                    ...(res.body.data ? res.body.data.find((itmInner) => itmInner.id === customers[i]._id) : { id: customers[i]._id }),
                    ...this.state.application.principals
                };
                delete obj.id
                merged.push(obj);
            }
            return merged
        } else {
            Swal.fire("error", getErrorMessage(res.error.error), 'error')
            this.setState({ loading: false });
            return []
        }
    }
    async checkCustomersLimits(customers, guarantor) {
        const customerIds: Array<string> = [];
        customers.forEach(customer => customerIds.push(customer._id));
        this.setState({ loading: true });
        const res = await getCustomersBalances({ ids: customerIds });
        if (res.status === 'success') {
            this.setState({ loading: false });
            const merged: Array<any> = [];
            const validationObject: any = {};
            for (let i = 0; i < customers.length; i++) {
                const obj = {
                    ...customers[i],
                    ...(res.body.data ? res.body.data.find((itmInner) => itmInner.id === customers[i]._id) : { id: customers[i]._id }),
                    ...this.state.application.principals
                };
                delete obj.id
                merged.push(obj);
            }
            if (res.body.data && res.body.data.length > 0) {
                merged.forEach(customer => {
                    if (!guarantor) {
                        if (customer.applicationIds && !customer.loanIds && customer.applicationIds.length >= customer.maxLoansAllowed) {
                            validationObject[customer._id] = { customerName: customer.customerName, applicationIds: customer.applicationIds }
                        }
                        if (customer.loanIds && !customer.applicationIds && customer.loanIds.length >= customer.maxLoansAllowed) {
                            if (Object.keys(validationObject).includes(customer._id)) {
                                validationObject[customer._id] = { ...validationObject[customer._id], ...{ loanIds: customer.loanIds } }
                            } else {
                                validationObject[customer._id] = { customerName: customer.customerName, loanIds: customer.loanIds }
                            }
                        }
                        if (customer.loanIds && customer.applicationIds && (customer.loanIds.length +  customer.applicationIds.length) >= customer.maxLoansAllowed) {
                            if (Object.keys(validationObject).includes(customer._id)) {
                                validationObject[customer._id] = { ...validationObject[customer._id], ...{ loanIds: customer.loanIds, applicationIds: customer.applicationIds } }
                            } else {
                                validationObject[customer._id] = { customerName: customer.customerName, loanIds: customer.loanIds , applicationIds: customer.applicationIds  }
                            }
                        }
                        if (customer.guarantorIds && customer.guarantorIds.length >= 0 && !customer.allowGuarantorLoan) {
                            if (Object.keys(validationObject).includes(customer._id)) {
                                validationObject[customer._id] = { ...validationObject[customer._id], ...{ guarantorIds: customer.guarantorIds } }
                            } else {
                                validationObject[customer._id] = { customerName: customer.customerName, guarantorIds: customer.guarantorIds };
                            }
                        }
                    }
                    else {
                        if (customer.applicationIds && customer.applicationIds.length > 0 && !customer.allowGuarantorLoan) {
                            validationObject[customer._id] = { customerName: customer.customerName, applicationIds: customer.applicationIds }
                        }
                        if (customer.loanIds && customer.loanIds.length > 0 && !customer.allowGuarantorLoan) {
                            if (Object.keys(validationObject).includes(customer._id)) {
                                validationObject[customer._id] = { ...validationObject[customer._id], ...{ loanIds: customer.loanIds } }
                            } else {
                                validationObject[customer._id] = { customerName: customer.customerName, loanIds: customer.loanIds }
                            }
                        }
                        if (customer.guarantorIds && customer.guarantorIds.length >= customer.guarantorMaxLoans) {
                            if (Object.keys(validationObject).includes(customer._id)) {
                                validationObject[customer._id] = { ...validationObject[customer._id], ...{ guarantorIds: customer.guarantorIds } }
                            } else {
                                validationObject[customer._id] = { customerName: customer.customerName, guarantorIds: customer.guarantorIds };
                            }
                        }
                    }
                })
            }
            if (Object.keys(validationObject).length > 0) {
                return { flag: false, validationObject: validationObject }
            }
            else return { flag: true, customers: merged }
        } else {
            Swal.fire("error", getErrorMessage(res.error.error), 'error')
            this.setState({ loading: false });
            return { flag: false }
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
                maxGroupReturningIndividualPrincipal: princples.body.maxGroupReturningIndividualPrincipal
            }
            const application = this.state.application;
            application.principals = principals
            this.setState({
                loading: false,
                application
            })
        } else {
            Swal.fire('Error!', getErrorMessage(princples.error.error), 'error');
            this.setState({ loading: false });
        }
    }
    async handleGroupChange(customers) {
        this.setState({ selectedGroupLeader: '' })
        const customersTemp: { customer: Customer; amount: number; type: string }[] = [];
        const defaultApplication = this.state.application
        if (customers.length > 0) {
            const check = await this.checkCustomersLimits(customers, false);
            if (check.flag === true && check.customers) {
                check.customers.forEach(customer => {
                    const obj = {
                        customer: customer,
                        amount: 0,
                        type: 'member'
                    }
                    customersTemp.push(obj)
                })
                defaultApplication.individualDetails = customersTemp;
                this.setState({
                    selectedCustomers: check.customers,
                    application: defaultApplication
                })
            } else if (check.flag === false && check.validationObject && Object.keys(check.validationObject).length > 0) {
                let names = '';
                let financeNames = '';
                Object.keys(check.validationObject).forEach((id, i) => {
                    if (check.validationObject[id].totalPrincipals) {
                        (i === 0) ? financeNames = financeNames + check.validationObject[id].customerName : financeNames = financeNames + ', ' + check.validationObject[id].customerName
                    } else (i === 0) ? names = names + check.validationObject[id].customerName : names = names + ', ' + check.validationObject[id].customerName

                });
                Swal.fire("error", `${names.length > 0 ? names : ''} ${names.length > 0 ? local.memberInvolvedInAnotherLoan : ''} ${(financeNames.length > 0 ? `\n ${financeNames} ${local.customersMaxLoanPrincipalError}` : '')}`, 'error')
            }
        } else {
            this.setState({
                selectedCustomers: []
            })
        }
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
    checkGroupValidation(customer) {
        const age = getAge(customer.birthDate);
        if (age <= 67 && age >= 18 && customer.blocked?.isBlocked !== true) {
            return false
        } else {
            return true
        }
    }
    getGroupErrorMessage(customer) {
        let errorMessage1 = "";
        let errorMessage = "";
        if (customer.blocked?.isBlocked === true) {
            errorMessage1 = `${local.theCustomerIsBlocked}`;
        }
        const age = getAge(customer.birthDate);
        if (age > 67 || age < 18) {
            errorMessage = `${local.groupAgeError}`
        }
        return <span>{errorMessage1}  {errorMessage1 ? <br /> : null} {errorMessage}</span>;
    }
    selectLO(e) {
        this.setState({ selectedLoanOfficer: e }, () => { this.searchCustomers() })

    }
    renderStepOne() {
        return (
            <div className="d-flex flex-column justify-content-center" style={{ textAlign: 'right', width: '90%', padding: 20 }}>
                {(this.state.customerType !== 'group') ? <div style={{ justifyContent: 'center', display: 'flex' }}>
            <CustomerSearch
              source="loanApplication"
              style={{ width: "100%" }}
              handleSearch={(key, query) => this.handleSearch(key, query)}
              selectedCustomer={this.state.selectedCustomer}
              searchResults={this.state.searchResults}
              selectCustomer={(customer) => this.selectCustomer(customer)}
              sme={this.state.customerType === 'sme'}
						/>
                </div> :
                    <div>
                        <h4>{local.customersSelection}</h4>
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <Form.Group controlId="loanOfficer" style={{ margin: 'auto', width: '60%' }}>
                                <Form.Label>{local.loanOfficer}</Form.Label>
                                <Select
                                    name="loanOfficer"
                                    data-qc="loanOfficer"
                                    value={this.state.selectedLoanOfficer}
																		styles={theme.selectStyleWithBorder}
																		theme={theme.selectTheme}
                                    enableReinitialize={false}
                                    onChange={(event) => {
                                        this.selectLO(event)
                                    }}
                                    type='text'
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option._id}
                                    options={this.state.loanOfficers}
                                    isDisabled={this.state.selectedCustomers.length > 0}
                                />
                            </Form.Group>
                        </div>
                        {this.state.selectedLoanOfficer._id.length > 0 && <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}>
                            <DualBox
                                labelKey={"customerName"}
                                vertical
                                options={this.state.branchCustomers}
                                selected={this.state.selectedCustomers}
                                onChange={(list) => this.handleGroupChange(list)}
                                filterKey={this.state.searchGroupCustomerKey}
                                rightHeader={local.allCustomers}
                                leftHeader={local.selectedCustomers}
                                viewSelected={(id) => this.viewCustomer(id)}
                                search={(keyword, key) => this.searchCustomers(keyword, key)}
                                dropDownKeys={['nationalId', 'name', 'key', 'code', 'customerShortenedCode']}
                                disabled={(customer) => this.checkGroupValidation(customer)}
                                disabledMessage={(customer) => this.getGroupErrorMessage(customer)}
                            />
                            {this.state.selectedCustomers.length <= 7 && this.state.selectedCustomers.length >= 3 ? <Form.Group controlId="leaderSelector" style={{ margin: 'auto', width: '60%' }}>
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
                            </Form.Group> : <span>{local.rangeOfGroup}</span>
                            }
                        </div>
                        }
                    </div>
                }
							<div className="d-flex justify-content-between py-4">
								<Button
									variant="secondary"
									className="w-25"
									onClick={() => { this.props.history.push("/track-loan-applications"); }}
								>{local.cancel}</Button>
								<Button 
									variant="primary" 
									data-qc="next"
									className="w-25"
									disabled={(this.state.customerType === 'group' 
											&& (this.state.selectedGroupLeader.length === 0 || this.state.selectedCustomers.length < 3)) 
											|| (this.state.customerType !== 'individual' && (Object.keys(this.state.selectedCustomer).length === 0)
										)}
									onClick={() => this.step('forward')}
									>
										{local.next}
									</Button>
							</div>
            </div>
        )
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
                        products={this.state.products.filter(product => product.beneficiaryType === this.state.customerType)}
                        loanOfficers={this.state.loanOfficers}
                        step={(key) => this.step(key)}
                        getSelectedLoanProduct={(id) => this.getSelectedLoanProduct(id)}
                        customer={(this.state.customerType === 'group') ? this.state.selectedCustomers : this.state.selectedCustomer}
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
                        removeGuar={(guarantor, i, values) => this.removeOptionalGuar(guarantor, i, values)}
                        handleSearch={(key, query, guarantor) => { this.handleSearchGuarantors(key, query, guarantor) }}
                        selectGuarantor={(query, guarantor, values) => { this.selectGuarantor(query, guarantor, values) }}
                        removeGuarantor={(query, guarantor, values) => { this.removeGuarantor(query, guarantor, values) }}
                        customer={(this.state.customerType === 'individual') ? this.state.selectedCustomer : this.state.selectedCustomers}
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
                        <div className="d-flex flex-column" style={{ margin: '20px 60px' }}>
                            <img style={{ width: 75, margin: '40px 20px' }} src={require('../../Assets/group.svg')} />
                            <Button onClick={() => this.setCustomerType('sme')}>sme</Button>
                        </div>
                    </div> :
                        <div style={{ display: "flex", flexDirection: "row" }} >
                            <Wizard
                                currentStepNumber={this.state.step - 1}
                                stepsDescription={(this.state.customerType !== 'group') ? [local.customersDetails, local.loanInfo, local.guarantorInfo] : [local.customersDetails, local.loanInfo]}
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