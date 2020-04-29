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
import ManageAccounts from './Components/ManageAccounts/manageAccounts';
import LoanProfile from './Components/LoanProfile/loanProfile';
import LoanList from './Components/LoanList/loanList';
import { Landing } from './Components/Landing/landing';
import { getCookie } from './Services/getCookie';
import Can from './config/Can';

const App = () => {
    // localStorage.setItem('baseURL', process.env.REACT_APP_BASE_URL);
    if (getCookie('token') === '') {
        window.location.href = process.env.REACT_APP_LOGIN_URL || ''
        return <></>

    } else {
        return (
            <BrowserRouter>
                <div style={{ direction: 'rtl', backgroundColor:'#fafafa' }}>
                    <NavBar />
                    <Switch>
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/new-customer" render={(props) => <Can I='create' a='Customer'><CustomerCreation {...props} edit={false} /></Can>} />
                        <Route exact path="/edit-customer" render={(props) => <Can I='edit' a='Customer'><CustomerCreation {...props} edit={true} /> </Can>} />
                        <Route path="/new-formula" render={(props) => <Can I='create' a='CalculationMethod'><FormulaCreation /></Can>} />
                        <Route path="/test-formula" render={(props) => <Can I='test' a='CalculationMethod'><FormulaTest {...props} /></Can>} />
                        <Route path="/new-loan-product" render={(props) => <Can I='create' a='LoanProduct'><LoanProductCreation /></Can>} />
                        <Route path="/assign-branch-products" render={(props) => <Can I='assignToBranch' a='LoanProduct'> <AssignProductToBranch {...props} /> </Can>} />
                        <Route path="/new-loan-application" render={(props) => <Can I='create' a='Application'><LoanApplicationCreation {...props} edit={false} /> </Can>} />
                        <Route path="/edit-loan-application" render={(props) => <Can I='view' a='Application'><LoanApplicationCreation {...props} edit={true} /> </Can>} />
                        <Route path="/track-loan-applications" render={(props) => <Can I='view' a='Application'><TrackLoanApplications /></Can>} />
                        <Route path="/create-loan" render={(props) => <LoanCreation {...props} />} />
                        <Route path="/loan-uses" render={(props) => <Can I='create' a='LoanUsage'><LoanUses /></Can>} />
                        <Route path="/bulk-approvals" render={(props) => <Can I='bulkApprove' a='Application'> <BulkApplicationApproval /></Can>} />
                        <Route path="/manage-accounts" render={(props) => <ManageAccounts />} />
                        <Route path="/loan-profile" render={(props) => <Can I='view' a='Application'> <LoanProfile {...props} /></Can>} />
                        <Route path="/loans" render={(props) => <LoanList {...props} />}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};

export default App;