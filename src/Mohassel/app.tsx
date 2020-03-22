import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CustomerCreation from './Components/CustomerCreation/customer-creation';
import FormulaCreation from './Components/LoanCreation/loanFormulaCreation';
import FormulaTest from './Components/LoanCreation/loanFormulaTest';
import LoanProductCreation from './Components/LoanProductCreation/loanProductCreation'
import NavBar from './Components/NavBar/navBar';
import {Landing} from './Components/Landing/landing';

const App = () => {
    // localStorage.setItem('baseURL', process.env.REACT_APP_BASE_URL);
    return (
        <BrowserRouter>
            <div style={{ direction: 'rtl' }}>
                <NavBar/>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/new-user" component={CustomerCreation} />
                    <Route path="/new-formula" component={FormulaCreation} />
                    <Route path="/test-formula" component={FormulaTest} />
                    <Route path="/new-loan-product" component={LoanProductCreation} />
                </Switch>
            </div>
        </BrowserRouter>
    )
};

export default App;