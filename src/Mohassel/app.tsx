import React, {useEffect} from 'react';
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
const App = () => {
    // localStorage.setItem('baseURL', process.env.REACT_APP_BASE_URL);
    useEffect(() => {
        console.log('go')
    }, [])
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
                        <Route exact path = "/customers"  render={(props)=> <Can I='getCustomer' a='customer'><CustomersList {...props} /></Can>}/>
                        <Route exact path="/new-customer" render={(props) => <Can I='createCustomer' a='customer'><CustomerCreation {...props} edit={false} /></Can>} />
                        <Route exact path="/edit-customer" render={(props) => <Can I='updateCustomer' a='customer'><CustomerCreation {...props} edit={true} /> </Can>} />
                        <Route path="/new-formula" render={(props) => <Can I='createCalculationFormula' a='product'><FormulaCreation /></Can>} />
                        <Route path="/test-formula" render={(props) => <Can I='testCalculate' a='product'><FormulaTest {...props} /></Can>} />
                        <Route path="/new-loan-product" render={(props) => <Can I='createLoanProduct' a='product'><LoanProductCreation /></Can>} />
                        <Route path="/assign-branch-products" render={(props) => <Can I='assignProductToBranch' a='product'> <AssignProductToBranch {...props} /> </Can>} />
                        <Route path="/new-loan-application" render={(props) => <Can I='assignProductToCustomer' a='application'><LoanApplicationCreation {...props} edit={false} /> </Can>} />
                        <Route path="/edit-loan-application" render={(props) => <LoanApplicationCreation {...props} edit={true} />} />
                        <Route path="/track-loan-applications" render={(props) => <Can I='getLoanApplication' a='application'><TrackLoanApplications /></Can>} />
                        <Route path="/create-loan" render={(props) => (ability.can( 'createLoan', 'application') || ability.can('issueLoan','application'))?<LoanCreation {...props} /> : null} />

                        <Route path="/loan-uses" render={(props) => <Can I='loanUsage' a='config'><LoanUses /></Can>} />
                        <Route path="/bulk-approvals" render={(props) => <Can I='approveLoanApplication' a='application'> <BulkApplicationApproval /></Can>} />
                        <Route path="/manage-accounts" render={(props) => <ManageAccounts />} />
                        <Route path="/loan-profile" render={(props) =>(ability.can('getLoanApplication','application') || ability.can('getIssuedLoan','application'))?<LoanProfile {...props} />:null} />
                        <Route path="/loans" render={(props) =><Can I='getIssuedLoan' a='application'> <LoanList {...props} /></Can>}/>
                        <Route exact path = "/new-user" render={(props)=> <Can I='createUser' a= 'user'><UserCreation  {...props} edit={false} /></Can> }></Route>
                        <Route exact path = "/edit-user" render={(props)=> <Can I='getUser' a= 'user'><UserCreation  {...props} edit={true} /></Can> }></Route>
                        <Route path="/new-role" render={(props) => <Can I='createRoles' a='user'><RoleCreation {...props} edit={false}/></Can>}/>
                        <Route path="/edit-role" render={(props) => <Can I='getRoles' a='user'><RoleCreation {...props} edit={true}/></Can>}/>
                        <Route path="/role-profile" render={(props) => <Can I='getRoles' a='user'><RoleProfile {...props} /></Can>}/>
                        <Route exact path="/user-details"  render={(props)=> <Can I='getUser' a= 'user'><UserDetails {...props}/></Can>} />
                        <Route exact path = "/new-branch"  render={(props)=> <Can I='createBranch' a='branch'><CreateBranch {...props} /></Can>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};

export default App;