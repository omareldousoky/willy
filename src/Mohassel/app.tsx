import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CustomerCreation from './Components/CustomerCreation/customer-creation';
import UserCreation from './Components/UserCreation/user-creation';
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
import RoleCreation from './Components/Roles/roleCreation';
import RoleProfile from './Components/Roles/roleProfile';
import { Landing } from './Components/Landing/landing';
import { getCookie } from './Services/getCookie';
import Can from './config/Can';
import UserDetails from './Components/userDetails/user-details';
import CreateBranch from './Components/BranchCreation/create-branch';
import CustomersList from './Components/CustomerCreation/customersList';
import ability from './config/ability';

import {routes} from './Services/routes'
import WithBreadcrumbs from './Components/navigation/withBreadcrumbs';
const App = () => {
    // localStorage.setItem('baseURL', process.env.REACT_APP_BASE_URL);
    if (getCookie('token') === '') {
        window.location.href = process.env.REACT_APP_LOGIN_URL || ''
        return <></>

    } else {
       
        return (
            <BrowserRouter >
                <div style={{ direction: 'rtl', backgroundColor:'#fafafa' }}>
                    <NavBar />
                    <Switch>
                        {
                            routes.map(route => (
                                <Route  key= {route.path} exact path = {route.path}  > 
                                    <WithBreadcrumbs route = {route} />
                                </Route> 
                            ))
                        }
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};

export default App;