import React from 'react';
import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.css';
import './custom.scss';
import './index.css';
import { Provider } from 'react-redux'
import store from './redux/store';
import App from './app';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById("root"));