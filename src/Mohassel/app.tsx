import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { getAuthData } from './redux/auth/actions';
import NavBar from './Components/NavBar/navBar';
import { getCookie } from './Services/getCookie';
import './index.scss';
import {routes} from './Services/routes'
import WithBreadcrumbs from './Components/navigation/withBreadcrumbs';
const App = (props) => {
    useEffect(() => {
        props.getAuthData();
    }, []);
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

const mapMethodsToProps = dispatch => {
    return {
        getAuthData: () => dispatch(getAuthData())
    };
};
export default connect(
    null,
    mapMethodsToProps
)(App);
