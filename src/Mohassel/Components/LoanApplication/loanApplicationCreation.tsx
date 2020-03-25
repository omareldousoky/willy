import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';
import { LoanApplication, LoanApplicationValidation } from './loanApplicationStates';
import { LoanApplicationCreationForm } from './loanApplicationCreationForm';
import { searchCustomerByName, getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import { getBirthdateFromNationalId, getGenderFromNationalId } from '../../Services/nationalIdValidation';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerSearch from '../CustomerSearch/customerSearchTable';
interface Props {
    history: Array<string>;
};
interface Application {
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
}
interface State {
    application: Application;
    loading: boolean;
    selectedCustomer: object;
    searchResults: Array<Application>;
}
class LoanApplicationCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            application: LoanApplication,
            loading: false,
            selectedCustomer: {},
            searchResults: []
        }
    }
    async UNSAFE_componentWillMount() {
        // const formulas = await getFormulas();
        // if(formulas.status === 'success'){
        //     this.setState({
        //         formulas: formulas.body.data
        //     })
        // } else {
        //     console.log('err')
        // }
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
                                <LoanApplicationCreationForm {...formikProps} />
                            }
                        </Formik> : <CustomerSearch source='loanApplication' handleSearch={(query) => this.handleSearch(query)} searchResults={this.state.searchResults} selectCustomer={(customer) => this.selectCustomer(customer)} />}
                    </Container>
                }
            </div>
        )
    }
}
export default withRouter(LoanApplicationCreation);