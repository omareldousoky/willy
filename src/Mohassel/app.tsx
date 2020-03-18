import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CustomerCreation from './Components/CustomerCreation/customer-creation';

const App = () => {
    // localStorage.setItem('baseURL', process.env.REACT_APP_BASE_URL);
    return (
        <BrowserRouter>
            <div style={{ direction: 'rtl' }}>
                <Switch>
                    {/* <Route exact path="/" component={} /> */}
                    <Route path="/new-user" component={CustomerCreation} />

                </Switch>
            </div>
        </BrowserRouter>
    )
};

export default App;