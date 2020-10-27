import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { getAuthData } from '../Shared/redux/auth/actions';
import { getCookie } from '../Shared/Services/getCookie';
import NavBar from '../Shared/Components/NavBar/navBar';
import CustomersList from './Components/Cusomters/customersList';
import DocumentsUpload from './Components/Cusomters/documentsUpload';
import trackLoanApplications from './Components/TrackLoanApplications/trackLoanApplications';
import LoanList from './Components/LoanList/loanList';
import UploadDocuments from './Components/LoanList/uploadDocuments';
import './index.scss';

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
                <div style={{ direction: 'rtl', backgroundColor: '#fafafa' }}>
                    <NavBar />
                    <Switch>
                    <Route path="/customers" component={CustomersList} />
                    <Route path="/edit-customer-document" component={DocumentsUpload} />
                    <Route path="/track-loan-applications" component={trackLoanApplications} />
                    <Route path="/loans" component={LoanList} />
                    <Route path="/edit-profile" component={UploadDocuments}/>
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
