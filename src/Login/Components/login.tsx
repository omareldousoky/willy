import React, { Component } from 'react'
import axios from 'axios';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import swal from 'sweetalert2';
import { LoginForm } from './loginForm';
import { loginCred, loginCredValidation } from './loginState';
import * as local from '../../Shared/Assets/ar.json';

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
      username: values.username,
      password: values.password
    }
    axios({
      url: `${process.env.REACT_APP_BASE_URL}/auth/login`,
      method: "post",
      data: data

    }).then(succ => {
      this.setCookie(succ.data.token);
      window.location.href = process.env.REACT_APP_MOHASSEL_URL || '';
    }, err => {
      swal.fire('', local.loginError, 'error');
    })
  }
  setCookie(cvalue: string) {
    document.cookie = "token=" + cvalue + ";path=/;";
  }
  render() {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '50vw', height: '50vh', backgroundColor: 'beige', margin: 'auto' }}>
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
      </Container>
    )
  }
}
export default Login;
