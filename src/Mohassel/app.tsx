import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CustomerCreation from './Components/CustomerCreation/customer-creation';
import FormulaCreation from './Components/LoanFormulaCreation/loanFormulaCreation';
import FormulaTest from './Components/LoanFormulaCreation/loanFormulaTest';
import LoanProductCreation from './Components/LoanProductCreation/loanProductCreation';
import LoanApplicationCreation from './Components/LoanApplication/loanApplicationCreation';
import AssignProductToBranch from './Components/Branch/assignProductToBranch';
import TrackLoanApplications from './Components/TrackLoanApplications/trackLoanApplications';
import LoanCreation from './Components/LoanCreation/loanCreation';
import NavBar from './Components/NavBar/navBar';
import LoanUses from './Components/LoanUses/loanUses';
import BulkApplicationApproval from './Components/BulkApplicationApproval/bulkApplicationApproval';
import { Landing } from './Components/Landing/landing';
import { getCookie } from './Services/getCookie';

const App = () => {
    // localStorage.setItem('baseURL', process.env.REACT_APP_BASE_URL);
    if (getCookie('token') === '') {
        window.location.href = process.env.REACT_APP_LOGIN_URL || ''
        return <></>

    } else {
        return (
            <BrowserRouter>
                <div style={{ direction: 'rtl' }}>
                    <NavBar />
                    <Switch>
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/new-customer" render={(props) => <CustomerCreation {...props} edit={false} />} />
                        <Route exact path="/edit-customer" render={(props) => <CustomerCreation {...props} edit={true} />} />
                        <Route path="/new-formula" component={FormulaCreation} />
                        <Route path="/test-formula" component={FormulaTest} />
                        <Route path="/new-loan-product" component={LoanProductCreation} />
                        <Route path="/assign-branch-products" component={AssignProductToBranch} />
                        <Route path="/new-loan-application" component={LoanApplicationCreation} />
                        <Route path="/track-loan-applications" component={TrackLoanApplications} />
                        <Route path="/create-loan" component={LoanCreation} />
                        <Route path="/loan-uses" component={LoanUses} />
                        <Route path="/bulk-approvals" component={BulkApplicationApproval} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};

export default App;