import React, { Component } from 'react'
import axios from 'axios';
import { Formik } from 'formik';
import swal from 'sweetalert2';
import { LoginForm } from './loginForm';
import { loginCred, loginCredValidation } from './loginState';
import * as local from '../../Shared/Assets/ar.json';
import { setToken } from '../../Shared/token';
interface User {
  username: string;
  password: string;
}
interface Props {
  title: string;
}
interface State {
  credentials: User;
}
class Login extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      credentials: loginCred
    };
  }
  handleChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value } as any)
  }
  submit = (values: User): void => {
    const data = {
      username: values.username.trim(),
      password: values.password
    }
    axios({
      url: `${process.env.REACT_APP_BASE_URL}/auth/login`,
      method: "post",
      data: data

    }).then(succ => {
      setToken(succ.data.Token);
      if(succ.data.validBranches) document.cookie = `ltsbranch=${JSON.stringify(succ.data.validBranches[0])};`;
      window.location.href = process.env.REACT_APP_MOHASSEL_URL || '';
    }, err => {
      swal.fire('', local.loginError, 'error');
    })
  }
  render() {
    return (
      <div className="login-parent">
        <div className="right-hero">
          <div className="texts">
            <h1>{local.welcomeTo}</h1>
            <h1>{local.systemForLoanTracking}</h1>
            <h3>{local.lowRateLoan}</h3>
          </div>
          <img alt="login-image" src={require('../Assets/loginPhotos.png')} />
        </div>
        <div className="left-hero">
          <img alt="login-log" className="login-logo" src={require('../../Shared/Assets/Logo.svg')} />
          <div className="login-form">
            <h2>{local.login}</h2>
            <Formik
              enableReinitialize
              initialValues={this.state.credentials}
              onSubmit={this.submit}
              validationSchema={loginCredValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) =>
                <LoginForm {...formikProps} />
              }
            </Formik>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="vertical-line-login"></div>
            <div style={{ margin: '100px 15px 0px 0px' }}>
              <p>{local.loginInfo01}</p>
              <p>{local.loginInfo02}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Login;
