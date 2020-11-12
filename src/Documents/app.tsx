import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { getAuthData } from '../Shared/redux/auth/actions';
import { getCookie } from '../Shared/Services/getCookie';
import NavBar from '../Shared/Components/NavBar/navBar';
import { routes } from './Services/routes'
import WithBreadcrumbs from '../Shared/Components/navigation/withBreadcrumbs';
import './index.scss';

const App = (props) => {
    useEffect(() => {
        props.getAuthData();
    }, []);
    if (getCookie('token') === '') {
        window.location.href = process.env.REACT_APP_LOGIN_URL || ''
        return <></>

    } else {
        const hideProp = {hide: true}
        return (
            <BrowserRouter >
                <div style={{ direction: 'rtl', backgroundColor: '#fafafa' }}>
                    <NavBar {...hideProp} />
                    <Switch>
                        {
                            routes.map(route => (
                                <Route key={route.path} exact path={route.path}  >
                                    <WithBreadcrumbs route={route} />
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
